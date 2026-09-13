'use client';

import React from 'react';

const OPTIONS = [
  { id: 'all', label: 'All sources' },
  { id: 'composer', label: 'Composer' },
  { id: 'ai_generator', label: 'AI generator' },
  { id: 'bulk_upload', label: 'Bulk upload' },
];

export default function LibrarySourceTabs({ activeSource = 'all', onSelectSource, counts = {} }) {
  return (
    <select
      className="lib-select"
      value={activeSource}
      onChange={(e) => onSelectSource && onSelectSource(e.target.value)}
      aria-label="Filter by source"
    >
      {OPTIONS.map((opt) => {
        const count = counts[opt.id] ?? 0;
        return (
          <option key={opt.id} value={opt.id}>
            {opt.label} ({count})
          </option>
        );
      })}
    </select>
  );
}
