'use client';

import React from 'react';

export default function EmptyDayState() {
  return (
    <div className="py-2 px-2">
      <p className="text-xs text-[color:var(--text-muted)] font-normal leading-normal">
        No post scheduled
      </p>
    </div>
  );
}
