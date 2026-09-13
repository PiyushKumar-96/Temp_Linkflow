'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GitCommit } from 'lucide-react';
import { toast } from 'sonner';
import ComposerEditor from './ComposerEditor';
import ComposerPreview from './ComposerPreview';
import ComposerToolbar from './ComposerToolbar';
import ComposerHeader from './ComposerHeader';
import { WorkflowMini } from './ComposerUI';
import ScheduleControl from '@/components/ScheduleControl';
import PipelineStageStepper from '@/components/PipelineStageStepper';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';
import SavedDraftsDialog from './SavedDraftsDialog';
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

const asGenerated = (images) =>
  images.map((img, i) => ({ ...img, source: 'ai', slotKey: `gen-${i}` }));

const GENERATED_POST = `The biggest mistake most B2B companies make on LinkedIn?\n\nThey treat it like a broadcast channel — pushing announcements instead of starting conversations.\n\nHere's what actually works:\n\n→ Share the messy middle, not just the polished outcome\n→ Ask genuine questions your audience cares about\n→ Respond to every comment in the first hour\n→ Write for one person, not your entire ICP\n\nLinkedIn rewards consistency and authenticity — not perfection.\n\nWe grew our company page from 800 to 22,000 followers by following these principles. No paid promotion.`;
const GENERATED_CTA =
  "What's the one thing that changed your LinkedIn results? Drop your thoughts below 👇";

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
  const [hashtags, setHashtags] = useState([]);
  const [pillarId, setPillarId] = useState('thought-leadership');
  const [target, setTarget] = useState('personal');
  const [device, setDevice] = useState('desktop');

  const [visualFormat, setVisualFormat] = useState('none');
  const [imageUrl, setImageUrl] = useState('');
  const [candidateImages, setCandidateImages] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState(null);
  const [infographicData, setInfographicData] = useState(null);

  const [imageGeneration, setImageGeneration] = useState(null); // { startedAt, count } while generating
  const [carouselGeneration, setCarouselGeneration] = useState(null); // { startedAt, count } while generating
  const [infographicGeneration, setInfographicGeneration] = useState(null); // { startedAt } while generating

  const [revealMode, setRevealMode] = useState('develop');
  const [isGenerating, setIsGenerating] = useState(false);

  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saved'
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'sending' | 'sent'

  const generationRun = useRef(0);
  const [draftId, setDraftId] = useState(null); // repeat saves in create mode update one post instead of creating copies

  const dateParam = searchParams.get('date');
  const [scheduledDate, setScheduledDate] = useState(
    () => dateParam || getNextAvailableSlot().date
  );
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
      if (targetPost.scheduledDate || targetPost.dueDate)
        setScheduledDate(targetPost.scheduledDate || targetPost.dueDate);
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
        setCandidateImages(
          existing && !isKnown
            ? [
                { id: 'existing-image', url: existing, alt: 'Current image', source: 'upload' },
                ...generated,
              ]
            : generated
        );
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

  const handleSelectDraft = (draft) => {
    if (!draft) return;
    setDraftId(draft.id);
    setContent(draft.content || '');
    setCta(draft.cta || '');
    setHashtags(draft.hashtags || []);
    if (draft.pillarId || draft.category) {
      const pid = draft.pillarId || pillarIdFromPost(draft);
      setPillarId(pid);
    }
    if (draft.target) setTarget(draft.target);
    if (draft.visualFormat) setVisualFormat(draft.visualFormat);
    if (draft.imageUrl) setImageUrl(draft.imageUrl);
    if (draft.carouselSlides) setCarouselSlides(draft.carouselSlides);
    if (draft.infographicData) setInfographicData(draft.infographicData);
    if (draft.scheduledDate || draft.dueDate)
      setScheduledDate(draft.scheduledDate || draft.dueDate);
    if (draft.scheduledTime) setScheduledTime(draft.scheduledTime);
    toast.success(`Loaded draft: ${draft.title || 'Untitled Draft'}`);
  };

  // ---------- Derived: fold + quality ----------

  const composedText = useMemo(
    () => composePostText(content, cta, hashtags),
    [content, cta, hashtags]
  );
  const foldIndex = useMemo(() => getFoldIndex(composedText, device), [composedText, device]);
  const contentFoldIndex =
    content.trim() && foldIndex != null && foldIndex < content.length ? foldIndex : null;

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

  const handleGenerateCarousel = async () => {
    const run = ++generationRun.current;
    setVisualFormat('carousel');
    setCarouselGeneration({ startedAt: Date.now(), count: 4 });

    await wait(5200);
    if (run !== generationRun.current) return;

    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    const firstLine =
      lines[0]?.replace(/^[#*\-•\s]+/, '').slice(0, 60) || 'The Strategic Growth Playbook';
    const points = lines
      .slice(1, 5)
      .map((l) => l.replace(/^[#*\-•\s[color:var(--warning-text)].]+/, '').trim())
      .filter(Boolean);

    const newSlides = [
      {
        id: `slide-1`,
        headline: firstLine,
        body: 'A breakdown of key strategic takeaways and execution principles for high-performing teams.',
        tag: 'SLIDE 01 / 04',
        accentColor: '#0a66c2',
      },
      {
        id: `slide-2`,
        headline: points[0] || '1. Focus on Pipeline Velocity',
        body:
          points[1] ||
          'Content that drives high-intent discussions consistently outperforms vanity metrics.',
        tag: 'SLIDE 02 / 04',
        accentColor: '#6366f1',
      },
      {
        id: `slide-3`,
        headline: points[2] || '2. High-Leverage Distribution',
        body:
          points[3] || 'Turn each high-performing insight into structured multi-channel assets.',
        tag: 'SLIDE 03 / 04',
        accentColor: '#8b5cf6',
      },
      {
        id: `slide-4`,
        headline: 'Next Steps & Execution',
        body: 'Document what converts, double down on validated distribution, and iterate weekly.',
        tag: 'SLIDE 04 / 04',
        accentColor: '#10b981',
      },
    ];

    setCarouselSlides(newSlides);
    setCarouselGeneration(null);
    toast.success('4-slide carousel generated with AI!');
  };

  const handleCancelCarousel = () => {
    generationRun.current += 1;
    setCarouselGeneration(null);
    toast('Carousel generation cancelled');
  };

  const handleGenerateInfographic = async () => {
    const run = ++generationRun.current;
    setVisualFormat('infographic');
    setInfographicGeneration({ startedAt: Date.now() });

    await wait(5200);
    if (run !== generationRun.current) return;

    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    const title =
      lines[0]?.replace(/^[#*\-•\s]+/, '').slice(0, 50) || 'B2B Growth Engine Framework';
    const points = lines
      .slice(1, 4)
      .map((l) => l.replace(/^[#*\-•\s[color:var(--warning-text)].]+/, '').trim())
      .filter(Boolean);

    const generatedData = {
      title,
      metricNumber: '+280%',
      metricLabel: 'Pipeline Growth Rate',
      pillars: [
        {
          step: '01',
          title: points[0] ? points[0].slice(0, 30) : 'Audience Validation',
          desc: points[1]
            ? points[1].slice(0, 60)
            : 'Direct feedback loops and customer conversation mapping',
        },
        {
          step: '02',
          title: points[2] ? points[2].slice(0, 30) : 'High-Intent Distribution',
          desc: 'Targeted reach across relevant decision-maker communities',
        },
        {
          step: '03',
          title: 'Revenue Attribution',
          desc: 'Direct correlation between thought leadership and qualified pipeline',
        },
      ],
      footerNote: 'Source: LinkedFlow Insights Studio',
    };

    setInfographicData(generatedData);
    setInfographicGeneration(null);
    toast.success('Infographic framework generated with AI!');
  };

  const handleCancelInfographic = () => {
    generationRun.current += 1;
    setInfographicGeneration(null);
    toast('Infographic generation cancelled');
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

  const handleUploadAttachment = (file) => {
    if (!file) return;

    const MAX_BYTES = 15 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      toast.error('File size exceeds 15 MB limit. Please select a smaller file.');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const isStandardImage =
      ['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
      /\.(png|jpe?g|webp)$/i.test(file.name);

    if (isPdf) {
      const pdfName = file.name;
      const baseName = pdfName.replace(/\.pdf$/i, '');
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);

      const slidesFromPdf = [
        {
          id: `pdf-slide-1`,
          headline: baseName,
          body: `Cover slide from uploaded document: ${pdfName} (${sizeMb} MB)`,
          tag: 'PAGE 01 / 04',
          accentColor: '#0a66c2',
        },
        {
          id: `pdf-slide-2`,
          headline: 'Executive Summary & Strategy',
          body: 'Detailed breakdown of core metrics and strategic focus areas.',
          tag: 'PAGE 02 / 04',
          accentColor: '#6366f1',
        },
        {
          id: `pdf-slide-3`,
          headline: 'Key Takeaways & Framework',
          body: 'Structured methodologies and actionable insights for execution.',
          tag: 'PAGE 03 / 04',
          accentColor: '#8b5cf6',
        },
        {
          id: `pdf-slide-4`,
          headline: 'Next Steps & Recommendations',
          body: 'High-impact conclusions and follow-up initiatives.',
          tag: 'PAGE 04 / 04',
          accentColor: '#10b981',
        },
      ];

      setVisualFormat('carousel');
      setUploadedPdfInfo({
        name: pdfName,
        size: sizeMb,
        pageCount: 4,
      });
      setCarouselSlides(slidesFromPdf);
      setImageUrl('');
      setRevealMode('quick');
      toast.success(`PDF uploaded: ${pdfName} (will publish as a LinkedIn carousel)`);
      return;
    }

    if (isGif) {
      const url = URL.createObjectURL(file);
      setVisualFormat('image');
      setUploadedPdfInfo(null);
      setImageUrl(url);
      setCandidateImages((prev) => [
        { id: `gif-${Date.now()}`, url, alt: file.name, source: 'upload', isGif: true },
        ...prev,
      ]);
      setRevealMode('quick');
      toast.success(`GIF uploaded: ${file.name}`);
      return;
    }

    if (isStandardImage) {
      const url = URL.createObjectURL(file);
      setVisualFormat('image');
      setUploadedPdfInfo(null);
      setCandidateImages((prev) => [
        { id: `upload-${Date.now()}`, url, alt: file.name, source: 'upload' },
        ...prev,
      ]);
      setImageUrl(url);
      setRevealMode('quick');
      toast.success(`Image uploaded: ${file.name}`);
      return;
    }

    toast.error('Unsupported format. Please upload an Image (PNG/JPG), PDF, or GIF.');
  };

  const handleRemoveAttachment = () => {
    setVisualFormat('none');
    setImageUrl('');
    setUploadedPdfInfo(null);
    setCarouselSlides([]);
    setCandidateImages([]);
    setInfographicData(null);
    toast.info('Visual attachment removed');
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
          summary: isSubmit
            ? `Sent revision v${nextVersion} for review`
            : `Edited draft in composer (v${nextVersion})`,
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
        saveStoredPosts(
          getStoredPosts().map((p) => (p.id === editPostId && updated ? { ...p, ...updated } : p))
        );

        setActivePost((prev) => (prev ? { ...prev, revisions: nextVersion } : prev));
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });
        return { id: editPostId, version: nextVersion };
      } catch {
        toast.error("Couldn't save the revision. Check your connection and try again.");
        return null;
      }
    }

    const postId = draftId || `comp-${Date.now()}`;
    if (!draftId) setDraftId(postId);
    const firstLine = content
      .trim()
      .split('\n')[0]
      .replace(/^[#*\-•\s]+/, '')
      .slice(0, 60);
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
          summary: isSubmit
            ? 'Created and sent for review from Post Composer'
            : 'Draft saved in Post Composer',
        },
      ],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          actor: 'Sarah Reeves',
          action: isSubmit
            ? `Sent for review (Slot: ${scheduledDate} ${scheduledTime})`
            : 'Draft saved in Post Composer',
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
      localStorage.setItem(
        APPROVAL_KEY,
        JSON.stringify([newPost, ...approvalPosts.filter((p) => p.id !== postId)])
      );
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
    toast.success(
      isEditMode ? `Version ${result.version} saved` : `Draft saved for ${slot.day}, ${slot.time}`
    );
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
    toast.success(
      isEditMode ? `Revision v${result.version} sent to the owner` : 'Sent to the owner for review'
    );
    await wait(prefersReducedMotion() ? 300 : 1300);
    navigate(`/approval-workflow?post=${result.id}&source=composer`);
  };

  return (
    <div className="cmp flex flex-col gap-4">
      {/* Editorial Hero Header matching Dashboard Theme & Reference Image 2 */}
      <ComposerHeader isEditMode={isEditMode} activePost={activePost} />

      {/* Top Action Bar */}
      <div className="flex items-center justify-end gap-3 px-3 py-2 bg-card/70 backdrop-blur-sm border border-border/70 rounded-xl shadow-sm flex-wrap">
        <ComposerToolbar
          onSaveDraft={handleSaveDraft}
          onViewDrafts={() => setShowDraftsModal(true)}
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
      </div>

      {isEditMode && activePost ? (
        <>
          <div className="cmp-card flex items-start gap-3 px-5 py-4">
            <span className="cmp-badge tone-blue" aria-hidden="true">
              <GitCommit size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold cmp-ink">Editing “{activePost.title}”</p>
              <p className="text-[13px] cmp-muted mt-0.5">
                Saving creates version {(activePost.revisions || 0) + 1}. Earlier versions stay in
                History.
              </p>
            </div>
          </div>
          <PipelineStageStepper
            status={activePost.status}
            post={{ ...activePost, scheduledDate, scheduledTime }}
          />
        </>
      ) : (
        <div>
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
            carouselGeneration={carouselGeneration}
            onGenerateCarousel={handleGenerateCarousel}
            onCancelCarousel={handleCancelCarousel}
            infographicData={infographicData}
            onChangeInfographicData={setInfographicData}
            infographicGeneration={infographicGeneration}
            onGenerateInfographic={handleGenerateInfographic}
            onCancelInfographic={handleCancelInfographic}
            candidateImages={candidateImages}
            imageUrl={imageUrl}
            imageGeneration={imageGeneration}
            revealMode={revealMode}
            onSelectImage={handleSelectImage}
            onRemoveImage={handleRemoveImage}
            onUploadImage={handleUploadAttachment}
            onUploadAttachment={handleUploadAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            onGenerateImages={handleGenerateImages}
            onCancelImages={handleCancelImages}
            uploadedPdfInfo={uploadedPdfInfo}
            isGenerating={isGenerating}
            onViewDrafts={() => setShowDraftsModal(true)}
          />
        </div>

        <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-20">
          <ComposerPreview
            composedText={composedText}
            foldIndex={foldIndex}
            visualFormat={visualFormat}
            carouselSlides={carouselSlides}
            carouselGeneration={carouselGeneration}
            infographicData={infographicData}
            infographicGeneration={infographicGeneration}
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

      <SavedDraftsDialog
        isOpen={showDraftsModal}
        onClose={() => setShowDraftsModal(false)}
        onSelectDraft={handleSelectDraft}
        activeDraftId={draftId}
      />
    </div>
  );
}
