'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckSquare, RotateCcw, AlertCircle } from 'lucide-react';
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

  // Unreviewed queue: posts requiring review or attention (awaiting_review, needs_revision, failed, auto_review)
  const unreviewedPosts = useMemo(() => {
    return postList.filter((p) => {
      const canonical = normalizeStatus(p.status);
      return (
        canonical === POST_STATUS.AWAITING_REVIEW ||
        canonical === POST_STATUS.NEEDS_REVISION ||
        canonical === POST_STATUS.FAILED ||
        canonical === POST_STATUS.AUTO_REVIEW
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
      ai_generator: activeQueuePosts.filter((p) => (p.source || 'ai_generator') === 'ai_generator')
        .length,
      bulk_upload: activeQueuePosts.filter((p) => (p.source || 'ai_generator') === 'bulk_upload')
        .length,
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

  const handleToggleRejected = (targetIsRejected) => {
    const nextParams = new URLSearchParams(searchParams);
    const shouldBeRejected =
      typeof targetIsRejected === 'boolean' ? targetIsRejected : !isRejectedView;
    if (!shouldBeRejected) {
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
    changeBriefMutation.mutate({
      id: selected.id,
      newBrief,
      authorName: user?.name || 'Sarah Reeves',
    });
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-56 bg-[color:var(--chip)] rounded-[var(--radius-input)] animate-pulse" />
          <div className="h-9 w-64 bg-[color:var(--chip)] rounded-[var(--radius-input)] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8" style={{ minHeight: 640 }}>
          <div className="xl:col-span-5 bg-[color:var(--card)] rounded-[var(--radius-card)] border border-[color:var(--border)] p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-[color:var(--chip)] rounded-[var(--radius-input)] animate-pulse"
              />
            ))}
          </div>
          <div className="xl:col-span-7 bg-[color:var(--card)] rounded-[var(--radius-card)] border border-[color:var(--border)] p-6 h-full min-h-[500px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[color:var(--card)] rounded-[var(--radius-card)] border border-[color:var(--border)] p-8 text-center max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[color:var(--danger-tint)] text-[color:var(--danger-text)] flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-semibold text-[color:var(--text)] mb-1">
          Failed to load approval queue
        </h2>
        <p className="text-xs text-[color:var(--text-muted)] mb-4">
          {error?.message || 'A network error occurred while loading posts.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-input)] bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[color:var(--text)] tracking-tight leading-[1.05]">
            {isRejectedView ? 'Rejected posts' : 'Approval queue'}
          </h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-1">
            {isRejectedView
              ? 'Review previously declined drafts, revise briefs, or restore to the publishing schedule.'
              : 'Review, quality check, and schedule LinkedIn posts before publishing.'}
          </p>
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
            <div className="bg-[color:var(--chip)] rounded-[var(--radius-card)] border border-[color:var(--border)] p-12 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-12 h-12 rounded-full bg-[color:var(--card)] flex items-center justify-center text-[color:var(--text-muted)] mb-3">
                <CheckSquare size={22} />
              </div>
              <h3 className="text-base font-semibold text-[color:var(--text)]">
                No Post Selected
              </h3>
              <p className="text-sm text-[color:var(--text-muted)] mt-1 max-w-xs">
                Select a post from the queue to view audit details, research package, or approve.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts overlay */}
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
