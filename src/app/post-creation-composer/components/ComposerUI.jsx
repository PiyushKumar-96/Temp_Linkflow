'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

export { CardHeader } from '@/components/ui/CardHeader';
export { Segmented } from '@/components/ui/Segmented';
export { ProgressRing } from '@/components/ui/ProgressRing';

export function DrawnCheck({ on, size = 18 }) {
  return (
    <span className={`cmp-dcheck ${on ? 'is-on' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 20 20" width={size} height={size}>
        <circle cx="10" cy="10" r="9" className="cmp-dcheck-bg" />
        <path d="M6 10.4l2.6 2.6L14 7.6" pathLength="1" className="cmp-dcheck-path" />
      </svg>
    </span>
  );
}

const FLOW = [
  { label: 'Slots set' },
  { label: 'Draft' },
  { label: 'Owner approval' },
  { label: 'Auto-publish' },
];

// Compact version of the dashboard's "Standard workflow" strip.
export function WorkflowMini({ activeIndex = 1 }) {
  return (
    <div className="cmp-card cmp-flow-wrap">
      <ol className="cmp-flow" aria-label="Publishing workflow">
        {FLOW.map((step, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'todo';
          return (
            <li
              key={step.label}
              className={`cmp-flow-step is-${state}`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="cmp-flow-node">
                {state === 'done' ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className="cmp-flow-label">{step.label}</span>
              {i < FLOW.length - 1 && (
                <span className="cmp-flow-link" aria-hidden="true">
                  <span />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
