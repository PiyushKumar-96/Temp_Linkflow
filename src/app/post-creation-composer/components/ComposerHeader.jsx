'use client';

import React from 'react';

export default function ComposerHeader({ isEditMode = false }) {
  return (
    <header className="flex flex-col gap-2 pt-2 pb-1.5 w-full max-w-2xl lg:max-w-3xl">
      {/* Eyebrow Tagline */}
      <p className="text-xs sm:text-[13px] font-bold tracking-[0.26em] text-slate-400 dark:text-slate-500 uppercase">
        CREATE &bull; REFINE &bull; PUBLISH
      </p>

      {/* Headline with Rich Blue Gradient on 'with purpose' and solid period */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-[-0.035em] leading-[1.08] text-slate-950 dark:text-white">
        <span>Create </span>
        <span className="bg-gradient-to-r from-blue-700 via-[#0a66c2] to-blue-500 dark:from-blue-400 dark:via-[#388be8] dark:to-sky-300 bg-clip-text text-transparent">
          with purpose
        </span>
        <span className="text-slate-950 dark:text-white">.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
        {isEditMode
          ? 'Refine draft copy and visual attachments before resubmitting for owner sign-off.'
          : 'Thoughtful posts. Greater reach. Real impact.'}
      </p>
    </header>
  );
}

