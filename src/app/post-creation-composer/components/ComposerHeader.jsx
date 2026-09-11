'use client';

import React from 'react';

export default function ComposerHeader({ isEditMode = false }) {
  return (
    <header className="relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_28px_-12px_rgba(15,23,42,0.06)] min-h-[230px] sm:min-h-[250px] lg:min-h-[265px] flex items-center justify-between transition-all">
      {/* Background Graphic Asset */}
      <img
        src="/assets/images/post%20composer%20header.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
      />

      {/* Left Side Content: Eyebrow, 2-Line Headline & Subtitle */}
      <div className="relative z-10 flex flex-col justify-center px-7 sm:px-11 lg:px-14 py-7 sm:py-9 max-w-lg lg:max-w-xl">
        {/* Eyebrow Tagline */}
        <p className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-slate-400 uppercase mb-3 sm:mb-3.5">
          CREATE &bull; REFINE &bull; PUBLISH
        </p>

        {/* Two-Line Headline with Theme Gradient on 'with purpose' and solid black period */}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.04] text-slate-950">
          <div>Create</div>
          <div className="mt-1 flex items-baseline">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              with purpose
            </span>
            <span className="text-slate-950">.</span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-3.5 text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
          {isEditMode
            ? 'Refine draft copy and visual attachments before resubmitting for owner sign-off.'
            : 'Thoughtful posts. Greater reach. Real impact.'}
        </p>
      </div>

      {/* Word Stack nestled inside the circle contour */}
      <div className="hidden md:flex items-center absolute right-[350px] sm:right-[405px] lg:right-[470px] top-0 bottom-0 h-full select-none pointer-events-none z-10">
        <div className="flex flex-col items-start pr-3 lg:pr-4 select-none">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-slate-400 uppercase leading-[1.85]">
            IDEAS
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-slate-400 uppercase leading-[1.85]">
            PEOPLE
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-slate-400 uppercase leading-[1.85]">
            OPPORTUNITIES
          </span>
          <span className="mt-2.5 block h-[1.5px] w-6 bg-slate-700 dark:bg-slate-300" />
        </div>
      </div>
    </header>
  );
}
