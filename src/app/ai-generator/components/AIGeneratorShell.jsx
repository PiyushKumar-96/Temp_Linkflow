'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, PenTool, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import AIGeneratorHeader from './AIGeneratorHeader';
import AIGeneratorForm from './AIGeneratorForm';
import GeneratedPostCard from './GeneratedPostCard';
import LinkedInPreviewModal from './LinkedInPreviewModal';
import AIGeneratorEmptyState from './AIGeneratorEmptyState';
import AIGeneratorLoadingState from './AIGeneratorLoadingState';

import { POST_STATUS } from '@/lib/post-status';
import { INITIAL_APPROVAL_POSTS } from '@/app/approval-workflow/_api/queries';
import { getSequentialScheduleSlots } from '@/lib/scheduling';
import { getStoredPosts, saveStoredPosts } from '@/temp-backend';
import { TOPICS } from '@/temp-backend/data/topics';
import { STOCK_IMAGES_LIST } from '@/temp-backend/data/media';

const MOCK_TOPICS = TOPICS.map((t) => t.title);
const MOCK_IMAGES = STOCK_IMAGES_LIST.map((img) => img.url);

const MOCK_CONTENTS = [
  "After 3 years of building in public, here's what nobody tells you about scaling a SaaS product from 0 to 10,000 customers.\n\nThe biggest lesson? Trust compounds faster than revenue.\n\nWhen we started sharing our failures openly, something unexpected happened — our community grew 3x faster than our paid ads ever did.\n\nHere are the 5 principles that changed everything for us:\n\n1. Share the raw metrics, not just vanity milestones\n2. Answer every single DM within 24 hours\n3. Turn customer support tickets into public teardowns\n4. Write for practitioners, not passive observers\n5. Consistency over viral spikes\n\nWhat's your biggest takeaway from building in public?",
  'The conventional wisdom on LinkedIn growth is wrong.\n\nEveryone says: post every day, use trending hashtags, go viral.\n\nWhat actually works:\n→ Post with deep domain intention\n→ Build genuine 1:1 connections with industry peers\n→ Show up consistently for 90 days with zero sales pitch\n\nWe grew from 800 to 22,000 followers doing the opposite of what standard marketing playbooks preach.\n\nAre you prioritizing reach or high-intent conversations?',
  "We reduced our customer onboarding time by 62% in one quarter.\n\nNot with more automation. Not with complex AI bots.\n\nWith one simple change: we stopped assuming we knew what customers needed and started asking them directly via 15-minute weekly teardowns.\n\nHere's the full breakdown of what we changed:\n\n• Simplified 8 setup steps into 3 mandatory inputs\n• Replaced 40-page manuals with 2-minute Loom walkthroughs\n• Assigned proactive customer success owners on Day 1\n\nHow does your team optimize initial time-to-value?",
];

