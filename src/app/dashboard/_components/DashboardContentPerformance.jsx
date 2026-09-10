'use client';

import React, { useState } from 'react';
import { ChevronDown, TrendingUp, Sparkles, BarChart2 } from 'lucide-react';

export default function DashboardContentPerformance() {
  const [timeRange, setTimeRange] = useState('14d');
  const [activeHoverIdx, setActiveHoverIdx] = useState(4); // Default to peak (Sep 6)

  // Daily performance data for Sep 2 through Sep 9
  const bars = [
    { day: 'Sep 2', posts: 18, height: 42 },
    { day: '3', posts: 12, height: 26 },
    { day: '4', posts: 24, height: 50 },
    { day: '5', posts: 31, height: 65 },
    { day: '6', posts: 42, height: 95, isPeak: true },
    { day: '7', posts: 26, height: 55 },
    { day: '8', posts: 34, height: 72 },
    { day: '9', posts: 38, height: 82 },
  ];

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <BarChart2 size={14} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Content Performance</h3>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-muted/50 border border-border/80 text-xs font-semibold text-foreground py-1 px-2.5 rounded-lg outline-none cursor-pointer appearance-none pr-6"
          >
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* Top Metric Strip: Fills the card and eliminates empty white space */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-foreground tabular-nums">38.4K</span>
          <span className="text-xs text-muted-foreground">Impressions</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center gap-0.5">
            <TrendingUp size={10} />
            +18.4%
          </span>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          Avg. Engagement: <span className="font-bold text-foreground">4.8%</span>
        </div>
      </div>

      {/* Sleek Dark Slate Container for Wave & Bar Chart */}
      <div className="flex-1 flex flex-col justify-between bg-[#0b1120] text-white rounded-xl p-4 relative overflow-hidden shadow-inner min-h-[220px]">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic / Peak Tooltip aligned with selected bar */}
        <div className="flex justify-center mb-1">
          <div className="relative bg-white text-slate-900 text-center px-3.5 py-1.5 rounded-xl shadow-lg transition-all duration-200 animate-in fade-in">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs font-black leading-none">
                {bars[activeHoverIdx]?.posts} posts
              </span>
              {bars[activeHoverIdx]?.isPeak && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-semibold text-slate-600 block mt-0.5">
              {bars[activeHoverIdx]?.isPeak ? 'Highest this month' : `Activity on ${bars[activeHoverIdx]?.day}`}
            </span>
            {/* Tooltip triangle indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
          </div>
        </div>

        {/* Bar chart visualization with refined, elegant columns */}
        <div className="flex items-end justify-between gap-2.5 h-28 px-2 pt-2">
          {bars.map((bar, idx) => {
            const isSelected = activeHoverIdx === idx;
            return (
              <div
                key={bar.day || idx}
                onMouseEnter={() => setActiveHoverIdx(idx)}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
              >
                {/* Refined gradient pillar bar */}
                <div
                  style={{ height: `${bar.height}%` }}
                  className={`w-full max-w-[22px] rounded-t-lg rounded-b-sm transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-blue-600 via-indigo-500 to-sky-400 shadow-[0_0_14px_rgba(99,102,241,0.6)] scale-y-105'
                      : bar.isPeak
                      ? 'bg-gradient-to-t from-blue-600/90 to-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                      : 'bg-gradient-to-t from-slate-800 to-slate-500/80 group-hover:from-slate-700 group-hover:to-slate-400'
                  }`}
                />
                <span
                  className={`text-[10px] font-mono select-none transition-colors ${
                    isSelected ? 'text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {bar.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Legend Breakdown */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex items-center justify-between text-[11px] text-slate-300 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
            <span className="font-bold text-white">42</span>
            <span className="text-slate-400">Scheduled</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-bold text-white">28</span>
            <span className="text-slate-400">Published</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="font-bold text-white">6</span>
            <span className="text-slate-400">In review</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <span className="font-bold text-white">2</span>
            <span className="text-slate-400">Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
