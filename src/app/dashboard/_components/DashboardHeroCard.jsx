'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function DashboardHeroCard({ onOpenAgenda }) {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-border/40 min-h-[220px] h-full flex flex-col justify-between p-6 sm:p-7 text-white select-none group">
      {/* Background Image: Misty Mountain Sunrise */}
      <img
        src="/images/dashboard-hero.jpg"
        alt="Mountain Sunrise"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
      />

      {/* Subtle left gradient overlay so the headline is legible while keeping the scenic sky completely natural */}
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

      {/* Top Row: Date text on left, Quote on right (dark text on bright morning sky) */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
          MON, 09 SEP
        </span>

        <p className="text-[11px] sm:text-xs text-slate-800 font-semibold text-right leading-relaxed max-w-[140px] italic">
          &ldquo;Consistency
          <br />
          turns ideas into
          <br />
          growth.&rdquo;
        </p>
      </div>

      {/* Bottom Content: Headline, subtext, and pill button */}
      <div className="relative z-10 mt-4 sm:mt-6 flex flex-col items-start">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Let’s keep
          <br />
          things moving.
        </h2>

        <p className="text-xs sm:text-sm text-slate-200 font-normal mt-1.5">
          2 items need your attention today.
        </p>

        <button
          type="button"
          onClick={onOpenAgenda}
          className="mt-4 sm:mt-5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm py-2 px-5 rounded-full shadow-md transition-all hover:scale-105 flex items-center gap-2 cursor-pointer w-fit"
        >
          <span>View Agenda</span>
          <ArrowRight size={14} className="text-slate-900 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
