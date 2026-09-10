'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPendingReviewCard({ pendingPosts = [] }) {
  const navigate = useNavigate();

  const defaultItems = [
    {
      id: 'pending-1',
      title: 'Why we switched from Slack to async communication...',
      excerpt:
        'After 3 years of Slack-first culture, we made a bold decision to reimagine how our distributed engineering team collaborates...',
      category: 'Thought Leadership',
      qualityScore: 94,
      visualFormat: 'text',
      timestamp: '2 hours ago',
      impact: 'Medium impact',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'pending-2',
      title: 'How content marketing drives 40% of our inbound leads',
      excerpt:
        'A deep dive into our content strategy, what worked, and key lessons learned while scaling organic engagement to 22K+ followers...',
      category: 'Case Study',
      qualityScore: 91,
      visualFormat: 'image',
      timestamp: '5 hours ago',
      impact: 'High impact',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const items = pendingPosts.length > 0 ? pendingPosts.slice(0, 2).map((p, idx) => ({
    id: p.id,
    title: p.title,
    excerpt: p.content ? p.content.slice(0, 110) + '...' : defaultItems[idx]?.excerpt || '',
    category: p.category || (idx === 0 ? 'Thought Leadership' : 'Case Study'),
    qualityScore: p.qualityAudit?.score || (idx === 0 ? 94 : 91),
    visualFormat: p.visualFormat || (idx === 0 ? 'text' : 'image'),
    timestamp: p.submittedAt || (idx === 0 ? '2 hours ago' : '5 hours ago'),
    impact: idx === 0 ? 'Medium impact' : 'High impact',
    authorAvatar: idx === 0 ? defaultItems[0].authorAvatar : defaultItems[1].authorAvatar,
  })) : defaultItems;

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <CheckSquare size={14} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Pending Human Review</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
            {pendingPosts.length || 2} queued
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/approval-workflow')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Open Queue</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Post Items */}
      <div className="flex flex-col divide-y divide-border/60 mt-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/approval-workflow?highlight=${item.id}`)}
            className="py-3 hover:bg-muted/20 -mx-2 px-2 rounded-xl transition-all cursor-pointer group flex items-start gap-3"
          >
            {/* Format Icon */}
            <div className="w-7 h-7 rounded-lg bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
              {item.visualFormat === 'image' ? (
                <ImageIcon size={13} />
              ) : (
                <FileText size={13} />
              )}
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                  {item.category}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Quality {item.qualityScore}%
                </span>
              </div>

              <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                {item.excerpt}
              </p>

              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                <span>{item.timestamp}</span>
                <span>·</span>
                <span className="font-medium text-foreground/80">{item.impact}</span>
              </div>
            </div>

            {/* Right: Author avatar + menu */}
            <div className="flex items-center gap-1.5 shrink-0 pt-1">
              <img
                src={item.authorAvatar}
                alt="Author"
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/approval-workflow?highlight=${item.id}`);
                }}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded"
              >
                <MoreVertical size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
