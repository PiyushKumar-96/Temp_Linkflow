'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';

/**
 * Compact Attention Required Card:
 * Mint green tint card (#E6F4EC), about 120px tall, with green check circle,
 * "Publishing is running smoothly" in bold ink, "No failed posts" muted,
 * and "View all" as circular arrow button.
 */
export default function DashboardAttentionRequired({ failedPosts, onRetryPost, onManualPublish }) {
  const navigate = useNavigate();

  const items = failedPosts === undefined ? [] : failedPosts;
  const hasFailures = items.length > 0;
  const goToFailures = () => navigate('/approval-workflow?status=failed');

  if (hasFailures) {
    const failedItem = items[0];
    return (
      <div className="flex min-h-[120px] flex-col justify-between rounded-[24px] bg-[#FDECEC] border border-[#D64545]/20 p-5 text-[#1B1B1F] shadow-[0_1px_3px_rgba(27,27,31,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-[#D64545] text-white font-bold text-xs">
              !
            </span>
            <div>
              <p className="text-xs font-bold text-[#1B1B1F]">1 failed dispatch</p>
              <p className="text-[11px] text-[#D64545]">{failedItem.errorDetails || 'Action needed'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={goToFailures}
            aria-label="View all failed posts"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#1B1B1F] transition-all hover:bg-[#0A66C2] hover:text-white active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="truncate text-[#6B6B70] text-[11px]">{failedItem.title}</span>
          <button
            type="button"
            onClick={goToFailures}
            className="font-semibold text-[#D64545] hover:underline shrink-0 text-xs cursor-pointer ml-2"
          >
            Resolve
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[120px] flex-col justify-between rounded-[24px] bg-[#E6F4EC] border border-[#0F8A5F]/20 p-5 text-[#1B1B1F] shadow-[0_1px_3px_rgba(27,27,31,0.04)]">
      {/* Top row: Green check circle + View all circular arrow button */}
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-9 place-items-center rounded-full bg-white text-[#0F8A5F] shadow-xs">
          <CheckCircle2 size={20} strokeWidth={2.4} />
        </div>

        <button
          type="button"
          onClick={goToFailures}
          aria-label="View all"
          title="View all"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#1B1B1F] transition-all hover:bg-[#0A66C2] hover:text-white active:scale-95 cursor-pointer shadow-xs"
        >
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </button>
      </div>

      {/* Bottom text: bold title in ink + muted subtext */}
      <div className="mt-2">
        <h4 className="text-sm font-bold text-[#1B1B1F]">
          Publishing is running smoothly
        </h4>
        <p className="mt-0.5 text-xs text-[#0F8A5F]">
          No failed posts
        </p>
      </div>
    </div>
  );
}
