'use client';

// Drop-in replacement for your existing ComposerPreview component.
// Same props / imports as the original — paste over your project file.
// Uses arbitrary-value Tailwind classes (e.g. bg-[#0a66c2]) as the original
// file did, so it relies on your project's own Tailwind build to render;
// it isn't meant to run standalone outside your app.

import React, { useState } from 'react';
import {
  ChevronDown,
  Globe,
  Heart,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  Repeat2,
  Send,
  Smartphone,
  Sparkles,
  ThumbsUp,
} from 'lucide-react';
import { CarouselVisual, InfographicVisual } from '@/components/visuals';
import { AVATARS } from '@/temp-backend/data/media';
import { useAuth } from '@/context/AuthContext';
import APP_CONFIG from '@/lib/config';
import { CardHeader, DrawnCheck, ProgressRing, Segmented } from './ComposerUI';
import {
  CAROUSEL_GEN_STEPS,
  GEN_STEPS,
  INFOGRAPHIC_GEN_STEPS,
  GenTile,
  getGenStep,
  useElapsed,
} from './ImageOptions';
import PhonePreview from './PhonePreview';
import LaptopPreview from './LaptopPreview';

const DEVICE_OPTIONS = [
  { value: 'desktop', label: 'Web', icon: Monitor },
  { value: 'mobile', label: 'Phone', icon: Smartphone },
];

