'use client';

import React from 'react';
import { X, Clock, User, Tag, ExternalLink } from 'lucide-react';
import type { CalendarPost } from './CalendarShell';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

interface Props {
  post: CalendarPost;
  onClose: () => void;
}

export default function PostDetailPopover({ post, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl card-shadow-md w-full max-w-sm slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <StatusBadge status={post.status} />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm text-foreground leading-relaxed">{post.title}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User size={12} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{post.date}{post.time ? ` at ${post.time}` : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag size={12} />
              <span>{post.category}</span>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Link href="/post-creation-composer" className="btn-secondary text-xs flex-1 justify-center">
              Edit Post
            </Link>
            <Link href="/approval-workflow" className="btn-primary text-xs flex-1 justify-center">
              <ExternalLink size={12} />
              View in Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}