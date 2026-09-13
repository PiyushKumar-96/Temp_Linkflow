'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  RotateCw,
  Download,
  CheckCircle2,
  Clock,
  Hash,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardFailuresSection({
  failedPosts = [],
  onRetryPost,
  onManualPublish,
}) {
  const navigate = useNavigate();
  const [retryingId, setRetryingId] = useState(null);

  if (failedPosts.length === 0) {
    return (
      <div className="card p-3.5 bg-emerald-500/5 border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={13} />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Publishing Pipeline Operational
            </p>
            <p className="text-[11px] text-muted-foreground">
              All Buffer workers and LinkedIn API webhooks responding within normal SLAs (0 dispatch
              failures).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleRetry = async (post) => {
    setRetryingId(post.id);
    await onRetryPost(post.id);
    setRetryingId(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Loud Alert Container */}
      <div className="border-2 border-destructive/60 bg-destructive/10 rounded-xl p-4 shadow-sm relative overflow-hidden">
        {/* Subtle decorative alert accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 border-b border-destructive/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-destructive text-white flex items-center justify-center animate-pulse">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-destructive flex items-center gap-2">
                Pipeline Dispatch Failure Detected
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-destructive text-white rounded-full">
                  Action Required
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {failedPosts.length} post{failedPosts.length > 1 ? 's' : ''} encountered fatal
                publishing errors and halted before dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Failed items list */}
        <div className="flex flex-col gap-3">
          {failedPosts.map((post) => {
            const details = post.failureDetails || {
              errorMessage: 'Dispatch worker timeout contacting Buffer / LinkedIn endpoint',
              failedAt: post.submittedAt || 'Today',
              attemptCount: 3,
              maxAttempts: 3,
              requestId: 'req_unknown',
            };

            const isRetrying = retryingId === post.id;

            return (
              <div
                key={post.id}
                className="card p-3.5 bg-card border-destructive/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive text-white">
                      FAILED DISPATCH
                    </span>
                    <span className="text-xs font-bold text-foreground">{post.title}</span>
                  </div>

                  <p className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                    <ShieldAlert size={13} className="shrink-0" />
                    {details.errorMessage}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      Failed: {details.failedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <RotateCw size={11} />
                      Attempts: {details.attemptCount} of {details.maxAttempts || 3}
                    </span>
                    <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
                      <Hash size={10} />
                      reqId: {details.requestId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRetry(post)}
                    disabled={isRetrying}
                    className="btn btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 bg-destructive hover:bg-destructive/90 text-white"
                  >
                    <RotateCw size={12} className={isRetrying ? 'animate-spin' : ''} />
                    {isRetrying ? 'Retrying...' : 'Retry Dispatch'}
                  </button>

                  <button
                    onClick={() => onManualPublish(post)}
                    className="btn btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
                    title="Export post and mark as manual publishing"
                  >
                    <Download size={12} />
                    Publish Manually
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
