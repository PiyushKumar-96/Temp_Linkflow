'use client';

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CalendarPlus } from 'lucide-react';
import { Panel, CornerArrowButton, addDays, toISODate, formatSlot } from './DashboardPrimitives';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function demoPosts() {
  const today = new Date();
  const slot = (days, time) => `${toISODate(addDays(today, days))} ${time} UTC`;
  return [
    { id: 'u-1', title: 'The modern B2B marketing stack for 2027: what to keep and what to drop', slot: slot(0, '09:30'), format: 'carousel', target: 'company', targetName: 'Company page', status: 'approved' },
    { id: 'u-2', title: '5 async communication rules that saved our remote engineering team', slot: slot(3, '14:00'), format: 'image', target: 'personal', targetName: 'Personal profile', status: 'approved' },
    { id: 'u-3', title: 'How we cut customer onboarding time from 14 days to 4 hours', slot: slot(7, '11:00'), format: 'article', target: 'company', targetName: 'Company page', status: 'approved' },
    { id: 'u-4', title: '5 mistakes first-time founders make on LinkedIn', slot: slot(10, '20:00'), format: 'video', target: 'personal', targetName: 'Personal profile', status: 'approved' },
  ];
}

const mapPost = (p) => ({
  id: p.id,
  title: p.title,
  slot: p.scheduledDate ? `${p.scheduledDate} ${p.scheduledTime || '09:00'} UTC` : '',
  format: p.visualFormat || 'image',
  target: p.account === 'company' ? 'company' : 'personal',
  targetName: p.account === 'company' ? 'Company page' : 'Personal profile',
  status: p.status || 'approved',
  month: p.scheduledDate?.slice(0, 7),
});

function parseDateComponents(slotStr) {
  if (!slotStr) {
    const d = new Date();
    return { day: String(d.getDate()).padStart(2, '0'), month: MONTHS_SHORT[d.getMonth()] };
  }
  const m = slotStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const mo = Number(m[2]) - 1;
    return { day: m[3], month: MONTHS_SHORT[mo] || 'Sep' };
  }
  return { day: '11', month: 'Sep' };
}

export default function DashboardUpcomingPostsCard({ upcomingPosts, limit = 4 }) {
  const navigate = useNavigate();
  const [targetFilter, setTargetFilter] = useState('all');

  const posts = useMemo(() => {
    const raw = upcomingPosts === undefined ? demoPosts() : upcomingPosts.map(mapPost);
    const seen = new Set();
    const unique = [];
    for (const p of raw) {
      const key = (p.title || p.id || '').trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }
    return unique;
  }, [upcomingPosts]);

  const filtered = posts.filter((p) => targetFilter === 'all' || p.target === targetFilter).slice(0, limit);

  const openCalendar = (post) =>
    navigate(post?.month ? `/content-calendar?month=${post.month}` : '/content-calendar');

  return (
    <Panel className="flex h-full flex-col p-5 sm:p-6">
      {/* Header: Title + All targets pill + Corner ↗ button */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-[#1B1B1F]">
          Upcoming posts
        </h3>

        <div className="flex items-center gap-2">
          {/* Neutral pill dropdown for All targets */}
          <div className="relative">
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              aria-label="Filter by publishing target"
              className="h-8 cursor-pointer appearance-none rounded-full bg-[#F0EFEB] pl-3.5 pr-7 text-xs font-semibold text-[#1B1B1F] outline-none transition-colors hover:bg-[#E4E2DC] focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
            >
              <option value="all">All targets</option>
              <option value="company">Company page</option>
              <option value="personal">Personal profile</option>
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B6B70]" />
          </div>

          <CornerArrowButton
            onClick={() => navigate('/content-calendar')}
            label="Full calendar"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-6 text-center">
          <CalendarPlus size={24} className="text-[#6B6B70]" />
          <p className="mt-2 text-xs font-semibold text-[#1B1B1F]">Nothing scheduled yet</p>
          <p className="mt-0.5 text-xs text-[#6B6B70]">Fill the next open slot to keep your cadence.</p>
        </div>
      ) : (
        <ul className="mt-3.5 flex flex-col gap-2.5">
          {filtered.map((post) => {
            const { day, month } = parseDateComponents(post.slot);

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
                  className="group flex items-center gap-3.5 rounded-[16px] p-2 transition-colors hover:bg-[#F0EFEB]/70 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
                >
                  {/* Date block: Identical neutral #F0EFEB with ink numerals for all rows */}
                  <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-[14px] bg-[#F0EFEB] text-[#1B1B1F]">
                    <span className="text-base font-bold leading-none tabular-nums">
                      {day}
                    </span>
                    <span className="text-[10px] font-semibold uppercase leading-tight text-[#6B6B70]">
                      {month}
                    </span>
                  </div>

                  {/* Title + time + profile */}
                  <div className="min-w-0 flex-1">
                    <p
                      title={post.title}
                      className="text-xs font-semibold text-[#1B1B1F] transition-colors group-hover:text-[#0A66C2] leading-snug line-clamp-2"
                    >
                      {post.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#6B6B70]">
                      <span className="tabular-nums font-medium text-[#1B1B1F]">
                        {formatSlot(post.slot) || 'Upcoming'}
                      </span>
                      <span>·</span>
                      <span>{post.targetName}</span>
                    </div>
                  </div>

                  {/* Status pill: suppressed when approved, rendered only on exception */}
                  {post.status && post.status !== 'approved' && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        post.status === 'failed'
                          ? 'bg-[#FDECEC] text-[#D64545]'
                          : post.status === 'needs_revision'
                          ? 'bg-[#FEF5E7] text-[#E8A33D]'
                          : post.status === 'awaiting_review' || post.status === 'in_review'
                          ? 'bg-[#E6F1FB] text-[#0A66C2]'
                          : 'bg-[#F0EFEB] text-[#6B6B70]'
                      }`}
                    >
                      {post.status === 'awaiting_review' || post.status === 'in_review'
                        ? 'In review'
                        : post.status === 'needs_revision'
                        ? 'Revision'
                        : post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
