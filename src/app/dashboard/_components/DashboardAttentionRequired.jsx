'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';

/**
 * Compact Attention Required Card:
 * Mint green tint card (var(--success-tint)), about 120px tall, with green check circle,
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
      <div className="flex min-h-[120px] flex-col justify-between rounded-[24px] bg-[color:var(--danger-tint)] border border-[color:color-mix(in_srgb,var(--danger)_20%,transparent)] p-5 text-[color:var(--text)] shadow-[0_1px_3px_rgba(27,27,31,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-[color:var(--danger)] text-white font-bold text-xs">
              !
            </span>
            <div>
              <p className="text-xs font-bold text-[color:var(--text)]">1 failed dispatch</p>
              <p className="text-[11px] text-[color:var(--danger-text)]">
                {failedItem.errorDetails || 'Action needed'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={goToFailures}
            aria-label="View all failed posts"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[color:var(--text)] transition-all hover:bg-[color:var(--brand)] hover:text-white active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="truncate text-[color:var(--text-muted)] text-[11px]">
            {failedItem.title}
          </span>
          <button
            type="button"
            onClick={goToFailures}
            className="font-semibold text-[color:var(--danger-text)] hover:underline shrink-0 text-xs cursor-pointer ml-2"
          >
            Resolve
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[120px] flex-col justify-between rounded-[24px] bg-[color:var(--success-tint)] border border-[color:color-mix(in_srgb,var(--success)_20%,transparent)] p-5 text-[color:var(--text)] shadow-[0_1px_3px_rgba(27,27,31,0.04)]">
      {/* Top row: Green check circle + View all circular arrow button */}
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-9 place-items-center rounded-full bg-white text-[color:var(--success-text)] shadow-xs">
          <CheckCircle2 size={20} strokeWidth={2.4} />
        </div>

        <button
          type="button"
          onClick={goToFailures}
          aria-label="View all"
          title="View all"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[color:var(--text)] transition-all hover:bg-[color:var(--brand)] hover:text-white active:scale-95 cursor-pointer shadow-xs"
        >
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </button>
      </div>

      {/* Bottom text: bold title in ink + muted subtext */}
      <div className="mt-2">
        <h4 className="text-sm font-bold text-[color:var(--text)]">
          Publishing is running smoothly
        </h4>
        <p className="mt-0.5 text-xs text-[color:var(--success-text)]">No failed posts</p>
      </div>
    </div>
  );
}
