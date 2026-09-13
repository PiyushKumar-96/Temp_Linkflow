'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { addDays } from './DashboardPrimitives';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
  { key: 'scheduled', label: 'Scheduled', dot: 'bg-[color:var(--info)]' },
  { key: 'published', label: 'Published', dot: 'bg-[color:var(--success)]' },
  { key: 'review', label: 'In review', dot: 'bg-[color:var(--warning)]' },
  { key: 'failed', label: 'Failed', dot: 'bg-[color:var(--danger)]' },
];

function buildBars(range) {
  const { values, bucket } = RANGES[range];
  const today = new Date();
  const max = Math.max(...values);
  const dense = values.length > 10;
  let firstVisibleSeen = false;
  let lastVisibleMonth = null;

  return values.map((v, i) => {
    const end = addDays(today, -(values.length - 1 - i) * bucket);
    const start = addDays(end, -(bucket - 1));
    const labelDate = bucket > 1 ? start : end;
    const visible = !dense || (values.length - 1 - i) % 2 === 0;

    let short = String(labelDate.getDate());
    if (visible) {
      if (!firstVisibleSeen || labelDate.getMonth() !== lastVisibleMonth) {
        short = `${labelDate.getDate()} ${MONTHS[labelDate.getMonth()]}`;
        firstVisibleSeen = true;
        lastVisibleMonth = labelDate.getMonth();
      }
    }

    const full =
      bucket > 1
        ? `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`
        : `${WEEKDAYS[end.getDay()]}, ${end.getDate()} ${MONTHS[end.getMonth()]}`;

    const height = max > 0 ? (v / max) * 100 : 0;

    return { value: v, short, full, visible, height, isPeak: v === max && v > 0 };
  });
}

export default function DashboardContentPerformance() {
  const [range, setRange] = useState('14d');
  const [hoverIdx, setHoverIdx] = useState(null);

  const data = RANGES[range];
  const bars = useMemo(() => buildBars(range), [range]);
  const shownIdx = hoverIdx;
  const shown = hoverIdx !== null ? bars[hoverIdx] : null;

  const anchor = hoverIdx !== null ? ((hoverIdx + 0.5) / bars.length) * 100 : 0;
  const shift = anchor < 20 ? 15 : anchor > 80 ? 85 : 50;

  return (
    <section className="relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-[24px] bg-[color:var(--card-dark)] p-6 text-white shadow-[0_1px_3px_rgba(20,24,33,0.12)]">
      {/* Top row: Title + Range selector */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">Content performance</h3>
        </div>

        {/* 14 days dark pill */}
        <div className="relative shrink-0">
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setHoverIdx(null);
            }}
            aria-label="Time range"
            className="h-8 cursor-pointer appearance-none rounded-full bg-[#1F2432] border border-[color:var(--bar-inactive)] pl-3.5 pr-8 text-xs font-semibold text-white outline-none transition-colors hover:bg-[#282F40] focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
          >
            {Object.entries(RANGES).map(([key, r]) => (
              <option key={key} value={key} className="bg-[color:var(--card-dark)] text-white">
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
          />
        </div>
      </div>

      {/* Hero numbers: impressions + accent-tint trend chip */}
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <span className="text-4xl sm:text-[48px] font-semibold leading-none tabular-nums tracking-tight text-white">
          {data.impressions}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#8F96A3]">impressions</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent-text)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--accent-on-dark)]">
          <TrendingUp size={12} strokeWidth={2.5} />
          {data.change}
        </span>
      </div>

      {/* Chart quiet caption */}
      <p className="mt-3 text-xs sm:text-sm font-medium text-[#8F96A3]">Posts published per day</p>

      {/* Pill bar chart: unselected bars in --bar-inactive (#2B3140), peak in flat --accent-on-dark (#9B9BF0) */}
      <div className="relative my-4 flex-1 pt-10" onMouseLeave={() => setHoverIdx(null)}>
        <div className="relative flex h-full min-h-[140px] flex-col">
          {/* Tooltip: renders on hover and focus only, dismissed at rest */}
          {shown && (
            <div
              className="pointer-events-none absolute z-20 transition-[left,bottom] duration-200 ease-out motion-reduce:transition-none"
              style={{ left: `${anchor}%`, bottom: `calc(${shown.height}% + 10px)` }}
            >
              <div
                className="relative whitespace-nowrap rounded-full bg-white px-3 py-1 text-center shadow-lg"
                style={{ transform: `translateX(-${shift}%)` }}
              >
                <span className="text-xs font-semibold text-[color:var(--text)]">
                  {shown.value} posts · {shown.full}
                </span>
              </div>
            </div>
          )}

          {/* Pill Bars */}
          <div className="relative flex flex-1 items-end gap-1.5 sm:gap-2.5">
            {bars.map((bar, idx) => {
              const active = idx === shownIdx;
              const isPeak = bar.isPeak;

              return (
                <button
                  key={`${range}-${idx}`}
                  type="button"
                  onMouseEnter={() => setHoverIdx(idx)}
                  onFocus={() => setHoverIdx(idx)}
                  onBlur={() => setHoverIdx(null)}
                  aria-label={`${bar.full}: ${bar.value} posts`}
                  className="group flex h-full flex-1 items-end justify-center outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] rounded-full"
                >
                  <span
                    style={{ height: `${bar.height}%` }}
                    className={`w-full max-w-[16px] sm:max-w-[20px] rounded-full transition-all duration-150 ${
                      isPeak
                        ? 'bg-[color:var(--accent-on-dark)]'
                        : active
                          ? 'bg-[#475168]'
                          : 'bg-[color:var(--bar-inactive)] hover:bg-[#384054]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="mt-2.5 flex gap-1.5 sm:gap-2.5" aria-hidden="true">
            {bars.map((bar, idx) => {
              const hideLabel = !bar.visible;
              return (
                <span
                  key={`${range}-l-${idx}`}
                  className={`flex-1 whitespace-nowrap text-center text-[10px] tabular-nums transition-colors ${
                    idx === shownIdx ? 'font-semibold text-white' : 'text-[#8F96A3]'
                  } ${hideLabel && idx !== shownIdx ? 'invisible' : ''}`}
                >
                  {bar.short}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom stats: four numbers with status dots and labels */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-[#232836] pt-4">
        {LEGEND.map((l) => (
          <div key={l.key} className="flex flex-col">
            <dt className="order-2 mt-1 truncate text-xs text-[#8F96A3]">{l.label}</dt>
            <dd className="order-1 flex items-center gap-2 text-xl sm:text-2xl font-semibold tabular-nums text-white">
              <span className={`size-2 shrink-0 rounded-full ${l.dot}`} />
              <span>{data.legend[l.key]}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
