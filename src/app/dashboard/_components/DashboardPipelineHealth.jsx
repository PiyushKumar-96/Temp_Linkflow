'use client';

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from './DashboardPrimitives';

const ROWS = [
  { key: 'onTrack', label: 'On track', color: 'var(--success)', route: '/content-calendar' },
  {
    key: 'inReview',
    label: 'In review',
    color: 'var(--info)',
    route: '/approval-workflow?status=awaiting_review',
  },
  {
    key: 'needsAttention',
    label: 'Needs attention',
    color: 'var(--warning)',
    route: '/approval-workflow?status=needs_revision',
  },
  {
    key: 'blocked',
    label: 'Blocked',
    color: 'var(--danger)',
    route: '/approval-workflow?status=failed',
  },
];

export default function DashboardPipelineHealth({
  percentage,
  stats = { onTrack: 22, inReview: 5, needsAttention: 2, blocked: 1 },
}) {
  const navigate = useNavigate();
  const rawId = React.useId();
  const maskId = `pipeline-mask-${rawId.replace(/[:]/g, '')}`;

  const total = ROWS.reduce((sum, r) => sum + (stats[r.key] || 0), 0);
  const pct = percentage ?? (total ? Math.round((stats.onTrack / total) * 100) : 73);

  // Semicircle gauge geometry
  const strokeWidth = 18;
  const radius = 68;
  const cx = 95;
  const cy = 82;

  // Active rows with positive count
  const activeRows = ROWS.filter((r) => (stats[r.key] || 0) > 0);

  // Build segmented SVG paths using butt caps inside a rounded track mask.
  // This completely eliminates bulbous overlap distortion on small segments (like blocked)
  // and prevents bleeding over neighboring segments (like needs attention).
  const segments = useMemo(() => {
    return activeRows.reduce((acc, row, index) => {
      const val = stats[row.key] || 0;
      const fraction = total > 0 ? val / total : 0;
      const fStart = acc.currentFraction;
      const fEnd = fStart + fraction;

      // Angles measured in radians: left is Math.PI (180°), right is 0 (0°).
      let a1 = Math.PI * (1 - fStart);
      let a2 = Math.PI * (1 - fEnd);

      // If starting at the beginning, extend slightly backwards past 180° to fill the mask's left round cap.
      if (fStart <= 0.0001) {
        a1 += 0.24;
      }
      // If ending at 1.0, extend slightly forwards past 0° to fill the mask's right round cap.
      if (fEnd >= 0.9999) {
        a2 -= 0.24;
      }

      const x1 = cx + radius * Math.cos(a1);
      const y1 = cy - radius * Math.sin(a1);
      const x2 = cx + radius * Math.cos(a2);
      const y2 = cy - radius * Math.sin(a2);

      const span = Math.abs(a1 - a2);
      const largeArcFlag = span > Math.PI ? 1 : 0;

      const d = `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;

      acc.list.push({
        ...row,
        d,
      });
      acc.currentFraction = fEnd;
      return acc;
    }, { list: [], currentFraction: 0 }).list;
  }, [activeRows, stats, total, cx, cy, radius]);

  return (
    <Panel className="flex h-full flex-col justify-between p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-[color:var(--text)]">
          Pipeline health
        </h3>
        {/* Live pill with pulsing green dot */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--success-tint)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--success-text)]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--success)] opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[color:var(--success)]" />
          </span>
          Live
        </span>
      </div>

      {/* Main content: Segmented semicircle gauge + 4-row legend */}
      <div className="my-auto flex flex-col items-center gap-4 py-2 sm:flex-row sm:items-center sm:justify-around">
        {/* Semicircle Gauge */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg
            width="190"
            height="100"
            viewBox="0 0 190 100"
            className="overflow-visible"
            role="img"
            aria-label={`${pct}% of posts on track`}
          >
            <defs>
              {/* Mask defines the overall rounded track geometry */}
              <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                <path
                  d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </mask>
            </defs>

            {/* Unfilled background track (warm neutral) */}
            <path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke="var(--chip)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Semicircle colored segments masked to the track with clean radial seams */}
            <g mask={`url(#${maskId})`}>
              {segments.map((seg) => (
                <path
                  key={seg.key}
                  d={seg.d}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth + 2}
                  strokeLinecap="butt"
                />
              ))}
            </g>
          </svg>

          {/* Hero number centered cleanly inside semicircle */}
          <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[36px] font-bold leading-none tabular-nums text-[color:var(--text)] tracking-tight">
              {pct}%
            </span>
            <span className="mt-1 text-xs font-medium text-[color:var(--text-muted)]">
              On track
            </span>
          </div>
        </div>

        {/* Legend: 4 compact rows with full label and bold count */}
        <ul className="flex min-w-[140px] flex-col gap-1 w-full sm:w-auto">
          {ROWS.map((row) => (
            <li key={row.key}>
              <button
                type="button"
                onClick={() => navigate(row.route)}
                className="flex w-full items-center justify-between gap-4 rounded-md px-2.5 py-1 text-left text-xs transition-colors hover:bg-[color:var(--chip)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span className="whitespace-nowrap text-xs font-medium text-[color:var(--text-muted)]">
                    {row.label}
                  </span>
                </span>
                <span className="font-semibold text-[color:var(--text)] tabular-nums">
                  {stats[row.key] ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
