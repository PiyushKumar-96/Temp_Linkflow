'use client';

import React from 'react';
import { X, Clock, User, Tag, ExternalLink, AlertTriangle, RotateCw, Download } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { formatSlot } from '@/app/dashboard/_components/DashboardPrimitives';

export default function PostDetailPopover({ post, onClose }) {
  const isFailed = post.status === 'failed';
  const failure = post.failureDetails || {
    errorMessage: 'Buffer API 429: Rate limit exceeded on LinkedIn profile endpoint',
    requestId: 'req_9f41b2f0a1c',
    attemptCount: 3,
  };

  const handleManualDownload = () => {
    const md = `# ${post.title}\n\nCategory: ${post.category}\nScheduled: ${post.date} ${post.time || ''}\nStatus: Manual Publish`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manual_publish_${post.id}.md`;
    a.click();
    toast.success('Downloaded publication bundle for manual dispatch');
  };

  const formattedDate = formatSlot(post.date) || post.date;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/10 fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-[color:var(--card)] rounded-[var(--radius-card)] shadow-xl w-full max-w-sm slide-up border p-5 flex flex-col gap-3.5 ${
          isFailed
            ? 'border-[color:var(--danger)]/60 bg-[color:var(--danger-tint)]/20'
            : 'border-[color:var(--border)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title row with inline close button */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-[color:var(--text)] leading-snug line-clamp-2 flex-1">
            {post.title}
          </p>
          <button
            onClick={onClose}
            className="p-1 -mr-1 -mt-1 rounded-[var(--radius-icon-btn)] hover:bg-[color:var(--chip)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {isFailed && (
          <div className="p-3 bg-[color:var(--card)] border border-[color:var(--danger)]/40 rounded-[var(--radius-input)] flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-[color:var(--danger-text)] font-bold">
              <AlertTriangle size={13} />
              <span>Publishing Failure Halted</span>
            </div>
            <p className="text-[11px] text-[color:var(--danger-text)] leading-snug">
              {failure.errorMessage}
            </p>
            <div className="flex items-center justify-between text-[10px] text-[color:var(--text-subtle)] font-mono pt-1 border-t border-[color:var(--border)] mt-0.5">
              <span>Attempts: {failure.attemptCount} of 3</span>
              <span>{failure.requestId}</span>
            </div>
          </div>
        )}

        {/* Metadata block below title */}
        <div className="flex flex-col gap-1.5 pt-0.5 text-xs text-[color:var(--text-muted)]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-[color:var(--text)]">{post.author}</span>
            <StatusBadge status={post.status} size="sm" />
          </div>

          <div>
            <span>
              {formattedDate}
              {post.time ? ` at ${post.time}` : ''}
            </span>
          </div>

          {(post.series || post.category) && (
            <div>
              <span>{post.series || post.category}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {isFailed ? (
            <>
              <Link
                to={`/approval-workflow?post=${post.id}`}
                className="px-3.5 py-2 rounded-[var(--radius-input)] bg-[color:var(--danger)] hover:bg-[color:var(--danger)]/90 text-white font-semibold text-xs flex-1 justify-center flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw size={12} />
                <span>Retry in queue</span>
              </Link>
              <button
                onClick={handleManualDownload}
                className="px-3.5 py-2 rounded-[var(--radius-input)] border border-[color:var(--border)] hover:bg-[color:var(--chip)] text-[color:var(--text)] font-semibold text-xs flex-1 justify-center flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={12} />
                <span>Export</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/post-creation-composer?id=${post.id}&mode=edit`}
                className="px-3.5 py-2 rounded-[var(--radius-input)] bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-white font-semibold text-xs flex-1 justify-center flex items-center transition-colors cursor-pointer text-center"
              >
                Edit post
              </Link>
              <Link
                to={`/approval-workflow?post=${post.id}`}
                className="px-3.5 py-2 rounded-[var(--radius-input)] border border-[color:var(--border)] hover:bg-[color:var(--chip)] text-[color:var(--text)] font-semibold text-xs flex-1 justify-center flex items-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <span>View in queue</span>
                <ExternalLink size={12} className="text-[color:var(--text-subtle)]" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
