'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ComposerEditor from './ComposerEditor';
import ComposerPreview from './ComposerPreview';
import ComposerAIPanel from './ComposerAIPanel';
import ComposerToolbar from './ComposerToolbar';
import ComposerHeader from './ComposerHeader';
import ScheduleControl from '@/components/ScheduleControl';
import PipelineStageStepper from '@/components/PipelineStageStepper';
import Breadcrumbs from '@/components/Breadcrumbs';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';
import { INITIAL_APPROVAL_POSTS } from '@/app/approval-workflow/_api/queries';
import { GitCommit, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getNextAvailableSlot } from '@/lib/scheduling';

import { STOCK_IMAGES } from '@/temp-backend/data/media';
import { getStoredPosts, saveStoredPosts } from '@/temp-backend';

const MOCK_CANDIDATE_IMAGES = [
  {
    id: STOCK_IMAGES.teamBrainstorm.id,
    url: STOCK_IMAGES.teamBrainstorm.url,
    alt: STOCK_IMAGES.teamBrainstorm.label,
  },
  {
    id: STOCK_IMAGES.modernWorkspace.id,
    url: STOCK_IMAGES.modernWorkspace.url,
    alt: STOCK_IMAGES.modernWorkspace.label,
  },
  {
    id: STOCK_IMAGES.growthDashboard.id,
    url: STOCK_IMAGES.growthDashboard.url,
    alt: STOCK_IMAGES.growthDashboard.label,
  },
];

