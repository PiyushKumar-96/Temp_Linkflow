'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { getTopPosts } from '@/temp-backend';

function SortHeader({ field, label, activeSort, onSort }) {
  const isActive = activeSort.field === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`anl-th-sort ${isActive ? 'anl-th-sort--active' : ''}`}
    >
      <span>{label}</span>
      {isActive ? (
        activeSort.dir === 'desc' ? (
          <ArrowDown size={11} className="fill-current" />
        ) : (
          <ArrowUp size={11} className="fill-current" />
        )
      ) : (
        <ArrowUpDown size={11} />
      )}
    </button>
  );
}

export default function TopPostsTable({
  range = 'range-30d',
  refreshKey = 0,
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ field: 'impressions', dir: 'desc' });

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

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return { field, dir: prev.dir === 'desc' ? 'asc' : 'desc' };
      }
      return { field, dir: 'desc' };
    });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const valA = a[sortConfig.field] ?? 0;
    const valB = b[sortConfig.field] ?? 0;
    const delta = valA - valB;
    return sortConfig.dir === 'desc' ? -delta : delta;
  });

  return (
    <div className="anl-card">
      <div className="anl-card-header">
        <div>
          <h3 className="anl-card-title">Top posts</h3>
          <p className="anl-card-subtitle">
            {posts.length} published posts · Ranked by{' '}
            {sortConfig.field === 'engRate' ? 'engagement rate' : sortConfig.field}
          </p>
        </div>
      </div>

      <div className="anl-table-wrap">
        <table className="anl-table">
          <thead>
            <tr>
              <th className="anl-th anl-th-post">Post</th>
              <th className="anl-th anl-th-right">
                <SortHeader
                  field="impressions"
                  label="Impressions"
                  activeSort={sortConfig}
                  onSort={handleSort}
                />
              </th>
              <th className="anl-th anl-th-right">
                <SortHeader
                  field="reactions"
                  label="Reactions"
                  activeSort={sortConfig}
                  onSort={handleSort}
                />
              </th>
              <th className="anl-th anl-th-right">
                <SortHeader
                  field="comments"
                  label="Comments"
                  activeSort={sortConfig}
                  onSort={handleSort}
                />
              </th>
              <th className="anl-th anl-th-right">
                <SortHeader
                  field="engRate"
                  label="Engagement rate"
                  activeSort={sortConfig}
                  onSort={handleSort}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="anl-td text-center text-xs text-muted-foreground py-8">
                  Loading posts...
                </td>
              </tr>
            ) : sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="anl-td text-center text-xs text-muted-foreground py-8">
                  No posts recorded in this period.
                </td>
              </tr>
            ) : (
              sortedPosts.map((post) => {
                const fullTitle = post.title || post.excerpt || '';
                return (
                  <tr key={post.id} className="anl-tr">
                    <td className="anl-td">
                      <div className="anl-post-cell">
                        <div className="anl-post-avatar">
                          {post.authorInitials || 'SR'}
                        </div>
                        <div>
                          <p className="anl-post-title" title={fullTitle}>{fullTitle}</p>
                          <div className="anl-post-meta">
                            <span>{post.author}</span>
                            <span>·</span>
                            <span>{post.publishedDate}</span>
                            {post.visualFormat && (
                              <span className="anl-post-format-tag">{post.visualFormat}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="anl-td anl-num-cell anl-td-right">
                      {post.impressions?.toLocaleString()}
                    </td>
                    <td className="anl-td anl-num-cell anl-td-right">
                      {post.reactions?.toLocaleString()}
                    </td>
                    <td className="anl-td anl-num-cell anl-td-right">
                      {post.comments?.toLocaleString()}
                    </td>
                    <td className="anl-td anl-num-cell anl-td-right">
                      {post.engRate}%
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
