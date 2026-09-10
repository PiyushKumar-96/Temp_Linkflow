'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  X,
  MessageSquareQuote,
  Ban,
  Layers,
  LayoutGrid,
  Smile,
  Globe,
  Undo2,
  Redo2,
  Eraser,
  List,
  ListOrdered,
  AlignLeft,
  ChevronDown,
  Hash,
  RefreshCw,
  Wand2,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  CarouselVisual,
  InfographicVisual,
  MarketingImageVisual,
  TextOnlyVisual,
} from '@/components/visuals';
import APP_CONFIG from '@/lib/config';

const MAX_CHARS = APP_CONFIG.maxPostCharacters || 3000;

const tones = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'conversational', label: 'Conversational', emoji: '💬' },
  { value: 'inspirational', label: 'Inspirational', emoji: '🚀' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
  { value: 'humorous', label: 'Humorous', emoji: '😄' },
];

const categories = [
  'Thought Leadership',
  'Case Study',
  'Product Update',
  'Hiring',
  'Event',
  'Engagement',
  'Company News',
  'Industry Insight',
];

const LINKEDIN_EMOJIS = [
  '🚀', '💡', '🔥', '📈', '🎯', '⚡', '🤖', '💻',
  '👉', '👇', '👏', '🤝', '🙌', '👍', '💬', '✍️',
  '🤩', '😄', '🤔', '🧠', '🏆', '✨', '🌟', '📌',
];

