'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, CornerArrowButton } from './DashboardPrimitives';

const DEFAULT_ITEMS = [
  {
    id: 'focus-1',
    time: '10:00 AM',
    status: 'normal',
    title: 'Review pending posts',
    detail: '3 items',
    link: '/approval-workflow?status=awaiting_review',
  },
  {
    id: 'focus-2',
    time: '12:30 PM',
    status: 'normal',
    title: 'Approve campaign draft',
    detail: 'Marketing, high priority',
    link: '/approval-workflow',
  },
  {
    id: 'focus-3',
    time: '03:00 PM',
    status: 'attention',
    title: 'Check pipeline alerts',
    detail: '1 critical issue',
    link: '/approval-workflow?status=failed',
  },
];

export default function DashboardTodayFocus({ items = DEFAULT_ITEMS }) {
  const navigate = useNavigate();

  return (
    <Panel className="flex h-full flex-col justify-between p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-[color:var(--text)]">
          Today&apos;s focus
        </h3>
        <CornerArrowButton onClick={() => navigate('/content-calendar')} label="View calendar" />
      </div>

      {/* Single dot vertical timeline */}
      <div className="my-auto py-2">
        <ol className="relative flex flex-col gap-3">
          {items.map((item, idx) => {
            const isCritical =
              item.status === 'attention' ||
              item.id === 'focus-3' ||
              item.detail?.includes('critical');
            const isLast = idx === items.length - 1;

            return (
              <li key={item.id} className="relative flex items-start gap-3">
                {/* Time */}
                <span className="w-16 shrink-0 pt-0.5 text-right font-medium text-[11px] tabular-nums text-[color:var(--text-muted)]">
                  {item.time}
                </span>

                {/* Single Timeline Column with Exactly One Dot & Thin Connecting Line */}
                <div className="relative flex flex-col items-center self-stretch shrink-0 pt-1">
                  <span
                    className={`size-2.5 rounded-full ring-2 ring-white z-10 ${
                      isCritical ? 'bg-[color:var(--danger)]' : 'bg-[color:var(--text)]'
                    }`}
                  />
                  {!isLast && (
                    <span
                      className="w-[1.5px] flex-1 bg-[color:var(--border)] mt-1"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Title & details */}
                <button
                  type="button"
                  onClick={() => navigate(item.link)}
                  className="group flex-1 -mt-0.5 rounded-xl p-1.5 text-left transition-colors hover:bg-[color:var(--chip)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
                >
                  <span className="block text-xs font-semibold text-[color:var(--text)] group-hover:text-[color:var(--brand)] transition-colors leading-snug">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[color:var(--text-muted)]">
                    {item.detail}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}
