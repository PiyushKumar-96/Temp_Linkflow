'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatSlot } from '@/app/dashboard/_components/DashboardPrimitives';

const PAGE_SIZE = 10;

function getSourceLabel(source) {
  if (source === 'composer') return 'Post composer';
  if (source === 'bulk_upload') return 'Bulk upload';
  return 'AI generator';
}

export default function ApprovalQueue({
  posts = [],
  selectedId,
  onSelect,
  isRejected = false,
  onToggleRejected,
  unreviewedCount = 0,
  rejectedCount = 0,
}) {
  const postList = Array.isArray(posts) ? posts : [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(postList.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  // Auto-sync page with selected item if navigated externally or via hotkeys
  useEffect(() => {
    if (!selectedId) return;
    const idx = postList.findIndex((p) => p.id === selectedId);
    if (idx !== -1) {
      const targetPage = Math.floor(idx / PAGE_SIZE) + 1;
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      }
    }
  }, [selectedId, postList]);

  // Reset to page 1 if totalPages shrink below current page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedPosts = postList.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="rounded-[var(--radius-card)] border border-[color:var(--border)] bg-[color:var(--card)] overflow-hidden flex flex-col h-full">
      {/* Queue Header with Toggle for Queue vs Rejected */}
      <div className="px-4 py-3 border-b border-[color:var(--border)] flex items-center justify-between bg-[color:var(--card)] gap-2 flex-wrap">
        <div className="flex items-center bg-[color:var(--chip)] p-1 rounded-full">
          <button
            type="button"
            onClick={() => onToggleRejected && onToggleRejected(false)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              !isRejected
                ? 'bg-[color:var(--card)] text-[color:var(--text)]'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
            }`}
          >
            <span>Queue</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-bold ${
                !isRejected
                  ? 'bg-[color:var(--chip)] text-[color:var(--text)]'
                  : 'text-[color:var(--text-subtle)]'
              }`}
            >
              {unreviewedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleRejected && onToggleRejected(true)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              isRejected
                ? 'bg-[color:var(--card)] text-[color:var(--danger-text)]'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--danger-text)]'
            }`}
          >
            <span>Rejected</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-bold ${
                isRejected
                  ? 'bg-[color:var(--danger-tint)] text-[color:var(--danger-text)]'
                  : 'text-[color:var(--text-subtle)]'
              }`}
            >
              {rejectedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Post List or Empty State */}
      {postList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              isRejected
                ? 'bg-[color:var(--danger-tint)] text-[color:var(--danger-text)]'
                : 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]'
            }`}
          >
            {isRejected ? (
              <XCircle size={24} strokeWidth={2} />
            ) : (
              <CheckCircle2 size={24} strokeWidth={2.5} />
            )}
          </div>
          <p className="text-[14px] font-bold text-[color:var(--text)]">
            {isRejected ? 'No rejected posts' : 'Publishing is running smoothly'}
          </p>
          <p className="mt-1 max-w-[260px] text-xs text-[color:var(--text-muted)] leading-relaxed">
            {isRejected
              ? 'There are currently no rejected posts matching this filter.'
              : 'No posts currently match this filter. Content generation and scheduling are on track.'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-[color:var(--border)]">
          {paginatedPosts.map((post) => {
            const isSelected = post.id === selectedId;
            const isOverdue = post.status === 'pending' && post.dueDate < '2026-09-08';
            const commentsCount = Array.isArray(post.comments)
              ? post.comments.length
              : typeof post.comments === 'number'
                ? post.comments
                : 0;
            const sourceText = getSourceLabel(post.source);
            const formattedDueDate = formatSlot(post.dueDate) || post.dueDate;

            return (
              <button
                key={post.id}
                onClick={() => onSelect(post.id)}
                className={`w-full text-left px-5 py-4 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-[-2px] ${
                  isSelected
                    ? 'bg-[color:var(--accent-tint)] border-l-[3px] border-l-[color:var(--accent)]'
                    : 'hover:bg-[color:var(--chip)] border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[color:var(--text)] line-clamp-2 leading-snug mb-1.5">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2.5 text-xs text-[color:var(--text-muted)] flex-wrap">
                    <span className="font-medium text-[color:var(--text)]">{post.author}</span>
                    <span className="text-[color:var(--border)]">·</span>
                    <span className="text-[11px] text-[color:var(--text-subtle)] font-medium">
                      {sourceText}
                    </span>
                    <span className="text-[color:var(--border)]">·</span>
                    <span>Due {formattedDueDate}</span>
                    {isOverdue && (
                      <span className="flex items-center gap-1 text-[color:var(--warning)] font-medium">
                        <AlertTriangle size={12} />
                        <span>Overdue</span>
                      </span>
                    )}
                    {commentsCount > 0 && (
                      <span className="text-[color:var(--text-muted)] font-medium">
                        {commentsCount} comment{commentsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination Controls Footer */}
      {postList.length > 0 && (
        <div className="px-5 py-3 border-t border-[color:var(--border)] bg-[color:var(--card)] flex items-center justify-between text-xs text-[color:var(--text-muted)]">
          <span className="tabular-nums">
            Showing{' '}
            <span className="font-semibold text-[color:var(--text)]">
              {(safePage - 1) * PAGE_SIZE + 1}
            </span>
            –
            <span className="font-semibold text-[color:var(--text)]">
              {Math.min(safePage * PAGE_SIZE, postList.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[color:var(--text)]">{postList.length}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => {
                const prev = Math.max(1, safePage - 1);
                setCurrentPage(prev);
                const firstOnPage = postList[(prev - 1) * PAGE_SIZE];
                if (firstOnPage) onSelect(firstOnPage.id);
              }}
              className="p-1.5 rounded-[var(--radius-icon-btn)] border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--text-muted)] hover:bg-[color:var(--chip)] hover:text-[color:var(--text)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => {
                const next = Math.min(totalPages, safePage + 1);
                setCurrentPage(next);
                const firstOnPage = postList[(next - 1) * PAGE_SIZE];
                if (firstOnPage) onSelect(firstOnPage.id);
              }}
              className="p-1.5 rounded-[var(--radius-icon-btn)] border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--text-muted)] hover:bg-[color:var(--chip)] hover:text-[color:var(--text)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
