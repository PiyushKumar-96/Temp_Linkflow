'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  RotateCw,
  Download,
  FileText,
  MoreVertical,
  XCircle,
} from 'lucide-react';

export default function DashboardAttentionRequired({
  failedPosts = [],
  onRetryPost,
  onManualPublish,
}) {
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);

  // Use real failed post or mock post matching screenshot
  const failedItem =
    failedPosts.length > 0
      ? failedPosts[0]
      : {
          id: 'failed-mock-1',
          title: '5 mistakes first-time founders make with their LinkedIn strategy...',
          errorDetails: 'Dispatch worker timeout contacting Buffer / LinkedIn endpoint',
          date: '2026-09-05 09:10',
          attempts: '3 of 3',
          tags: ['#retry', '#api_timeout'],
        };

  const handleRetry = async () => {
    setRetrying(true);
    if (onRetryPost) {
      await onRetryPost(failedItem.id);
    }
    setRetrying(false);
  };

  const handleManual = () => {
    if (onManualPublish) {
      onManualPublish(failedItem);
    }
  };

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between gap-4 h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
            <ShieldAlert size={14} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Attention Required</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
            1 critical
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/approval-workflow?status=failed')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Red Warning Alert Box with ample padding and clean spacing */}
      <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200/90 dark:border-red-900/40 rounded-xl p-4 flex flex-col gap-3">
        {/* Warning Title Row */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <AlertTriangle size={16} className="text-red-600 shrink-0" />
            <span className="text-xs font-bold text-foreground">
              Pipeline Dispatch Failure Detected
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white tracking-wide shrink-0">
              Action Required
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 ml-auto sm:ml-0">
            <span>4 hours ago</span>
            <button
              type="button"
              onClick={() => navigate('/approval-workflow?status=failed')}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded ml-0.5 cursor-pointer"
            >
              <MoreVertical size={13} />
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          1 post encountered fatal publishing errors and was halted before dispatch.
        </p>

        {/* Nested Post Preview Card with spacious layout */}
        <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-muted-foreground shrink-0" />
            <span className="text-xs font-bold text-foreground truncate">
              {failedItem.title}
            </span>
          </div>

          <p className="text-xs text-red-600 dark:text-red-400 font-medium pl-6 leading-snug">
            {failedItem.errorDetails || 'Dispatch worker timeout contacting Buffer / LinkedIn endpoint'}
          </p>

          <div className="flex items-center justify-between gap-2 flex-wrap pl-6 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-red-600 flex items-center gap-1 font-semibold">
                <XCircle size={12} />
                Failed
              </span>
              <span>·</span>
              <span className="font-mono text-[10px]">{failedItem.date || '2026-09-05 09:10'}</span>
              <span>·</span>
              <span className="text-[10px]">Attempts: {failedItem.attempts || '3 of 3'}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {(failedItem.tags || ['#retry', '#api_timeout']).map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[9px] border border-border/50"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons with comfortable spacing and equal padding */}
      <div className="mt-auto pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="flex-1 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCw size={13} className={retrying ? 'animate-spin' : ''} />
          <span>{retrying ? 'Retrying Dispatch...' : 'Retry Dispatch'}</span>
        </button>

        <button
          type="button"
          onClick={handleManual}
          className="btn-secondary text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-foreground hover:text-primary cursor-pointer shadow-2xs"
        >
          <Download size={13} />
          <span>Publish Manually</span>
        </button>
      </div>
    </div>
  );
}
