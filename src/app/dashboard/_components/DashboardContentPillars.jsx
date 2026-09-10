'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Sparkles, Layers } from 'lucide-react';

export default function DashboardContentPillars() {
  const navigate = useNavigate();

  const pillars = [
    {
      id: 'pillar-1',
      name: 'Thought Leadership',
      current: 12,
      target: 15,
      percentage: 80,
      color: 'bg-emerald-500',
      bgClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      account: 'Personal Profile',
    },
    {
      id: 'pillar-2',
      name: 'Case Studies & Proof',
      current: 6,
      target: 8,
      percentage: 75,
      color: 'bg-blue-500',
      bgClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      account: 'Company Page',
    },
    {
      id: 'pillar-3',
      name: 'Engineering Culture',
      current: 5,
      target: 6,
      percentage: 83,
      color: 'bg-purple-500',
      bgClass: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      account: 'Company Page',
    },
    {
      id: 'pillar-4',
      name: 'Industry Insights',
      current: 4,
      target: 5,
      percentage: 80,
      color: 'bg-amber-500',
      bgClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      account: 'Personal Profile',
    },
  ];

  const totalPlanned = pillars.reduce((acc, p) => acc + p.current, 0);
  const totalTarget = pillars.reduce((acc, p) => acc + p.target, 0);
  const overallBalance = Math.round((totalPlanned / totalTarget) * 100);

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between h-full gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Target size={14} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Content Pillars & Themes</h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {overallBalance}% Balanced
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/topics')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Manage Topics</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Pillars List with Quota Progress Bars */}
      <div className="flex flex-col gap-2.5 my-auto">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            onClick={() => navigate(`/topics?series=${encodeURIComponent(pillar.name)}`)}
            className="p-2 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {pillar.name}
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
                  · {pillar.account}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs shrink-0 font-medium">
                <span className="font-bold text-foreground tabular-nums">{pillar.current}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground tabular-nums">{pillar.target}</span>
                <span className="text-[10px] font-mono text-muted-foreground ml-1">
                  ({pillar.percentage}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-muted/70 overflow-hidden">
              <div
                style={{ width: `${pillar.percentage}%` }}
                className={`h-full rounded-full ${pillar.color} transition-all duration-500 group-hover:opacity-90`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          <span className="font-bold text-foreground">{totalPlanned}</span> of {totalTarget} monthly posts planned
        </span>
        <span className="text-primary font-semibold flex items-center gap-0.5">
          <Sparkles size={11} />
          Cadence Healthy
        </span>
      </div>
    </div>
  );
}
