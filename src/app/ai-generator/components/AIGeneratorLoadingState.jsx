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

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const postNumber = currentPostIndex + 1;

  const cardContent = (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col gap-3.5 relative overflow-hidden shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header skeleton with spinner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
          <div className="flex flex-col gap-1">
            <span className="cmp-skel" style={{ width: 120, height: 10, '--m-i': 0 }} />
            <span className="cmp-skel" style={{ width: 75, height: 8, '--m-i': 1 }} />
          </div>
        </div>

        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 px-2.5 py-1 rounded-full">
          <Loader2 size={12} className="animate-spin text-purple-600 dark:text-purple-400" />
          <span>Drafting post #{postNumber} of {totalPosts}</span>
        </span>
      </div>

      {/* Content text shimmer lines */}
      <div className="flex flex-col gap-2 py-1">
        {[94, 100, 88, 70].map((w, i) => (
          <span
            key={i}
            className="cmp-skel"
            style={{ width: `${w}%`, height: 11, '--m-i': i }}
          />
        ))}
      </div>

      {/* Developing Visual Media Canvas (from Post Composer GenTile) */}
      {visualFormat !== 'none' && (
        <div
          className="cmp-gen-tile w-full h-40 sm:h-48 rounded-xl relative overflow-hidden border border-slate-200/80 dark:border-slate-800"
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

          <span className="cmp-gen-caption">
            <Sparkles size={13} />
            <span>
              Generating {visualFormat === 'carousel' ? '5-slide document deck' : visualFormat === 'infographic' ? 'infographic metric cards' : 'image options'}…
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
            <p className="cmp-gen-title text-sm sm:text-base">
              Synthesizing {totalPosts} LinkedIn {totalPosts === 1 ? 'post' : 'posts'}
            </p>
            <span className="cmp-gen-time font-mono" aria-hidden="true">
              {formatElapsed(elapsed)}
            </span>
          </div>

          <p className="cmp-gen-step text-xs font-medium" aria-live="polite">
            <span key={postNumber} className="m-swap">
              Drafting post {postNumber} of {totalPosts}…
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
