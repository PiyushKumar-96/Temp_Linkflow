'use client';

import React from 'react';
import { X, Clock, User, Tag, ExternalLink, AlertTriangle, RotateCw, Download } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-card rounded-xl card-shadow-md w-full max-w-sm slide-up border ${
          isFailed ? 'border-destructive/60 bg-destructive/5' : 'border-border'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <StatusBadge status={post.status} />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground leading-relaxed">{post.title}</p>

          {isFailed && (
            <div className="p-3 bg-card border border-destructive/40 rounded-lg flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-destructive font-bold">
                <AlertTriangle size={13} />
                <span>Publishing Failure Halted</span>
              </div>
              <p className="text-[11px] text-destructive leading-snug">
                {failure.errorMessage}
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/60 mt-0.5">
                <span>Attempts: {failure.attemptCount} of 3</span>
                <span>{failure.requestId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User size={12} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>
                {post.date}
                {post.time ? ` at ${post.time}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag size={12} />
              <span>{post.category}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {isFailed ? (
              <>
                <Link
                  to={`/approval-workflow?post=${post.id}`}
                  className="btn btn-primary bg-destructive hover:bg-destructive/90 text-white text-xs flex-1 justify-center flex items-center gap-1"
                >
                  <RotateCw size={12} />
                  Retry in Queue
                </Link>
                <button
                  onClick={handleManualDownload}
                  className="btn btn-outline text-xs flex-1 justify-center flex items-center gap-1"
                >
                  <Download size={12} />
                  Export
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/post-creation-composer?id=${post.id}&mode=edit`}
                  className="btn-secondary text-xs flex-1 justify-center"
                >
                  Edit Post
                </Link>
                <Link to={`/approval-workflow?post=${post.id}`} className="btn-primary text-xs flex-1 justify-center">
                  <ExternalLink size={12} />
                  View in Queue
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
