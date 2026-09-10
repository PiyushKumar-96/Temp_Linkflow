'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListChecks } from 'lucide-react';
import { Panel, PanelHeader, PanelLink, Pill } from './DashboardPrimitives';

const DEFAULT_ITEMS = [
  {
    id: 'focus-1',
    time: '10:00 AM',
    tone: 'emerald',
    title: 'Review pending posts',
    detail: '3 items',
    link: '/approval-workflow?status=awaiting_review',
  },
  {
    id: 'focus-2',
    time: '12:30 PM',
    tone: 'blue',
    title: 'Approve campaign draft',
    detail: 'Marketing, high priority',
    link: '/approval-workflow',
  },
  {
    id: 'focus-3',
    time: '03:00 PM',
    tone: 'amber',
    title: 'Check pipeline alerts',
    detail: '1 critical issue',
    link: '/approval-workflow?status=failed',
  },
];

const RAIL = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  indigo: 'bg-indigo-500',
  slate: 'bg-slate-400',
};

/** "03:00 PM" -> minutes since midnight (or null) */
function toMinutes(time) {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(time || '');
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3]?.toUpperCase() === 'PM') h += 12;
  if (!m[3]) h = Number(m[1]);
  return h * 60 + Number(m[2]);
}

export default function DashboardTodayFocus({ items = DEFAULT_ITEMS }) {
  const navigate = useNavigate();

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nextIdx = items.findIndex((it) => (toMinutes(it.time) ?? Infinity) >= nowMinutes);

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={ListChecks}
        tone="blue"
        title="Today's focus"
        action={<PanelLink onClick={() => navigate('/content-calendar')}>View calendar</PanelLink>}
      />

      <ol className="my-auto flex flex-col gap-1 pt-4">
        {items.map((item, idx) => {
          const toneName = item.tone || item.color?.match(/bg-(\w+)-/)?.[1] || 'slate';
          const isPast = nextIdx === -1 || idx < nextIdx;
          const isNext = idx === nextIdx;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => navigate(item.link)}
                className="group grid w-full grid-cols-[62px_3px_1fr] items-stretch gap-x-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <time className="pt-px text-xs font-medium text-muted-foreground tabular-nums">{item.time}</time>
                <span
                  aria-hidden="true"
                  className={`rounded-full ${RAIL[toneName] || RAIL.slate} ${isPast ? 'opacity-35' : ''}`}
                />
                <span className="min-w-0">
                  <span
                    className={`block truncate text-[13px] font-semibold transition-colors group-hover:text-primary ${
                      isPast ? 'text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={`text-xs ${isPast ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                      {item.detail}
                    </span>
                    {isNext && <Pill tone="blue">Up next</Pill>}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