function renderFormatted(text) {
  if (!text) return null;
  return text.split(/(https?:\/\/[^\s]+|#[\p{L}\p{N}_-]+|@[\p{L}\p{N}_-]+)/gu).map((part, i) => {
    if (/^(https?:\/\/|#|@)/.test(part)) {
      return (
        <span key={i} className="text-[#0a66c2] font-semibold break-all">
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function MediaPreview({
  visualFormat,
  imageUrl,
  imageGeneration,
  revealMode,
  carouselSlides,
  carouselGeneration,
  infographicData,
  infographicGeneration,
}) {
  const isGeneratingCarousel = Boolean(carouselGeneration);
  const isGeneratingInfographic = Boolean(infographicGeneration);
  const isGeneratingImage = Boolean(imageGeneration);

  const activeStartedAt =
    carouselGeneration?.startedAt || infographicGeneration?.startedAt || imageGeneration?.startedAt;

  const elapsed = useElapsed(activeStartedAt);

  if (visualFormat === 'carousel' || visualFormat === 'pdf') {
    if (isGeneratingCarousel) {
      const step = getGenStep(elapsed, CAROUSEL_GEN_STEPS);
      return (
        <div className="cmp-li-media">
          <GenTile step={step} reveal={revealMode}>
            <span className="cmp-gen-caption">
              <Sparkles size={13} />
              <span key={step} className="m-swap">
                {CAROUSEL_GEN_STEPS[step]?.label || 'Generating carousel slides…'}
              </span>
            </span>
          </GenTile>
        </div>
      );
    }
    if (!carouselSlides || carouselSlides.length === 0) return null;
    return (
      <div className="border-t border-gray-100 p-2 bg-slate-50">
        <CarouselVisual slides={carouselSlides} isEditable={false} />
      </div>
    );
  }

  if (visualFormat === 'infographic') {
    if (isGeneratingInfographic) {
      const step = getGenStep(elapsed, INFOGRAPHIC_GEN_STEPS);
      return (
        <div className="cmp-li-media">
          <GenTile step={step} reveal={revealMode}>
            <span className="cmp-gen-caption">
              <Sparkles size={13} />
              <span key={step} className="m-swap">
                {INFOGRAPHIC_GEN_STEPS[step]?.label || 'Generating infographic…'}
              </span>
            </span>
          </GenTile>
        </div>
      );
    }
    if (!infographicData) return null;
    return (
      <div className="border-t border-gray-100 p-2 bg-slate-50">
        <InfographicVisual data={infographicData} isEditable={false} />
      </div>
    );
  }

  if (visualFormat !== 'image' || (!imageUrl && !imageGeneration)) return null;

  const step = getGenStep(elapsed, GEN_STEPS);
  // Same element for "generating" and "ready", so the image develops in place.
  return (
    <div className="cmp-li-media">
      <GenTile
        src={imageGeneration ? undefined : imageUrl}
        alt="Post image"
        step={step}
        reveal={revealMode}
      >
        {imageGeneration && (
          <span className="cmp-gen-caption">
            <Sparkles size={13} />
            <span key={step} className="m-swap">
              {GEN_STEPS[step].label}
            </span>
          </span>
        )}
      </GenTile>
    </div>
  );
}

function QualityCheck({ checks, score, hasText }) {
  const [open, setOpen] = useState(false);
  const displayScore = hasText ? score : 0;
  const nextCheck = checks.find((c) => !c.ok);
  const tone = !hasText ? 'slate' : score >= 80 ? 'green' : score >= 60 ? 'amber' : 'red';
  const hint = !hasText
    ? 'Start writing to see how your post scores.'
    : nextCheck
      ? nextCheck.hint
      : 'Ready for review. The owner sees this score in the queue.';

  return (
    <div className="cmp-quality">
      <button
        type="button"
        className="cmp-quality-row"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <ProgressRing value={hasText ? score / 100 : 0} size={40} stroke={4} tone={tone}>
          {hasText ? displayScore : '–'}
        </ProgressRing>
        <span className="min-w-0 flex-1">
          <span className="cmp-quality-title">
            {hasText ? `Quality ${displayScore}%` : 'Quality check'}
          </span>
          <span key={hint} className="cmp-quality-hint truncate">
            {hint}
          </span>
        </span>
        <ChevronDown size={16} className={`cmp-chevron ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <ul className="cmp-checklist">
          {checks.map((check) => {
            const ok = hasText && check.ok;
            return (
              <li key={check.id} className={ok ? 'is-ok' : ''}>
                <DrawnCheck on={ok} />
                <span>{check.label}</span>
                <span className="sr-only">{ok ? 'done' : 'not yet'}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ComposerPreview({
  composedText = '',
  foldIndex = null,
  visualFormat = 'image',
  imageUrl,
  imageGeneration,
  carouselGeneration,
  infographicGeneration,
  revealMode = 'develop',
  carouselSlides,
  infographicData,
  isGenerating = false,
  device = 'mobile',
  onDeviceChange,
  target = 'personal',
  quality,
  hasBody = true,
}) {
  const { user } = useAuth?.() || {};
  const [internalDevice, setInternalDevice] = useState(device || 'mobile');
  const activeDevice = onDeviceChange ? device || 'mobile' : internalDevice;
  const handleDeviceChange = (v) => {
    setInternalDevice(v);
    onDeviceChange?.(v);
  };
  const [expanded, setExpanded] = useState(false);

  // Hashtags alone aren't a post yet, so keep the placeholder until there's body text or a CTA.
  const hasText = Boolean(hasBody) && composedText.trim().length > 0;
  const isTruncated = foldIndex != null;

  const author =
    target === 'company'
      ? {
          name: APP_CONFIG.companyName || 'Your company',
          headline: APP_CONFIG.companyFollowersLabel || 'Company page',
          avatar: APP_CONFIG.companyLogoUrl || null,
          isCompany: true,
        }
      : {
          name: user?.name || 'Sarah Reeves',
          headline: user?.headline || 'Growth at Typegrow | Helping you grow on LinkedIn',
          avatar:
            user?.avatarUrl ||
            AVATARS?.alex ||
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
          isCompany: false,
        };

  const cardElement = (
    <article className="cmp-li-card">
      <header className="p-3.5 flex items-start gap-3">
        <div key={target} className="flex items-start gap-3 flex-1 min-w-0">
          {author.isCompany ? (
            author.avatar ? (
              <img
                src={author.avatar}
                alt=""
                className="w-12 h-12 rounded-md object-cover shrink-0"
              />
            ) : (
              <span className="w-12 h-12 rounded-md bg-slate-900 text-white flex items-center justify-center text-lg font-semibold shrink-0">
                {author.name.charAt(0)}
              </span>
            )
          ) : (
            <img
              src={author.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          )}
          <div className="min-w-0 pt-0.5">
            <p className="text-[14px] font-semibold leading-tight truncate">{author.name}</p>
            <p className="text-[12px] text-[color:var(--text-muted)] leading-snug truncate mt-0.5">
              {author.headline}
            </p>
            <p className="flex items-center gap-1 mt-0.5 text-[12px] text-[color:var(--text-muted)]">
              Now <span aria-hidden="true">·</span> <Globe size={12} aria-hidden="true" />
            </p>
          </div>
        </div>
        <MoreHorizontal
          size={20}
          className="text-[color:var(--text-muted)] shrink-0"
          aria-hidden="true"
        />
      </header>

      <div className="px-3.5 pb-3 text-[14px] leading-[1.45] break-words">
        {isGenerating ? (
          <div className="flex flex-col gap-2 py-1" aria-hidden="true">
            {[100, 92, 96, 70].map((w, i) => (
              <span key={i} className="cmp-skel" style={{ width: `${w}%`, height: 11 }} />
            ))}
          </div>
        ) : hasText ? (
          <p key={expanded ? 'full' : 'short'} className="whitespace-pre-wrap">
            {!isTruncated && renderFormatted(composedText)}
            {isTruncated && !expanded && (
              <>
                {renderFormatted(composedText.slice(0, foldIndex).replace(/\s+$/, ''))}{' '}
                <button type="button" className="cmp-li-more" onClick={() => setExpanded(true)}>
                  …more
                </button>
              </>
            )}
            {isTruncated && expanded && (
              <>
                {renderFormatted(composedText.slice(0, foldIndex))}
                <span className="cmp-li-cut" title="LinkedIn shows “…more” here">
                  …more
                </span>
                {renderFormatted(composedText.slice(foldIndex))}
                {'\n'}
                <button
                  type="button"
                  className="cmp-li-more mt-1"
                  onClick={() => setExpanded(false)}
                >
                  Show less
                </button>
              </>
            )}
          </p>
        ) : (
          <p className="text-[color:var(--text-muted)]">Your post appears here as you write.</p>
        )}
      </div>

      <MediaPreview
        visualFormat={visualFormat}
        imageUrl={imageUrl}
        imageGeneration={imageGeneration}
        carouselGeneration={carouselGeneration}
        infographicGeneration={infographicGeneration}
        revealMode={revealMode}
        carouselSlides={carouselSlides}
        infographicData={infographicData}
      />

      {/* Ghost engagement row — mirrors LinkedIn's reaction/comment bar so the preview
          reads as a real post even before anything has been published. */}
      <div className="px-3.5 py-2 border-t border-gray-100 flex items-center gap-1.5 text-[12px] text-[#8c8c8c]">
        <span className="flex -space-x-1 shrink-0">
          <span className="size-4 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center">
            <ThumbsUp size={8} className="text-slate-400" />
          </span>
          <span className="size-4 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center">
            <Heart size={8} className="text-slate-400" />
          </span>
        </span>
        <span className="truncate">Reactions and comments will appear here once you publish</span>
      </div>

      <div
        className="px-1 py-0.5 border-t border-gray-100 flex items-stretch text-[color:var(--text-muted)]"
        aria-hidden="true"
      >
        {[
          { icon: ThumbsUp, label: 'Like' },
          { icon: MessageSquare, label: 'Comment' },
          { icon: Repeat2, label: 'Repost' },
          { icon: Send, label: 'Send' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className={`flex-1 flex items-center justify-center gap-1.5 ${
              activeDevice === 'mobile' ? 'py-2' : 'flex-col gap-1 py-2.5'
            }`}
          >
            <Icon size={activeDevice === 'mobile' ? 17 : 18} strokeWidth={1.8} />
            {activeDevice !== 'mobile' && (
              <span className="text-[12px] font-semibold">{label}</span>
            )}
          </span>
        ))}
      </div>
    </article>
  );

  return (
    <section className="cmp-card" aria-labelledby="cmp-preview-title">
      <CardHeader tone="blue" title="Preview" id="cmp-preview-title">
        <Segmented
          label="Preview device"
          options={DEVICE_OPTIONS}
          value={activeDevice}
          onChange={handleDeviceChange}
          size="sm"
          className="is-collapsible"
          inline
        />
      </CardHeader>

      <div className="cmp-stage !my-1.5 !py-3 !px-2">
        {activeDevice === 'mobile' ? (
          <PhonePreview>
            {/*
              `zoom` (unlike transform:scale) shrinks both the visual rendering AND
              the layout box, so the card's full content is scrollable inside the
              phone feed without any clipping or dead-space hacks.
              zoom 0.60 on a 320px natural card → 192px effective layout width,
              which matches the ~192px phone content area.
            */}
            <div style={{ zoom: 0.7, width: 320 }}>{cardElement}</div>
          </PhonePreview>
        ) : (
          <LaptopPreview avatarUrl={author.avatar}>
            {/*
              zoom:0.75 scales the card proportionally so it fits the 200px feed
              viewport without scrolling. zoom (unlike transform:scale) also shrinks
              the layout box, so the feed's scroll container measures the correct height.
            */}
            <div style={{ zoom: 0.9 }}>{cardElement}</div>
          </LaptopPreview>
        )}
      </div>

      {quality && (
        <QualityCheck
          checks={quality.checks}
          score={quality.score}
          hasText={Boolean(quality.hasText)}
        />
      )}
    </section>
  );
}
