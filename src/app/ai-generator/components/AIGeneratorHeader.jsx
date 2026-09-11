'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIGeneratorHeader() {
  return (
    <header className="relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_28px_-12px_rgba(15,23,42,0.06)] min-h-[230px] sm:min-h-[250px] lg:min-h-[265px] flex items-center justify-between transition-all">
      {/* Background Graphic Asset */}
      <img
        src="/assets/images/2c0ca9f9-f505-40d4-b558-7e2a2a7a5110.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
      />

      {/* Left Side Content: Exact same padding, scale and layout as ComposerHeader */}
      <div className="relative z-10 flex flex-col justify-center px-7 sm:px-11 lg:px-14 py-7 sm:py-9 max-w-lg lg:max-w-xl">
        {/* Top Eyebrow Badge with Sparkle */}
        <div className="flex items-center gap-2 mb-3 sm:mb-3.5">
          <span className="grid size-6 place-items-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Sparkles size={13} />
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            AI POST GENERATOR
          </span>
        </div>

        {/* Two-Line Headline matching ComposerHeader scale */}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.04] text-slate-950 dark:text-white">
          <div>Turn ideas into</div>
          <div className="mt-1 flex items-baseline">
            <span className="text-[#0a66c2] dark:text-[#388be8]">LinkedIn</span>
            <span className="ml-2.5 text-slate-950 dark:text-white">posts.</span>
          </div>
        </h1>

        {/* Subtitle matching ComposerHeader */}
        <p className="mt-3 sm:mt-3.5 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          Generate engaging content, visuals, and ready-to-publish posts in seconds.
        </p>
      </div>
    </header>
  );
}
