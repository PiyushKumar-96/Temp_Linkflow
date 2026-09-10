'use client';

import React from 'react';
import { MONTHS_2026, computeWeekRanges } from '../_model/week-ranges';

export default function TopicWeeklySelector({
  startDate,
  endDate,
  currentMonthKey,
  onMonthChange,
  onSelectWeek,
}) {
  const weekRanges = computeWeekRanges(currentMonthKey);

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">Target Month</span>
        <select
          value={currentMonthKey}
          onChange={(e) => onMonthChange(e.target.value)}
          className="input py-1 text-xs bg-card w-40"
        >
          {MONTHS_2026.map((m) => (
            <option key={m.key} value={m.key}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        {weekRanges.map((w) => {
          const isSelected = startDate === w.startDate && endDate === w.endDate;
          return (
            <button
              key={w.label}
              type="button"
              onClick={() => onSelectWeek(w)}
              className={`p-2 rounded-lg border text-left flex flex-col transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-xs">{w.label}</span>
              <span className="text-[10px] opacity-75 tabular-nums">{w.subtext}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-card/60 px-2.5 py-1.5 rounded-md border border-border/50">
        <span>Selected Range:</span>
        <span className="font-semibold text-foreground tabular-nums">
          {startDate} → {endDate} (7 days)
        </span>
      </div>
    </div>
  );
}
