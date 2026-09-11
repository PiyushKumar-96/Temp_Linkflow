'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function EmptyDayState({ selectedDate }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {/* Same card design without artificial time */}
      <div className="group relative rounded-xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-blue-600 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
              No post scheduled
            </p>

            {/* Subtitle / status */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Unscheduled day
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>0 events</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/post-creation-composer?date=${selectedDate}`)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Plus size={13} />
            <span>Add post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
