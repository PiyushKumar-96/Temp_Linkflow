'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import ComposerEditor from './ComposerEditor';
import ComposerPreview from './ComposerPreview';
import ComposerAIPanel from './ComposerAIPanel';
import ComposerToolbar from './ComposerToolbar';
import ScheduleDrawer from './ScheduleDrawer';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';
import { INITIAL_APPROVAL_POSTS } from '@/app/approval-workflow/_api/queries';
import { GitCommit, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { STOCK_IMAGES } from '@/temp-backend/data/media';
import { getStoredPosts } from '@/temp-backend';

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

  const handleSaveDraftOrRevision = () => {
    const fullContent = cta ? `${content}\n\n${cta}` : content;

    if (isEditMode && editPostId) {
      // Save creates a NEW VERSION in the approval queue without overwriting
      try {
        const stored = localStorage.getItem('linkedflow_approval_posts');
        let posts = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;

        posts = posts.map((p) => {
          if (p.id !== editPostId) return p;
          const nextVersion = (p.revisions || 0) + 1;
          const newRevision = {
            id: `rev-${Date.now()}`,
            versionNumber: nextVersion,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            author: 'Sarah Reeves',
            authorType: 'human',
            summary: `Edited draft in composer (v${nextVersion})`,
            diff: `+ Human revision saved at ${new Date().toLocaleTimeString()}`,
          };

          return {
            ...p,
            content: fullContent,
            cta,
            hashtags,
            category,
            visualFormat,
            imageUrl: visualFormat === 'none' ? null : imageUrl,
            revisions: nextVersion,
            revisionsList: [...(p.revisionsList || []), newRevision],
            activityLog: [
              ...(p.activityLog || []),
              {
                id: `act-${Date.now()}`,
                actor: 'Sarah Reeves',
                action: `Created new revision v${nextVersion}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        });

        localStorage.setItem('linkedflow_approval_posts', JSON.stringify(posts));
        toast.success(`Saved new revision v${(activePost?.revisions || 0) + 1} to approval queue!`);
      } catch {
        toast.success('Saved new revision!');
      }
    } else {
      // Create mode
      toast.success('Draft saved to library');
    }
  };

  const handleSubmitForReview = () => {
    handleSaveDraftOrRevision();
    if (isEditMode) {
      toast.success('Revision submitted for review!');
      navigate('/approval-workflow');
    } else {
      toast.success('Submitted for review — approvers notified');
      navigate('/approval-workflow');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Alert Banner if opened from Approval Queue */}
      {isEditMode && activePost && (
        <div className="p-3.5 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <GitCommit size={16} />
            </div>
            <div>
              <p className="text-xs font-600 text-foreground">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-foreground">
            {isEditMode ? 'Edit Draft (New Revision)' : 'Post Composer'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEditMode
              ? 'Refine draft copy and visual selection before resubmitting for owner sign-off'
              : 'Create, refine, and attach visual candidates for your LinkedIn post'}
          </p>
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
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Editor */}
        <div className={`${showAIPanel ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
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
          />
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div className="xl:col-span-1">
            <ComposerAIPanel
              content={content}
              tone={selectedTone}
              onToneChange={setSelectedTone}
              onHashtagsChange={setHashtags}
              onApplySuggestion={setContent}
            />
          </div>
        )}

        {/* Preview */}
        <div className="xl:col-span-2">
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

      {/* Schedule Drawer */}
      {showScheduleDrawer && (
        <ScheduleDrawer
          onClose={() => setShowScheduleDrawer(false)}
          onSchedule={(date, time) => {
            setShowScheduleDrawer(false);
            toast.success(`Post scheduled for ${date} at ${time}`);
          }}
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
