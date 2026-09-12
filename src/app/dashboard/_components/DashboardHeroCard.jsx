'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { formatDayLabel } from './DashboardPrimitives';
import HeroScene from './HeroScene';

export default function DashboardHeroCard({
  onOpenAgenda,
  attentionCount = 2,
  quote = 'Consistency turns ideas into growth.',
  scenePhase, // optional: 'dawn' | 'day' | 'dusk' | 'night' — omit to follow the clock
}) {
  const today = formatDayLabel(new Date(), { year: true });

  return (
    <section className="relative isolate flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#242B38] p-6 text-white shadow-[0_1px_3px_rgba(27,27,31,0.06)]">
      <HeroScene phase={scenePhase} />

      {/* Top row: translucent date pill + quote */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-white/18 px-3 py-1 text-xs font-semibold tracking-tight text-white backdrop-blur-xs">
          {today}
        </span>
        {quote && (
          <p className="hidden max-w-[240px] text-right text-xs italic leading-relaxed text-white/80 sm:block">
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>

      {/* Middle: numeral, heading, sub-line */}
      <div className="relative z-10 my-auto flex flex-col py-2">
        <span className="text-6xl font-semibold leading-none tracking-tight tabular-nums text-white sm:text-[72px]">
          {attentionCount}
        </span>
        <h2 className="mt-2 text-xl font-semibold leading-tight text-white">
          Let&apos;s keep things moving.
        </h2>
        <p className="mt-1 text-xs text-white/85 sm:text-sm">
          {attentionCount === 0
            ? 'Nothing needs your attention today.'
            : `${attentionCount} item${attentionCount === 1 ? '' : 's'} need${attentionCount === 1 ? 's' : ''} your attention today.`}
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 pt-2">
        <button
          type="button"
          onClick={onOpenAgenda}
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#1B1B1F] transition-all hover:scale-[1.02] hover:bg-white/95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <span>View agenda</span>
          <span className="grid size-5 place-items-center rounded-full bg-[#1B1B1F] text-white">
            <ArrowUpRight size={12} strokeWidth={2.4} />
          </span>
        </button>
      </div>
    </section>
  );
}
