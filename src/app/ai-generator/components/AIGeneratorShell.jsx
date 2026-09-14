'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, LayoutGrid, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import BatchSpecPanel from './BatchSpecPanel';
import ChatModeView from './ChatModeView';
import ResultsEmptyState from './ResultsEmptyState';
import AIGeneratedCard from './AIGeneratedCard';
import LinkedInPreviewModal from './LinkedInPreviewModal';

import { createDefaultGroup } from '../extractSpec';
import { getPostContent } from '../postLibrary';
import { POST_STATUS } from '@/lib/post-status';
import { INITIAL_APPROVAL_POSTS } from '@/app/approval-workflow/_api/queries';
import { getSequentialScheduleSlots } from '@/lib/scheduling';
import { getStoredPosts, saveStoredPosts } from '@/temp-backend';
import { STOCK_IMAGES_LIST } from '@/temp-backend/data/media';

import '@/styles/aigen.css';

const MOCK_IMAGES = STOCK_IMAGES_LIST.map((img) => img.url);

/**
 * Generates a post synthesizing title from content, completely decoupling it from the topic string
 */
function generatePostForGroup(group, postIndexInBatch, postIndexInGroup, slot) {
  const postData = getPostContent(group.pillar, postIndexInBatch);

  // Distinct title directly from content analysis (never prefixed with topic string)
  const postTitle = postData.title;
  const bodyContent = `${postData.hookPrefix}\n\n${postData.takeaways.join('\n')}\n\nWhat is your team's experience with this? Drop your thoughts below.`;

  let imageUrl = null;
  let carouselSlides = null;

  if (group.format === 'image') {
    imageUrl = MOCK_IMAGES[postIndexInBatch % MOCK_IMAGES.length];
  } else if (group.format === 'carousel') {
    carouselSlides = [
      { id: `slide-${postIndexInBatch}-1`, headline: postTitle, tag: 'SLIDE 01 / 05' },
      { id: `slide-${postIndexInBatch}-2`, headline: 'Phase 1: Discovery & Synthesis', tag: 'SLIDE 02 / 05' },
      { id: `slide-${postIndexInBatch}-3`, headline: 'Phase 2: Tactical Execution', tag: 'SLIDE 03 / 05' },
      { id: `slide-${postIndexInBatch}-4`, headline: 'Phase 3: Velocity & SLAs', tag: 'SLIDE 04 / 05' },
      { id: `slide-${postIndexInBatch}-5`, headline: 'Summary & Actionable Takeaway', tag: 'SLIDE 05 / 05' },
    ];
  }

  return {
    id: `ai-gen-${Date.now()}-${postIndexInBatch}-${Math.random().toString(36).slice(2, 6)}`,
    groupId: group.id,
    topic: group.topic,
    state: 'generated', // 'idle' | 'generating' | 'generated' | 'failed'
    title: postTitle,
    content: bodyContent,
    cta: 'What is your experience with this approach? Drop your thoughts below 👇',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    authorRole: 'Content Strategist',
    category: group.pillar,
    pillar: group.pillar,
    visualFormat: group.format,
    imageUrl,
    carouselSlides,
    scheduledDate: slot.date,
    scheduledTime: slot.time,
    source: 'ai_generator',
    status: POST_STATUS.AWAITING_REVIEW,
  };
}

const STORAGE_MODE_KEY = 'linkedflow_aigen_mode';

