'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Sparkles, AlertCircle } from 'lucide-react';
import { Panel, PanelHeader, PanelLink, Pill } from './DashboardPrimitives';

const BAR = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

const DEFAULT_PILLARS = [
  { id: 'pillar-1', name: 'Thought leadership', current: 12, target: 15, tone: 'emerald', account: 'Personal profile' },
  { id: 'pillar-2', name: 'Case studies & proof', current: 6, target: 8, tone: 'blue', account: 'Company page' },
  { id: 'pillar-3', name: 'Engineering culture', current: 5, target: 6, tone: 'violet', account: 'Company page' },
  { id: 'pillar-4', name: 'Industry insights', current: 4, target: 5, tone: 'amber', account: 'Personal profile' },
];

export default function DashboardContentPillars({ pillars = DEFAULT_PILLARS }) {
  const navigate = useNavigate();

  const totalPlanned = pillars.reduce((acc, p) => acc + p.current, 0);
  const totalTarget = pillars.reduce((acc, p) => acc + p.target, 0);
  const balance = totalTarget ? Math.round((totalPlanned / totalTarget) * 100) : 0;
  const healthy = balance >= 75;

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={Target}
        tone="indigo"
        title="Content pillars"
        badge={
          <Pill tone={healthy ? 'emerald' : 'amber'} dot>
            {balance}% of target
          </Pill>
        }
        action={<PanelLink onClick={() => navigate('/topics')}>Manage topics</PanelLink>}
      />

      <ul className="my-auto flex flex-col gap-1 pt-4">
        {pillars.map((pillar) => {
          const pct = Math.min(100, Math.round((pillar.current / pillar.target) * 100));
          return (
            <li key={pillar.id}>
              <button
                type="button"
                onClick={() => navigate(`/topics?series=${encodeURIComponent(pillar.name)}`)}
                className="group w-full rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {pillar.name}
                    <span className="ml-2 hidden text-[11px] font-normal text-muted-foreground sm:inline">
                      {pillar.account}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    <span className="font-semibold text-foreground">{pillar.current}</span> / {pillar.target}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full ${BAR[pillar.tone] || BAR.blue} transition-[width] duration-500 motion-reduce:transition-none`}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground tabular-nums">{totalPlanned}</span> of {totalTarget} monthly posts planned
        </span>
        <span className={`inline-flex items-center gap-1 font-semibold ${healthy ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>
          {healthy ? <Sparkles size={12} /> : <AlertCircle size={12} />}
          {healthy ? 'Cadence healthy' : 'Behind plan'}
        </span>
      </div>
    </Panel>
  );
}
