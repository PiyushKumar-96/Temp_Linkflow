'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AlignLeft,
  Ban,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  Eraser,
  Flame,
  GraduationCap,
  Hash,
  Image as ImageIcon,
  Laugh,
  Layers,
  LayoutGrid,
  Link2,
  List,
  ListOrdered,
  MessageCircle,
  MessageSquarePlus,
  MessageSquareQuote,
  Monitor,
  PenLine,
  Plus,
  Redo2,
  RefreshCw,
  Rocket,
  Scissors,
  SlidersHorizontal,
  Smartphone,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Undo2,
  User,
  X,
} from 'lucide-react';
import APP_CONFIG from '@/lib/config';
import { CardHeader, ProgressRing, Segmented } from './ComposerUI';
import ImageOptions from './ImageOptions';
import CarouselOptions from './CarouselOptions';
import InfographicOptions from './InfographicOptions';
import { CarouselVisual, InfographicVisual, TextOnlyVisual } from '@/components/visuals';
import { PILLARS, TARGETS, getPillar, prefersReducedMotion } from '../_model/composer-utils';



const MAX_CHARS = APP_CONFIG.maxPostCharacters || 3000;
const LINE_HEIGHT = 24; // keep in sync with .cmp-editor-text in composer.css
const MIN_EDITOR_HEIGHT = 240;

const TONES = [
  { value: 'professional', label: 'Professional', icon: Briefcase },
  { value: 'conversational', label: 'Conversational', icon: MessageCircle },
  { value: 'inspirational', label: 'Inspirational', icon: Rocket },
  { value: 'educational', label: 'Educational', icon: GraduationCap },
  { value: 'humorous', label: 'Humorous', icon: Laugh },
];

const VISUAL_FORMATS = [
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'carousel', label: 'Carousel', icon: Layers },
  { value: 'infographic', label: 'Infographic', icon: LayoutGrid },
  { value: 'none', label: 'Text only', icon: Ban },
];

const VISUAL_QUALIFIER = {
  image: 'One image under your post',
  carousel: 'Swipeable slides',
  infographic: 'One data-led graphic',
  none: 'Text-only posts do well when the hook is strong',
};

const TARGET_OPTIONS = TARGETS.map((t) => ({
  value: t.id,
  label: t.label,
  icon: t.id === 'company' ? Building2 : User,
}));

const DEVICE_OPTIONS = [
  { value: 'desktop', label: 'Desktop feed', icon: Monitor, iconOnly: true },
  { value: 'mobile', label: 'Mobile feed', icon: Smartphone, iconOnly: true },
];

const LINKEDIN_EMOJIS = [
  '🚀', '💡', '🔥', '📈', '🎯', '⚡', '🤖', '💻',
  '👉', '👇', '👏', '🤝', '🙌', '👍', '💬', '✍️',
  '🤩', '😄', '🤔', '🧠', '🏆', '✨', '🌟', '📌',
];

const HASHTAG_SUGGESTIONS = [
  '#LinkedInTips',
  '#ContentMarketing',
  '#B2BSaaS',
  '#GrowthMarketing',
  '#SocialMediaStrategy',
  '#ThoughtLeadership',
  '#StartupLife',
  '#MarketingStrategy',
  '#LinkedInMarketing',
  '#DigitalMarketing',
  '#BrandBuilding',
  '#ContentCreation',
];

const TONE_REWRITES = [
  {
    tone: 'professional',
    preview: "We're pleased to share key insights from our recent growth strategy and quarterly performance benchmarks...",
  },
  {
    tone: 'conversational',
    preview: "Can I be honest with you? Most LinkedIn advice is completely backwards. Here's what actually worked for our team...",
  },
  {
    tone: 'inspirational',
    preview: 'Three years ago we started with zero traction and a blank screen. Today we empower thousands of creators. Never quit on your day one.',
  },
  {
    tone: 'educational',
    preview: 'Here are the 5 core framework metrics that actually predict B2B audience expansion (and how to execute them step-by-step)...',
  },
];

const IMPROVE_OPTIONS = [
  { label: 'Add a stronger hook', icon: Target },
  { label: 'Make it more concise', icon: Scissors },
  { label: 'Include a call to action', icon: MessageSquarePlus },
  { label: 'Improve readability', icon: BookOpen },
  { label: 'Add more data points', icon: TrendingUp },
  { label: 'Make it more engaging', icon: Flame },
];

