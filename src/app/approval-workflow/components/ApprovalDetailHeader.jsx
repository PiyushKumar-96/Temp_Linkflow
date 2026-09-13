'use client';

import React from 'react';
import { Check, X, RefreshCw, ShieldAlert, Clock } from 'lucide-react';
import { POST_STATUS, normalizeStatus, canReview } from '@/lib/post-status';

export default function ApprovalDetailHeader({
  post,
  targetSlotText,
  isOwner,
  isApproving,
  onOpenReject,
  onApprove,
}) {
  const sourceLabel =
    post.source === 'composer'
      ? 'Post composer'
      : post.source === 'bulk_upload'
        ? 'Bulk upload'
        : 'AI generator';

  return (
    <div className="px-6 py-4 border-b border-[color:var(--border)] bg-[color:var(--card)]">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Post Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[color:var(--text-subtle)] font-medium">
            {sourceLabel}
          </span>
          <span className="text-xs text-[color:var(--border)] hidden sm:inline">·</span>
          <span className="text-xs text-[color:var(--text-muted)]">
            Target:{' '}
            <strong className="font-medium text-[color:var(--text)]">{targetSlotText}</strong>
          </span>
        </div>

        {/* Actions: Primary Decision Buttons (Reject + Approve) */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {normalizeStatus(post.status) === POST_STATUS.REJECTED ? (
            <button
              onClick={onApprove}
              disabled={!isOwner || isApproving}
              className="text-xs px-4 py-1.5 rounded-[var(--radius-input)] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-white disabled:bg-[color:var(--chip)] disabled:text-[color:var(--text-subtle)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-100"
              title={`Restore post and schedule for ${targetSlotText}`}
            >
              {isApproving ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <Check size={13} strokeWidth={2.5} />
              )}
              <span>Restore & Approve</span>
            </button>
          ) : (
            (canReview(post.status) ||
              normalizeStatus(post.status) === POST_STATUS.AWAITING_REVIEW) && (
              <>
                <button
                  onClick={onOpenReject}
                  disabled={!isOwner}
                  className="text-xs px-3.5 py-1.5 rounded-[var(--radius-input)] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[color:var(--border)] text-[color:var(--danger-text)] hover:bg-[color:var(--danger-tint)] disabled:bg-[color:var(--chip)] disabled:text-[color:var(--text-subtle)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-100"
                  title={
                    !isOwner ? 'Only Account Owners can reject posts' : 'Reject post with feedback'
                  }
                >
                  <X size={13} />
                  <span>Reject</span>
                </button>

                <div className="relative group">
                  <button
                    onClick={onApprove}
                    disabled={!isOwner || isApproving}
                    className="text-xs px-4 py-1.5 rounded-[var(--radius-input)] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-white disabled:bg-[color:var(--chip)] disabled:text-[color:var(--text-subtle)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-100"
                    title={`Approve post and schedule for ${targetSlotText}`}
                  >
                    {isApproving ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} strokeWidth={2.5} />
                    )}
                    <span>Approve & Schedule</span>
                  </button>

                  {!isOwner && (
                    <div className="absolute right-0 bottom-full mb-2 w-56 p-2 bg-[color:var(--text)] text-white text-[11px] rounded-[var(--radius-input)] shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      <div className="flex items-center gap-1 text-[color:var(--warning)] font-semibold mb-0.5">
                        <ShieldAlert size={12} />
                        <span>Owner Role Required</span>
                      </div>
                      Only Account Owners can authorize publishing to LinkedIn.
                    </div>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
