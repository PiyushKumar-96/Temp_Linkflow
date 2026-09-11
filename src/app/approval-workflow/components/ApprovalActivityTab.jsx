'use client';

import React from 'react';
import { Send } from 'lucide-react';

export const commentTypeColors = {
  comment: 'bg-muted/60 border border-border/40',
  revision_request: 'bg-warning/10 border border-warning/30 text-warning-foreground',
  approval: 'bg-success/10 border border-success/30 text-success-foreground',
  rejection: 'bg-danger/10 border border-danger/30 text-danger-foreground',
};

export const commentTypeLabels = {
  comment: 'Comment',
  revision_request: 'Brief Change / Revision',
  approval: 'Approved',
  rejection: 'Rejected',
};

export default function ApprovalActivityTab({
  post,
  activityLog = [],
  comment,
  setComment,
  onSendComment,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Quick Comment Input */}
      <div className="p-3 rounded-xl border border-border bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendComment()}
            placeholder="Add a review comment or note..."
            className="input-base text-xs flex-1"
          />
          <button
            onClick={onSendComment}
            disabled={!comment.trim()}
            className="btn-primary text-xs px-3 disabled:opacity-50"
          >
            <Send size={13} />
          </button>
        </div>
      </div>

      {/* Combined Timeline: Activity Logs + Comments */}
      {activityLog.length > 0 || (post.comments && post.comments.length > 0) ? (
        [
          ...(post.comments || []).map((c) => ({ ...c, isComment: true })),
          ...activityLog.map((a) => ({ ...a, isComment: false })),
        ]
          .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
          .map((item, idx) => (
            <div
              key={`timeline-${item.id || idx}`}
              className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
                item.isComment
                  ? commentTypeColors[item.type] || 'bg-card border-border'
                  : 'bg-muted/20 border-border/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-[9px] font-700">
                      {item.authorInitials || item.actor?.slice(0, 2).toUpperCase() || 'SYS'}
                    </span>
                  </div>
                  <span className="font-600 text-foreground">
                    {item.author || item.actor || 'System'}
                  </span>
                  {item.isComment && item.type && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-background/60 border border-border/40 font-500">
                      {commentTypeLabels[item.type] || item.type}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
              </div>

              {item.isComment ? (
                <p className="text-foreground leading-relaxed pl-7">{item.text}</p>
              ) : (
                <div className="pl-7">
                  <p className="font-500 text-foreground">{item.action}</p>
                  {item.details && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.details}</p>
                  )}
                </div>
              )}
            </div>
          ))
      ) : (
        <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
          No activity recorded yet for this draft.
        </div>
      )}
    </div>
  );
}
