'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Target,
  Eye,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { getTopPosts } from '@/temp-backend';

function SortBtn({ k, label, sortKey, onSort }) {
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
        sortKey === k ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      <ArrowUpDown size={11} />
    </button>
  );
}

export default function TopPostsTable({
  range = 'range-30d',
  highlightPostId = null,
  onSelectPost = null,
  refreshKey = 0,
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('impressions');
  const [sortDir, setSortDir] = useState('desc');
  const highlightedRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      setLoading(true);
      try {
        const data = await getTopPosts(range);
        if (!cancelled) {
          setPosts(data);
        }
      } catch {
        // Fallback
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [range, refreshKey]);

  // Auto-scroll highlighted row into view
  useEffect(() => {
    if (highlightPostId && highlightedRef.current) {
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [highlightPostId, posts]);

  const sorted = [...posts].sort((a, b) => {
    const aVal = a[sortKey] ?? 0;
    const bVal = b[sortKey] ?? 0;
    const diff = aVal - bVal;
    return sortDir === 'desc' ? -diff : diff;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Top Posts</h3>
            {highlightPostId && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Target size={10} />
                Focus Mode
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ranked by {sortKey === 'engRate' ? 'engagement rate' : sortKey}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{posts.length} posts</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Post
              </th>
              <th className="text-left px-3 py-2.5">
                <SortBtn k="impressions" label="Impressions" sortKey={sortKey} onSort={handleSort} />
              </th>
              <th className="text-left px-3 py-2.5">
                <SortBtn k="reactions" label="Reactions" sortKey={sortKey} onSort={handleSort} />
              </th>
              <th className="text-left px-3 py-2.5">
                <SortBtn k="comments" label="Comments" sortKey={sortKey} onSort={handleSort} />
              </th>
              <th className="text-left px-3 py-2.5">
                <SortBtn k="engRate" label="Eng. Rate" sortKey={sortKey} onSort={handleSort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                  Loading posts analytics...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                  No posts recorded in this timeframe.
                </td>
              </tr>
            ) : (
              sorted.map((post) => {
                const isHighlighted =
                  highlightPostId &&
                  (post.id === highlightPostId || post.id.includes(highlightPostId));

                return (
                  <tr
                    key={post.id}
                    ref={isHighlighted ? highlightedRef : null}
                    onClick={() => onSelectPost?.(post.id)}
                    className={`border-b border-border last:border-0 transition-all cursor-pointer ${
                      isHighlighted
                        ? 'bg-primary/10 ring-2 ring-inset ring-primary/40 font-medium'
                        : 'hover:bg-muted/40'
                    }`}
                  >
                    <td className="px-5 py-3.5 min-w-[280px] max-w-[320px]">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold">
                          {post.authorInitials || 'SR'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm text-foreground line-clamp-2 leading-snug">
                              {post.title || post.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground">{post.author}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {post.publishedDate}
                            </span>
                            {post.category && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                                {post.category}
                              </span>
                            )}
                            {isHighlighted && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground font-semibold rounded animate-pulse">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-sm font-semibold text-foreground tabular-nums whitespace-nowrap">
                      {post.impressions?.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-foreground tabular-nums">
                      {post.reactions?.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-foreground tabular-nums">
                      {post.comments}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {post.trend === 'up' ? (
                          <TrendingUp size={13} className="text-success" />
                        ) : (
                          <TrendingDown size={13} className="text-danger" />
                        )}
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            post.trend === 'up' ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {post.engRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
