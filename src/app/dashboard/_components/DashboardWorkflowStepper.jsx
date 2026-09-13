'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Panel } from './DashboardPrimitives';

const DEFAULT_STEPS = [
  {
    id: 'slots',
    number: 1,
    title: 'Set slots in settings',
    meta: '2 slots set',
    status: 'done',
    route: '/settings',
  },
  {
    id: 'draft',
    number: 2,
    title: 'Plan topic or draft post',
    meta: '4 drafts in progress',
    status: 'active',
    route: '/topics',
  },
  {
    id: 'approve',
    number: 3,
    title: 'Owner approves in queue',
    meta: '2 waiting for review',
    status: 'upcoming',
    route: '/approval-workflow',
  },
  {
    id: 'publish',
    number: 4,
    title: 'Auto-publish to LinkedIn',
    meta: 'Sent via Buffer',
    status: 'upcoming',
    route: '/content-calendar',
  },
];

export default function DashboardWorkflowStepper({ steps = DEFAULT_STEPS, onOpenWorkflowModal }) {
  const navigate = useNavigate();

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[color:var(--text)]">
              Standard workflow
            </h3>
            <p className="text-xs text-[color:var(--text-muted)]">
              From draft to LinkedIn in 4 steps
            </p>
          </div>
          {/* Neutral pill button for How it works */}
          <button
            type="button"
            onClick={onOpenWorkflowModal || (() => navigate('/approval-workflow'))}
            className="inline-flex h-8 items-center rounded-full bg-[color:var(--chip)] px-3.5 text-xs font-semibold text-[color:var(--text)] transition-colors hover:bg-[color:var(--border)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
          >
            How it works
          </button>
        </div>

        {/* Single rounded track in neutral warm track with evenly distributed steps */}
        <div className="relative rounded-[20px] bg-[color:var(--track-warm)] p-2 sm:p-2.5">
          <ol className="flex flex-col sm:flex-row items-stretch sm:items-center w-full">
            {steps.map((step, idx) => {
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';
              const isLast = idx === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Item */}
                  <li className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate(step.route)}
                      className={`group flex w-full items-center gap-2.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] ${
                        isActive
                          ? 'rounded-full bg-[color:var(--accent-tint)] px-3.5 py-1.5'
                          : 'rounded-full px-2.5 py-1.5 hover:bg-white'
                      }`}
                    >
                      {/* Circle Indicator */}
                      {isDone ? (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[color:var(--brand)] text-white">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      ) : isActive ? (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] text-[color:var(--on-accent)] text-xs font-bold tabular-nums">
                          {step.number}
                        </span>
                      ) : (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-[color:var(--border)] bg-white text-xs font-semibold text-[color:var(--text-muted)] tabular-nums">
                          {step.number}
                        </span>
                      )}

                      {/* Step label & meta */}
                      <div className="min-w-0 flex-1 text-left">
                        <span
                          className={`block truncate text-xs font-semibold leading-tight ${
                            isActive
                              ? 'text-[color:var(--accent-text)]'
                              : isDone
                                ? 'text-[color:var(--text)]'
                                : 'text-[color:var(--text-muted)]'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`block truncate text-[11px] leading-tight ${
                            isActive
                              ? 'text-[color:color-mix(in_srgb,var(--accent-text)_80%,transparent)]'
                              : 'text-[color:var(--text-muted)]'
                          }`}
                        >
                          {step.meta}
                        </span>
                      </div>
                    </button>
                  </li>

                  {/* Equal width connector between steps */}
                  {!isLast && (
                    <div
                      className="hidden sm:block h-[1.5px] w-6 shrink-0 bg-[color:var(--border)] mx-2"
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </div>
      </div>
    </Panel>
  );
}