export default function AIGeneratorShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mode state: 'fields' | 'chat' (persisted in localStorage across reloads)
  const [activeMode, setActiveMode] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_MODE_KEY);
      return stored === 'chat' ? 'chat' : 'fields';
    } catch {
      return 'fields';
    }
  });

  const handleModeChange = (newMode) => {
    setActiveMode(newMode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, newMode);
    } catch {
      // ignore
    }
  };

  // 1. Fields Mode State (Keeps its own fields, untouched by chat)
  const [groups, setGroups] = useState([createDefaultGroup('g-init-1')]);
  const [globalSchedule, setGlobalSchedule] = useState({
    autoSchedule: true,
    startDate: '2026-09-15',
    defaultTime: '09:00',
  });
  const [submittedEmpty, setSubmittedEmpty] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 2. Chat Mode State (Per-session thread, clears on reload)
  const [chatTurns, setChatTurns] = useState([]);

  // Shared preview modal
  const [previewPost, setPreviewPost] = useState(null);

  // Group manipulation handlers (Fields mode)
  const handleChangeGroup = (groupId, patch) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...patch } : g))
    );
    setSubmittedEmpty(false);
  };

  const handleAddGroup = () => {
    if (groups.length >= 4) return;
    const newId = `g-${Date.now()}-${groups.length + 1}`;
    setGroups((prev) => [...prev, createDefaultGroup(newId, { count: 2 })]);
    setSubmittedEmpty(false);
  };

  const handleRemoveGroup = (groupId) => {
    if (groups.length <= 1) return;
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // Generate Batch (Fields mode)
  const handleGenerate = async () => {
    const hasInvalid = groups.some((g) => !g.topic || g.topic.trim().length < 3);
    if (hasInvalid) {
      setSubmittedEmpty(true);
      toast.error('Please provide a valid topic (min 3 characters) for each group');
      return;
    }

    setIsGenerating(true);
    const totalCount = groups.reduce((acc, g) => acc + (g.count || 0), 0);

    const slots = globalSchedule.autoSchedule
      ? getSequentialScheduleSlots(totalCount, globalSchedule.startDate)
      : Array.from({ length: totalCount }).map(() => ({
          date: globalSchedule.startDate,
          time: globalSchedule.defaultTime,
        }));

    const placeholders = [];
    let slotOffset = 0;
    groups.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        const slot = slots[slotOffset] || {
          date: globalSchedule.startDate,
          time: globalSchedule.defaultTime,
        };
        placeholders.push({
          id: `placeholder-${Date.now()}-${slotOffset}`,
          groupId: group.id,
          state: 'generating',
          title: `Drafting post ${slotOffset + 1}…`,
          content: '',
          pillar: group.pillar,
          topic: group.topic,
          visualFormat: group.format,
          scheduledDate: slot.date,
          scheduledTime: slot.time,
        });
        slotOffset++;
      }
    });

    setPosts(placeholders);

    let overallIdx = 0;
    for (let gIdx = 0; gIdx < groups.length; gIdx++) {
      const group = groups[gIdx];
      for (let i = 0; i < group.count; i++) {
        const currentOverallIdx = overallIdx;
        await new Promise((r) => setTimeout(r, 450));

        const isSimulatedFailure =
          group.topic.toLowerCase().includes('simulate error') && currentOverallIdx === 1;

        if (isSimulatedFailure) {
          setPosts((prev) =>
            prev.map((p, pIdx) =>
              pIdx === currentOverallIdx
                ? {
                    ...p,
                    state: 'failed',
                    failureReason: 'Rate limit encountered on image synthesis engine.',
                  }
                : p
            )
          );
        } else {
          const finished = generatePostForGroup(
            group,
            currentOverallIdx,
            i,
            slots[currentOverallIdx] || {
              date: globalSchedule.startDate,
              time: globalSchedule.defaultTime,
            }
          );
          setPosts((prev) =>
            prev.map((p, pIdx) => (pIdx === currentOverallIdx ? finished : p))
          );
        }
        overallIdx++;
      }
    }

    setIsGenerating(false);
    toast.success(`Generated batch of ${totalCount} posts across ${groups.length} group${groups.length > 1 ? 's' : ''}`);
  };

  // Card action handlers (Fields mode)
  const handleRetryPost = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, state: 'generating' } : p))
    );

    await new Promise((r) => setTimeout(r, 600));

    const idx = posts.findIndex((p) => p.id === postId);
    const targetPost = posts[idx];
    const group = groups.find((g) => g.id === targetPost?.groupId) || groups[0];
    const slot = {
      date: targetPost?.scheduledDate || globalSchedule.startDate,
      time: targetPost?.scheduledTime || globalSchedule.defaultTime,
    };
    const recovered = generatePostForGroup(group, idx >= 0 ? idx : 0, 0, slot);

    setPosts((prev) => prev.map((p) => (p.id === postId ? recovered : p)));
    toast.success('Post regenerated successfully');
  };

  const handleDismissPost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Queue dispatch helper (Shared)
  const handleSendOneToQueue = (postId, optionalPostObject = null) => {
    const target =
      optionalPostObject ||
      posts.find((p) => p.id === postId && p.state === 'generated');
    if (!target) return;

    try {
      const prepared = {
        ...target,
        status: POST_STATUS.AWAITING_REVIEW,
        source: 'ai_generator',
      };

      const stored = localStorage.getItem('linkedflow_approval_posts');
      const existing = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
      const mergedApproval = [prepared, ...existing.filter((p) => p.id !== target.id)];
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(mergedApproval));

      const masterPosts = getStoredPosts();
      const mergedMaster = [prepared, ...masterPosts.filter((p) => p.id !== target.id)];
      saveStoredPosts(mergedMaster);

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });

      toast.success('Post sent to approval queue', {
        action: {
          label: 'View queue',
          onClick: () => navigate('/approval-workflow?source=ai_generator'),
        },
      });
    } catch {
      toast.error('Could not send post to queue');
    }
  };

  const handleSendAllToQueue = () => {
    const validPosts = posts.filter((p) => p.state === 'generated');
    if (validPosts.length === 0) return;

    try {
      const postsForQueue = validPosts.map((p) => ({
        ...p,
        status: POST_STATUS.AWAITING_REVIEW,
        source: 'ai_generator',
      }));

      const stored = localStorage.getItem('linkedflow_approval_posts');
      const existing = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
      const newIds = new Set(postsForQueue.map((p) => p.id));
      const mergedApproval = [...postsForQueue, ...existing.filter((p) => !newIds.has(p.id))];
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(mergedApproval));

      const masterPosts = getStoredPosts();
      const mergedMaster = [...postsForQueue, ...masterPosts.filter((p) => !newIds.has(p.id))];
      saveStoredPosts(mergedMaster);

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });

      toast.success(`${validPosts.length} posts sent to approval queue`);
      navigate('/approval-workflow?source=ai_generator');
    } catch {
      toast.error('Could not send posts to approval queue');
    }
  };

  // Chat thread handlers
  const handleAddChatTurn = (newTurn) => {
    setChatTurns((prev) => [...prev, newTurn]);
  };

  const handleUpdatePostInTurn = (turnId, postId, patch) => {
    setChatTurns((prev) =>
      prev.map((t) => {
        if (t.id !== turnId || !t.posts) return t;
        return {
          ...t,
          posts: t.posts.map((p) => (p.id === postId ? { ...p, ...patch } : p)),
        };
      })
    );
  };

  const handleDismissPostInTurn = (turnId, postId) => {
    setChatTurns((prev) =>
      prev.map((t) => {
        if (t.id !== turnId || !t.posts) return t;
        return {
          ...t,
          posts: t.posts.filter((p) => p.id !== postId),
        };
      })
    );
  };

  const validCount = posts.filter((p) => p.state === 'generated').length;

  return (
    <div className="aig flex flex-col gap-6">
      {/* 1. Page Header with Segmented Mode Switcher */}
      <div className="aig-head">
        <div>
          <h1 className="aig-title">Generate</h1>
          <p className="aig-sub">
            {activeMode === 'fields'
              ? 'Draft multi-format post batches for editorial review and approval.'
              : 'Brainstorm and draft LinkedIn content through conversational exploration.'}
          </p>
        </div>

        {/* Mode Switcher Segmented Control */}
        <div className="aig-mode-toggle" role="tablist" aria-label="Generator mode">
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'fields'}
            onClick={() => handleModeChange('fields')}
            className="aig-mode-btn"
          >
            <LayoutGrid size={13} />
            <span>Fields</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'chat'}
            onClick={() => handleModeChange('chat')}
            className="aig-mode-btn"
          >
            <MessageSquare size={13} />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* 2. MODE: FIELDS (Grouped Spec + Right Results Pane) */}
      {activeMode === 'fields' && (
        <div className="aig-layout">
          {/* Left Column: Spec Panel */}
          <div className="flex flex-col gap-5">
            <BatchSpecPanel
              groups={groups}
              onChangeGroup={handleChangeGroup}
              onAddGroup={handleAddGroup}
              onRemoveGroup={handleRemoveGroup}
              globalSchedule={globalSchedule}
              onChangeGlobalSchedule={setGlobalSchedule}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              submittedEmpty={submittedEmpty}
            />
          </div>

          {/* Right Column: Results Pane */}
          <div className="aig-results-pane">
            {posts.length === 0 ? (
              <ResultsEmptyState />
            ) : (
              <>
                {/* Batch Action Bar */}
                <div className="aig-results-bar">
                  <span className="aig-results-meta">
                    <strong>{validCount}</strong> of <strong>{posts.length}</strong> posts ready
                  </span>

                  <button
                    type="button"
                    onClick={handleSendAllToQueue}
                    disabled={validCount === 0 || isGenerating}
                    className="aig-btn-send-all"
                  >
                    <CheckSquare size={13} />
                    <span>Send all to approval queue ({validCount})</span>
                  </button>
                </div>

                {/* Cards Grid */}
                <div className="aig-cards-grid">
                  {posts.map((post) => (
                    <AIGeneratedCard
                      key={post.id}
                      post={post}
                      onDismiss={handleDismissPost}
                      onPreview={(p) => setPreviewPost(p)}
                      onSendToQueue={(postId) => handleSendOneToQueue(postId, post)}
                      onRetry={handleRetryPost}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. MODE: CHAT (Full-width thread, pinned bottom bar, inline cards) */}
      {activeMode === 'chat' && (
        <ChatModeView
          chatTurns={chatTurns}
          onAddTurn={handleAddChatTurn}
          onUpdatePostInTurn={handleUpdatePostInTurn}
          onDismissPostInTurn={handleDismissPostInTurn}
          onPreviewPost={(p) => setPreviewPost(p)}
          onSendToQueue={(postId, postObj) => handleSendOneToQueue(postId, postObj)}
        />
      )}

      {/* Shared LinkedIn Preview Modal */}
      <LinkedInPreviewModal
        isOpen={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
        onSendToQueue={(postId) => handleSendOneToQueue(postId, previewPost)}
      />
    </div>
  );
}
