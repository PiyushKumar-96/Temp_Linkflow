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
  const scheduledTimeText = post.scheduledDate || post.scheduledFor || post.dueDate || 'scheduled slot';
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
    <div className={`p-3 bg-muted/30 border border-border/80 rounded-xl flex flex-col gap-2.5 ${className}`}>
      {/* Stepper horizontal line */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-0.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isFailed && isCurrent
                      ? 'bg-rose-500 text-white'
                      : isRejected && isCurrent
                      ? 'bg-red-500 text-white'
                      : isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                      ? 'bg-[#0a66c2] text-white ring-2 ring-[#0a66c2]/30'
                      : 'bg-muted border border-border text-muted-foreground'
                  }`}
                >
                  {isFailed && isCurrent ? (
                    <AlertCircle size={11} />
                  ) : isCompleted ? (
                    <Check size={11} />
                  ) : (
                    idx + 1
                  )}
                </div>

                <span
                  className={`text-xs whitespace-nowrap ${
                    isCurrent
                      ? 'font-bold text-foreground'
                      : isCompleted
                      ? 'font-medium text-foreground/80'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {idx < PIPELINE_STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-[12px] mx-1 rounded-full ${
                    idx < currentStageIdx ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* What happens next explanation line */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card px-2.5 py-1.5 rounded-lg border border-border/60">
        <Clock size={12} className="text-primary shrink-0" />
        <span className="leading-tight text-foreground/90 font-medium">
          {nextActionLine}
        </span>
      </div>
    </div>
  );
}
