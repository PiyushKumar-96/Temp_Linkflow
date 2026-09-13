'use client';

import React from 'react';
import { Check, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { normalizeStatus, POST_STATUS } from '@/lib/post-status';

const PIPELINE_STAGES = [
  { id: 'planned', label: 'Planned' },
  { id: 'generating', label: 'Generating' },
  { id: 'ai_review', label: 'AI Review' },
  { id: 'review', label: 'Your Review' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
];

/**
 * Maps raw status to active pipeline index (0-5)
 */
function getStageIndex(status) {
  const canonical = normalizeStatus(status);
  switch (canonical) {
    case POST_STATUS.PLANNED:
      return 0;
    case POST_STATUS.GENERATING:
      return 1;
    case POST_STATUS.AUTO_REVIEW:
      return 2;
    case POST_STATUS.AWAITING_REVIEW:
    case POST_STATUS.NEEDS_REVISION:
      return 3;
    case POST_STATUS.APPROVED:
    case POST_STATUS.SCHEDULED:
      return 4;
    case POST_STATUS.PUBLISHED:
    case POST_STATUS.MANUAL:
      return 5;
    case POST_STATUS.FAILED:
    case POST_STATUS.REJECTED:
      return 3; // stopped at review / dispatch
    default:
      return 0;
  }
}

/**
 * Formulates the single actionable "what happens next" line
 */
function getWhatHappensNext(status, post = {}) {
  const canonical = normalizeStatus(status);
  const scheduledTimeText =
    post.scheduledDate || post.scheduledFor || post.dueDate || 'scheduled slot';
  const timeText = post.scheduledTime ? ` at ${post.scheduledTime}` : '';

  switch (canonical) {
    case POST_STATUS.PLANNED:
      return 'Next: Start AI drafting or write copy in Post Composer.';
    case POST_STATUS.GENERATING:
      return 'Next: AI is synthesizing copy & candidate visuals. Automated quality audit follows.';
    case POST_STATUS.AUTO_REVIEW:
      return 'Next: Running viral hook scoring and compliance check before team review.';
    case POST_STATUS.AWAITING_REVIEW:
      return `Next: Owner approval will lock this post for ${scheduledTimeText}${timeText} via Buffer.`;
    case POST_STATUS.NEEDS_REVISION:
      return 'Next: Author refines copy in Composer or updates the brief to regenerate.';
    case POST_STATUS.APPROVED:
      return `Next: Approved for publication. Buffer worker will dispatch on ${scheduledTimeText}${timeText}.`;
    case POST_STATUS.SCHEDULED:
      return `Next: Post is active in queue. Will publish to LinkedIn on ${scheduledTimeText}${timeText}.`;
    case POST_STATUS.PUBLISHED:
      return 'Complete: Post is live on LinkedIn. Performance metrics tracking in Analytics.';
    case POST_STATUS.MANUAL:
      return 'Complete: Post was exported for manual publishing to LinkedIn.';
    case POST_STATUS.FAILED:
      return 'Attention: Buffer dispatch encountered an API quota or token error. Verify connection and retry.';
    case POST_STATUS.REJECTED:
      return 'Declined: Post was rejected by the owner. Author can edit copy to resubmit or archive.';
    default:
      return 'Next: Ready for review and scheduling.';
  }
}

export default function PipelineStageStepper({
  status = 'planned',
  post = {},
  compact = false,
  className = '',
}) {
  const canonical = normalizeStatus(status);
  const currentStageIdx = getStageIndex(canonical);
  const isFailed = canonical === POST_STATUS.FAILED;
  const isRejected = canonical === POST_STATUS.REJECTED;
  const nextActionLine = getWhatHappensNext(canonical, post);

  return (
    <div
      className={`p-3 sm:p-3.5 bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800 rounded-xl flex flex-col gap-3 ${className}`}
    >
      {/* Stepper horizontal line */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all shrink-0 ${
                    isFailed && isCurrent
                      ? 'bg-rose-600 text-white ring-4 ring-rose-500/20'
                      : isRejected && isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-500/20'
                        : isCompleted
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : isCurrent
                            ? 'bg-[#0a66c2] text-white ring-4 ring-[#0a66c2]/20 font-bold shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold'
                  }`}
                >
                  {isFailed && isCurrent ? (
                    <AlertCircle size={13} strokeWidth={2.5} />
                  ) : isCompleted ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    idx + 1
                  )}
                </div>

                <span
                  className={`text-[12.5px] whitespace-nowrap tracking-tight transition-colors ${
                    isCurrent
                      ? 'font-semibold text-slate-950 dark:text-white'
                      : isCompleted
                        ? 'font-medium text-slate-700 dark:text-slate-300'
                        : 'font-normal text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {idx < PIPELINE_STAGES.length - 1 && (
                <div
                  className={`h-[2px] flex-1 min-w-[14px] max-w-[48px] mx-1.5 rounded-full transition-colors ${
                    idx < currentStageIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* What happens next explanation line */}
      <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 shadow-2xs">
        <Clock size={13} className="text-[#0a66c2] shrink-0" />
        <span className="leading-tight text-slate-700 dark:text-slate-200 font-medium">
          {nextActionLine}
        </span>
      </div>
    </div>
  );
}
