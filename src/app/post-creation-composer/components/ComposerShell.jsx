'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GitCommit } from 'lucide-react';
import { toast } from 'sonner';
import ComposerEditor from './ComposerEditor';
import ComposerPreview from './ComposerPreview';
import ComposerToolbar from './ComposerToolbar';
import { WorkflowMini } from './ComposerUI';
import ScheduleControl from '@/components/ScheduleControl';
import PipelineStageStepper from '@/components/PipelineStageStepper';
import Breadcrumbs from '@/components/Breadcrumbs';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';
import { INITIAL_APPROVAL_POSTS } from '@/app/approval-workflow/_api/queries';
import { getNextAvailableSlot } from '@/lib/scheduling';
import { STOCK_IMAGES } from '@/temp-backend/data/media';
import { getStoredPosts, saveStoredPosts } from '@/temp-backend';
import {
  composePostText,
  formatSlot,
  getFoldIndex,
  getPillar,
  getQualityChecks,
  getQualityScore,
  pillarIdFromPost,
  prefersReducedMotion,
  wait,
} from '../_model/composer-utils';
import '@/styles/motion.css';
import '@/styles/composer.css';


const MOCK_CANDIDATE_IMAGES = [
  { id: STOCK_IMAGES.teamBrainstorm.id, url: STOCK_IMAGES.teamBrainstorm.url, alt: STOCK_IMAGES.teamBrainstorm.label },
  { id: STOCK_IMAGES.modernWorkspace.id, url: STOCK_IMAGES.modernWorkspace.url, alt: STOCK_IMAGES.modernWorkspace.label },
  { id: STOCK_IMAGES.growthDashboard.id, url: STOCK_IMAGES.growthDashboard.url, alt: STOCK_IMAGES.growthDashboard.label },
];

const asGenerated = (images) => images.map((img, i) => ({ ...img, source: 'ai', slotKey: `gen-${i}` }));

const GENERATED_POST = `The biggest mistake most B2B companies make on LinkedIn?\n\nThey treat it like a broadcast channel — pushing announcements instead of starting conversations.\n\nHere's what actually works:\n\n→ Share the messy middle, not just the polished outcome\n→ Ask genuine questions your audience cares about\n→ Respond to every comment in the first hour\n→ Write for one person, not your entire ICP\n\nLinkedIn rewards consistency and authenticity — not perfection.\n\nWe grew our company page from 800 to 22,000 followers by following these principles. No paid promotion.`;
const GENERATED_CTA = "What's the one thing that changed your LinkedIn results? Drop your thoughts below 👇";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const APPROVAL_KEY = 'linkedflow_approval_posts';

