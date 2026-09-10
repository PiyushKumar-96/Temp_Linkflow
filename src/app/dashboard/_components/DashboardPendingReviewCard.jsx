'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Image as ImageIcon,
  Layers,
  MoreVertical,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { IconPendingReview } from './DashboardCustomIcons';
import { Panel, PanelHeader, PanelLink, Pill, IconButton, Avatar } from './DashboardPrimitives';

const FORMAT_ICONS = { image: ImageIcon, carousel: Layers, text: FileText };

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
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
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
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
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
  author: p.author || '',
  authorAvatar: p.authorAvatar,
});

/**
 * pendingPosts === undefined -> demo data
 * pendingPosts === []        -> "all clear" state
 */
export default function DashboardPendingReviewCard({ pendingPosts, limit = 2 }) {
  const navigate = useNavigate();

  const items = pendingPosts === undefined ? DEMO_ITEMS : pendingPosts.slice(0, limit).map(mapPost);
  const count = pendingPosts === undefined ? DEMO_ITEMS.length : pendingPosts.length;

  const open = (id) => navigate(`/approval-workflow?highlight=${id}`);

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={IconPendingReview}
        tone="amber"
        title="Pending review"
        badge={count > 0 && <Pill tone="amber">{count} queued</Pill>}
        action={<PanelLink onClick={() => navigate('/approval-workflow')}>Open queue</PanelLink>}
      />

      {items.length === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 size={26} className="text-emerald-500" />
          <p className="mt-2 text-[13px] font-semibold text-foreground">Review queue is clear</p>
          <p className="mt-1 text-xs text-muted-foreground">New drafts will appear here for approval.</p>
          <button
            type="button"
            onClick={() => navigate('/topics')}
            className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Plan a topic
          </button>
        </div>
      ) : (
        <ul className="mt-3 flex flex-1 flex-col divide-y divide-border/60">
          {items.map((item) => {
            const FormatIcon = FORMAT_ICONS[item.visualFormat] || FileText;
            const highImpact = /high/i.test(item.impact);
            return (
              <li key={item.id} className="py-1 first:pt-0 last:pb-0">
                <div
                  role="link"
                  tabIndex={0}
                  onClick={() => open(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      open(item.id);
                    }
                  }}
                  className="group -mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="mt-0.5 hidden size-8 shrink-0 place-items-center rounded-lg bg-muted/70 text-muted-foreground sm:grid">
                    <FormatIcon size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Pill tone="blue">{item.category}</Pill>
                      <Pill tone="emerald" icon={Sparkles}>
                        Quality {item.qualityScore}%
                      </Pill>
                    </div>
                    <h4 className="mt-1.5 truncate text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.excerpt}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      {item.author && (
                        <span className="inline-flex items-center gap-1.5">
                          <Avatar src={item.authorAvatar} name={item.author} size="size-5" textSize="text-[8px]" className="ring-0" />
                          <span className="font-medium text-foreground/80">{item.author}</span>
                        </span>
                      )}
                      <span>{item.timestamp}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${highImpact ? 'bg-rose-500' : 'bg-slate-400'}`} />
                        <span className={highImpact ? 'font-medium text-foreground' : ''}>{item.impact} impact</span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <IconButton
                      label="Post options"
                      onClick={(e) => {
                        e.stopPropagation();
                        open(item.id);
                      }}
                    >
                      <MoreVertical size={14} />
                    </IconButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