export default function ComposerShell() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editPostId = searchParams.get('id');
  const isEditMode = searchParams.get('mode') === 'edit';

  const [activePost, setActivePost] = useState(null);
  const [content, setContent] = useState('');
  const [cta, setCta] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [hashtags, setHashtags] = useState(['#LinkedInMarketing', '#ContentStrategy', '#B2BSaaS']);
  const [imageUrl, setImageUrl] = useState('');
  const [candidateImages, setCandidateImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [visualFormat, setVisualFormat] = useState('image'); // 'image' | 'none'
  const [category, setCategory] = useState('Thought Leadership');

  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const dateParam = searchParams.get('date');
  const [scheduledDate, setScheduledDate] = useState(() => dateParam || getNextAvailableSlot().date);
  const [scheduledTime, setScheduledTime] = useState(() => getNextAvailableSlot().time);

  useEffect(() => {
    if (dateParam && !isEditMode) {
      setScheduledDate(dateParam);
    }
  }, [dateParam, isEditMode]);

  // Load existing draft if opened in edit mode or from a template
  useEffect(() => {
    if (isEditMode && editPostId) {
      let allPosts = getStoredPosts();
      try {
        const stored = localStorage.getItem('linkedflow_approval_posts');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) allPosts = [...parsed, ...allPosts];
        }
      } catch {
        // Ignore
      }

      const targetPost = allPosts.find((p) => p.id === editPostId);
      if (targetPost) {
        setActivePost(targetPost);

        if (targetPost.scheduledDate || targetPost.dueDate) {
          setScheduledDate(targetPost.scheduledDate || targetPost.dueDate);
        }
        if (targetPost.scheduledTime) {
          setScheduledTime(targetPost.scheduledTime);
        }

        // Separate CTA if present at bottom
        const lines = (targetPost.content || '').split('\n').filter((l) => l.trim() !== '');
        if (lines.length > 2 && lines[lines.length - 1].includes('?')) {
          setCta(lines[lines.length - 1]);
          setContent(lines.slice(0, lines.length - 1).join('\n\n'));
        } else {
          setContent(targetPost.content || '');
          setCta(targetPost.cta || '');
        }

        setHashtags(targetPost.hashtags || []);
        setCategory(targetPost.category || 'Thought Leadership');
        if (targetPost.visualFormat === 'none') {
          setVisualFormat('none');
          setImageUrl('');
          setCandidateImages([]);
        } else {
          setVisualFormat('image');
          setCandidateImages(MOCK_CANDIDATE_IMAGES);
          setImageUrl(targetPost.imageUrl || MOCK_CANDIDATE_IMAGES[0].url);
        }
      }
    } else if (location.state?.template) {
      const tpl = location.state.template;
      setContent(tpl.body || '');
      if (tpl.category) setCategory(tpl.category);
      if (tpl.tone) setSelectedTone(tpl.tone);
      if (tpl.hashtags) setHashtags(tpl.hashtags);
      toast.success(`Loaded template: "${tpl.name}"`);
    }
  }, [editPostId, isEditMode, location.state]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));

    setContent(
      `The biggest mistake most B2B companies make on LinkedIn?\n\nThey treat it like a broadcast channel — pushing announcements instead of starting conversations.\n\nHere's what actually works:\n\n→ Share the messy middle, not just the polished outcome\n→ Ask genuine questions your audience cares about\n→ Respond to every comment in the first hour\n→ Write for one person, not your entire ICP\n\nLinkedIn rewards consistency and authenticity — not perfection.\n\nWe grew our company page from 800 to 22,000 followers by following these principles. No paid promotion.`
    );

    const generatedCta =
      "What's the one thing that changed your LinkedIn results? Drop your thoughts below 👇";
    setCta(generatedCta);

    if (visualFormat !== 'none') {
      setCandidateImages(MOCK_CANDIDATE_IMAGES);
      setSelectedImageIndex(0);
      setImageUrl(MOCK_CANDIDATE_IMAGES[0].url);
    }

    setIsGenerating(false);
    toast.success('Generated draft and visual variations ✨');
  };

  const handleSelectImageIndex = (idx) => {
    setSelectedImageIndex(idx);
    if (candidateImages[idx]) {
      setImageUrl(candidateImages[idx].url || candidateImages[idx]);
      setVisualFormat('image');
      toast.success(`Attached Image Variation #${idx + 1}`);
    }
  };

  const handleRemoveCandidates = () => {
    setCandidateImages([]);
    setImageUrl('');
    setVisualFormat('none');
    toast.info('Switched to text-only (visual removed)');
  };

  const handleSaveDraftOrRevision = (isSubmit = false) => {
    const fullContent = cta ? `${content}\n\n${cta}` : content;
    const targetStatus = isSubmit ? 'awaiting_review' : 'draft';

    if (isEditMode && editPostId) {
      try {
        const stored = localStorage.getItem('linkedflow_approval_posts');
        let posts = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
        const nextVersion = (activePost?.revisions || 0) + 1;
        const newRevision = {
          id: `rev-${Date.now()}`,
          versionNumber: nextVersion,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          author: 'Sarah Reeves',
          authorType: 'human',
          summary: isSubmit ? `Submitted revision v${nextVersion} for review` : `Edited draft in composer (v${nextVersion})`,
          diff: `+ Human revision saved at ${new Date().toLocaleTimeString()}`,
        };

        posts = posts.map((p) => {
          if (p.id !== editPostId) return p;
          return {
            ...p,
            content: fullContent,
            cta,
            hashtags,
            category,
            visualFormat,
            imageUrl: visualFormat === 'none' ? null : imageUrl,
            scheduledDate,
            scheduledTime,
            dueDate: scheduledDate,
            status: isSubmit ? 'awaiting_review' : p.status,
            source: p.source || 'composer',
            revisions: nextVersion,
            revisionsList: [...(p.revisionsList || []), newRevision],
            activityLog: [
              ...(p.activityLog || []),
              {
                id: `act-${Date.now()}`,
                actor: 'Sarah Reeves',
                action: isSubmit
                  ? `Submitted revision v${nextVersion} for review (Slot: ${scheduledDate} ${scheduledTime})`
                  : `Created new revision v${nextVersion}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        });

        localStorage.setItem('linkedflow_approval_posts', JSON.stringify(posts));

        // Sync with master posts
        const masterPosts = getStoredPosts();
        const updatedMaster = masterPosts.map((p) => {
          if (p.id !== editPostId) return p;
          const target = posts.find((ap) => ap.id === editPostId);
          return target ? { ...p, ...target } : p;
        });
        saveStoredPosts(updatedMaster);

        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });

        if (isSubmit) {
          toast.success(`Revision v${nextVersion} submitted to Approval Queue!`);
          navigate(`/approval-workflow?post=${editPostId}&source=composer`);
        } else {
          toast.success(`Saved new revision v${nextVersion} to approval queue!`);
        }
      } catch {
        toast.error('Failed to save revision');
      }
    } else {
      // Create mode
      const newPostId = `comp-${Date.now()}`;
      const firstLine = content.trim().split('\n')[0].replace(/^[#*\-•\s]+/, '').slice(0, 60);
      const newPost = {
        id: newPostId,
        title: firstLine || 'Post Composer Draft',
        content: fullContent,
        cta,
        hashtags: hashtags || [],
        category: category || 'Thought Leadership',
        visualFormat,
        imageUrl: visualFormat === 'none' ? null : imageUrl,
        scheduledDate,
        scheduledTime,
        dueDate: scheduledDate,
        status: targetStatus,
        source: 'composer',
        author: 'Sarah Reeves',
        authorInitials: 'SR',
        authorRole: 'Content Strategist',
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        revisions: 1,
        revisionsList: [
          {
            id: `rev-${Date.now()}`,
            versionNumber: 1,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            author: 'Sarah Reeves',
            authorType: 'human',
            summary: isSubmit ? 'Created & submitted via Post Composer' : 'Draft saved in Post Composer',
          },
        ],
        activityLog: [
          {
            id: `act-${Date.now()}`,
            actor: 'Sarah Reeves',
            action: isSubmit
              ? `Submitted to Approval Queue (Slot: ${scheduledDate} ${scheduledTime})`
              : 'Draft saved in Post Composer',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          },
        ],
        qualityAudit: {
          score: 93,
          grade: 'A',
          verdict: 'Ready for Review',
          hookScore: 92,
          clarityScore: 94,
          voiceScore: 93,
          readabilityWpm: 215,
          issues: [],
        },
        citations: [],
        comments: [],
      };

      try {
        const stored = localStorage.getItem('linkedflow_approval_posts');
        const approvalPosts = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
        localStorage.setItem(
          'linkedflow_approval_posts',
          JSON.stringify([newPost, ...approvalPosts.filter((p) => p.id !== newPostId)])
        );

        const masterPosts = getStoredPosts();
        saveStoredPosts([newPost, ...masterPosts.filter((p) => p.id !== newPostId)]);

        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });

        if (isSubmit) {
          toast.success('Submitted to Approval Queue — ready for review!');
          navigate(`/approval-workflow?post=${newPostId}&source=composer`);
        } else {
          toast.success(`Draft saved (Scheduled for ${scheduledDate} ${scheduledTime})`);
        }
      } catch {
        toast.error('Failed to save post');
      }
    }
  };

  const handleSubmitForReview = () => {
    handleSaveDraftOrRevision(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Editorial Hero Header matching Dashboard Theme & Reference Image 2 */}
      <ComposerHeader
        isEditMode={isEditMode}
        activePost={activePost}
      />

      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-card/70 backdrop-blur-sm border border-border/70 rounded-xl shadow-sm flex-wrap">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-foreground">Post Composer</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Target slot: <strong className="text-foreground font-medium">{scheduledDate} {scheduledTime}</strong></span>
        </div>

        <ComposerToolbar
          showAIPanel={showAIPanel}
          onToggleAI={() => setShowAIPanel((s) => !s)}
          onSaveDraft={handleSaveDraftOrRevision}
          onSubmitReview={handleSubmitForReview}
          onSchedule={() => setShowScheduleDrawer(true)}
          onOpenHistory={() => setShowHistoryModal(true)}
          hasContent={(content || '').length > 0}
          isEditMode={isEditMode}
          returnUrl="/approval-workflow"
          scheduledSlotLabel={`${scheduledDate} ${scheduledTime}`}
        />
      </div>

      {/* Mode Alert Banner if opened from Approval Queue */}
      {isEditMode && activePost && (
        <div className="p-3.5 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <GitCommit size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Editing Review Draft: &ldquo;{activePost.title}&rdquo;
              </p>
              <p className="text-[11px] text-muted-foreground">
                Loaded with original content, CTA, hashtags, and visual attachments. Saving will create a new incremental version without overwriting past history.
              </p>
            </div>
          </div>

          <Link
            to="/approval-workflow"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 shrink-0"
          >
            <ArrowLeft size={13} />
            <span>Return to Review</span>
          </Link>
        </div>
      )}

      {/* Pipeline Stepper showing exact lifecycle stage & next step */}
      {isEditMode && activePost && (
        <PipelineStageStepper
          status={activePost.status}
          post={{ ...activePost, scheduledDate, scheduledTime }}
        />
      )}

      {/* Main Grid: 2-column side-by-side layout for real-time preview without scrolling */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor + Merged AI Assistant (Left Column) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-5">
          <ComposerEditor
            content={content}
            onChange={setContent}
            cta={cta}
            onCtaChange={setCta}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            category={category}
            onCategoryChange={setCategory}
            imageUrl={imageUrl}
            onImageChange={setImageUrl}
            visualFormat={visualFormat}
            onVisualFormatChange={setVisualFormat}
            candidateImages={candidateImages}
            selectedImageIndex={selectedImageIndex}
            onSelectImageIndex={handleSelectImageIndex}
            onRemoveCandidates={handleRemoveCandidates}
            isGenerating={isGenerating}
            onAIGenerate={handleAIGenerate}
            showAIPanel={showAIPanel}
            onToggleAIPanel={() => setShowAIPanel((s) => !s)}
          />
        </div>

        {/* Live LinkedIn Preview (Right Column - sticky in real time!) */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-20">
          <ComposerPreview
            content={content}
            cta={cta}
            hashtags={hashtags}
            imageUrl={imageUrl}
            visualFormat={visualFormat}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Centralized Schedule Control Drawer */}
      {showScheduleDrawer && (
        <ScheduleControl
          isDrawer={true}
          date={scheduledDate}
          time={scheduledTime}
          onChange={({ date, time }) => {
            setScheduledDate(date);
            setScheduledTime(time);
            toast.success(`Publishing slot updated to ${date} at ${time}`);
          }}
          onClose={() => setShowScheduleDrawer(false)}
        />
      )}

      {/* Version History & Diff Dialog */}
      <VersionHistoryDialog
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        revisions={activePost?.revisionsList || []}
        currentContent={content}
        currentPostTitle={activePost?.title || 'Draft in Composer'}
        onRestoreVersion={(v) => {
          if (v.content) setContent(v.content);
        }}
      />
    </div>
  );
}
