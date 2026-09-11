'use client';

import React, { useState, useEffect } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export default function ApprovalQueue({ posts = [], selectedId, onSelect }) {
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

  if (postList.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center justify-center p-8 text-center h-full min-h-[420px]">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 ring-1 ring-emerald-600/20 shadow-xs">
          <CheckCircle2 size={24} strokeWidth={2.5} />
        </div>
        <p className="text-[14px] font-bold text-slate-900 dark:text-white">Publishing is running smoothly</p>
        <p className="mt-1 max-w-[260px] text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          No posts currently match this filter. Content generation and scheduling are on track.
        </p>
      </div>
    );
  }

  const paginatedPosts = postList.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Queue Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
            Queue Posts
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums">
            {postList.length}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tabular-nums">
          Page {safePage} of {totalPages}
        </span>
      </div>

      {/* Post List (10 per page) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-slate-100 dark:divide-slate-800">
        {paginatedPosts.map((post) => {
          const isSelected = post.id === selectedId;
          const isOverdue = post.status === 'pending' && post.dueDate < '2026-09-08';
          const commentsCount = Array.isArray(post.comments)
            ? post.comments.length
            : typeof post.comments === 'number'
              ? post.comments
              : 0;

          return (
            <button
              key={post.id}
              onClick={() => onSelect(post.id)}
              className={`w-full text-left px-5 py-4 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/50 dark:bg-blue-950/30 border-l-[3.5px] border-l-[#0a66c2]'
                  : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-l-[3.5px] border-l-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <span className="text-white text-xs font-bold">{post.authorInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <StatusBadge status={post.status} size="sm" />
                    {post.source === 'composer' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shrink-0">
                        ✍️ Composer
                      </span>
                    )}
                    {post.source === 'bulk_upload' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 shrink-0">
                        📁 Bulk Upload
                      </span>
                    )}
                    {(!post.source || post.source === 'ai_generator') && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800 shrink-0">
                        🤖 AI Generator
                      </span>
                    )}
                    {isOverdue && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-1.5">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" />
                      Due {post.dueDate}
                    </span>
                    {commentsCount > 0 && (
                      <span className="text-[#0a66c2] font-medium">
                        {commentsCount} comment{commentsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination Controls Footer */}
      {postList.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(safePage - 1) * PAGE_SIZE + 1}</span>–<span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(safePage * PAGE_SIZE, postList.length)}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{postList.length}</span>
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
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="px-2 font-medium tabular-nums text-[11.5px]">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => {
                const next = Math.min(totalPages, safePage + 1);
                setCurrentPage(next);
                const firstOnPage = postList[(next - 1) * PAGE_SIZE];
                if (firstOnPage) onSelect(firstOnPage.id);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
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

