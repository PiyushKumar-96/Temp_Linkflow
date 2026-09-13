'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Panel, CornerArrowButton } from './DashboardPrimitives';

const DEMO_ITEMS = [
  {
    id: 'pending-1',
    title: 'Why we switched from Slack to async communication',
    excerpt:
      'After 3 years of Slack-first culture, we made a bold decision to reimagine how our distributed engineering team collaborates.',
    category: 'Thought leadership',
    qualityScore: 94,
    visualFormat: 'text',
    timestamp: '2 hours ago',
    impact: 'Medium',
    author: 'Lisa Tran',
  },
  {
    id: 'pending-2',
    title: 'How content marketing drives 40% of our inbound leads',
    excerpt:
      'A deep dive into our content strategy, what worked, and key lessons learned while scaling organic engagement to 22K+ followers.',
    category: 'Case study',
    qualityScore: 91,
    visualFormat: 'image',
    timestamp: '5 hours ago',
    impact: 'High',
    author: 'Rohan Mehta',
  },
];

const mapPost = (p, idx) => ({
  id: p.id,
  title: p.title,
  excerpt: p.content || DEMO_ITEMS[idx]?.excerpt || '',
  category: p.category || 'Thought leadership',
  qualityScore: p.qualityAudit?.score ?? 90,
  visualFormat: p.visualFormat || 'text',
  timestamp: p.submittedAt || 'Recently',
  impact: p.impact || 'Medium',
  author: p.author || 'Sarah Reeves',
});

export default function DashboardPendingReviewCard({ pendingPosts, limit = 2 }) {
  const navigate = useNavigate();

  const items = pendingPosts === undefined ? DEMO_ITEMS : pendingPosts.slice(0, limit).map(mapPost);
  const count = pendingPosts === undefined ? 14 : pendingPosts.length;

  const open = (id) => navigate(`/approval-workflow?highlight=${id}`);

  return (
    <Panel className="flex h-full flex-col justify-between p-5 sm:p-6">
      {/* Header: Title + Ink pill counter + Corner ↗ button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-semibold tracking-tight text-[color:var(--text)]">
            Pending review
          </h3>
          {count > 0 && (
            <span className="inline-flex items-center rounded-full bg-[color:var(--text)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-white">
              {count} queued
            </span>
          )}
        </div>
        <CornerArrowButton onClick={() => navigate('/approval-workflow')} label="Open queue" />
      </div>

      {items.length === 0 ? (
        <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle2 size={24} className="text-[color:var(--success-text)]" />
          <p className="mt-2 text-xs font-semibold text-[color:var(--text)]">
            Review queue is clear
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
            New drafts will appear here for approval.
          </p>
        </div>
      ) : (
        <div className="my-auto flex flex-col gap-3 py-2">
          {items.map((item) => {
            const authorInitials = (item.author || 'SR')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();
            const isHigh = /high/i.test(item.impact);

            return (
              <div
                key={item.id}
                role="link"
                tabIndex={0}
                onClick={() => open(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(item.id);
                  }
                }}
                className="group flex flex-col justify-between rounded-[16px] bg-[color:var(--track-warm)] border border-[color:color-mix(in_srgb,var(--border)_60%,transparent)] p-4 transition-all hover:bg-[color:var(--chip)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
              >
                {/* Top chips: Category (neutral gray) + Quality (neutral chip) + Impact (white outlined pill) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-white border border-[color:var(--border)] px-2.5 py-0.5 text-[11px] font-semibold text-[color:var(--text-muted)]">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white border border-[color:var(--border)] px-2.5 py-0.5 text-[11px] font-semibold text-[color:var(--text-muted)] tabular-nums">
                      Quality {item.qualityScore}%
                    </span>
                  </div>
                  {/* Impact pill */}
                  <span
                    className={`inline-flex items-center rounded-full bg-white border border-[color:var(--border)] px-2.5 py-0.5 text-[11px] font-semibold ${
                      isHigh ? 'text-[color:var(--warning-text)]' : 'text-[color:var(--text-muted)]'
                    }`}
                  >
                    {item.impact} impact
                  </span>
                </div>

                {/* Bold title without truncation */}
                <h4 className="mt-2.5 text-sm font-semibold text-[color:var(--text)] transition-colors group-hover:text-[color:var(--brand)] leading-snug">
                  {item.title}
                </h4>

                {/* Excerpt */}
                <p className="mt-1 line-clamp-1 text-xs text-[color:var(--text-muted)]">
                  {item.excerpt}
                </p>

                {/* Author with initials in neutral circle + date */}
                <div className="mt-3 flex items-center justify-between border-t border-[color:var(--border)] pt-2.5 text-xs text-[color:var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-[color:var(--chip)] text-[10px] font-bold text-[color:var(--text)]">
                      {authorInitials}
                    </span>
                    <span className="font-medium text-[color:var(--text)]">{item.author}</span>
                  </div>
                  <span className="text-[11px] text-[color:var(--text-muted)]">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
