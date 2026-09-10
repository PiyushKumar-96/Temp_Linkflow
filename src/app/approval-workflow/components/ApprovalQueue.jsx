'use client';

import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Clock, AlertTriangle } from 'lucide-react';

export default function ApprovalQueue({ posts = [], selectedId, onSelect }) {
  const postList = Array.isArray(posts) ? posts : [];

  if (postList.length === 0) {
    return (
      <div className="card flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-sm font-600 text-foreground mb-1">Queue is clear</p>
          <p className="text-xs text-muted-foreground">No posts match this filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-600 text-foreground">{postList.length} posts</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {postList.map((post) => {
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
              className={`w-full text-left px-4 py-3.5 border-b border-border last:border-b-0 transition-all duration-150 ${
                isSelected
                  ? 'bg-primary/5 border-l-2 border-l-primary'
                  : 'hover:bg-muted/40 border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-700">{post.authorInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={post.status} size="sm" />
                    {isOverdue && <AlertTriangle size={11} className="text-warning" />}
                  </div>
                  <p className="text-sm text-foreground line-clamp-2 leading-snug mb-1.5">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      Due {post.dueDate}
                    </span>
                    {commentsCount > 0 && (
                      <span>
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
    </div>
  );
}
