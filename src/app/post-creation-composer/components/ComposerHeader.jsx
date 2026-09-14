'use client';

import React from 'react';

export default function ComposerHeader({ isEditMode = false }) {
  return (
    <header className="flex flex-col gap-1.5 pt-1 pb-2 min-w-0">
      <h1 className="text-[36px] leading-[1.02] tracking-[-0.035em] font-bold text-[color:var(--text,#1B1917)] whitespace-nowrap">
        {isEditMode ? 'Edit draft' : 'New post'}
      </h1>

      <p className="text-sm sm:text-base text-[color:var(--text-muted)] font-normal leading-relaxed whitespace-nowrap">
        {isEditMode
          ? 'Refine draft copy and visual attachments before resubmitting.'
          : 'Draft, review, and schedule to your next open slot.'}
      </p>
    </header>
  );
}