function generateMockPost(topicTitle, theme, reference, visualFormat, index, scheduleDate, scheduleTime) {
  const content = MOCK_CONTENTS[index % MOCK_CONTENTS.length];
  const postCategory = theme || 'Thought Leadership';

  let imageUrl = null;
  let candidateImages = [];
  let carouselSlides = null;
  let infographicData = null;

  if (visualFormat === 'image') {
    candidateImages = MOCK_IMAGES;
    imageUrl = MOCK_IMAGES[index % MOCK_IMAGES.length];
  } else if (visualFormat === 'carousel') {
    carouselSlides = [
      {
        id: `slide-${index}-1`,
        headline: topicTitle,
        body: `A strategic deep dive on ${postCategory.toLowerCase()} and high-impact execution.`,
        tag: 'SLIDE 01 / 05',
        accentColor: '#0a66c2',
      },
      {
        id: `slide-${index}-2`,
        headline: 'Phase 1: Research & Discovery',
        body: 'Identify core friction points and synthesize key user takeaways before drafting solutions.',
        tag: 'SLIDE 02 / 05',
        accentColor: '#6366f1',
      },
      {
        id: `slide-${index}-3`,
        headline: 'Phase 2: Execution Framework',
        body: 'Standardize communication SLAs and deploy automated workflows across distributed pods.',
        tag: 'SLIDE 03 / 05',
        accentColor: '#8b5cf6',
      },
      {
        id: `slide-${index}-4`,
        headline: 'Phase 3: Measuring Velocity',
        body: 'Attribution tracked directly through demo pipelines and qualified inbound opportunities.',
        tag: 'SLIDE 04 / 05',
        accentColor: '#06b6d4',
      },
      {
        id: `slide-${index}-5`,
        headline: 'Actionable Takeaway',
        body: 'Consistency and clear documentation compound faster than ad spend. Start with 1 sprint.',
        tag: 'SLIDE 05 / 05',
        accentColor: '#10b981',
      },
    ];
  } else if (visualFormat === 'infographic') {
    infographicData = {
      title: topicTitle,
      metricNumber: '+62%',
      metricLabel: 'Onboarding Velocity Lift',
      pillars: [
        { step: '01', title: 'Streamlined Setup', desc: 'Reduced friction in user onboarding' },
        { step: '02', title: 'Async Loom Guides', desc: 'Visual step-by-step contextual walkthroughs' },
        { step: '03', title: 'Direct Customer SLA', desc: 'Guaranteed 24-hour turnaround on blockers' },
      ],
      footerNote: reference ? `Anchored to: ${reference}` : 'Source: LinkedFlow Benchmarks 2026',
    };
  }

  const citations = reference
    ? [
        {
          id: `cite-${Date.now()}-${index}`,
          sourceName: reference.startsWith('http') ? 'Source document' : 'Context note',
          domain: reference.startsWith('http') ? new URL(reference.startsWith('http://') || reference.startsWith('https://') ? reference : `https://${reference}`).hostname : 'internal',
          url: reference.startsWith('http') ? reference : '#',
          claim: `Incorporated reference: "${reference}"`,
          verifiedDate: '2026',
          confidence: 96,
        },
      ]
    : [];

  return {
    id: `ai-gen-${Date.now()}-${index}`,
    title: topicTitle,
    content,
    cta: "What's your experience with this approach? Drop your thoughts below 👇",
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    authorRole: 'Content Strategist',
    category: postCategory,
    theme: postCategory,
    reference: reference || null,
    visualFormat,
    hashtags: ['#LinkedInMarketing', '#B2BSaaS', '#ContentStrategy', '#GrowthMarketing'],
    candidateImages,
    selectedImageIndex: index % (MOCK_IMAGES.length || 1),
    imageUrl,
    carouselSlides,
    infographicData,
    scheduledDate: scheduleDate,
    scheduledTime: scheduleTime,
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    dueDate: scheduleDate,
    status: POST_STATUS.GENERATING,
    source: 'ai_generator',
    revisions: 1,
    revisionsList: [
      {
        id: `rev-ai-${Date.now()}-${index}`,
        versionNumber: 1,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        author: 'Batch generator',
        authorType: 'ai',
        summary: `Drafted from topic "${topicTitle}"`,
      },
    ],
    qualityAudit: {
      score: 94,
      grade: 'A',
      verdict: 'Ready for Review',
      hookScore: 95,
      clarityScore: 93,
      voiceScore: 94,
      readabilityWpm: 220,
      issues: [],
    },
    citations,
    activityLog: [
      {
        id: `act-ai-${Date.now()}-${index}`,
        actor: 'Batch generator',
        action: `Generated draft from topic "${topicTitle}"`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
    ],
    comments: [],
  };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function AIGeneratorShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState('');
  const [theme, setTheme] = useState('Thought Leadership');
  const [reference, setReference] = useState('');
  const [visualFormat, setVisualFormat] = useState('image');
  const [postCount, setPostCount] = useState(3);
  const [useScheduleRules, setUseScheduleRules] = useState(true);
  const [startDate, setStartDate] = useState('2026-09-15');
  const [defaultTime, setDefaultTime] = useState('09:00');

  const [customTopics, setCustomTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraftIndex, setCurrentDraftIndex] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);

  const activeDraftTopic =
    customTopics.length > 0
      ? customTopics[currentDraftIndex % customTopics.length]
      : topic || MOCK_TOPICS[currentDraftIndex % MOCK_TOPICS.length];

  useEffect(() => {
    if (generatedPosts.length === 0) return;

    const interval = setInterval(() => {
      setGeneratedPosts((prev) =>
        prev.map((p) => {
          if (p.status === POST_STATUS.GENERATING) {
            return { ...p, status: POST_STATUS.AUTO_REVIEW };
          }
          if (p.status === POST_STATUS.AUTO_REVIEW) {
            return { ...p, status: POST_STATUS.AWAITING_REVIEW };
          }
          return p;
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [generatedPosts.length]);

  const handleGenerate = async () => {
    if (!topic && customTopics.length === 0) {
      toast.error('Please enter a topic or add notes for this batch');
      return;
    }
    setIsGenerating(true);
    setCurrentDraftIndex(0);
    setGeneratedPosts([]);

    const sequentialSlots = useScheduleRules
      ? getSequentialScheduleSlots(postCount, startDate)
      : [];

    for (let i = 0; i < postCount; i++) {
      setCurrentDraftIndex(i);
      // Wait for each individual post to draft and synthesize
      await new Promise((r) => setTimeout(r, 1600));

      const postTopic =
        customTopics.length > 0
          ? customTopics[i % customTopics.length]
          : topic || MOCK_TOPICS[i % MOCK_TOPICS.length];
      const slot = useScheduleRules && sequentialSlots[i]
        ? sequentialSlots[i]
        : { date: addDays(startDate, i), time: defaultTime, isSettingsSlot: false };

      const newPost = generateMockPost(postTopic, theme, reference, visualFormat, i, slot.date, slot.time);

      setGeneratedPosts((prev) => [...prev, newPost]);
    }

    setIsGenerating(false);
    toast.success(`Generated ${postCount} posts`);
  };

  const handleSendAllToApprovalQueue = () => {
    if (generatedPosts.length === 0) return;

    try {
      const postsForQueue = generatedPosts.map((p) => ({
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

      toast.success(`${generatedPosts.length} posts sent to approval queue`);
      navigate('/approval-workflow?source=ai_generator');
    } catch {
      toast.error('Could not send posts to approval queue');
    }
  };

  const handleSendOneToApprovalQueue = (id) => {
    try {
      const target = generatedPosts.find((p) => p.id === id);
      if (!target) return;

      const prepared = {
        ...target,
        status: POST_STATUS.AWAITING_REVIEW,
        source: 'ai_generator',
      };

      const stored = localStorage.getItem('linkedflow_approval_posts');
      const existing = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
      const mergedApproval = [prepared, ...existing.filter((p) => p.id !== id)];
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(mergedApproval));

      const masterPosts = getStoredPosts();
      const mergedMaster = [prepared, ...masterPosts.filter((p) => p.id !== id)];
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

  const handleRemovePost = (id) => {
    setGeneratedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSelectImageIndex = (postId, newIdx) => {
    setGeneratedPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              selectedImageIndex: newIdx,
              imageUrl: (p.candidateImages || MOCK_IMAGES)[newIdx],
            }
          : p
      )
    );
  };

  const completedCount = generatedPosts.filter((p) => p.status === POST_STATUS.AWAITING_REVIEW).length;

  return (
    <div className="flex flex-col gap-5 max-w-[1360px] mx-auto pb-14 px-2 sm:px-4">
      {/* Header Banner */}
      <AIGeneratorHeader />

      {/* Cockpit Context Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-800 dark:text-slate-200">Batch post generator</span>
          <span>&bull;</span>
          <span>Format: <strong className="font-medium text-slate-700 dark:text-slate-200 capitalize">{visualFormat}</strong></span>
          <span>&bull;</span>
          <span>Auto-scheduling enabled</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/post-creation-composer"
            className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <PenTool size={13} />
            <span>Open composer</span>
          </Link>
          <Link
            to="/approval-workflow?source=ai_generator"
            className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <CheckSquare size={13} className="text-blue-600 dark:text-blue-400" />
            <span>Approval queue</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Settings on Left, Preview/Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Post Settings Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <AIGeneratorForm
            topic={topic}
            onTopicChange={setTopic}
            theme={theme}
            onThemeChange={setTheme}
            reference={reference}
            onReferenceChange={setReference}
            visualFormat={visualFormat}
            onVisualFormatChange={setVisualFormat}
            customTopics={customTopics}
            newTopic={newTopic}
            onNewTopicChange={setNewTopic}
            onAddCustomTopic={() => {
              if (!newTopic.trim()) return;
              setCustomTopics((prev) => [...prev, newTopic.trim()]);
              setNewTopic('');
            }}
            onRemoveCustomTopic={(idx) => setCustomTopics((prev) => prev.filter((_, i) => i !== idx))}
            postCount={postCount}
            onPostCountChange={setPostCount}
            useScheduleRules={useScheduleRules}
            onUseScheduleRulesChange={setUseScheduleRules}
            startDate={startDate}
            onStartDateChange={setStartDate}
            defaultTime={defaultTime}
            onDefaultTimeChange={setDefaultTime}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Right Column: Preview / Stream Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {generatedPosts.length === 0 && !isGenerating && (
            <AIGeneratorEmptyState
              topic={topic}
              theme={theme}
              reference={reference}
              visualFormat={visualFormat}
              onSelectTopic={(newTopicText) => setTopic(newTopicText)}
            />
          )}

          {/* Initial generation: show full loading state with header while post #1 is being synthesized */}
          {isGenerating && generatedPosts.length === 0 && (
            <AIGeneratorLoadingState
              currentPostIndex={currentDraftIndex}
              totalPosts={postCount}
              theme={theme}
              visualFormat={visualFormat}
              topic={activeDraftTopic}
              showHeader={true}
            />
          )}

          {/* Stream of posts: completed cards + active drafting card below them */}
          {generatedPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              {/* Batch Action Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 px-1">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {isGenerating ? (
                      <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                        <Loader2 size={13} className="animate-spin" />
                        Generating post {currentDraftIndex + 1} of {postCount}…
                      </span>
                    ) : (
                      `${generatedPosts.length} posts generated`
                    )}
                  </span>
                  {!isGenerating && (
                    <>
                      <span>&bull;</span>
                      <span>
                        {completedCount} ready for review
                      </span>
                    </>
                  )}
                </div>

                {!isGenerating && (
                  <button
                    type="button"
                    onClick={handleSendAllToApprovalQueue}
                    className="h-8 px-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <CheckSquare size={13} />
                    <span>Send all to approval queue ({generatedPosts.length})</span>
                  </button>
                )}
              </div>

              {/* Cards List: finished posts + active drafting card beneath */}
              <div className="flex flex-col gap-4">
                {generatedPosts.map((post, idx) => (
                  <GeneratedPostCard
                    key={post.id}
                    post={post}
                    index={idx}
                    isExpanded={expandedPost === post.id}
                    onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    onRemove={() => handleRemovePost(post.id)}
                    onSelectImageIndex={(newIdx) => handleSelectImageIndex(post.id, newIdx)}
                    onSendToQueue={handleSendOneToApprovalQueue}
                    onOpenPreview={(p) => setPreviewPost(p)}
                  />
                ))}

                {/* Show active drafting card below completed posts while still generating */}
                {isGenerating && (
                  <AIGeneratorLoadingState
                    currentPostIndex={currentDraftIndex}
                    totalPosts={postCount}
                    theme={theme}
                    visualFormat={visualFormat}
                    topic={activeDraftTopic}
                    showHeader={false}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LinkedIn Live Feed Preview Modal */}
      <LinkedInPreviewModal
        isOpen={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
        onSendToQueue={handleSendOneToApprovalQueue}
      />
    </div>
  );
}