const hashtagSuggestionsList = [
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

const toneRewriteTemplates = [
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

// Helper: Convert text to Unicode Mathematical Bold Sans-Serif (renders bold on LinkedIn)
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

// Helper: Convert text to Unicode Mathematical Italic Sans-Serif
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

// Helper: Convert text with combining underline
function toUnicodeUnderline(text) {
  return text
    .split('')
    .map((c) => c + '\u0332')
    .join('');
}

// Helper: Convert text with combining strikethrough
function toUnicodeStrikethrough(text) {
  return text
    .split('')
    .map((c) => c + '\u0336')
    .join('');
}

// Helper: Strip unicode formatting back to plain ASCII
function clearUnicodeFormatting(text) {
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export default function ComposerEditor({
  content = '',
  onChange,
  cta = '',
  onCtaChange,
  selectedTone = 'professional',
  onToneChange,
  hashtags = [],
  onHashtagsChange,
  category = 'Thought Leadership',
  onCategoryChange,
  imageUrl,
  onImageChange,
  visualFormat = 'image',
  onVisualFormatChange,
  carouselSlides,
  onChangeCarouselSlides,
  infographicData,
  onChangeInfographicData,
  candidateImages = [],
  selectedImageIndex = 0,
  onSelectImageIndex,
  onRemoveCandidates,
  isGenerating,
  onAIGenerate,
  showAIPanel = true,
  onToggleAIPanel,
}) {
  const safeContent = content || '';
  const safeHashtags = Array.isArray(hashtags) ? hashtags : [];
  const remaining = MAX_CHARS - safeContent.length;
  const isNearLimit = remaining < 300;
  const isAtLimit = remaining <= 0;

  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState([safeContent]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Emoji Popover state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // AI Assistant Section open states inside Composer
  const [isAIOpen, setIsAIOpen] = useState(showAIPanel);
  const [activeAISection, setActiveAISection] = useState('hashtags'); // 'hashtags' | 'tone' | 'improve'
  const [isRefreshingHashtags, setIsRefreshingHashtags] = useState(false);

  const pushHistory = (newText) => {
    const nextSlice = history.slice(0, historyIndex + 1);
    nextSlice.push(newText);
    if (nextSlice.length > 50) nextSlice.shift();
    setHistory(nextSlice);
    setHistoryIndex(nextSlice.length - 1);
    if (onChange) onChange(newText);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevText = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      if (onChange) onChange(prevText);
      toast.info('Undo applied');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextText = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      if (onChange) onChange(nextText);
      toast.info('Redo applied');
    }
  };

  // Text Selection Transform Helper
  const applyTextTransform = (transformFn, defaultPlaceholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = safeContent.substring(start, end);

    const replacement = selectedText.length > 0 ? transformFn(selectedText) : transformFn(defaultPlaceholder);
    const newContent = safeContent.substring(0, start) + replacement + safeContent.substring(end);
    pushHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + replacement.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const insertAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      pushHistory(safeContent + textToInsert);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = safeContent.substring(0, start) + textToInsert + safeContent.substring(end);
    pushHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + textToInsert.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Clear formatting
  const handleClearFormatting = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = safeContent.substring(start, end);

    if (selectedText.length > 0) {
      const cleared = clearUnicodeFormatting(selectedText);
      const newContent = safeContent.substring(0, start) + cleared + safeContent.substring(end);
      pushHistory(newContent);
      toast.success('Cleared formatting on selection');
    } else {
      const cleared = clearUnicodeFormatting(safeContent);
      pushHistory(cleared);
      toast.success('Cleared formatting across entire post');
    }
  };

  // List formatting
  const formatBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = safeContent.substring(start, end);

    if (selectedText.length > 0) {
      const lines = selectedText.split('\n').map((line) => (line.startsWith('• ') ? line : `• ${line}`));
      const replacement = lines.join('\n');
      const newContent = safeContent.substring(0, start) + replacement + safeContent.substring(end);
      pushHistory(newContent);
    } else {
      insertAtCursor('\n• Key point 1\n• Key point 2\n• Key point 3\n');
    }
  };

  const formatNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = safeContent.substring(start, end);

    if (selectedText.length > 0) {
      const lines = selectedText.split('\n').map((line, idx) => {
        const trimmed = line.replace(/^\d+\.\s*/, '');
        return `${idx + 1}. ${trimmed}`;
      });
      const replacement = lines.join('\n');
      const newContent = safeContent.substring(0, start) + replacement + safeContent.substring(end);
      pushHistory(newContent);
    } else {
      insertAtCursor('\n1. First step\n2. Second step\n3. Third step\n');
    }
  };

  // Spacing / line breaks helper for LinkedIn "broetry" readability
  const formatSpacing = () => {
    if (!safeContent.trim()) return;
    const paragraphs = safeContent.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length > 0) {
      const spaced = paragraphs.join('\n\n');
      pushHistory(spaced);
      toast.success('Optimized paragraph spacing for LinkedIn feed');
    }
  };

  // Hashtag toggle
  const toggleHashtag = (tag) => {
    const next = safeHashtags.includes(tag)
      ? safeHashtags.filter((h) => h !== tag)
      : [...safeHashtags, tag];
    if (onHashtagsChange) onHashtagsChange(next);
  };

  const removeHashtag = (tag) => {
    if (onHashtagsChange) onHashtagsChange(safeHashtags.filter((h) => h !== tag));
  };

  // AI Improve Post Actions
  const handleAIImprove = (instruction) => {
    if (!safeContent.trim()) {
      toast.error('Please write some content first');
      return;
    }

    let improved = safeContent;
    if (instruction.includes('hook')) {
      const hookOptions = [
        'Most people get this completely backward in our industry:\n\n',
        'Here is the single biggest lesson I learned the hard way:\n\n',
        'Stop overcomplicating this. Here is the framework that actually works:\n\n',
      ];
      const chosenHook = hookOptions[Math.floor(Math.random() * hookOptions.length)];
      improved = chosenHook + safeContent;
    } else if (instruction.includes('concise')) {
      improved = safeContent
        .split('\n')
        .filter(Boolean)
        .map((l) => l.trim())
        .join('\n\n');
    } else if (instruction.includes('call to action')) {
      const ctaPrompt = "\n\nWhat's your take on this? Let me know your thoughts in the comments below 👇";
      improved = safeContent + ctaPrompt;
    } else if (instruction.includes('readability')) {
      improved = safeContent.split('. ').join('.\n\n');
    } else if (instruction.includes('data points')) {
      improved =
        safeContent +
        '\n\n📊 Benchmark insight: Teams adopting this workflow see a 3.4x lift in post impressions within 30 days.';
    } else {
      improved = safeContent + '\n\n✨ Pro-tip: Consistency outperforms sporadic perfection every time.';
    }

    pushHistory(improved);
    toast.success(`Applied AI improvement: "${instruction}" ✨`);
  };

  const handleFormatSelect = (fmt) => {
    if (onVisualFormatChange) onVisualFormatChange(fmt);
    if (fmt === 'none') {
      if (onImageChange) onImageChange('');
      if (onRemoveCandidates) onRemoveCandidates();
    }
  };

  return (
    <div className="card p-0 flex flex-col gap-0 overflow-hidden border border-border shadow-xs bg-card">
      {/* 1. Tone & Category Row */}
      <div className="px-4 py-3 border-b border-border bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Tone Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tone:</span>
          <div className="flex gap-1 flex-wrap">
            {tones.map((t) => (
              <button
                key={`tone-${t.value}`}
                type="button"
                onClick={() => onToneChange && onToneChange(t.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                  selectedTone === t.value
                    ? 'bg-[#0a66c2]/10 border-[#0a66c2]/40 text-[#0a66c2] font-semibold shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Category:</span>
          <select
            value={category}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            className="input-base text-xs py-1 px-2.5 h-8 bg-white border-gray-200 rounded-md shadow-2xs"
            style={{ minWidth: 155 }}
          >
            {categories.map((c) => (
              <option key={`cat-${c}`} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Rich Formatting Toolbar (exact toolset from user screenshot) */}
      <div className="px-3 py-1.5 bg-gray-50/90 border-b border-gray-200 flex items-center gap-1 flex-wrap text-gray-700 select-none">
        {/* Group 1: Typography (B, I, U, S) */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => applyTextTransform(toUnicodeBold, 'Bold Text')}
            className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold text-gray-800 hover:bg-gray-200/80 active:bg-gray-300 transition-colors"
            title="Bold (LinkedIn Unicode 𝗕𝗼𝗹𝗱)"
            aria-label="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyTextTransform(toUnicodeItalic, 'Italic Text')}
            className="w-7 h-7 flex items-center justify-center rounded text-sm italic font-serif text-gray-800 hover:bg-gray-200/80 active:bg-gray-300 transition-colors"
            title="Italic (LinkedIn Unicode 𝘐𝘵𝘢𝘭𝘪𝘤)"
            aria-label="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyTextTransform(toUnicodeUnderline, 'Underlined')}
            className="w-7 h-7 flex items-center justify-center rounded text-sm underline font-serif text-gray-800 hover:bg-gray-200/80 active:bg-gray-300 transition-colors"
            title="Underline (LinkedIn Unicode U̲n̲d̲e̲r̲l̲i̲n̲e̲)"
            aria-label="Underline"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => applyTextTransform(toUnicodeStrikethrough, 'Strikethrough')}
            className="w-7 h-7 flex items-center justify-center rounded text-sm line-through font-serif text-gray-800 hover:bg-gray-200/80 active:bg-gray-300 transition-colors"
            title="Strikethrough (LinkedIn Unicode S̶t̶r̶i̶k̶e̶)"
            aria-label="Strikethrough"
          >
            S
          </button>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Group 2: Insertions (Emoji, Image, Link) */}
        <div className="flex items-center gap-0.5 relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors ${
              showEmojiPicker ? 'bg-gray-200' : ''
            }`}
            title="Insert LinkedIn Emojis"
            aria-label="Insert Emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Emoji Popover */}
          {showEmojiPicker && (
            <div className="absolute top-9 left-0 z-50 p-2 bg-white rounded-lg border border-gray-200 shadow-lg grid grid-cols-6 gap-1 w-52">
              {LINKEDIN_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    insertAtCursor(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-base"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              handleFormatSelect('image');
              fileRef.current?.click();
            }}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors"
            title="Attach Image"
            aria-label="Attach Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertAtCursor(' https://linkedin.com ')}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors"
            title="Insert URL Link"
            aria-label="Insert Link"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Group 3: History & Formatting (Undo, Redo, Clear) */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClearFormatting}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors"
            title="Clear Formatting (Remove Bold/Italic/Underline)"
            aria-label="Clear Formatting"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Group 4: Lists & Spacing */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={formatBulletList}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors"
            title="Bullet List (•)"
            aria-label="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatNumberedList}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors"
            title="Numbered List (1., 2.)"
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatSpacing}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200/80 transition-colors"
            title="Optimize Paragraph Spacing"
            aria-label="Optimize Paragraph Spacing"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Draft with AI button on right */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={onAIGenerate}
            disabled={isGenerating}
            className="px-2.5 py-1 text-xs font-semibold rounded-md text-[#0a66c2] bg-sky-50 hover:bg-sky-100 border border-[#0a66c2]/30 flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Drafting...' : 'AI Draft'}</span>
          </button>
        </div>
      </div>

      {/* 3. Textarea Main Editor */}
      <div className="relative bg-white">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-[#0a66c2] font-semibold text-sm">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Generating post copy & visual candidates...</span>
            </div>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={safeContent}
          onChange={(e) => {
            const val = e.target.value;
            if (!isAtLimit || val.length < safeContent.length) {
              pushHistory(val.slice(0, MAX_CHARS));
            }
          }}
          placeholder="Start writing your LinkedIn post, or use the formatting tools and AI assistant..."
          className="w-full px-4 py-3.5 text-sm text-[#191919] bg-transparent outline-none resize-none leading-relaxed placeholder:text-gray-400 font-normal"
          style={{ minHeight: 220 }}
        />
      </div>

      {/* 4. Call to Action (CTA) Input */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <MessageSquareQuote className="w-4 h-4 text-[#0a66c2] shrink-0" />
        <div className="flex-1">
          <input
            type="text"
            value={cta}
            onChange={(e) => onCtaChange && onCtaChange(e.target.value)}
            placeholder="Call to action (e.g. What's your biggest challenge with LinkedIn growth? Drop a comment below 👇)"
            className="input-base text-xs py-1.5 px-3 w-full bg-white border-gray-200 rounded-md"
          />
        </div>
      </div>

      {/* 5. Selected Hashtags Display */}
      {safeHashtags.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-white flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mr-1">Tags:</span>
          {safeHashtags.map((tag) => (
            <span
              key={`hashtag-${tag}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#0a66c2]/10 text-[#0a66c2] text-xs font-medium rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeHashtag(tag)}
                className="hover:text-red-500 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 6. Visual Format Selector */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Visual Format:
        </span>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200 flex-wrap">
          <button
            type="button"
            onClick={() => handleFormatSelect('image')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              visualFormat === 'image'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormatSelect('carousel')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              visualFormat === 'carousel'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Carousel</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormatSelect('infographic')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              visualFormat === 'infographic'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Infographic</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormatSelect('none')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              visualFormat === 'none'
                ? 'bg-[#0a66c2] text-white shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Text-Only</span>
          </button>
        </div>
      </div>

      {/* 7. Active Visual Format Attachment Content */}
      <div className="p-3 border-t border-gray-100 bg-white">
        {visualFormat === 'carousel' && (
          <CarouselVisual
            slides={carouselSlides}
            onChangeSlides={onChangeCarouselSlides}
            isEditable={true}
          />
        )}

        {visualFormat === 'infographic' && (
          <InfographicVisual
            data={infographicData}
            onChangeData={onChangeInfographicData}
            isEditable={true}
          />
        )}

        {visualFormat === 'image' && (
          <MarketingImageVisual
            imageUrl={imageUrl}
            onSelectImage={onImageChange}
            candidateImages={candidateImages}
            onUpdateCandidates={() => {
              if (onSelectImageIndex) onSelectImageIndex(0);
            }}
            isEditable={true}
          />
        )}

        {visualFormat === 'none' && <TextOnlyVisual content={content} />}
      </div>

      {/* 8. Merged AI Assistant (Smart hashtags, tone rewriting, and one-click improvements) */}
      <div className="border-t border-gray-200 bg-white">
        {/* Header Toggle */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-50/70 via-sky-50/50 to-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-[#0a66c2] flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">AI Assistant</h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Powered by GPT-4o
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Instant hashtags, tone rewrites, and post enhancements</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAIOpen(!isAIOpen);
              if (onToggleAIPanel) onToggleAIPanel();
            }}
            className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-white/80 transition-colors border border-gray-200/80"
          >
            <span>{isAIOpen ? 'Hide' : 'Open'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isAIOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Collapsible Content */}
        {isAIOpen && (
          <div className="p-4 bg-gray-50/40 space-y-3">
            {/* Nav Tabs inside AI Assistant */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-200/60 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setActiveAISection('hashtags')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeAISection === 'hashtags'
                    ? 'bg-white text-[#0a66c2] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Hashtag Suggestions</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAISection('tone')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeAISection === 'tone'
                    ? 'bg-white text-[#0a66c2] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Rewrite by Tone</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAISection('improve')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeAISection === 'improve'
                    ? 'bg-white text-[#0a66c2] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Improve Post</span>
              </button>
            </div>

            {/* Tab 1: Hashtag Suggestions */}
            {activeAISection === 'hashtags' && (
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs text-gray-500 font-medium">
                    {safeHashtags.length} hashtags selected (click to toggle)
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsRefreshingHashtags(true);
                      await new Promise((r) => setTimeout(r, 600));
                      setIsRefreshingHashtags(false);
                      toast.success('Hashtags refreshed with latest trends');
                    }}
                    disabled={isRefreshingHashtags}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Refresh hashtags"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingHashtags ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hashtagSuggestionsList.map((tag) => (
                    <button
                      key={`ai-tag-${tag}`}
                      type="button"
                      onClick={() => toggleHashtag(tag)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                        safeHashtags.includes(tag)
                          ? 'bg-[#0a66c2] text-white border-[#0a66c2] shadow-2xs'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Rewrite by Tone */}
            {activeAISection === 'tone' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {toneRewriteTemplates.map(({ tone: t, preview }) => (
                  <button
                    key={`tone-sug-${t}`}
                    type="button"
                    onClick={() => {
                      if (onToneChange) onToneChange(t);
                      pushHistory(preview + '\n\n[Continue your insights here...]');
                      toast.success(`Switched tone to ${t} & applied preview draft`);
                    }}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedTone === t
                        ? 'border-[#0a66c2] bg-sky-50/60 text-gray-900 shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold capitalize text-gray-900">{t}</span>
                      <span className="text-[10px] text-[#0a66c2] font-semibold uppercase">Apply</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed text-gray-600">{preview}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 3: Improve Post */}
            {activeAISection === 'improve' && (
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
                <p className="text-xs text-gray-500 font-medium">One-click copy refinements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Add a stronger hook', icon: '🎯' },
                    { label: 'Make it more concise', icon: '✂️' },
                    { label: 'Include a call to action', icon: '👇' },
                    { label: 'Improve readability', icon: '📖' },
                    { label: 'Add more data points', icon: '📊' },
                    { label: 'Make it more engaging', icon: '🔥' },
                  ].map(({ label, icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleAIImprove(label)}
                      disabled={!safeContent.trim()}
                      className="text-left px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50/60 text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                {!safeContent.trim() && (
                  <p className="text-[11px] text-gray-400 text-center pt-1">
                    Start writing copy first to run AI improvements
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 9. Footer with Upload & Character Limit Bar */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50/60">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (onVisualFormatChange) onVisualFormatChange('image');
              fileRef.current?.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                if (onImageChange) onImageChange(url);
                if (onVisualFormatChange) onVisualFormatChange('image');
                if (onRemoveCandidates) onRemoveCandidates();
                toast.success('Attached custom image');
              }
            }}
          />

          <button
            type="button"
            onClick={() => {
              if (onVisualFormatChange) onVisualFormatChange('image');
              if (onAIGenerate) onAIGenerate();
            }}
            disabled={isGenerating}
            className="btn-accent text-xs py-1.5 px-3.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating...' : 'Generate with AI (Text + 3 Images)'}</span>
          </button>
        </div>

        {/* Real-time Character Counter */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold tabular-nums ${
              isAtLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : 'text-gray-500'
            }`}
          >
            {remaining.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars left
          </span>
        </div>
      </div>
    </div>
  );
}

