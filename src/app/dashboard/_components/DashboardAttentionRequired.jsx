'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  RotateCw,
  Upload,
  FileText,
  MoreVertical,
  XCircle,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';
import { IconAttentionRequired } from './DashboardCustomIcons';
import { Panel, PanelHeader, PanelLink, Pill, IconButton, buttonStyles, formatSlot } from './DashboardPrimitives';

const DEMO_FAILURE = {
  id: 'failed-mock-1',
  title: '5 mistakes first-time founders make with their LinkedIn strategy',
  errorDetails: 'Buffer timed out while sending this post to LinkedIn.',
  date: '2026-09-05 09:10',
  attempts: '3 of 3',
  timeAgo: '4 hours ago',
  tags: ['retry', 'api_timeout'],
};

/**
 * failedPosts === undefined -> demo data (matches the design reference)
 * failedPosts === []        -> "all clear" state
 */
export default function DashboardAttentionRequired({ failedPosts, onRetryPost, onManualPublish }) {
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);

  const items = failedPosts === undefined ? [DEMO_FAILURE] : failedPosts;
  const failedItem = items[0];
  const extra = items.length - 1;

  const handleRetry = async () => {
    if (!failedItem) return;
    setRetrying(true);
    try {
      await onRetryPost?.(failedItem.id);
    } finally {
      setRetrying(false);
    }
  };

  const goToFailures = () => navigate('/approval-workflow?status=failed');

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={IconAttentionRequired}
        tone={items.length ? 'rose' : 'emerald'}
        title="Attention required"
        badge={items.length > 0 && <Pill tone="rose">{items.length} critical</Pill>}
        action={<PanelLink onClick={goToFailures}>View all</PanelLink>}
      />

      {!failedItem ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl bg-emerald-50/50 px-6 py-8 text-center ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-400/[0.05]">
          <CheckCircle2 size={26} className="text-emerald-500" />
          <p className="mt-2 text-[13px] font-semibold text-foreground">Publishing is running smoothly</p>
          <p className="mt-1 max-w-[260px] text-xs text-muted-foreground">
            No failed posts. Buffer and LinkedIn are responding normally.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col rounded-xl bg-rose-50/60 p-4 ring-1 ring-inset ring-rose-200/80 dark:bg-rose-400/[0.06] dark:ring-rose-400/15">
          {/* Alert title */}
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" strokeWidth={2.2} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="pt-0.5 text-[13px] font-semibold text-foreground">Pipeline dispatch failed</p>
                <div className="flex shrink-0 items-center gap-0.5">
                  <span className="text-[11px] text-muted-foreground">{failedItem.timeAgo || 'Recently'}</span>
                  <IconButton label="More options" onClick={goToFailures} className="size-6">
                    <MoreVertical size={14} />
                  </IconButton>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {items.length === 1 ? '1 post was' : `${items.length} posts were`} stopped before reaching LinkedIn.
              </p>
            </div>
          </div>

          {/* Failed post */}
          <div className="mt-3 rounded-lg bg-card p-3 ring-1 ring-inset ring-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2">
              <FileText size={14} className="shrink-0 text-muted-foreground" />
              <p className="truncate text-xs font-semibold text-foreground">{failedItem.title}</p>
            </div>
            <p className="mt-1.5 flex items-start gap-1.5 pl-[22px] text-xs text-rose-600 dark:text-rose-400">
              {failedItem.errorDetails || 'Buffer timed out while sending this post to LinkedIn.'}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/60 pl-[22px] pt-2.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                <XCircle size={12} />
                Failed
              </span>
              <span className="tabular-nums">{formatSlot(failedItem.date) || 'Unknown time'}</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <RefreshCcw size={11} />
                {failedItem.attempts || '3 of 3'}
              </span>
              <span className="flex flex-wrap gap-1">
                {(failedItem.tags || []).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-rose-100/70 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 dark:bg-rose-400/10 dark:text-rose-300"
                  >
                    #{String(t).replace(/^#/, '')}
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Fix actions */}
          <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className={`${buttonStyles.dark} h-9 w-full px-3 sm:w-auto sm:flex-1`}
            >
              <RotateCw size={14} className={retrying ? 'animate-spin motion-reduce:animate-none' : ''} />
              {retrying ? 'Retrying…' : 'Retry dispatch'}
            </button>
            <button
              type="button"
              onClick={() => onManualPublish?.(failedItem)}
              className={`${buttonStyles.outline} h-9 w-full px-3 sm:w-auto sm:flex-1`}
            >
              <Upload size={14} />
              Publish manually
            </button>
          </div>

          {extra > 0 && (
            <button
              type="button"
              onClick={goToFailures}
              className="mt-2 self-center text-[11px] font-semibold text-rose-700 hover:underline dark:text-rose-300 cursor-pointer"
            >
              +{extra} more failed {extra === 1 ? 'post' : 'posts'}
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}
