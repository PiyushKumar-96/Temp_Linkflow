'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function EmptyDayState({ selectedDate }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {/* Same card design without artificial time */}
      <div className="group relative rounded-xl p-4 bg-[color:var(--card)] border border-[color:var(--border)] border-l-4 border-l-[color:var(--brand)] shadow-sm transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-base sm:text-lg font-bold text-[color:var(--text)]">
              No post scheduled
            </p>

            {/* Subtitle / status */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-[color:var(--text-muted)] font-medium">
                Unscheduled day
              </span>
              <span className="text-[color:var(--border)]">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[color:var(--chip)] text-[color:var(--text-muted)] border border-[color:var(--border)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--text-subtle)]" />
                <span>0 events</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/post-creation-composer?date=${selectedDate}`)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand-hover)] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <Plus size={13} />
            <span>Add post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
