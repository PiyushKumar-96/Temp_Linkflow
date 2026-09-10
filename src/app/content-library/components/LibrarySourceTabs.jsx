'use client';

import React from 'react';
import { Layers, PenTool, Sparkles, Upload } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Sources', icon: Layers },
  { id: 'composer', label: 'Post Composer', icon: PenTool },
  { id: 'ai_generator', label: 'AI Generator', icon: Sparkles },
  { id: 'bulk_upload', label: 'Bulk Upload', icon: Upload },
];

export default function LibrarySourceTabs({
  activeSource = 'all',
  onSelectSource,
  counts = {},
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
        Source:
      </span>
      {TABS.map((tab) => {
        const isActive = activeSource === tab.id;
        const count = counts[tab.id] ?? 0;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectSource(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Icon size={13} />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-bold ${
                isActive
                  ? 'bg-white/25 text-white'
                  : 'bg-muted text-foreground'
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
