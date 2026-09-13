'use client';

// Drop-in replacement for your existing ComposerPreview component.
// Same props / imports as the original — paste over your project file.
// Uses arbitrary-value Tailwind classes (e.g. bg-[#0a66c2]) as the original
// file did, so it relies on your project's own Tailwind build to render;
// it isn't meant to run standalone outside your app.

import React, { useState } from 'react';
import {
  Bell,
  Briefcase,
  ChevronDown,
  Eye,
  Globe,
  Heart,
  Home,
  Lock,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  Repeat2,
  Search,
  Send,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Users,
  Wifi,
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

const DEVICE_OPTIONS = [
  { value: 'desktop', label: 'Web', icon: Monitor },
  { value: 'mobile', label: 'Phone', icon: Smartphone },
];

// Icons for the LinkedIn desktop top nav bar.
const DESKTOP_NAV_ITEMS = [
  { icon: Home, active: true },
  { icon: Users },
  { icon: Briefcase },
  { icon: MessageSquare },
  { icon: Bell },
];

function PhoneDeviceFrame({ children }) {
  // 220px wide × ~440px tall = ~2:1 iPhone aspect ratio.
  // Dynamic Island is absolutely centred in the status bar — not in a flex row.
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: 282,
        maxWidth: '100%',
      }}
    >
      {/* Outer titanium rim */}
      <div
        style={{
          borderRadius: 44,
          padding: 3,
          background: 'linear-gradient(150deg, #e4e4e7 0%, #a1a1aa 50%, #52525b 100%)',
          boxShadow:
            '0 0 0 1px #27272a,' +
            '0 20px 48px -10px rgba(0,0,0,0.40),' +
            'inset 0 1px 0 rgba(255,255,255,0.28)',
        }}
      >
        {/* Inner black bezel */}
        <div style={{ borderRadius: 41, background: '#080808', padding: 5 }}>
          {/* Screen — 395px gives total device ~430px = proper 2:1 ratio at 220px wide */}
          <div
            style={{
              borderRadius: 36,
              height: 395,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: '#f4f2ee',
            }}
          >
            {/* ── Status bar: time left, island ABSOLUTE centre, icons right ── */}
            <div
              style={{
                flexShrink: 0,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px 5px',
                background: '#ffffff',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: -0.3, zIndex: 1 }}>
                9:41
              </span>

              {/* Dynamic Island — perfectly centred via absolute */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 76,
                  height: 20,
                  borderRadius: 12,
                  background: '#000',
                }}
              />

              {/* Status icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3.5, zIndex: 1 }}>
                <svg style={{ height: 8, width: 11 }} viewBox="0 0 17 12" fill="currentColor">
                  <rect x="0" y="9" width="2.5" height="3" rx="0.6" />
                  <rect x="4.5" y="6" width="2.5" height="6" rx="0.6" />
                  <rect x="9" y="3" width="2.5" height="9" rx="0.6" />
                  <rect x="13.5" y="0" width="2.5" height="12" rx="0.6" />
                </svg>
                <Wifi size={9} strokeWidth={2.5} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 15,
                      height: 8,
                      border: '1px solid currentColor',
                      borderRadius: 2,
                      padding: 1,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        background: 'currentColor',
                        borderRadius: 1,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 1.5,
                      height: 4,
                      background: 'currentColor',
                      borderRadius: '0 1px 1px 0',
                      marginLeft: 1,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── LinkedIn mobile header ── */}
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                background: '#ffffff',
                borderBottom: '1px solid #e9e9e9',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: '#0a66c2',
                  color: '#fff',
                  fontSize: 9.5,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '-0.5px',
                  flexShrink: 0,
                }}
              >
                in
              </div>
              <div
                style={{
                  flex: 1,
                  height: 24,
                  background: '#eef3f8',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '0 8px',
                  color: '#8c8c8c',
                  fontSize: 10,
                }}
              >
                <Search size={9.5} style={{ flexShrink: 0 }} />
                <span>Search LinkedIn</span>
              </div>
            </div>

            {/* ── Feed ── (scrollbar hidden) */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '5px 5px 0',
                background: '#f4f2ee',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {children}
            </div>

            {/* ── Home indicator ── */}
            <div
              style={{
                flexShrink: 0,
                padding: '5px 0 7px',
                background: '#f4f2ee',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.6)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaptopDeviceFrame({ children, avatarUrl }) {
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: 480,
        maxWidth: '100%',
      }}
    >
      {/* ── MacBook Space Black lid casing ── */}
      <div
        style={{
          background: 'linear-gradient(175deg, #2a2a2a 0%, #1a1a1a 55%, #111 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '6px 8px 0 8px',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.08),' +
            '0 -1px 0 rgba(0,0,0,0.5),' +
            '0 22px 52px -14px rgba(0,0,0,0.55)',
        }}
      >
        {/* Camera */}
        <div
          style={{
            height: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 3,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 35%, #3a3a3a, #1a1a1a)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {/* Screen inside lid — black thin bezel */}
        <div
          style={{
            borderRadius: '7px 7px 0 0',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.5)',
            background: '#000',
          }}
        >
          {/* LinkedIn nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 38,
              padding: '0 10px',
              background: '#fff',
              borderBottom: '1px solid #e9e9e9',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: '#0a66c2',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '-0.5px',
                }}
              >
                in
              </div>
              <div
                style={{
                  width: 100,
                  height: 24,
                  background: '#f3f2ef',
                  borderRadius: 4,
                  padding: '0 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#8c8c8c',
                  fontSize: 10.5,
                }}
              >
                <Search size={10} style={{ flexShrink: 0 }} />
                <span>Search</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {DESKTOP_NAV_ITEMS.map(({ icon: Icon, active }, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    color: active ? '#191919' : 'var(--text-subtle)',
                  }}
                >
                  <Icon size={14} strokeWidth={active ? 2.2 : 1.7} />
                  <span
                    style={{
                      height: 2,
                      width: 12,
                      borderRadius: 1,
                      background: active ? '#191919' : 'transparent',
                    }}
                  />
                </div>
              ))}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{ width: 20, height: 20, borderRadius: '50%', background: '#e2e8f0' }}
                />
              )}
            </div>
          </div>

          {/* Feed — height tuned so the full laptop device fits the sticky column */}
          <div
            style={{
              height: 337,
              overflowY: 'auto',
              overflowX: 'hidden',
              background: '#f3f2ef',
              padding: '10px 12px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div style={{ maxWidth: 440, margin: '0 auto' }}>{children}</div>
          </div>
        </div>
      </div>

      {/* Hinge */}
      <div style={{ height: 2, background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)' }} />

      {/* Keyboard base — wider than lid, black */}
      <div
        style={{
          marginLeft: '-3%',
          width: '106%',
          height: 13,
          background: 'linear-gradient(180deg, #222 0%, #141414 100%)',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 8px 24px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 2,
        }}
      >
        <div
          style={{
            width: 36,
            height: 5,
            background: '#2a2a2a',
            borderRadius: '0 0 3px 3px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    </div>
  );
}

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
  device = 'desktop',
  onDeviceChange,
  target = 'personal',
  quality,
  hasBody = true,
}) {
  const { user } = useAuth?.() || {};
  const [internalDevice, setInternalDevice] = useState(device || 'desktop');
  const activeDevice = onDeviceChange ? device || 'desktop' : internalDevice;
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

      <div className="cmp-stage !my-1.5 !py-2 !px-2">
        {activeDevice === 'mobile' ? (
          <PhoneDeviceFrame>
            {/*
              `zoom` (unlike transform:scale) shrinks both the visual rendering AND
              the layout box, so the card's full content is scrollable inside the
              phone feed without any clipping or dead-space hacks.
              zoom 0.60 on a 320px natural card → 192px effective layout width,
              which matches the ~192px phone content area.
            */}
            <div style={{ zoom: 0.8, width: 320 }}>{cardElement}</div>
          </PhoneDeviceFrame>
        ) : (
          <LaptopDeviceFrame avatarUrl={author.avatar}>
            {/*
              zoom:0.75 scales the card proportionally so it fits the 200px feed
              viewport without scrolling. zoom (unlike transform:scale) also shrinks
              the layout box, so the feed's scroll container measures the correct height.
            */}
            <div style={{ zoom: 0.9 }}>{cardElement}</div>
          </LaptopDeviceFrame>
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
