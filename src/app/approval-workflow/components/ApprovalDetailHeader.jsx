'use client';

import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Check,
  X,
  RefreshCw,
  Sparkles,
  Download,
  Edit3,
  ShieldAlert,
  History,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { POST_STATUS, normalizeStatus, canReview } from '@/lib/post-status';
import Segmented from '@/components/ui/Segmented';

export default function ApprovalDetailHeader({
  post,
  targetSlotText,
  revisionsCount,
  isOwner,
  isApproving,
  activeTab,
  setActiveTab,
  citationsCount = 0,
  activityCount = 0,
  onDownloadManual,
  onOpenReject,
  onApprove,
  onOpenChangeBrief,
  onOpenHistory,
}) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex flex-col gap-3">
        {/* Row 1: Workflow Tags, Target Slot, and Review Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Post Meta Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={post.status} size="sm" />
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 font-medium">
              {post.series || post.category || 'General'}
            </span>
            {post.source === 'composer' && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                ✍️ Post Composer
              </span>
            )}
            {post.source === 'bulk_upload' && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                📁 Bulk Upload
              </span>
            )}
            {(!post.source || post.source === 'ai_generator') && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800">
                🤖 AI Generator
              </span>
            )}
            <span className="text-xs text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              <span>Target: <strong className="font-medium text-slate-700 dark:text-slate-300">{targetSlotText}</strong></span>
            </span>
          </div>

          {/* Actions: Utilities + Reject + Approve */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* Secondary utility actions */}
            <div className="flex items-center gap-1.5 mr-1">
              <button
                onClick={onDownloadManual}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shadow-2xs cursor-pointer"
                title="Export copy & assets"
              >
                <Download size={13} />
              </button>

              <Link to={`/post-creation-composer?id=${post.id}&mode=edit`}>
                <button
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shadow-2xs cursor-pointer"
                  title="Edit in Composer"
                >
                  <Edit3 size={13} />
                </button>
              </Link>

              <button
                onClick={onOpenChangeBrief}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0a66c2] transition-colors shadow-2xs cursor-pointer"
                title="Change Brief"
              >
                <Sparkles size={13} />
              </button>

              <button
                onClick={onOpenHistory}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shadow-2xs cursor-pointer"
                title={`View revision history (${revisionsCount})`}
              >
                <History size={13} />
              </button>
            </div>

            {/* Primary Decision Buttons */}
            {normalizeStatus(post.status) === POST_STATUS.REJECTED ? (
              <button
                onClick={onApprove}
                disabled={!isOwner || isApproving}
                className={`text-xs px-4 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                  isOwner
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                }`}
                title={`Restore post and schedule for ${targetSlotText}`}
              >
                {isApproving ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Check size={13} strokeWidth={2.5} />
                )}
                <span>Restore & Approve</span>
              </button>
            ) : (canReview(post.status) || normalizeStatus(post.status) === POST_STATUS.AWAITING_REVIEW) && (
              <>
                <button
                  onClick={onOpenReject}
                  disabled={!isOwner}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                    isOwner
                      ? 'border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                  title={!isOwner ? 'Only Account Owners can reject posts' : 'Reject post with feedback'}
                >
                  <X size={13} />
                  <span>Reject</span>
                </button>

                <div className="relative group">
                  <button
                    onClick={onApprove}
                    disabled={!isOwner || isApproving}
                    className={`text-xs px-4 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                      isOwner
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                    }`}
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
                    <div className="absolute right-0 bottom-full mb-2 w-56 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold mb-0.5">
                        <ShieldAlert size={12} />
                        <span>Owner Role Required</span>
                      </div>
                      Only Account Owners can authorize publishing to LinkedIn.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Due date / Revisions + Sub-Tabs */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Due {post.dueDate || 'Soon'}</span>
            {revisionsCount > 0 && (
              <>
                <span>·</span>
                <span>{revisionsCount} revision{revisionsCount !== 1 ? 's' : ''}</span>
              </>
            )}
          </div>

          <Segmented
            label="Review details sub-tabs"
            size="sm"
            options={[
              { value: 'review', label: 'Post Preview' },
              { value: 'research', label: `Research (${citationsCount})` },
              { value: 'history', label: `Activity (${activityCount})` },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}
