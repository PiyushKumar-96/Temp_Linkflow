'use client';

import React from 'react';

export default function ComposerHeader({ isEditMode = false }) {
  return (
    <header className="relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_28px_-12px_rgba(15,23,42,0.06)] min-h-[230px] sm:min-h-[250px] lg:min-h-[265px] flex items-center justify-between transition-all">
      {/* 1. Ambient Background Shapes matching Image 2 */}
      {/* Top periwinkle/lavender oval dipping from the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-[340px] sm:right-[380px] lg:right-[430px] w-24 h-32 rounded-full bg-indigo-200/65 dark:bg-indigo-600/25 transform -rotate-12 blur-[0.5px]"
      />
      {/* Large soft circular halo contour behind the word stack and apex */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[100px] sm:right-[120px] lg:right-[140px] w-[340px] sm:w-[400px] lg:w-[440px] h-[340px] sm:h-[400px] lg:h-[440px] rounded-full bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-transparent dark:from-indigo-950/25 dark:via-slate-900/30 dark:to-transparent border border-indigo-100/60 dark:border-indigo-900/30"
      />

      {/* 2. Left Side Content: Eyebrow, 2-Line Headline & Subtitle (Breadcrumb removed) */}
      <div className="relative z-10 flex flex-col justify-center px-7 sm:px-11 lg:px-14 py-7 sm:py-9 max-w-lg lg:max-w-xl">
        {/* Eyebrow Tagline */}
        <p className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-slate-400 dark:text-slate-500 uppercase mb-3 sm:mb-3.5">
          CREATE &bull; REFINE &bull; PUBLISH
        </p>

        {/* Two-Line Headline with Theme Gradient on 'with purpose' and solid black period */}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.04] text-slate-950 dark:text-white">
          <div>Create</div>
          <div className="mt-1 flex items-baseline">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-300 bg-clip-text text-transparent">
              with purpose
            </span>
            <span className="text-slate-950 dark:text-white">.</span>
          </div>
        </h1>

        {/* Subtitle matching Image 2 */}
        <p className="mt-3 sm:mt-3.5 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          {isEditMode
            ? 'Refine draft copy and visual attachments before resubmitting for owner sign-off.'
            : 'Thoughtful posts. Greater reach. Real impact.'}
        </p>
      </div>

      {/* 3. Right Side Composite: Word Stack + Architectural Cantilever with Guaranteed Gap */}
      <div className="hidden md:flex items-center absolute right-0 top-0 bottom-0 h-full select-none pointer-events-none">
        {/* Word Stack nestled neatly inside the circle and before the cantilever apex */}
        <div className="relative z-10 flex flex-col items-start pr-3 lg:pr-4 select-none">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-slate-400 dark:text-slate-400 uppercase leading-[1.85]">
            IDEAS
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-slate-400 dark:text-slate-400 uppercase leading-[1.85]">
            PEOPLE
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-slate-400 dark:text-slate-400 uppercase leading-[1.85]">
            OPPORTUNITIES
          </span>
          <span className="mt-2.5 block h-[1.5px] w-6 bg-slate-700 dark:bg-slate-300" />
        </div>


        {/* Architectural Cantilever Structure matching Image 2 */}
        <div className="relative h-full w-[300px] sm:w-[350px] lg:w-[400px] xl:w-[430px] overflow-hidden">
          <svg
            viewBox="0 0 380 280"
            preserveAspectRatio="none"
            className="h-full w-full object-cover object-right"
            aria-hidden="true"
          >
            <defs>
              {/* Pure Cantilever Chevron Clip matching Image 2 */}
              <clipPath id="chevronCantileverClip">
                <polygon points="230,0 35,140 230,280 380,280 380,0" />
              </clipPath>
            </defs>

            {/* Clipped Architectural Structure - Pure Building Image */}
            <g clipPath="url(#chevronCantileverClip)">
              {/* Base Tone */}
              <rect width="380" height="280" fill="#0b1120" />

              {/* Full Skyscraper Photo Covering Entire Upper & Lower Chevron */}
              <image
                href="/images/composer-architecture.jpg"
                x="-15"
                y="-25"
                width="420"
                height="330"
                preserveAspectRatio="xMidYMid slice"
                opacity="1"
              />
            </g>


            {/* Clean Razor-Sharp Symmetrical Chevron Highlights matching Image 2 */}
            <line
              x1="230"
              y1="0"
              x2="35"
              y2="140"
              stroke="#cbd5e1"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <line
              x1="35"
              y1="140"
              x2="230"
              y2="280"
              stroke="#ffffff"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

      </div>
    </header>
  );
}


