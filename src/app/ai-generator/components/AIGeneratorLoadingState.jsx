'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

function formatElapsed(ms) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export default function AIGeneratorLoadingState({
  currentPostIndex = 0,
  totalPosts = 3,
  theme = 'Thought Leadership',
  visualFormat = 'image',
  topic = '',
  showHeader = true,
}) {
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Multi-stage drafting cycle for active post
  useEffect(() => {
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentPostIndex]);

  const postNumber = currentPostIndex + 1;

  const cardContent = (
    <div className="rounded-xl border border-purple-200/90 dark:border-purple-900/70 bg-white/95 dark:bg-slate-900/95 p-4 sm:p-5 flex flex-col gap-3.5 relative overflow-hidden shadow-md shadow-purple-500/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Ambient gradient top accent bar */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 animate-pulse" />

      {/* Header with active AI status */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative size-8 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Post {postNumber} of {totalPosts}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                {theme}
              </span>
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1.5 truncate">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-600" />
              </span>
              <span className="truncate">
                {stage === 0
                  ? 'Formulating hook & perspective…'
                  : stage === 1
                  ? 'Writing LinkedIn body & CTA…'
                  : `Synthesizing ${visualFormat === 'carousel' ? 'carousel slides' : visualFormat === 'infographic' ? 'infographic data' : 'visual asset'}…`}
              </span>
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/80 px-2.5 py-1 rounded-full shadow-xs">
          <Loader2 size={12} className="animate-spin text-purple-600 dark:text-purple-400" />
          <span className="font-mono text-[10px] tracking-wider uppercase">
            {stage === 0 ? 'Hook Phase' : stage === 1 ? 'Drafting' : 'Finalizing'}
          </span>
        </span>
      </div>

      {/* Dynamic streaming text simulation */}
      <div className="flex flex-col gap-2 py-1">
        <div className="flex items-center gap-2">
          <span
            className="cmp-skel rounded-md"
            style={{
              width: stage >= 0 ? '94%' : '50%',
              height: 11,
              '--m-i': 0,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="cmp-skel rounded-md"
            style={{
              width: stage >= 1 ? '100%' : '70%',
              height: 11,
              '--m-i': 1,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="cmp-skel rounded-md"
            style={{
              width: stage >= 1 ? '88%' : '40%',
              height: 11,
              '--m-i': 2,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="cmp-skel rounded-md"
            style={{
              width: stage >= 2 ? '72%' : '45%',
              height: 11,
              '--m-i': 3,
              transition: 'width 0.4s ease-out',
            }}
          />
          {/* Animated blinking typing cursor */}
          <span className="inline-block w-1.5 h-3 bg-purple-600 dark:bg-purple-400 animate-pulse rounded-xs shrink-0" />
        </div>
      </div>

      {/* Developing Visual Media Canvas (from Post Composer GenTile) */}
      {visualFormat !== 'none' && (
        <div
          className="cmp-gen-tile w-full h-44 sm:h-52 rounded-xl relative overflow-hidden border border-purple-200/60 dark:border-purple-900/60 shadow-inner"
          data-reveal="develop"
          style={{ '--i': currentPostIndex, '--noise': 0.2 }}
          aria-busy="true"
        >
          <div className="cmp-gen-field" aria-hidden="true">
            <span className="cmp-gen-blob b1" />
            <span className="cmp-gen-blob b2" />
            <span className="cmp-gen-blob b3" />
          </div>
          <span className="cmp-gen-grain" aria-hidden="true" />
          <span className="cmp-gen-sweep" aria-hidden="true" />

          {/* Perspective dot grid overlay */}
          <div
            className="absolute inset-0 z-[2] opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Live Percentage & Status Pill */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-300" />
            </span>
            <span>{stage === 0 ? 'Analyzing 35%' : stage === 1 ? 'Generating 72%' : 'Rendering 96%'}</span>
          </div>

          <span className="cmp-gen-caption">
            <Sparkles size={13} className="text-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>
              {stage === 0
                ? 'Crafting hook & thesis…'
                : stage === 1
                ? 'Composing post layout…'
                : visualFormat === 'carousel'
                ? 'Generating 5-slide PDF deck…'
                : visualFormat === 'infographic'
                ? 'Plotting metric visual charts…'
                : 'Rendering high-definition visual…'}
            </span>
          </span>
        </div>
      )}
    </div>
  );

  if (!showHeader) {
    return cardContent;
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col gap-6 shadow-xs animate-in fade-in duration-200">
      {/* Header Progress Bar matching Composer GenProgress */}
      <div className="cmp-gen-head">
        <span className="cmp-badge tone-violet cmp-gen-badge" aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="cmp-gen-title text-sm sm:text-base font-semibold">
              Synthesizing {totalPosts} LinkedIn {totalPosts === 1 ? 'post' : 'posts'}
            </p>
            <span className="cmp-gen-time font-mono text-xs" aria-hidden="true">
              {formatElapsed(elapsed)}
            </span>
          </div>

          <p className="cmp-gen-step text-xs font-medium" aria-live="polite">
            <span key={`${postNumber}-${stage}`} className="m-swap">
              Post {postNumber} of {totalPosts}: {stage === 0 ? 'Formulating hook…' : stage === 1 ? 'Drafting copy & layout…' : 'Synthesizing visual asset…'}
            </span>
          </p>

          <div className="cmp-gen-bar" style={{ '--steps': totalPosts }} aria-hidden="true">
            {Array.from({ length: totalPosts }).map((_, i) => (
              <span
                key={i}
                className={i < currentPostIndex ? 'is-done' : i === currentPostIndex ? 'is-current' : ''}
              />
            ))}
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Applying brand voice rules for <strong className="text-slate-700 dark:text-slate-300 font-medium">{theme}</strong>
            {topic ? ` on "${topic}"` : ''}.
          </p>
        </div>
      </div>

      {cardContent}
    </div>
  );
}
