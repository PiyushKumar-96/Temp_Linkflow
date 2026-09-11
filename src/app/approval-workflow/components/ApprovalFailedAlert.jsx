'use client';

import React from 'react';
import { AlertTriangle, RotateCw, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ApprovalFailedAlert({
  post,
  onChangeBrief,
  onDownloadManual,
}) {
  return (
    <div className="rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-destructive text-white flex items-center justify-center shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-destructive">
              Publishing Pipeline Dispatch Halted
            </h4>
            <p className="text-xs text-foreground font-medium mt-0.5">
              {post.failureDetails?.errorMessage || 'Buffer API 429: LinkedIn profile quota exceeded'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-destructive/20 text-destructive font-semibold">
          {post.failureDetails?.requestId || 'req_9f41b2f'}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-destructive/20 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span>Failed: {post.failureDetails?.failedAt || 'Today'}</span>
          <span>
            Attempts: {post.failureDetails?.attemptCount || 3} of{' '}
            {post.failureDetails?.maxAttempts || 3}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onChangeBrief(post.id, 'Retry dispatch worker connection');
              toast.success('Restarted generation and dispatch pipeline');
            }}
            className="btn btn-primary text-xs py-1 px-3 bg-destructive hover:bg-destructive/90 text-white flex items-center gap-1.5"
          >
            <RotateCw size={12} />
            Retry Dispatch
          </button>
          <button
            onClick={onDownloadManual}
            className="btn btn-outline text-xs py-1 px-3 flex items-center gap-1.5"
          >
            <Download size={12} />
            Publish Manually
          </button>
        </div>
      </div>
    </div>
  );
}
