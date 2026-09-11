'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { IconWorkflow, IconWorkflowHowItWorks } from './DashboardCustomIcons';
import { Panel, buttonStyles } from './DashboardPrimitives';

const DEFAULT_STEPS = [
  { id: 'slots', title: 'Set slots in settings', meta: '2 slots set', status: 'done', route: '/settings' },
  { id: 'draft', title: 'Plan topic or draft post', meta: '4 drafts in progress', status: 'active', route: '/topics' },
  { id: 'approve', title: 'Owner approves in queue', meta: '2 waiting for review', status: 'waiting', route: '/approval-workflow' },
  { id: 'publish', title: 'Auto-publish to LinkedIn', meta: 'Sent via Buffer', status: 'upcoming', route: '/content-calendar' },
];

const STATUS_STYLES = {
  done: {
    container: 'bg-emerald-50/70 ring-emerald-600/15 hover:bg-emerald-50 dark:bg-emerald-400/[0.06] dark:ring-emerald-400/20',
    badge: 'bg-emerald-500 text-white',
    label: 'Completed',
  },
  active: {
    container: 'bg-card ring-primary/30 shadow-[0_4px_14px_-6px_rgba(59,130,246,0.35)] hover:ring-primary/55',
    badge: 'bg-primary text-primary-foreground',
    label: 'In progress',
  },
  waiting: {
    container: 'bg-amber-50/60 ring-amber-600/15 hover:bg-amber-50 dark:bg-amber-400/[0.06] dark:ring-amber-400/20',
    badge: 'bg-amber-500 text-white',
    label: 'Waiting',
  },
  upcoming: {
    container: 'bg-purple-50/80 ring-purple-500/25 hover:bg-purple-100/70 dark:bg-purple-400/[0.08] dark:ring-purple-400/25',
    badge: 'bg-purple-500 text-white',
    label: 'Upcoming',
  },
};

export default function DashboardWorkflowStepper({ steps = DEFAULT_STEPS, onOpenWorkflowModal }) {
  const navigate = useNavigate();

  return (
    <Panel className="p-4 sm:p-5">
      {/* Below 2xl: title + actions on top, steps full-width beneath. At 2xl everything sits on one line. */}
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 2xl:contents">
          {/* Title block */}
          <div className="flex items-center gap-3 2xl:order-1 2xl:shrink-0 2xl:border-r 2xl:border-border/60 2xl:pr-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-indigo-500/5 text-violet-600 dark:text-violet-400 ring-1 ring-inset ring-violet-500/25 shadow-[0_2px_12px_-2px_rgba(139,92,246,0.3)]">
              <IconWorkflow size={20} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold tracking-tight text-foreground">Standard workflow</h3>
              <p className="whitespace-nowrap text-xs text-muted-foreground">From draft to LinkedIn in 4 steps</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 2xl:order-3">
            <button
              type="button"
              onClick={onOpenWorkflowModal || (() => navigate('/approval-workflow'))}
              className={`${buttonStyles.outline} h-9 px-3.5 flex items-center gap-1.5`}
            >
              <IconWorkflowHowItWorks size={14} />
              <span>How it works</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Steps */}
        <ol className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center 2xl:order-2">
          {steps.map((step, idx) => {
            const s = STATUS_STYLES[step.status] || STATUS_STYLES.upcoming;
            return (
              <React.Fragment key={step.id}>
                <li className="min-w-0">
                  <button
                    type="button"
                    onClick={() => navigate(step.route)}
                    aria-label={`Step ${idx + 1}: ${step.title}. ${s.label}. ${step.meta}`}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ring-1 ring-inset transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${s.container}`}
                  >
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${s.badge}`}>
                      {step.status === 'done' ? <Check size={14} strokeWidth={3} /> : idx + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-foreground">{step.title}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{step.meta}</span>
                    </span>
                  </button>
                </li>
                {idx < steps.length - 1 && (
                  <li aria-hidden="true" className="hidden justify-center text-muted-foreground/50 lg:flex">
                    <ChevronRight size={16} />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}