function gradeFor(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

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
  const [pillarId, setPillarId] = useState('thought-leadership');
  const [target, setTarget] = useState('personal');
  const [device, setDevice] = useState('desktop');

  const [visualFormat, setVisualFormat] = useState('image');
  const [imageUrl, setImageUrl] = useState('');
  const [candidateImages, setCandidateImages] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [infographicData, setInfographicData] = useState(null);

  const [imageGeneration, setImageGeneration] = useState(null); // { startedAt, count } while generating

  const [revealMode, setRevealMode] = useState('develop');
  const [isGenerating, setIsGenerating] = useState(false);


  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saved'
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'sending' | 'sent'

  const generationRun = useRef(0);
  const draftIdRef = useRef(null); // repeat saves in create mode update one post instead of creating copies

  const dateParam = searchParams.get('date');
  const [scheduledDate, setScheduledDate] = useState(() => dateParam || getNextAvailableSlot().date);
  const [scheduledTime, setScheduledTime] = useState(() => getNextAvailableSlot().time);

  useEffect(() => {
    if (dateParam && !isEditMode) setScheduledDate(dateParam);
  }, [dateParam, isEditMode]);

  // Load an existing draft (edit mode) or a template
  useEffect(() => {
    if (isEditMode && editPostId) {
      let allPosts = getStoredPosts();
      try {
        const stored = localStorage.getItem(APPROVAL_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) allPosts = [...parsed, ...allPosts];
        }
      } catch {
        // ignore
      }

      const targetPost = allPosts.find((p) => p.id === editPostId);
      if (!targetPost) return;

      setActivePost(targetPost);
      if (targetPost.scheduledDate || targetPost.dueDate) setScheduledDate(targetPost.scheduledDate || targetPost.dueDate);
      if (targetPost.scheduledTime) setScheduledTime(targetPost.scheduledTime);

      const lines = (targetPost.content || '').split('\n').filter((l) => l.trim() !== '');
      if (lines.length > 2 && lines[lines.length - 1].includes('?')) {
        setCta(lines[lines.length - 1]);
        setContent(lines.slice(0, lines.length - 1).join('\n\n'));
      } else {
        setContent(targetPost.content || '');
        setCta(targetPost.cta || '');
      }

      setHashtags(targetPost.hashtags || []);
      const loadedPillar = pillarIdFromPost(targetPost);
      setPillarId(loadedPillar);
      setTarget(targetPost.target || getPillar(loadedPillar).target);

      if (targetPost.visualFormat === 'none') {
        setVisualFormat('none');
        setImageUrl('');
        setCandidateImages([]);
      } else {
        const generated = asGenerated(MOCK_CANDIDATE_IMAGES);
        const existing = targetPost.imageUrl;
        const isKnown = generated.some((img) => img.url === existing);
        setVisualFormat(targetPost.visualFormat || 'image');
        setCandidateImages(existing && !isKnown ? [{ id: 'existing-image', url: existing, alt: 'Current image', source: 'upload' }, ...generated] : generated);
        setImageUrl(existing || generated[0].url);
        setRevealMode('quick');
      }
    } else if (location.state?.template) {
      const tpl = location.state.template;
      setContent(tpl.body || '');
      if (tpl.category) {
        const id = pillarIdFromPost({ category: tpl.category });
        setPillarId(id);
        setTarget(getPillar(id).target);
      }
      if (tpl.tone) setSelectedTone(tpl.tone);
      if (tpl.hashtags) setHashtags(tpl.hashtags);
      toast.success(`Loaded template: ${tpl.name}`);
    }
  }, [editPostId, isEditMode, location.state]);

  // ---------- Derived: fold + quality ----------

  const composedText = useMemo(() => composePostText(content, cta, hashtags), [content, cta, hashtags]);
  const foldIndex = useMemo(() => getFoldIndex(composedText, device), [composedText, device]);
  const contentFoldIndex = content.trim() && foldIndex != null && foldIndex < content.length ? foldIndex : null;

  const quality = useMemo(() => {
    const checks = getQualityChecks({ content, cta, hashtags, visualFormat, imageUrl, foldIndex });
    return { checks, score: getQualityScore(checks), hasText: content.trim().length > 0 };
  }, [content, cta, hashtags, visualFormat, imageUrl, foldIndex]);

  // ---------- AI generation (text first, then images) ----------

  const runImageGeneration = async (run) => {
    setCandidateImages((prev) => prev.filter((img) => img.source !== 'ai'));
    setImageGeneration({ startedAt: Date.now(), count: MOCK_CANDIDATE_IMAGES.length });

    // BACKEND: POST /api/ai/generate-images with { content, tone, pillar }. Real calls usually take 10–20 s.
    await wait(8500);
    if (run !== generationRun.current) return;

    const generated = asGenerated(MOCK_CANDIDATE_IMAGES);
    setRevealMode('develop');
    setCandidateImages((prev) => [...prev.filter((img) => img.source !== 'ai'), ...generated]);
    setImageUrl(generated[0].url);
    setImageGeneration(null);
    toast.success('Image options are ready');
  };

  const handleAIGenerate = async ({ withImages = true } = {}) => {
    const run = ++generationRun.current;
    setIsGenerating(true);

    // BACKEND: POST /api/ai/draft-post with { tone, pillar, target }
    await wait(1200);
    if (run !== generationRun.current) return;

    setContent(GENERATED_POST);
    setCta(GENERATED_CTA);
    setIsGenerating(false);

    if (!withImages) {
      toast.success('Draft ready');
      return;
    }
    setVisualFormat('image');
    await runImageGeneration(run);
  };

  const handleGenerateImages = () => {
    const run = ++generationRun.current;
    setVisualFormat('image');
    runImageGeneration(run);
  };

  const handleCancelImages = () => {
    generationRun.current += 1;
    setImageGeneration(null);
    toast('Image generation cancelled');
  };

  // ---------- Images ----------

  const handleSelectImage = (url) => {
    setRevealMode('quick');
    setImageUrl(url);
    setVisualFormat('image');
  };

  const handleRemoveImage = (url) => {
    const next = candidateImages.filter((img) => img.url !== url);
    setCandidateImages(next);
    if (url === imageUrl) {
      setRevealMode('quick');
      setImageUrl(next[0]?.url || '');
    }
  };

  const handleUploadImage = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Use a PNG, JPG or WEBP image.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('That image is over 10 MB. Try a smaller file.');
      return;
    }
    const url = URL.createObjectURL(file);
    setRevealMode('quick');
    setCandidateImages((prev) => [{ id: `upload-${Date.now()}`, url, alt: file.name, source: 'upload' }, ...prev]);
    setImageUrl(url);
    setVisualFormat('image');
  };

  // ---------- Setup ----------

  const handlePillarChange = (id) => {
    setPillarId(id);
    setTarget(getPillar(id).target);
  };

  // ---------- Persist ----------

  // Writes the post and returns { id, version } or null. Toasts and navigation are handled by the caller.
  const persistPost = (isSubmit) => {
    const fullContent = cta ? `${content}\n\n${cta}` : content;
    const pillar = getPillar(pillarId);
    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const fields = {
      content: fullContent,
      cta,
      hashtags: hashtags || [],
      category: pillar.category,
      pillar: pillar.id,
      target,
      visualFormat,
      imageUrl: visualFormat === 'none' ? null : imageUrl,
      carouselSlides: visualFormat === 'carousel' ? carouselSlides : undefined,
      infographicData: visualFormat === 'infographic' ? infographicData : undefined,
      scheduledDate,
      scheduledTime,
      dueDate: scheduledDate,

    };

    if (isEditMode && editPostId) {
      try {
        const stored = localStorage.getItem(APPROVAL_KEY);
        let posts = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
        const nextVersion = (activePost?.revisions || 0) + 1;
        const newRevision = {
          id: `rev-${Date.now()}`,
          versionNumber: nextVersion,
          createdAt: stamp,
          author: 'Sarah Reeves',
          authorType: 'human',
          summary: isSubmit ? `Sent revision v${nextVersion} for review` : `Edited draft in composer (v${nextVersion})`,
          diff: `+ Human revision saved at ${new Date().toLocaleTimeString()}`,
        };

        posts = posts.map((p) => {
          if (p.id !== editPostId) return p;
          return {
            ...p,
            ...fields,
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
                  ? `Sent revision v${nextVersion} for review (Slot: ${scheduledDate} ${scheduledTime})`
                  : `Created new revision v${nextVersion}`,
                timestamp: stamp,
              },
            ],
          };
        });

        localStorage.setItem(APPROVAL_KEY, JSON.stringify(posts));
        const updated = posts.find((ap) => ap.id === editPostId);
        saveStoredPosts(getStoredPosts().map((p) => (p.id === editPostId && updated ? { ...p, ...updated } : p)));

        setActivePost((prev) => (prev ? { ...prev, revisions: nextVersion } : prev));
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });
        return { id: editPostId, version: nextVersion };
      } catch {
        toast.error("Couldn't save the revision. Check your connection and try again.");
        return null;
      }
    }

    if (!draftIdRef.current) draftIdRef.current = `comp-${Date.now()}`;
    const postId = draftIdRef.current;
    const firstLine = content.trim().split('\n')[0].replace(/^[#*\-•\s]+/, '').slice(0, 60);
    const newPost = {
      id: postId,
      title: firstLine || 'Post Composer Draft',
      ...fields,
      status: isSubmit ? 'awaiting_review' : 'draft',
      source: 'composer',
      author: 'Sarah Reeves',
      authorInitials: 'SR',
      authorRole: 'Content Strategist',
      submittedAt: stamp,
      revisions: 1,
      revisionsList: [
        {
          id: `rev-${Date.now()}`,
          versionNumber: 1,
          createdAt: stamp,
          author: 'Sarah Reeves',
          authorType: 'human',
          summary: isSubmit ? 'Created and sent for review from Post Composer' : 'Draft saved in Post Composer',
        },
      ],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          actor: 'Sarah Reeves',
          action: isSubmit ? `Sent for review (Slot: ${scheduledDate} ${scheduledTime})` : 'Draft saved in Post Composer',
          timestamp: stamp,
        },
      ],
      qualityAudit: {
        // `score` now matches the checklist the writer saw. The sub-scores are still placeholders.
        score: quality.score,
        grade: gradeFor(quality.score),
        verdict: quality.score >= 75 ? 'Ready for Review' : 'Needs Work',
        hookScore: 92,
        clarityScore: 94,
        voiceScore: 93,
        readabilityWpm: 215,
        issues: quality.checks.filter((c) => !c.ok).map((c) => c.hint),
      },
      citations: [],
      comments: [],
    };

    try {
      const stored = localStorage.getItem(APPROVAL_KEY);
      const approvalPosts = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
      localStorage.setItem(APPROVAL_KEY, JSON.stringify([newPost, ...approvalPosts.filter((p) => p.id !== postId)]));
      saveStoredPosts([newPost, ...getStoredPosts().filter((p) => p.id !== postId)]);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });
      return { id: postId, version: 1 };
    } catch {
      toast.error("Couldn't save the post. Check your connection and try again.");
      return null;
    }
  };

  const handleSaveDraft = () => {
    const result = persistPost(false);
    if (!result) return;
    const slot = formatSlot(scheduledDate, scheduledTime);
    toast.success(isEditMode ? `Version ${result.version} saved` : `Draft saved for ${slot.day}, ${slot.time}`);
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 1800);
  };

  // Signature moment: button fills → turns green → workflow advances to owner approval → navigate.
  const handleSubmitForReview = async () => {
    if (submitState !== 'idle') return;
    if (imageGeneration) {
      toast.error('Wait for the images to finish, or cancel them, before sending.');
      return;
    }
    setSubmitState('sending');
    await wait(prefersReducedMotion() ? 0 : 700); // BACKEND: replace with the real request

    const result = persistPost(true);
    if (!result) {
      setSubmitState('idle');
      return;
    }

    setSubmitState('sent');
    toast.success(isEditMode ? `Revision v${result.version} sent to the owner` : 'Sent to the owner for review');
    await wait(prefersReducedMotion() ? 300 : 1300);
    navigate(`/approval-workflow?post=${result.id}&source=composer`);
  };

  return (
    <div className="cmp flex flex-col gap-5">
      {isEditMode ? (
        <Breadcrumbs
          items={[
            { label: 'Approval Queue', href: '/approval-workflow' },
            { label: `Edit Draft: ${activePost?.title || 'Review Item'}` },
          ]}
        />
      ) : (
        <Breadcrumbs items={[{ label: 'Content Operations', href: '/dashboard' }, { label: 'Post Composer' }]} />
      )}

      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between m-rise" style={{ '--m-i': 0 }}>
        <div>
          <h1 className="cmp-page-title">{isEditMode ? 'Edit draft' : 'Post composer'}</h1>
          <p className="cmp-page-sub">
            {isEditMode
              ? 'Make changes, then send the new version back for approval.'
              : 'Write, preview and send your post to the owner for approval.'}
          </p>
        </div>

        <ComposerToolbar
          onSaveDraft={handleSaveDraft}
          onSubmitReview={handleSubmitForReview}
          onSchedule={() => setShowScheduleDrawer(true)}
          onOpenHistory={() => setShowHistoryModal(true)}
          hasContent={content.trim().length > 0}
          isEditMode={isEditMode}
          returnUrl="/approval-workflow"
          scheduledDate={scheduledDate}
          scheduledTime={scheduledTime}
          saveState={saveState}
          submitState={submitState}
        />
      </header>

      {isEditMode && activePost ? (
        <>
          <div className="cmp-card flex items-start gap-3 px-5 py-4 m-rise" style={{ '--m-i': 1 }}>
            <span className="cmp-badge tone-blue" aria-hidden="true">
              <GitCommit size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold cmp-ink">Editing “{activePost.title}”</p>
              <p className="text-[13px] cmp-muted mt-0.5">
                Saving creates version {(activePost.revisions || 0) + 1}. Earlier versions stay in History.
              </p>
            </div>
          </div>
          <PipelineStageStepper status={activePost.status} post={{ ...activePost, scheduledDate, scheduledTime }} />
        </>
      ) : (
        <div className="m-rise" style={{ '--m-i': 1 }}>
          <WorkflowMini activeIndex={submitState === 'sent' ? 2 : 1} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 min-w-0">
          <ComposerEditor
            content={content}
            onChange={setContent}
            cta={cta}
            onCtaChange={setCta}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            pillarId={pillarId}
            onPillarChange={handlePillarChange}
            target={target}
            onTargetChange={setTarget}
            device={device}
            onDeviceChange={setDevice}
            foldIndex={contentFoldIndex}
            visualFormat={visualFormat}
            onVisualFormatChange={setVisualFormat}
            carouselSlides={carouselSlides}
            onChangeCarouselSlides={setCarouselSlides}
            infographicData={infographicData}
            onChangeInfographicData={setInfographicData}
            candidateImages={candidateImages}
            imageUrl={imageUrl}
            imageGeneration={imageGeneration}
            revealMode={revealMode}
            onSelectImage={handleSelectImage}
            onRemoveImage={handleRemoveImage}
            onUploadImage={handleUploadImage}
            onGenerateImages={handleGenerateImages}
            onCancelImages={handleCancelImages}
            isGenerating={isGenerating}
            onAIGenerate={handleAIGenerate}
            showAIPanel={showAIPanel}
            onToggleAIPanel={() => setShowAIPanel((s) => !s)}
          />
        </div>

        <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-20">
          <ComposerPreview
            composedText={composedText}
            foldIndex={foldIndex}
            visualFormat={visualFormat}
            carouselSlides={carouselSlides}
            infographicData={infographicData}
            imageUrl={imageUrl}
            imageGeneration={imageGeneration}
            revealMode={revealMode}
            isGenerating={isGenerating}
            device={device}
            onDeviceChange={setDevice}
            target={target}
            quality={quality}
            hasBody={Boolean(content.trim() || cta.trim())}
          />

        </div>
      </div>

      {showScheduleDrawer && (
        <ScheduleControl
          isDrawer
          date={scheduledDate}
          time={scheduledTime}
          onChange={({ date, time }) => {
            setScheduledDate(date);
            setScheduledTime(time);
            const slot = formatSlot(date, time);
            toast.success(`Slot moved to ${slot.day}, ${slot.time}`);
          }}
          onClose={() => setShowScheduleDrawer(false)}
        />
      )}

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
