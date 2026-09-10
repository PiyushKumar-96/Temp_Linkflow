'use client';

import React, { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { Panel, PanelHeader, Pill, TONES } from './DashboardPrimitives';

const ROWS = [
  { key: 'onTrack', label: 'On track', tone: 'emerald', route: '/content-calendar' },
  { key: 'inReview', label: 'In review', tone: 'blue', route: '/approval-workflow?status=awaiting_review' },
  { key: 'needsAttention', label: 'Needs attention', tone: 'amber', route: '/approval-workflow?status=needs_revision' },
  { key: 'blocked', label: 'Blocked', tone: 'rose', route: '/approval-workflow?status=failed' },
];

export default function DashboardPipelineHealth({
  percentage,
  stats = { onTrack: 22, inReview: 5, needsAttention: 2, blocked: 1 },
}) {
  const navigate = useNavigate();
  const gradientId = `ph-${useId().replace(/:/g, '')}`;

  const total = ROWS.reduce((sum, r) => sum + (stats[r.key] || 0), 0);
  const pct = percentage ?? (total ? Math.round((stats.onTrack / total) * 100) : 0);

  const size = 120;
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={Activity}
        tone="emerald"
        title="Pipeline health"
        action={
          <Pill tone="emerald" dot pulse>
            Live
          </Pill>
        }
      />

      <div className="my-auto flex items-center gap-4 pt-4">
        <div
          className="relative shrink-0"
          role="img"
          aria-label={`${pct} percent of posts on track`}
        >
          <svg width={size} height={size} className="-rotate-90">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={stroke}
              fill="none"
              className="stroke-slate-100 dark:stroke-white/10"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="none"
              className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold leading-none tracking-tight text-foreground tabular-nums">
              {pct}%
            </span>
            <span className="mt-1 text-[11px] font-medium text-muted-foreground">On track</span>
          </div>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col gap-0.5">
          {ROWS.map((row) => (
            <li key={row.key}>
              <button
                type="button"
                onClick={() => navigate(row.route)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 text-left text-[13px] transition-colors hover:bg-muted/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className={`size-2 shrink-0 rounded-full ${TONES[row.tone].dot}`} />
                  <span className="whitespace-nowrap text-muted-foreground">{row.label}</span>
                </span>
                <span className="font-semibold text-foreground tabular-nums">{stats[row.key] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
