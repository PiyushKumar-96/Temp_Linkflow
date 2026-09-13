'use client';

import React from 'react';

const TABS = [
  { id: 'all', label: 'All sources' },
  { id: 'composer', label: 'Post composer' },
  { id: 'ai_generator', label: 'AI generator' },
  { id: 'bulk_upload', label: 'Bulk upload' },
];

export default function ApprovalSourceTabs({ activeSource = 'all', onSelectSource, counts = {} }) {
  return (
    <div className="flex items-center gap-2 flex-nowrap shrink-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((tab) => {
        const isActive = activeSource === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectSource && onSelectSource(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-input)] text-xs font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[color:var(--accent)] text-white border border-[color:var(--accent)]'
                : 'bg-[color:var(--card)] border border-[color:var(--border)] text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[11px] tabular-nums font-medium leading-none ${
                isActive ? 'text-white' : 'text-[color:var(--text-subtle)]'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
