'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Eye, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';
import { Panel, PanelHeader, PanelLink, Pill } from './DashboardPrimitives';

export default function DashboardRecentlyPublished({ publishedPosts = [], limit = 3 }) {
  const navigate = useNavigate();

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={Send}
        tone="emerald"
        title="Recently published"
        badge={
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
            Last 14 days
          </span>
        }
        action={<PanelLink onClick={() => navigate('/analytics')}>Analytics</PanelLink>}
      />

      {publishedPosts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="text-[13px] font-semibold text-foreground">No posts published yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Results show up here after your first post goes live.
          </p>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-border/60">
          {publishedPosts.slice(0, limit).map((post) => (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => navigate(`/analytics?post=${post.id}&highlight=${post.id}`)}
                className="group -mx-2 flex w-[calc(100%+1rem)] flex-col gap-2 rounded-xl px-2 py-3 text-left transition-colors hover:bg-muted/50 md:flex-row md:items-center md:justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {post.category && <Pill tone="slate">{post.category}</Pill>}
                    <span className="text-[11px] text-muted-foreground">
                      Published {post.publishedDate}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground tabular-nums">
                  <span className="inline-flex items-center gap-1" title="Impressions">
                    <Eye size={13} />
                    {post.impressions?.toLocaleString() ?? '—'}
                  </span>
                  <span className="inline-flex items-center gap-1" title="Reactions">
                    <ThumbsUp size={13} />
                    {post.reactions ?? '—'}
                  </span>
                  <span className="inline-flex items-center gap-1" title="Comments">
                    <MessageSquare size={13} />
                    {post.comments ?? post.commentsCount ?? '—'}
                  </span>
                  <Pill tone="emerald" icon={TrendingUp}>
                    {post.engRate ?? post.engagementRate ?? '—'}%
                  </Pill>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
