'use client';

import React, { useState } from 'react';
import type { ApprovalPost } from './ApprovalShell';
import StatusBadge from '@/components/ui/StatusBadge';
import { Check, X, Send, Clock, RefreshCw, History } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  post: ApprovalPost;
  onApprove: () => void;
  onReject: () => void;
  onAddComment: (text: string) => void;
}

const commentTypeColors: Record<string, string> = {
  comment: 'bg-muted',
  revision_request: 'bg-warning/10 border border-warning/20',
  approval: 'bg-success/10 border border-success/20',
  rejection: 'bg-danger/10 border border-danger/20',
};

const commentTypeLabels: Record<string, string> = {
  comment: '',
  revision_request: '↩ Revision requested',
  approval: '✓ Approved',
  rejection: '✗ Rejected',
};

export default function ApprovalDetail({ post, onApprove, onReject, onAddComment }: Props) {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'history'>('content');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    await new Promise(r => setTimeout(r, 600));
    onApprove();
    setIsApproving(false);
    toast.success('Post approved — scheduled for publishing');
  };

  const handleReject = async () => {
    setIsRejecting(true);
    await new Promise(r => setTimeout(r, 600));
    onReject();
    setIsRejecting(false);
    toast.error('Post rejected — author notified');
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    onAddComment(comment.trim());
    setComment('');
    toast.success('Comment added');
  };

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      {/* Post header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={post.status} />
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{post.category}</span>
              {post.revisions > 0 && (
                <span className="text-xs flex items-center gap-1 text-muted-foreground">
                  <RefreshCw size={10} />
                  {post.revisions} revision{post.revisions > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-white text-xs font-700" style={{ fontSize: 9 }}>{post.authorInitials}</span>
                </div>
                <span>{post.author} · {post.authorRole}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                Submitted {post.submittedAt}
              </span>
              <span className="flex items-center gap-1 text-warning">
                <Clock size={10} />
                Due {post.dueDate}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {post.status === 'pending' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="btn-danger disabled:opacity-50"
              >
                {isRejecting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <X size={14} />
                )}
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="btn-success disabled:opacity-50"
              >
                {isApproving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Approve
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {(['content', 'history'] as const).map(tab => (
            <button
              key={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm font-500 rounded-md capitalize transition-all duration-150 ${
                activeTab === tab ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'history' ? `History (${post.comments.length})` : 'Content'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'content' ? (
          <div className="p-5 flex flex-col gap-4">
            {/* Post content */}
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.hashtags.map(tag => (
                    <span key={`tag-${tag}`} className="text-xs text-primary font-500">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Comment input */}
            <div>
              <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide block mb-2">
                Add Comment
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendComment(); }}
                  placeholder="Leave feedback or request changes..."
                  className="input-base text-sm flex-1"
                />
                <button
                  onClick={handleSendComment}
                  disabled={!comment.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Comments */}
            {post.comments.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-600 text-muted-foreground uppercase tracking-wide">Comments</h4>
                {post.comments.map(c => (
                  <div key={c.id} className={`rounded-lg p-3 ${commentTypeColors[c.type]}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-white font-700" style={{ fontSize: 9 }}>{c.authorInitials}</span>
                      </div>
                      <span className="text-xs font-600 text-foreground">{c.author}</span>
                      <span className="text-xs text-muted-foreground">{c.timestamp}</span>
                      {commentTypeLabels[c.type] && (
                        <span className="text-xs font-600 ml-auto text-muted-foreground">{commentTypeLabels[c.type]}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-5">
            <div className="flex flex-col gap-0">
              {/* Timeline */}
              {[
                { id: 'tl-created', label: 'Post created', time: post.submittedAt, by: post.author, icon: '✏️' },
                ...post.comments.map(c => ({
                  id: `tl-${c.id}`,
                  label: c.type === 'approval' ? 'Approved' : c.type === 'rejection' ? 'Rejected' : c.type === 'revision_request' ? 'Revision requested' : 'Commented',
                  time: c.timestamp,
                  by: c.author,
                  icon: c.type === 'approval' ? '✓' : c.type === 'rejection' ? '✗' : c.type === 'revision_request' ? '↩' : '💬',
                })),
              ].map((event, i, arr) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">
                      {event.icon}
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                  </div>
                  <div className="pb-4 pt-1">
                    <p className="text-sm font-600 text-foreground">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{event.by} · {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}