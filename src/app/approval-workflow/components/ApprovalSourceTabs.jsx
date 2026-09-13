'use client';

import React from 'react';
import { Layers, PenTool, Sparkles, Upload } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Sources', icon: Layers },
  { id: 'composer', label: 'Post Composer', icon: PenTool },
  { id: 'ai_generator', label: 'AI Generator', icon: Sparkles },
  { id: 'bulk_upload', label: 'Bulk Upload', icon: Upload },
];

export default function ApprovalSourceTabs({ activeSource = 'all', onSelectSource, counts = {} }) {
  return (
    <div className="flex items-center gap-2 flex-nowrap shrink-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
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
            onClick={() => onSelectSource && onSelectSource(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[#0a66c2] text-white border border-[#0a66c2] shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Icon
              size={13}
              className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}
            />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10.5px] tabular-nums font-bold leading-none ${
                isActive
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
