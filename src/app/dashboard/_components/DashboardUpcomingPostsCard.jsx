'use client';

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  MoreVertical,
  CalendarPlus,
} from 'lucide-react';
import {
  IconUpcomingPosts,
  IconFormatCarousel,
  IconFormatImage,
  IconFormatText,
  IconFormatVideo,
  IconFormatInfographic,
  IconTargetCompany,
  IconTargetPersonal,
  IconPrecisionClock,
} from './DashboardCustomIcons';
import { Panel, PanelHeader, PanelLink, Pill, IconButton, addDays, toISODate, formatSlot } from './DashboardPrimitives';

const FORMATS = {
  carousel: { label: 'Carousel', icon: IconFormatCarousel },
  image: { label: 'Image', icon: IconFormatImage },
  article: { label: 'Article', icon: IconFormatText },
  none: { label: 'Text', icon: IconFormatText },
  text: { label: 'Text', icon: IconFormatText },
  video: { label: 'Video', icon: IconFormatVideo },
  infographic: { label: 'Infographic', icon: IconFormatInfographic },
};

const STATUS = {
  scheduled: { label: 'Scheduled', tone: 'blue' },
  approved: { label: 'Approved', tone: 'emerald' },
  in_queue: { label: 'In queue', tone: 'slate' },
  awaiting_review: { label: 'In review', tone: 'amber' },
  failed: { label: 'Failed', tone: 'rose' },
};

const TARGETS = {
  company: { label: 'Company page', icon: IconTargetCompany },
  personal: { label: 'Personal profile', icon: IconTargetPersonal },
};

function demoPosts() {
  const today = new Date();
  const slot = (days, time) => `${toISODate(addDays(today, days))} ${time} UTC`;
  return [
    { id: 'u-1', title: 'The modern B2B marketing stack for 2027: what to keep and what to drop', slot: slot(2, '09:30'), format: 'carousel', target: 'company', status: 'scheduled' },
    { id: 'u-2', title: '5 async communication rules that saved our remote engineering team', slot: slot(5, '14:00'), format: 'image', target: 'personal', status: 'scheduled' },
    { id: 'u-3', title: 'How we cut customer onboarding time from 14 days to 4 hours', slot: slot(9, '11:00'), format: 'article', target: 'company', status: 'approved' },
    { id: 'u-4', title: '5 mistakes first-time founders make on LinkedIn', slot: slot(10, '20:00'), format: 'video', target: 'personal', status: 'in_queue' },
  ];
}

const mapPost = (p) => ({
  id: p.id,
  title: p.title,
  slot: p.scheduledDate ? `${p.scheduledDate} ${p.scheduledTime || '09:00'} UTC` : '',
  format: p.visualFormat || 'image',
  target: p.account === 'company' ? 'company' : 'personal',
  status: p.status || 'scheduled',
  month: p.scheduledDate?.slice(0, 7),
});

/**
 * upcomingPosts === undefined -> demo data
 * upcomingPosts === []        -> empty state
 */
export default function DashboardUpcomingPostsCard({ upcomingPosts, limit = 4 }) {
  const navigate = useNavigate();
  const [targetFilter, setTargetFilter] = useState('all');

  const posts = useMemo(
    () => (upcomingPosts === undefined ? demoPosts() : upcomingPosts.map(mapPost)),
    [upcomingPosts]
  );
  const filtered = posts.filter((p) => targetFilter === 'all' || p.target === targetFilter).slice(0, limit);

  const openCalendar = (post) =>
    navigate(post?.month ? `/content-calendar?month=${post.month}` : '/content-calendar');

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={IconUpcomingPosts}
        tone="blue"
        title="Upcoming posts"
        badge={<span className="hidden text-xs font-medium text-muted-foreground sm:inline">Next 14 days</span>}
        action={
          <>
            <div className="relative">
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                aria-label="Filter by publishing target"
                className="h-8 cursor-pointer appearance-none rounded-lg border border-border/70 bg-card pl-2.5 pr-7 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <option value="all">All targets</option>
                <option value="company">Company page</option>
                <option value="personal">Personal profile</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <PanelLink onClick={() => navigate('/content-calendar')} className="hidden sm:inline-flex">
              Full calendar
            </PanelLink>
          </>
        }
      />

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center py-8 text-center">
          <CalendarPlus size={26} className="text-muted-foreground/70" />
          <p className="mt-2 text-[13px] font-semibold text-foreground">Nothing scheduled yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Fill the next open slot to keep your cadence.</p>
          <button
            type="button"
            onClick={() => navigate('/post-creation-composer')}
            className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Compose post
          </button>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-border/60">
          {filtered.map((post) => {
            const format = FORMATS[post.format] || FORMATS.image;
            const status = STATUS[post.status] || STATUS.scheduled;
            const target = TARGETS[post.target];
            const FormatIcon = format.icon;
            const TargetIcon = target.icon;

            return (
              <li key={post.id}>
                <div
                  role="link"
                  tabIndex={0}
                  onClick={() => openCalendar(post)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCalendar(post);
                    }
                  }}
                  className="group -mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 sm:items-center transition-colors hover:bg-muted/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span
                    title={format.label}
                    className="hidden size-9 shrink-0 place-items-center rounded-lg bg-muted/70 text-muted-foreground sm:grid"
                  >
                    <FormatIcon size={16} aria-hidden="true" />
                    <span className="sr-only">{format.label}</span>
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="sm:hidden">
                        <Pill tone={status.tone} dot>
                          {status.label}
                        </Pill>
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <IconPrecisionClock size={12} />
                        {formatSlot(post.slot)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <TargetIcon size={11} />
                        {target.label}
                      </span>
                    </div>
                  </div>

                  <span className="hidden sm:block">
                    <Pill tone={status.tone} dot>
                      {status.label}
                    </Pill>
                  </span>
                  <IconButton
                    label="Post options"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCalendar(post);
                    }}
                  >
                    <MoreVertical size={14} />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
