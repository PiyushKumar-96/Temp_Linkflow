'use client';

import React, { useRef } from 'react';
import {
  Sparkles,
  Image,
  X,
  MessageSquareQuote,
  FileText,
  Ban,
  Layers,
  LayoutGrid,
} from 'lucide-react';
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

export default function ComposerEditor({
  content,
  onChange,
  cta = '',
  onCtaChange,
  selectedTone,
  onToneChange,
  hashtags,
  onHashtagsChange,
  category,
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
}) {
  const safeContent = content || '';
  const safeHashtags = Array.isArray(hashtags) ? hashtags : [];
  const remaining = MAX_CHARS - safeContent.length;
  const isNearLimit = remaining < 300;
  const isAtLimit = remaining <= 0;
  const fileRef = useRef(null);

  const removeHashtag = (tag) => {
    onHashtagsChange(safeHashtags.filter((h) => h !== tag));
  };

  const handleFormatSelect = (fmt) => {
    if (onVisualFormatChange) onVisualFormatChange(fmt);
    if (fmt === 'none') {
      if (onImageChange) onImageChange('');
      if (onRemoveCandidates) onRemoveCandidates();
    }
  };

  return (
    <div className="card flex flex-col gap-0 overflow-hidden">
      {/* Tone & Category row */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex flex-wrap gap-3">
        {/* Tone */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide">
            Tone
          </label>
          <div className="flex gap-1 flex-wrap">
            {tones.map((t) => (
              <button
                key={`tone-${t.value}`}
                onClick={() => onToneChange(t.value)}
                className={`px-2.5 py-1 text-xs font-500 rounded-full border transition-all duration-150 ${
                  selectedTone === t.value
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-muted border-transparent text-muted-foreground hover:text-foreground'
                }`}
                title={t.label}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1 ml-auto">
          <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-base text-xs py-1 px-2 h-7"
            style={{ minWidth: 160 }}
          >
            {categories.map((c) => (
              <option key={`cat-${c}`} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10 rounded-none">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-sm font-600">
                Generating post & 3 visual variations with AI...
              </span>
            </div>
          </div>
        )}
        <textarea
          value={safeContent}
          onChange={(e) =>
            !isAtLimit || e.target.value.length < safeContent.length
              ? onChange(e.target.value.slice(0, MAX_CHARS))
              : undefined
          }
          placeholder="Start writing your LinkedIn post, or click 'Generate with AI'..."
          className="w-full px-4 py-3 text-sm text-foreground bg-transparent outline-none resize-none leading-relaxed placeholder:text-muted-foreground"
          style={{ minHeight: 220 }}
        />
      </div>

      {/* Call to Action (CTA) Input */}
      <div className="px-4 py-2 border-t border-border/60 bg-muted/10">
        <label className="text-[11px] font-600 text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1">
          <MessageSquareQuote size={13} className="text-primary" />
          <span>Call to Action (CTA)</span>
        </label>
        <input
          type="text"
          value={cta}
          onChange={(e) => onCtaChange && onCtaChange(e.target.value)}
          placeholder="e.g. What's your biggest challenge with LinkedIn growth? Drop a comment below 👇"
          className="input-base text-xs py-1.5 px-3 w-full bg-background"
        />
      </div>

      {/* Hashtags */}
      {safeHashtags.length > 0 && (
        <div className="px-4 py-2 border-t border-border/40 flex flex-wrap gap-1.5">
          {safeHashtags.map((tag) => (
            <span
              key={`hashtag-${tag}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-500 rounded-full"
            >
              {tag}
              <button
                onClick={() => removeHashtag(tag)}
                className="hover:text-danger transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Visual Format Mode Selector (4 Formats) */}
      <div className="px-4 py-2.5 border-t border-border/60 bg-muted/20 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
            Visual Format:
          </span>
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg flex-wrap">
            <button
              type="button"
              onClick={() => handleFormatSelect('image')}
              className={`px-2.5 py-1 text-xs font-500 rounded-md transition-all flex items-center gap-1.5 ${
                visualFormat === 'image'
                  ? 'bg-card text-foreground card-shadow font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Image size={12} />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatSelect('carousel')}
              className={`px-2.5 py-1 text-xs font-500 rounded-md transition-all flex items-center gap-1.5 ${
                visualFormat === 'carousel'
                  ? 'bg-card text-foreground card-shadow font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={12} />
              <span>Carousel</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatSelect('infographic')}
              className={`px-2.5 py-1 text-xs font-500 rounded-md transition-all flex items-center gap-1.5 ${
                visualFormat === 'infographic'
                  ? 'bg-card text-foreground card-shadow font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid size={12} />
              <span>Infographic</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatSelect('none')}
              className={`px-2.5 py-1 text-xs font-500 rounded-md transition-all flex items-center gap-1.5 ${
                visualFormat === 'none'
                  ? 'bg-card text-foreground card-shadow font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Ban size={12} />
              <span>Text-Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Visual Format */}
      <div className="p-4 border-t border-border bg-muted/10">
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
            onUpdateCandidates={(cands) => {
              if (onSelectImageIndex) onSelectImageIndex(0);
            }}
            isEditable={true}
          />
        )}

        {visualFormat === 'none' && <TextOnlyVisual content={content} />}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (onVisualFormatChange) onVisualFormatChange('image');
              fileRef.current?.click();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-500 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Image size={13} />
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
                onImageChange(url);
                if (onVisualFormatChange) onVisualFormatChange('image');
                if (onRemoveCandidates) onRemoveCandidates();
              }
            }}
          />

          <button
            onClick={() => {
              if (onVisualFormatChange) onVisualFormatChange('image');
              onAIGenerate();
            }}
            disabled={isGenerating}
            className="btn-accent text-xs py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <Sparkles size={13} />
            <span>{isGenerating ? 'Generating...' : 'Generate with AI (Text + 3 Images)'}</span>
          </button>
        </div>

        {/* Real-time LinkedIn Character Counter */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-600 tabular-nums ${
              isAtLimit ? 'text-danger' : isNearLimit ? 'text-warning' : 'text-muted-foreground'
            }`}
          >
            {remaining.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters left
          </span>
        </div>
      </div>
    </div>
  );
}
