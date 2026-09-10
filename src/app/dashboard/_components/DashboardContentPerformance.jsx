'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { IconContentPerformance } from './DashboardCustomIcons';
import { addDays } from './DashboardPrimitives';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Mock series — replace with analytics data when wired up.
const RANGES = {
  '7d': {
    label: '7 days',
    values: [4, 3, 5, 7, 4, 6, 6],
    bucket: 1,
    impressions: '17.9K',
    change: '+9.2%',
    legend: { scheduled: 18, published: 12, review: 4, failed: 1 },
  },
  '14d': {
    label: '14 days',
    values: [3, 2, 4, 3, 5, 4, 6, 3, 5, 8, 4, 6, 5, 6],
    bucket: 1,
    impressions: '38.4K',
    change: '+18.4%',
    legend: { scheduled: 42, published: 28, review: 6, failed: 2 },
  },
  '30d': {
    label: '30 days',
    values: [9, 11, 8, 14, 12, 10, 16, 13, 15, 17],
    bucket: 3,
    impressions: '81.2K',
    change: '+12.7%',
    legend: { scheduled: 86, published: 61, review: 9, failed: 3 },
  },
};

const LEGEND = [
  { key: 'scheduled', label: 'Scheduled', dot: 'bg-sky-400' },
  { key: 'published', label: 'Published', dot: 'bg-emerald-400' },
  { key: 'review', label: 'In review', dot: 'bg-amber-400' },
  { key: 'failed', label: 'Failed', dot: 'bg-rose-400' },
];

function buildBars(range) {
  const { values, bucket } = RANGES[range];
  const today = new Date();
  const max = Math.max(...values);
  const dense = values.length > 10;
  let lastMonth = null;

  return values.map((v, i) => {
    const end = addDays(today, -(values.length - 1 - i) * bucket);
    const start = addDays(end, -(bucket - 1));
    const labelDate = bucket > 1 ? start : end;
    const visible = !dense || (values.length - 1 - i) % 2 === 0;

    let short = String(labelDate.getDate());
    if (visible && labelDate.getMonth() !== lastMonth) {
      short = `${MONTHS[labelDate.getMonth()]} ${labelDate.getDate()}`;
      lastMonth = labelDate.getMonth();
    }
    const full =
      bucket > 1
        ? `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`
        : `${WEEKDAYS[end.getDay()]}, ${end.getDate()} ${MONTHS[end.getMonth()]}`;

    return { value: v, short, full, visible, height: 14 + (v / max) * 72, isPeak: v === max };
  });
}

export default function DashboardContentPerformance() {
  const [range, setRange] = useState('14d');
  const [hoverIdx, setHoverIdx] = useState(null);

  const data = RANGES[range];
  const bars = useMemo(() => buildBars(range), [range]);
  const peakIdx = bars.findIndex((b) => b.isPeak);
  const shownIdx = hoverIdx ?? peakIdx;
  const shown = bars[shownIdx];

  const anchor = ((shownIdx + 0.5) / bars.length) * 100;
  const shift = anchor < 22 ? 18 : anchor > 78 ? 82 : 50;
  const dense = bars.length > 10;

  return (
    <section className="relative isolate flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl bg-[#111a2e] p-5 text-white shadow-[0_1px_2px_rgba(15,23,42,0.2),0_18px_40px_-18px_rgba(15,23,42,0.6)] ring-1 ring-inset ring-white/[0.06]">
      {/* Ambient light */}
      <div aria-hidden="true" className="absolute -top-28 left-1/2 -z-10 size-80 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 -right-16 -z-10 size-56 rounded-full bg-sky-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-sky-500/10 text-indigo-200 ring-1 ring-white/15 shadow-[0_2px_10px_-2px_rgba(99,102,241,0.4)]">
            <IconContentPerformance size={17} />
          </span>
          <h3 className="truncate text-[15px] font-bold tracking-tight">Content performance</h3>
        </div>
        <div className="relative shrink-0">
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setHoverIdx(null);
            }}
            aria-label="Time range"
            className="h-8 cursor-pointer appearance-none rounded-lg bg-white/10 pl-3 pr-7 text-xs font-medium text-white outline-none ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-indigo-300 [&>option]:text-slate-900"
          >
            {Object.entries(RANGES).map(([key, r]) => (
              <option key={key} value={key}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/60" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2 pl-[38px] text-xs text-slate-400">
        <span className="text-sm font-semibold text-white tabular-nums">{data.impressions}</span>
        impressions
        <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-300">
          <TrendingUp size={12} />
          {data.change}
        </span>
      </div>

      {/* Chart */}
      <div className="relative mt-4 flex-1 pt-14" onMouseLeave={() => setHoverIdx(null)}>
        <div className="relative flex h-full min-h-[128px] flex-col">
          {/* Bars layer */}
          <div className="relative flex flex-1 items-end gap-1.5 sm:gap-2">
            {/* Tooltip */}
            {shown && (
              <div
                className="pointer-events-none absolute z-10 transition-[left,bottom] duration-200 ease-out motion-reduce:transition-none"
                style={{ left: `${anchor}%`, bottom: `calc(${shown.height}% + 10px)` }}
              >
                <div
                  className="relative whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-center text-slate-900 shadow-xl shadow-indigo-950/40"
                  style={{ transform: `translateX(-${shift}%)` }}
                >
                  <span className="block text-xs font-bold leading-tight tabular-nums">
                    {shown.value} posts
                  </span>
                  <span className="block text-[10px] font-medium text-slate-500">
                    {shown.isPeak ? 'Busiest in this range' : shown.full}
                  </span>
                  <span
                    className="absolute -bottom-1 size-2 -translate-x-1/2 rotate-45 bg-white"
                    style={{ left: `${shift}%` }}
                  />
                </div>
              </div>
            )}

            {bars.map((bar, idx) => {
              const active = idx === shownIdx;
              return (
                <button
                  key={`${range}-${idx}`}
                  type="button"
                  onMouseEnter={() => setHoverIdx(idx)}
                  onFocus={() => setHoverIdx(idx)}
                  onBlur={() => setHoverIdx(null)}
                  aria-label={`${bar.full}: ${bar.value} posts`}
                  className="group flex h-full flex-1 items-end justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 cursor-pointer"
                >
                  <span
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      dense ? 'max-w-[12px]' : 'max-w-[18px]'
                    } ${
                      active
                        ? 'bg-gradient-to-t from-indigo-400 to-indigo-100 shadow-[0_0_22px_rgba(165,180,252,0.65)]'
                        : 'bg-gradient-to-t from-indigo-300/15 to-indigo-200/55 group-hover:to-indigo-200/80'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="mt-2 flex gap-1.5 sm:gap-2" aria-hidden="true">
            {bars.map((bar, idx) => {
              const hideLabel = !bar.visible;
              return (
                <span
                  key={`${range}-l-${idx}`}
                  className={`flex-1 whitespace-nowrap text-center text-[10px] tabular-nums transition-colors ${
                    idx === shownIdx ? 'font-semibold text-white' : 'text-slate-500'
                  } ${hideLabel && idx !== shownIdx ? 'invisible' : ''}`}
                >
                  {bar.short}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
        {LEGEND.map((l) => (
          <div key={l.key} className="flex min-w-0 flex-col">
            <dt className="order-2 truncate text-[11px] text-slate-400">{l.label}</dt>
            <dd className="flex items-center gap-1.5 text-lg font-semibold leading-tight tabular-nums">
              <span className={`size-1.5 rounded-full ${l.dot}`} />
              {data.legend[l.key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
