'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPipelineHealth({
  percentage = 78,
  stats = {
    onTrack: 22,
    inReview: 5,
    needsAttention: 2,
    blocked: 1,
  },
}) {
  const navigate = useNavigate();

  // Circular gauge constants
  const size = 120;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card p-5 flex flex-col justify-between rounded-2xl border border-border shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Pipeline Health</h3>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Main Body: Donut Gauge + Legend */}
      <div className="flex items-center justify-between gap-4 my-auto pt-2">
        {/* Donut Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Percentage Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-2xl font-black text-foreground tracking-tight leading-none">
              {percentage}%
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground mt-1">
              On Track
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
          <div
            onClick={() => navigate('/content-calendar')}
            className="flex items-center justify-between text-xs hover:bg-muted/40 p-1 rounded transition-colors cursor-pointer"
            title="View scheduled content on calendar"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-muted-foreground">On Track</span>
            </div>
            <span className="font-bold text-foreground tabular-nums">{stats.onTrack}</span>
          </div>

          <div
            onClick={() => navigate('/approval-workflow?status=awaiting_review')}
            className="flex items-center justify-between text-xs hover:bg-muted/40 p-1 rounded transition-colors cursor-pointer"
            title="View posts currently in review"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-medium text-muted-foreground">In Review</span>
            </div>
            <span className="font-bold text-foreground tabular-nums">{stats.inReview}</span>
          </div>

          <div
            onClick={() => navigate('/approval-workflow?status=needs_revision')}
            className="flex items-center justify-between text-xs hover:bg-muted/40 p-1 rounded transition-colors cursor-pointer"
            title="View items needing attention"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-medium text-muted-foreground">Needs Attention</span>
            </div>
            <span className="font-bold text-foreground tabular-nums">{stats.needsAttention}</span>
          </div>

          <div
            onClick={() => navigate('/approval-workflow?status=failed')}
            className="flex items-center justify-between text-xs hover:bg-muted/40 p-1 rounded transition-colors cursor-pointer"
            title="View blocked or failed dispatches"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-medium text-muted-foreground">Blocked</span>
            </div>
            <span className="font-bold text-foreground tabular-nums">{stats.blocked}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
