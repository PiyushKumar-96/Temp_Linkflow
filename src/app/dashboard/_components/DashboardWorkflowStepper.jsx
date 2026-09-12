'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Panel } from './DashboardPrimitives';

const DEFAULT_STEPS = [
  { id: 'slots', number: 1, title: 'Set slots in settings', meta: '2 slots set', status: 'done', route: '/settings' },
  { id: 'draft', number: 2, title: 'Plan topic or draft post', meta: '4 drafts in progress', status: 'active', route: '/topics' },
  { id: 'approve', number: 3, title: 'Owner approves in queue', meta: '2 waiting for review', status: 'upcoming', route: '/approval-workflow' },
  { id: 'publish', number: 4, title: 'Auto-publish to LinkedIn', meta: 'Sent via Buffer', status: 'upcoming', route: '/content-calendar' },
];

export default function DashboardWorkflowStepper({ steps = DEFAULT_STEPS, onOpenWorkflowModal }) {
  const navigate = useNavigate();

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#1B1B1F]">Standard workflow</h3>
            <p className="text-xs text-[#6B6B70]">From draft to LinkedIn in 4 steps</p>
          </div>
          {/* Neutral pill button for How it works */}
          <button
            type="button"
            onClick={onOpenWorkflowModal || (() => navigate('/approval-workflow'))}
            className="inline-flex h-8 items-center rounded-full bg-[#F0EFEB] px-3.5 text-xs font-semibold text-[#1B1B1F] transition-colors hover:bg-[#E4E2DC] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
          >
            How it works
          </button>
        </div>

        {/* Single rounded track in neutral #F8F7F4 with evenly distributed steps */}
        <div className="relative rounded-[20px] bg-[#F8F7F4] p-2 sm:p-2.5">
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
                      className={`group flex w-full items-center gap-2.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                        isActive
                          ? 'rounded-full bg-[var(--accent-tint)] px-3.5 py-1.5'
                          : 'rounded-full px-2.5 py-1.5 hover:bg-white'
                      }`}
                    >
                      {/* Circle Indicator */}
                      {isDone ? (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-white">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      ) : isActive ? (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-xs font-bold tabular-nums">
                          {step.number}
                        </span>
                      ) : (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-[#E4E2DC] bg-white text-xs font-semibold text-[#6B6B70] tabular-nums">
                          {step.number}
                        </span>
                      )}

                      {/* Step label & meta */}
                      <div className="min-w-0 flex-1 text-left">
                        <span
                          className={`block truncate text-xs font-semibold leading-tight ${
                            isActive ? 'text-[var(--accent-text)]' : isDone ? 'text-[#1B1B1F]' : 'text-[#6B6B70]'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`block truncate text-[11px] leading-tight ${
                            isActive ? 'text-[var(--accent-text)]/80' : 'text-[#6B6B70]'
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
                      className="hidden sm:block h-[1.5px] w-6 shrink-0 bg-[#E4E2DC] mx-2"
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