const AI_TABS = [
  { value: 'draft', label: 'Draft' },
  { value: 'improve', label: 'Improve' },
  { value: 'tone', label: 'Change tone' },
];

// ---------- Unicode formatting helpers (render as styled text on LinkedIn) ----------

function toUnicodeBold(text) {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d5d4 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d5ee + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ec + (code - 48));
      return char;
    })
    .join('');
}

function toUnicodeItalic(text) {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d608 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d622 + (code - 97));
      return char;
    })
    .join('');
}

function toUnicodeUnderline(text) {
  return text
    .split('')
    .map((c) => c + '\u0332')
    .join('');
}

function toUnicodeStrikethrough(text) {
  return text
    .split('')
    .map((c) => c + '\u0336')
    .join('');
}

function clearUnicodeFormatting(text) {
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function improveText(content, instruction) {
  if (instruction.includes('hook')) {
    const hooks = [
      'Most people get this completely backward in our industry:\n\n',
      'Here is the single biggest lesson I learned the hard way:\n\n',
      'Stop overcomplicating this. Here is the framework that actually works:\n\n',
    ];
    return hooks[Math.floor(Math.random() * hooks.length)] + content;
  }
  if (instruction.includes('concise')) {
    return content
      .split('\n')
      .filter(Boolean)
      .map((l) => l.trim())
      .join('\n\n');
  }
  if (instruction.includes('call to action')) {
    return `${content}\n\nWhat's your take on this? Let me know your thoughts in the comments below 👇`;
  }
  if (instruction.includes('readability')) {
    return content.split('. ').join('.\n\n');
  }
  if (instruction.includes('data points')) {
    return `${content}\n\n📊 Benchmark insight: Teams adopting this workflow see a 3.4x lift in post impressions within 30 days.`;
  }
  return `${content}\n\n✨ Pro-tip: Consistency outperforms sporadic perfection every time.`;
}

function normalizeTag(raw) {
  const cleaned = raw.trim().replace(/^#+/, '').replace(/[^\p{L}\p{N}_]/gu, '');
  return cleaned ? `#${cleaned}` : '';
}

// ---------- Sub-components ----------

function useDismiss(open, onClose, ref) {
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, ref]);
}

function PillarPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = getPillar(value);
  useDismiss(open, () => setOpen(false), ref);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="cmp-select"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="min-w-0">
          <span className="cmp-select-value truncate">{current.label}</span>
          <span className="cmp-select-meta">
            {current.planned} of {current.goal} planned this month
          </span>
        </span>
        <ChevronDown size={16} className={`cmp-chevron ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <div className="cmp-popover" role="listbox" aria-label="Content pillar">
          {PILLARS.map((pillar, i) => (
            <button
              key={pillar.id}
              type="button"
              role="option"
              aria-selected={pillar.id === value}
              className="cmp-option"
              onClick={() => {
                onChange(pillar.id);
                setOpen(false);
              }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="text-[14px] font-medium cmp-ink">{pillar.label}</span>{' '}
                  <span className="cmp-qualifier">
                    {pillar.target === 'company' ? 'Company page' : 'Personal profile'}
                  </span>
                </span>
                <span className="text-[13px] tabular-nums cmp-ink">
                  {pillar.planned} / {pillar.goal}
                </span>
              </span>
              <span className="cmp-bar" aria-hidden="true">
                <span
                  className={`cmp-bar-fill tone-${pillar.tone}`}
                  style={{ '--v': Math.min(pillar.planned / pillar.goal, 1), '--m-i': i }}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HashtagsCard({ hashtags, onChange }) {
  const [draft, setDraft] = useState('');
  const [leaving, setLeaving] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const count = hashtags.length;
  const countTone = count >= 3 && count <= 5 ? 'green' : 'amber';
  const suggestions = HASHTAG_SUGGESTIONS.filter((t) => !hashtags.includes(t)).slice(0, 8);

  const add = (raw) => {
    const tag = normalizeTag(raw);
    if (!tag) return;
    if (hashtags.some((h) => h.toLowerCase() === tag.toLowerCase())) {
      toast.info(`${tag} is already added`);
      return;
    }
    onChange([...hashtags, tag]);
  };

  const remove = (tag) => {
    if (prefersReducedMotion()) {
      onChange(hashtags.filter((h) => h !== tag));
      return;
    }
    setLeaving((l) => [...l, tag]);
    setTimeout(() => {
      setLeaving((l) => l.filter((t) => t !== tag));
      onChange((current) => (Array.isArray(current) ? current : hashtags).filter((h) => h !== tag));
    }, 150);
  };

  return (
    <section className="cmp-card m-rise" style={{ '--m-i': 5 }} aria-labelledby="cmp-tags-title">
      <CardHeader icon={Hash} tone="green" title="Hashtags" qualifier="3–5 works best" id="cmp-tags-title">
        <span className={`cmp-pill tone-${countTone}`}>
          <span className="cmp-dot" />
          {count} of 5
        </span>
      </CardHeader>

      <div className="cmp-card-body flex flex-col gap-4">
        <div className="cmp-tagbox">
          {hashtags.map((tag) => (
            <span key={tag} className={`cmp-tag ${leaving.includes(tag) ? 'is-leaving' : ''}`}>
              {tag}
              <button type="button" className="cmp-tag-x" aria-label={`Remove ${tag}`} onClick={() => remove(tag)}>
                <X size={13} />
              </button>
            </span>
          ))}
          <input
            className="cmp-tag-input"
            value={draft}
            placeholder={count ? 'Add another' : 'Add a hashtag and press Enter'}
            aria-label="Add a hashtag"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
                if (draft.trim()) {
                  e.preventDefault();
                  add(draft);
                  setDraft('');
                }
              } else if (e.key === 'Backspace' && !draft && hashtags.length) {
                remove(hashtags[hashtags.length - 1]);
              }
            }}
            onBlur={() => {
              if (draft.trim()) {
                add(draft);
                setDraft('');
              }
            }}
          />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center gap-1 pt-1 shrink-0">
            <span className="text-[13px] cmp-muted">Suggested</span>
            <button
              type="button"
              className="cmp-icon-btn"
              aria-label="Refresh suggestions"
              disabled={isRefreshing}
              onClick={async () => {
                // BACKEND: POST /api/ai/hashtag-suggestions with { content, tone }
                setIsRefreshing(true);
                await new Promise((r) => setTimeout(r, 600));
                setIsRefreshing(false);
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'cmp-spin' : ''} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2" aria-live="polite">
            {suggestions.map((tag) => (
              <button key={tag} type="button" className="cmp-suggest" onClick={() => add(tag)}>
                <Plus size={13} />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Main ----------

export default function ComposerEditor({
  content = '',
  onChange,
  cta = '',
  onCtaChange,
  selectedTone = 'professional',
  onToneChange,
  hashtags = [],
  onHashtagsChange,
  pillarId,
  onPillarChange,
  target = 'personal',
  onTargetChange,
  device = 'desktop',
  onDeviceChange,
  foldIndex = null,
  visualFormat = 'image',
  onVisualFormatChange,
  carouselSlides,
  onChangeCarouselSlides,
  carouselGeneration,
  onGenerateCarousel,
  onCancelCarousel,
  infographicData,
  onChangeInfographicData,
  infographicGeneration,
  onGenerateInfographic,
  onCancelInfographic,
  candidateImages = [],
  imageUrl,
  imageGeneration,
  revealMode,
  onSelectImage,
  onRemoveImage,
  onUploadImage,
  onGenerateImages,
  onCancelImages,
  isGenerating = false,
  onAIGenerate,
  showAIPanel = false,
  onToggleAIPanel,
}) {
  const safeContent = content || '';
  const safeHashtags = Array.isArray(hashtags) ? hashtags : [];
  const remaining = MAX_CHARS - safeContent.length;
  const isNearLimit = remaining < 300;
  const isAtLimit = remaining <= 0;
  const pillar = getPillar(pillarId);

  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const anchorRef = useRef(null);
  const fileRef = useRef(null);
  const emojiRef = useRef(null);

  const [history, setHistory] = useState([safeContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [aiTab, setAiTab] = useState('draft');
  const [includeImages, setIncludeImages] = useState(true);
  const [rewriting, setRewriting] = useState(false);
  const [justRewritten, setJustRewritten] = useState(false);
  const [foldY, setFoldY] = useState(null);

  useDismiss(showEmojiPicker, () => setShowEmojiPicker(false), emojiRef);

  // Keep undo history in step with changes made outside the textarea
  // (AI drafts, loading a post, the Undo action in a toast).
  useEffect(() => {
    if (safeContent === history[historyIndex]) return;
    const next = [...history.slice(0, historyIndex + 1), safeContent].slice(-50);
    setHistory(next);
    setHistoryIndex(next.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeContent]);

  // Auto-grow the textarea and position the fold marker.
  useLayoutEffect(() => {
    const sync = () => {
      const ta = textareaRef.current;
      if (ta) {
        ta.style.height = 'auto';
        ta.style.height = `${Math.max(MIN_EDITOR_HEIGHT, ta.scrollHeight)}px`;
      }
      const anchor = anchorRef.current;
      if (!anchor) {
        setFoldY(null);
        return;
      }
      const h = anchor.offsetHeight;
      setFoldY(anchor.offsetTop + h + (LINE_HEIGHT - h) / 2);
    };
    sync();
    if (typeof ResizeObserver === 'undefined' || !editorRef.current) return undefined;
    const observer = new ResizeObserver(sync);
    observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, [safeContent, foldIndex]);

  const pushHistory = (newText) => {
    const next = [...history.slice(0, historyIndex + 1), newText].slice(-50);
    setHistory(next);
    setHistoryIndex(next.length - 1);
    if (onChange) onChange(newText);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      if (onChange) onChange(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      if (onChange) onChange(history[historyIndex + 1]);
    }
  };

  const withSelection = (fn) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    fn(textarea, textarea.selectionStart, textarea.selectionEnd);
  };

  const applyTextTransform = (transformFn, placeholder = '') =>
    withSelection((textarea, start, end) => {
      const selected = safeContent.substring(start, end);
      const replacement = transformFn(selected.length > 0 ? selected : placeholder);
      pushHistory(safeContent.substring(0, start) + replacement + safeContent.substring(end));
      setTimeout(() => {
        textarea.focus();
        const cursor = start + replacement.length;
        textarea.setSelectionRange(cursor, cursor);
      }, 0);
    });

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      pushHistory(safeContent + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    pushHistory(safeContent.substring(0, start) + text + safeContent.substring(end));
    setTimeout(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const handleClearFormatting = () =>
    withSelection((_, start, end) => {
      const selected = safeContent.substring(start, end);
      if (selected.length > 0) {
        pushHistory(safeContent.substring(0, start) + clearUnicodeFormatting(selected) + safeContent.substring(end));
        toast.success('Formatting cleared from the selection');
      } else {
        pushHistory(clearUnicodeFormatting(safeContent));
        toast.success('Formatting cleared from the whole post');
      }
    });

  const formatBulletList = () =>
    withSelection((_, start, end) => {
      const selected = safeContent.substring(start, end);
      if (selected.length > 0) {
        const replacement = selected
          .split('\n')
          .map((line) => (line.startsWith('• ') ? line : `• ${line}`))
          .join('\n');
        pushHistory(safeContent.substring(0, start) + replacement + safeContent.substring(end));
      } else {
        insertAtCursor('\n• Key point 1\n• Key point 2\n• Key point 3\n');
      }
    });

  const formatNumberedList = () =>
    withSelection((_, start, end) => {
      const selected = safeContent.substring(start, end);
      if (selected.length > 0) {
        const replacement = selected
          .split('\n')
          .map((line, i) => `${i + 1}. ${line.replace(/^\d+\.\s*/, '')}`)
          .join('\n');
        pushHistory(safeContent.substring(0, start) + replacement + safeContent.substring(end));
      } else {
        insertAtCursor('\n1. First step\n2. Second step\n3. Third step\n');
      }
    });

  const formatSpacing = () => {
    if (!safeContent.trim()) return;
    const paragraphs = safeContent
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    pushHistory(paragraphs.join('\n\n'));
    toast.success('Added a blank line between paragraphs');
  };

  // AI rewrite: shimmer while working, flash the field when done, offer undo.
  const runRewrite = (successLabel, produce) => {
    if (rewriting) return;
    const before = safeContent;
    setRewriting(true);
    // BACKEND: POST /api/ai/improve-post with { content, instruction }
    setTimeout(
      () => {
        pushHistory(produce(before));
        setRewriting(false);
        setJustRewritten(true);
        setTimeout(() => setJustRewritten(false), 1000);
        toast.success(successLabel, {
          action: { label: 'Undo', onClick: () => onChange && onChange(before) },
        });
      },
      prefersReducedMotion() ? 0 : 750
    );
  };

  const handleImprove = (instruction) => {
    if (!safeContent.trim()) {
      toast.error('Write something first, then choose an improvement.');
      return;
    }
    runRewrite(`Applied: ${instruction.toLowerCase()}`, (text) => improveText(text, instruction));
  };

  const handleToneRewrite = (tone, preview) => {
    if (onToneChange) onToneChange(tone);
    runRewrite(`Rewritten in a ${tone} tone`, () => `${preview}\n\n[Continue your insights here...]`);
  };

  const showFold = foldY != null && foldIndex != null && !isGenerating;
  const busy = isGenerating || rewriting;

  return (
    <div className="flex flex-col gap-5">
      {/* ---------- Setup ---------- */}
      <section className="cmp-card m-rise" style={{ '--m-i': 2 }} aria-labelledby="cmp-setup-title">
        <CardHeader icon={SlidersHorizontal} tone="blue" title="Post setup" id="cmp-setup-title" />
        <div className="cmp-card-body grid gap-5 sm:grid-cols-2">
          <div>
            <span className="cmp-label">Publish to</span>
            <Segmented
              label="Publish to"
              options={TARGET_OPTIONS}
              value={target}
              onChange={(v) => onTargetChange && onTargetChange(v)}
              size="lg"
            />
          </div>
          <div>
            <span className="cmp-label">Content pillar</span>
            <PillarPicker value={pillar.id} onChange={(id) => onPillarChange && onPillarChange(id)} />
          </div>
          <div className="sm:col-span-2">
            <span className="cmp-label" id="cmp-tone-label">
              Tone
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cmp-tone-label">
              {TONES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  className="cmp-chip"
                  aria-pressed={selectedTone === value}
                  onClick={() => onToneChange && onToneChange(value)}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Write ---------- */}
      <section className="cmp-card m-rise" style={{ '--m-i': 3 }} aria-labelledby="cmp-write-title">
        <CardHeader icon={PenLine} tone="blue" title="Write" id="cmp-write-title">
          <button
            type="button"
            className="cmp-btn cmp-btn-soft tone-violet is-sm"
            aria-expanded={showAIPanel}
            aria-controls="cmp-ai-panel"
            onClick={onToggleAIPanel}
          >
            <Sparkles size={15} />
            Write with AI
          </button>
        </CardHeader>

        <div className="cmp-toolbar" role="toolbar" aria-label="Formatting">
          <button type="button" className="cmp-tool font-bold" onClick={() => applyTextTransform(toUnicodeBold, 'Bold text')} title="Bold" aria-label="Bold">
            B
          </button>
          <button type="button" className="cmp-tool italic font-serif" onClick={() => applyTextTransform(toUnicodeItalic, 'Italic text')} title="Italic" aria-label="Italic">
            I
          </button>
          <button type="button" className="cmp-tool underline" onClick={() => applyTextTransform(toUnicodeUnderline, 'Underlined')} title="Underline" aria-label="Underline">
            U
          </button>
          <button type="button" className="cmp-tool line-through" onClick={() => applyTextTransform(toUnicodeStrikethrough, 'Strikethrough')} title="Strikethrough" aria-label="Strikethrough">
            S
          </button>

          <span className="cmp-tool-sep" aria-hidden="true" />

          <div ref={emojiRef} className="relative">
            <button
              type="button"
              className="cmp-tool"
              aria-expanded={showEmojiPicker}
              aria-label="Insert emoji"
              title="Insert emoji"
              onClick={() => setShowEmojiPicker((s) => !s)}
            >
              <Smile size={16} />
            </button>
            {showEmojiPicker && (
              <div className="cmp-emoji-pop">
                {LINKEDIN_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="cmp-tool text-base"
                    onClick={() => {
                      insertAtCursor(emoji);
                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="cmp-tool"
            title="Attach image"
            aria-label="Attach image"
            onClick={() => {
              if (onVisualFormatChange) onVisualFormatChange('image');
              fileRef.current?.click();
            }}
          >
            <ImageIcon size={16} />
          </button>
          <button type="button" className="cmp-tool" title="Insert link" aria-label="Insert link" onClick={() => insertAtCursor(' https://linkedin.com ')}>
            <Link2 size={16} />
          </button>

          <span className="cmp-tool-sep" aria-hidden="true" />

          <button type="button" className="cmp-tool" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo" aria-label="Undo">
            <Undo2 size={16} />
          </button>
          <button type="button" className="cmp-tool" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo" aria-label="Redo">
            <Redo2 size={16} />
          </button>
          <button type="button" className="cmp-tool" onClick={handleClearFormatting} title="Clear formatting" aria-label="Clear formatting">
            <Eraser size={16} />
          </button>

          <span className="cmp-tool-sep" aria-hidden="true" />

          <button type="button" className="cmp-tool" onClick={formatBulletList} title="Bullet list" aria-label="Bullet list">
            <List size={16} />
          </button>
          <button type="button" className="cmp-tool" onClick={formatNumberedList} title="Numbered list" aria-label="Numbered list">
            <ListOrdered size={16} />
          </button>
          <button type="button" className="cmp-tool" onClick={formatSpacing} title="Space out paragraphs" aria-label="Space out paragraphs">
            <AlignLeft size={16} />
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onUploadImage) onUploadImage(file);
            e.target.value = '';
          }}
        />

        {showAIPanel && (
          <div id="cmp-ai-panel" className="cmp-ai">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <Segmented label="AI tools" options={AI_TABS} value={aiTab} onChange={setAiTab} size="sm" inline />
              <span className="text-[12.5px] cmp-muted">
                Uses {pillar.label.toLowerCase()} and a {selectedTone} tone
              </span>
            </div>

            <div key={aiTab} className="m-fade-in">
              {aiTab === 'draft' && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div>
                    <p className="text-[14px] font-medium cmp-ink">Write a full draft</p>
                    <p className="text-[13px] cmp-muted mt-0.5">
                      {safeContent.trim()
                        ? 'Replaces what you have written. You can undo it.'
                        : 'A hook, body and call to action you can edit.'}
                    </p>
                    <label className="mt-2 inline-flex items-center gap-2 text-[13px] cmp-ink cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-violet-600 w-4 h-4"
                        checked={includeImages}
                        onChange={(e) => setIncludeImages(e.target.checked)}
                      />
                      Also create 3 image options
                    </label>
                  </div>
                  <button
                    type="button"
                    className="cmp-btn cmp-btn-primary is-sm shrink-0"
                    disabled={busy || Boolean(imageGeneration)}
                    onClick={() => onAIGenerate && onAIGenerate({ withImages: includeImages })}
                  >
                    <Sparkles size={15} />
                    {isGenerating ? 'Drafting…' : 'Draft post'}
                  </button>
                </div>
              )}

              {aiTab === 'improve' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {IMPROVE_OPTIONS.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      className="cmp-ai-opt"
                      disabled={!safeContent.trim() || busy}
                      onClick={() => handleImprove(label)}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                  {!safeContent.trim() && (
                    <p className="sm:col-span-2 text-[12.5px] cmp-muted">Write something first to use these.</p>
                  )}
                </div>
              )}

              {aiTab === 'tone' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_REWRITES.map(({ tone, preview }) => (
                    <button
                      key={tone}
                      type="button"
                      className="cmp-ai-opt cmp-ai-tone"
                      disabled={busy}
                      onClick={() => handleToneRewrite(tone, preview)}
                    >
                      <span className="capitalize cmp-ink">{tone}</span>
                      <p className="line-clamp-2">{preview}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div
          ref={editorRef}
          className={`cmp-editor ${rewriting ? 'is-rewriting' : ''} ${justRewritten ? 'is-rewritten' : ''}`}
          style={{ '--fold-y': `${foldY ?? 0}px` }}
        >
          <div className="cmp-fold-tint" data-hidden={!showFold} aria-hidden="true" />

          <div className="cmp-editor-text cmp-editor-mirror" aria-hidden="true">
            {foldIndex != null ? (
              <>
                {safeContent.slice(0, foldIndex)}
                <span ref={anchorRef}>{'\u2060'}</span>
                {safeContent.slice(foldIndex)}
              </>
            ) : (
              safeContent
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={safeContent}
            readOnly={busy}
            aria-label="Post text"
            aria-describedby="cmp-char-count"
            placeholder="Write your post. The first line is your hook, so make it count."
            className="cmp-editor-text"
            onChange={(e) => {
              const val = e.target.value;
              if (!isAtLimit || val.length < safeContent.length) pushHistory(val.slice(0, MAX_CHARS));
            }}
          />

          <div className="cmp-fold-line" data-hidden={!showFold} aria-hidden="true">
            <span className="cmp-fold-label">
              {device === 'mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
              …more cuts here
            </span>
          </div>

          {isGenerating && (
            <div className="cmp-drafting" role="status">
              <p className="cmp-drafting-status">
                <Sparkles size={15} className="cmp-spin" style={{ animationDuration: '2.4s' }} />
                Drafting a {selectedTone} post for {pillar.label.toLowerCase()}
              </p>
              {[92, 100, 84, 0, 96, 78, 88].map((w, i) =>
                w === 0 ? (
                  <span key={`gap-${i}`} className="h-2" />
                ) : (
                  <span key={`skel-${i}`} className="cmp-skel" style={{ width: `${w}%`, '--m-i': i }} />
                )
              )}
            </div>
          )}
        </div>

        <div className="px-5 pt-3">
          <div className="cmp-field">
            <MessageSquareQuote size={16} className="cmp-field-icon" aria-hidden="true" />
            <input
              type="text"
              className="cmp-input"
              value={cta}
              aria-label="Call to action"
              placeholder="Call to action, e.g. What's your biggest challenge with LinkedIn growth?"
              onChange={(e) => onCtaChange && onCtaChange(e.target.value)}
            />
          </div>
        </div>

        <div className="cmp-card-foot mt-4">
          <div className="flex items-center gap-2.5">
            <ProgressRing
              value={safeContent.length / MAX_CHARS}
              tone={isAtLimit ? 'red' : isNearLimit ? 'amber' : 'blue'}
            />
            <span
              id="cmp-char-count"
              className={`text-[13px] tabular-nums ${isAtLimit ? 'text-rose-600' : isNearLimit ? 'text-amber-700' : 'cmp-muted'}`}
            >
              {remaining.toLocaleString()} characters left
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] cmp-muted">Show fold for</span>
            <Segmented
              label="Show fold for"
              options={DEVICE_OPTIONS}
              value={device}
              onChange={(v) => onDeviceChange && onDeviceChange(v)}
              size="sm"
              inline
            />
          </div>
        </div>
      </section>

      {/* ---------- Visual ---------- */}
      <section className="cmp-card m-rise" style={{ '--m-i': 4 }} aria-labelledby="cmp-visual-title">
        <CardHeader icon={ImageIcon} tone="amber" title="Visual" qualifier={VISUAL_QUALIFIER[visualFormat]} id="cmp-visual-title" />
        <div className="cmp-card-body flex flex-col gap-4">
          <Segmented
            label="Visual format"
            options={VISUAL_FORMATS}
            value={visualFormat}
            onChange={(v) => onVisualFormatChange && onVisualFormatChange(v)}
            className="is-collapsible"
          />

          <div key={visualFormat} className="m-fade-in">
            {visualFormat === 'image' && (
              <ImageOptions
                images={candidateImages}
                imageUrl={imageUrl}
                generation={imageGeneration}
                revealMode={revealMode}
                canGenerate={!isGenerating && !imageGeneration}
                onSelect={onSelectImage}
                onRemove={onRemoveImage}
                onUpload={onUploadImage}
                onGenerate={onGenerateImages}
                onCancel={onCancelImages}
              />
            )}
            {visualFormat === 'carousel' && (
              <CarouselOptions
                slides={carouselSlides}
                onChangeSlides={onChangeCarouselSlides}
                generation={carouselGeneration}
                onGenerate={onGenerateCarousel}
                onCancel={onCancelCarousel}
                canGenerate={!isGenerating && !carouselGeneration}
                isGenerating={isGenerating}
                content={safeContent}
              />
            )}
            {visualFormat === 'infographic' && (
              <InfographicOptions
                data={infographicData}
                onChangeData={onChangeInfographicData}
                generation={infographicGeneration}
                onGenerate={onGenerateInfographic}
                onCancel={onCancelInfographic}
                canGenerate={!isGenerating && !infographicGeneration}
                isGenerating={isGenerating}
                content={safeContent}
              />
            )}
            {visualFormat === 'none' && <TextOnlyVisual content={content} />}

          </div>
        </div>
      </section>

      <HashtagsCard hashtags={safeHashtags} onChange={onHashtagsChange} />
    </div>
  );
}
