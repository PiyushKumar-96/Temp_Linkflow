'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookImage, ArrowRight, Eye, ThumbsUp, MessageSquare, TrendingUp, BarChart2 } from 'lucide-react';

export default function DashboardRecentlyPublished({ publishedPosts = [] }) {
  const navigate = useNavigate();

  return (
    <div className="card flex flex-col overflow-hidden border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <BookImage size={14} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Recently Published</h2>
            <p className="text-[11px] text-muted-foreground">
              Performance metrics from posts delivered to LinkedIn in the last 14 days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <BarChart2 size={13} />
            Analytics
          </button>
          <span className="text-muted-foreground text-xs">·</span>
          <button
            type="button"
            onClick={() => navigate('/content-library')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Library
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-border">
        {publishedPosts.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No published posts yet.
          </div>
        ) : (
          publishedPosts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/analytics?post=${post.id}&highlight=${post.id}`)}
              title="Click to view full metrics on Analytics page"
              className="p-3.5 hover:bg-primary/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex flex-col gap-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Published on {post.publishedDate}
                  </span>
                  <span className="text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    View in Analytics <ArrowRight size={10} />
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {post.title}
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye size={12} />
                  <span>{post.impressions?.toLocaleString() || '1,420'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp size={12} />
                  <span>{post.reactions || '86'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare size={12} />
                  <span>{post.comments || post.commentsCount || '19'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  <TrendingUp size={11} />
                  <span>{post.engRate || post.engagementRate || '4.8'}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
