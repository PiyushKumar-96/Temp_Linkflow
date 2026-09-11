'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckSquare, RotateCcw, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';
import ApprovalQueue from './ApprovalQueue';
import ApprovalDetail from './ApprovalDetail';
import ApprovalSourceTabs from './ApprovalSourceTabs';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import {
  useApprovalPosts,
  useApprovePost,
  useRejectPost,
  useChangeBriefPost,
  useAddComment,
} from '../_api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { POST_STATUS, normalizeStatus } from '@/lib/post-status';

export default function ApprovalShell() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isOwner, user } = useAuth();

  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // TanStack Query & Mutations
  const { data: posts = [], isLoading, isError, error, refetch } = useApprovalPosts();
  const approveMutation = useApprovePost();
  const rejectMutation = useRejectPost();
  const changeBriefMutation = useChangeBriefPost();
  const addCommentMutation = useAddComment();

  const postList = useMemo(() => (Array.isArray(posts) ? posts : []), [posts]);

  // Unreviewed queue: exclude approved, scheduled, published, AND rejected
  const unreviewedPosts = useMemo(() => {
    return postList.filter((p) => {
      const canonical = normalizeStatus(p.status);
      return (
        canonical !== POST_STATUS.APPROVED &&
        canonical !== POST_STATUS.SCHEDULED &&
        canonical !== POST_STATUS.PUBLISHED &&
        canonical !== POST_STATUS.REJECTED
      );
    });
  }, [postList]);

  // Rejected posts archive
  const rejectedPosts = useMemo(() => {
    return postList.filter((p) => normalizeStatus(p.status) === POST_STATUS.REJECTED);
  }, [postList]);

  // URL state synchronization
  const viewMode = searchParams.get('view') || 'unreviewed';
  const isRejectedView = viewMode === 'rejected';

  const activeQueuePosts = isRejectedView ? rejectedPosts : unreviewedPosts;
  const sourceFilter = searchParams.get('source') || 'all';
  const selectedParamId = searchParams.get('post');

  const sourceCounts = useMemo(() => {
    return {
      all: activeQueuePosts.length,
      composer: activeQueuePosts.filter((p) => (p.source || 'ai_generator') === 'composer').length,
      ai_generator: activeQueuePosts.filter((p) => (p.source || 'ai_generator') === 'ai_generator').length,
      bulk_upload: activeQueuePosts.filter((p) => (p.source || 'ai_generator') === 'bulk_upload').length,
    };
  }, [activeQueuePosts]);

  const filtered = useMemo(() => {
    if (sourceFilter === 'all') return activeQueuePosts;
    return activeQueuePosts.filter((p) => (p.source || 'ai_generator') === sourceFilter);
  }, [activeQueuePosts, sourceFilter]);

  const selectedId = useMemo(() => {
    if (selectedParamId && filtered.some((p) => p.id === selectedParamId)) {
      return selectedParamId;
    }
    return filtered[0]?.id || null;
  }, [selectedParamId, filtered]);

  const selected = useMemo(() => {
    return activeQueuePosts.find((p) => p.id === selectedId) || null;
  }, [activeQueuePosts, selectedId]);

  const handleToggleRejected = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (isRejectedView) {
      nextParams.delete('view');
    } else {
      nextParams.set('view', 'rejected');
    }
    nextParams.delete('post');
    setSearchParams(nextParams, { replace: true });
  };

  const handleSelect = (id) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('post', id);
    setSearchParams(nextParams, { replace: true });
  };

  const handleSourceChange = (newSource) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newSource === 'all') {
      nextParams.delete('source');
    } else {
      nextParams.set('source', newSource);
    }
    nextParams.delete('post');
    setSearchParams(nextParams, { replace: true });
  };

  const handleApprove = () => {
    if (!selected) return;
    approveMutation.mutate({ id: selected.id, authorName: user?.name || 'Sarah Reeves' });
  };

  const handleReject = (feedback) => {
    if (!selected) return;
    rejectMutation.mutate({ id: selected.id, feedback, authorName: user?.name || 'Sarah Reeves' });
  };

  const handleChangeBrief = (newBrief) => {
    if (!selected) return;
    changeBriefMutation.mutate({ id: selected.id, newBrief, authorName: user?.name || 'Sarah Reeves' });
  };

  const handleAddComment = (text) => {
    if (!selected) return;
    addCommentMutation.mutate({ id: selected.id, text, authorName: user?.name || 'Sarah Reeves' });
  };

  // Keyboard navigation shortcuts: j, k, a, r, e, ?
  useEffect(() => {
    function handleKeyDown(e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) {
        return;
      }

      if (e.key === 'j') {
        e.preventDefault();
        const curIdx = filtered.findIndex((p) => p.id === selectedId);
        if (curIdx >= 0 && curIdx < filtered.length - 1) {
          handleSelect(filtered[curIdx + 1].id);
        }
      } else if (e.key === 'k') {
        e.preventDefault();
        const curIdx = filtered.findIndex((p) => p.id === selectedId);
        if (curIdx > 0) {
          handleSelect(filtered[curIdx - 1].id);
        }
      } else if (e.key === 'a') {
        e.preventDefault();
        if (selected) {
          if (!isOwner) {
            toast.error('Only Account Owners can approve posts');
          } else {
            handleApprove();
          }
        }
      } else if (e.key === 'r') {
        e.preventDefault();
        // Trigger reject modal on active detail
        const rejectBtn = document.querySelector('button[title*="Reject"]');
        if (rejectBtn) rejectBtn.click();
      } else if (e.key === 'e') {
        e.preventDefault();
        if (selected) {
          navigate(`/post-creation-composer?id=${selected.id}&mode=edit`);
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, selectedId, selected, isOwner, navigate]);

  const pendingCount = unreviewedPosts.length;
  const rejectedCount = rejectedPosts.length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="h-9 w-48 bg-slate-200/70 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-9 w-64 bg-slate-200/70 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5" style={{ minHeight: 640 }}>
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 h-full min-h-[500px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Failed to load approval queue</h2>
        <p className="text-xs text-slate-500 mb-4">
          {error?.message || 'A network error occurred while loading posts.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-xs font-semibold rounded-full bg-[#0a66c2] text-white hover:bg-[#084e96] transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <RotateCcw size={13} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_28px_-12px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center border shadow-2xs shrink-0 ${
            isRejectedView
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/50'
              : 'bg-blue-50 dark:bg-blue-950/50 text-[#0a66c2] dark:text-blue-400 border-blue-100/80 dark:border-blue-900/50'
          }`}>
            {isRejectedView ? <XCircle size={20} /> : <CheckSquare size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {isRejectedView ? 'Rejected Posts' : 'Approval Queue'}
              </h1>
              {isRejectedView ? (
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                  {rejectedPosts.length} rejected
                </span>
              ) : (
                pendingCount > 0 && (
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                    {pendingCount} pending
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRejectedView
                ? 'Review previously declined drafts, revise briefs, or restore to the publishing schedule.'
                : 'Review, quality check, and schedule LinkedIn posts before publishing.'}
            </p>
          </div>
        </div>

        <div className="flex items-center shrink-0">
          {/* Source Tabs */}
          <ApprovalSourceTabs
            activeSource={sourceFilter}
            onSelectSource={handleSourceChange}
            counts={sourceCounts}
          />
        </div>
      </div>

      {/* Split panel: Queue (left) & Detail (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8" style={{ minHeight: 640 }}>
        <div className="xl:col-span-5 h-full">
          <ApprovalQueue
            posts={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
            isRejected={isRejectedView}
            onToggleRejected={handleToggleRejected}
            unreviewedCount={unreviewedPosts.length}
            rejectedCount={rejectedPosts.length}
          />
        </div>
        <div className="xl:col-span-7 h-full">
          {selected ? (
            <ApprovalDetail
              post={selected}
              onApprove={handleApprove}
              onReject={handleReject}
              onChangeBrief={handleChangeBrief}
              onAddComment={handleAddComment}
              isApproving={approveMutation.isPending}
            />
          ) : (
            <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                <CheckSquare size={22} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No Post Selected</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Select a post from the queue to view audit details, research package, or approve.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts overlay */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

