'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckSquare, Keyboard, RotateCcw, AlertCircle } from 'lucide-react';
import ApprovalQueue from './ApprovalQueue';
import ApprovalDetail from './ApprovalDetail';
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

  // URL state synchronization
  const filter = searchParams.get('status') || 'all';
  const selectedParamId = searchParams.get('post');

  const filtered = useMemo(() => {
    if (filter === 'all') return postList;
    if (filter === 'pending') {
      return postList.filter(
        (p) => p.status === 'awaiting_review' || p.status === 'pending' || p.status === 'needs_revision'
      );
    }
    return postList.filter((p) => p.status === filter);
  }, [postList, filter]);

  const selectedId = useMemo(() => {
    if (selectedParamId && filtered.some((p) => p.id === selectedParamId)) {
      return selectedParamId;
    }
    return filtered[0]?.id || null;
  }, [selectedParamId, filtered]);

  const selected = useMemo(() => {
    return postList.find((p) => p.id === selectedId) || null;
  }, [postList, selectedId]);

  const handleSelect = (id) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('post', id);
    setSearchParams(nextParams, { replace: true });
  };

  const handleFilterChange = (newFilter) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newFilter === 'all') {
      nextParams.delete('status');
    } else {
      nextParams.set('status', newFilter);
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

  const pendingCount = postList.filter(
    (p) => p.status === 'awaiting_review' || p.status === 'pending' || p.status === 'needs_revision'
  ).length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="h-8 w-44 bg-muted rounded animate-pulse" />
          <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5" style={{ minHeight: 640 }}>
          <div className="xl:col-span-2 card p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/60 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="xl:col-span-3 card p-6 h-full bg-muted/30 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto my-12 border border-danger/30 bg-danger/5">
        <AlertCircle size={28} className="text-danger mx-auto mb-3" />
        <h2 className="text-base font-600 text-foreground mb-1">Failed to load approval queue</h2>
        <p className="text-xs text-muted-foreground mb-4">
          {error?.message || 'A network error occurred while loading posts.'}
        </p>
        <button
          onClick={() => refetch()}
          className="btn-primary text-xs py-2 px-4 mx-auto flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckSquare size={20} className="text-primary" />
          <h1 className="text-2xl font-700 text-foreground">Approval Queue</h1>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-700 bg-warning/20 text-warning rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Keyboard shortcut trigger */}
          <button
            onClick={() => setShortcutsOpen(true)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-colors flex items-center gap-1.5 text-xs font-500"
            title="Press '?' for keyboard shortcuts"
          >
            <Keyboard size={14} />
            <span className="hidden sm:inline">Shortcuts</span>
            <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.2 rounded border border-border">
              ?
            </kbd>
          </button>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
            ].map((f) => (
              <button
                key={`filter-${f.id}`}
                onClick={() => handleFilterChange(f.id)}
                className={`px-3 py-1.5 text-sm font-500 rounded-md capitalize transition-all duration-150 ${
                  filter === f.id
                    ? 'bg-card text-foreground card-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split panel */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5" style={{ minHeight: 640 }}>
        <div className="xl:col-span-2">
          <ApprovalQueue
            posts={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <div className="xl:col-span-3">
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
            <div className="card flex items-center justify-center h-full min-h-[400px]">
              <p className="text-sm text-muted-foreground">Select a post to review</p>
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
