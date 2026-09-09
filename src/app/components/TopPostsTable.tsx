'use client';

import React, { useState } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';


interface Post {
  id: string;
  excerpt: string;
  author: string;
  authorInitials: string;
  publishedDate: string;
  impressions: number;
  reactions: number;
  comments: number;
  reposts: number;
  engRate: number;
  trend: 'up' | 'down';
  category: string;
}

const posts: Post[] = [
  { id: 'post-001', excerpt: 'We just crossed 10,000 customers — here\'s what we learned about building trust at scale...', author: 'Sarah Reeves', authorInitials: 'SR', publishedDate: 'Sep 4', impressions: 28400, reactions: 892, comments: 134, reposts: 67, engRate: 7.4, trend: 'up', category: 'Thought Leadership' },
  { id: 'post-002', excerpt: 'How we reduced our customer onboarding time by 62% in one quarter (full case study inside)...', author: 'Marcus Chen', authorInitials: 'MC', publishedDate: 'Sep 2', impressions: 22100, reactions: 641, comments: 98, reposts: 44, engRate: 6.1, trend: 'up', category: 'Case Study' },
  { id: 'post-003', excerpt: 'Excited to announce our new AI-powered analytics dashboard — built for teams who move fast...', author: 'Sarah Reeves', authorInitials: 'SR', publishedDate: 'Aug 31', impressions: 19800, reactions: 480, comments: 72, reposts: 31, engRate: 5.2, trend: 'up', category: 'Product Update' },
  { id: 'post-004', excerpt: 'We\'re hiring a Senior Product Designer to join our distributed team. Here\'s why we\'re different...', author: 'Jordan Patel', authorInitials: 'JP', publishedDate: 'Aug 27', impressions: 16200, reactions: 390, comments: 88, reposts: 22, engRate: 4.8, trend: 'down', category: 'Hiring' },
  { id: 'post-005', excerpt: 'Join us at SaaStr Annual next week — we\'ll be at booth 412. Come say hi and grab a demo...', author: 'Lisa Tran', authorInitials: 'LT', publishedDate: 'Aug 25', impressions: 14100, reactions: 310, comments: 41, reposts: 18, engRate: 5.6, trend: 'up', category: 'Event' },
  { id: 'post-006', excerpt: 'What\'s the biggest mistake companies make with LinkedIn? Drop your answer below...', author: 'Marcus Chen', authorInitials: 'MC', publishedDate: 'Aug 21', impressions: 21300, reactions: 720, comments: 203, reposts: 56, engRate: 8.1, trend: 'up', category: 'Engagement' },
  { id: 'post-007', excerpt: 'The 5 LinkedIn habits that helped us grow our company page from 800 to 22,000 followers...', author: 'Sarah Reeves', authorInitials: 'SR', publishedDate: 'Aug 19', impressions: 11800, reactions: 290, comments: 52, reposts: 29, engRate: 3.9, trend: 'down', category: 'Thought Leadership' },
  { id: 'post-008', excerpt: 'Our Q2 product roadmap is live — transparency is a core value here. Here\'s what we\'re building...', author: 'Jordan Patel', authorInitials: 'JP', publishedDate: 'Aug 15', impressions: 9200, reactions: 201, comments: 34, reposts: 14, engRate: 2.7, trend: 'down', category: 'Product Update' },
];

type SortKey = 'impressions' | 'engRate' | 'reactions' | 'comments';

export default function TopPostsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('impressions');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...posts].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === 'desc' ? -diff : diff;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-1 text-xs font-600 uppercase tracking-wide transition-colors ${
        sortKey === k ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      <ArrowUpDown size={11} />
    </button>
  );

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-base font-600 text-foreground">Top Posts</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Ranked by {sortKey === 'engRate' ? 'engagement rate' : sortKey}</p>
        </div>
        <span className="text-xs text-muted-foreground">{posts.length} posts</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-5 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">Post</th>
              <th className="text-left px-3 py-2.5"><SortBtn k="impressions" label="Impressions" /></th>
              <th className="text-left px-3 py-2.5"><SortBtn k="reactions" label="Reactions" /></th>
              <th className="text-left px-3 py-2.5"><SortBtn k="comments" label="Comments" /></th>
              <th className="text-left px-3 py-2.5"><SortBtn k="engRate" label="Eng. Rate" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors group">
                <td className="px-5 py-3.5 min-w-[280px] max-w-[320px]">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-700">{post.authorInitials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground line-clamp-2 leading-snug">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{post.publishedDate}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{post.category}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-sm font-600 text-foreground tabular-nums whitespace-nowrap">
                  {post.impressions.toLocaleString()}
                </td>
                <td className="px-3 py-3.5 text-sm text-foreground tabular-nums">{post.reactions.toLocaleString()}</td>
                <td className="px-3 py-3.5 text-sm text-foreground tabular-nums">{post.comments}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5">
                    {post.trend === 'up'
                      ? <TrendingUp size={13} className="text-success" />
                      : <TrendingDown size={13} className="text-danger" />
                    }
                    <span className={`text-sm font-600 tabular-nums ${post.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                      {post.engRate}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}