'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

export function CardHeader({ icon: Icon, tone = 'blue', title, qualifier, id, children }) {
  return (
    <div className="cmp-card-head">
      <span className={`cmp-badge tone-${tone}`} aria-hidden="true">
        <Icon size={17} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 flex items-baseline gap-x-2 flex-wrap">
        <h2 id={id} className="cmp-title">
          {title}
        </h2>
        {qualifier && <span className="cmp-qualifier">{qualifier}</span>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

export function Segmented({ options, value, onChange, label, size = 'md', inline = false, className = '' }) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = options[(index + dir + options.length) % options.length];
    onChange(next.value);
    const buttons = e.currentTarget.querySelectorAll('[role="radio"]');
    buttons[(index + dir + options.length) % options.length]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`cmp-seg ${size === 'sm' ? 'is-sm' : size === 'lg' ? 'is-lg' : ''} ${inline ? 'is-inline' : ''} ${className}`}
      style={{ '--n': options.length, '--idx': index }}
    >
      <span className="cmp-seg-thumb" aria-hidden="true" />
      {options.map((option, i) => {
        const Icon = option.icon;
        const active = i === index;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            aria-label={option.iconOnly ? option.label : undefined}
            title={option.iconOnly ? option.label : undefined}
            className={`cmp-seg-btn ${active ? 'is-active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={15} aria-hidden="true" />}
            {!option.iconOnly && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function ProgressRing({ value, size = 22, stroke = 3, tone = 'blue', label, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value || 0, 0), 1);
  const center = size / 2;

  return (
    <span
      className={`cmp-ring tone-${tone}`}
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={stroke} className="cmp-ring-track" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${center} ${center})`}
          className="cmp-ring-value"
          style={{ '--ring-c': circumference }}
        />
      </svg>
      {children && (
        <span className="cmp-ring-label" aria-hidden="true">
          {children}
        </span>
      )}
    </span>
  );
}

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
  { label: 'Slots set', tone: 'green' },
  { label: 'Draft', tone: 'blue' },
  { label: 'Owner approval', tone: 'amber' },
  { label: 'Auto-publish', tone: 'violet' },
];

// Compact version of the dashboard's "Standard workflow" strip.
export function WorkflowMini({ activeIndex = 1 }) {
  return (
    <div className="cmp-card cmp-flow-wrap">
      <span className="cmp-flow-caption">Standard workflow</span>
      <ol className="cmp-flow" aria-label="Publishing workflow">
        {FLOW.map((step, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'todo';
          return (
            <li
              key={step.label}
              className={`cmp-flow-step is-${state} tone-${step.tone}`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="cmp-flow-node">{state === 'done' ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
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

// Animates a displayed number toward `value`.
export function useCountTo(value, duration = 450) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const from = fromRef.current;
    if (reduce || from === value) {
      fromRef.current = value;
      setDisplay(value);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (value - from) * eased);
      fromRef.current = current;
      setDisplay(current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}
