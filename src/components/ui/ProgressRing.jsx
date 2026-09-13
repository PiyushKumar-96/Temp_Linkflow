'use client';

import React from 'react';

export function ProgressRing({
  value,
  size = 22,
  stroke = 3,
  tone = 'blue',
  label,
  children,
  className = '',
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value || 0, 0), 1);
  const center = size / 2;

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 cmp-ring tone-${tone} ${className}`}
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="cmp-ring-track"
          style={{ stroke: 'var(--track, #e8edf3)' }}
        />
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
          style={{
            '--ring-c': circumference,
            stroke: tone === 'green' ? 'var(--success)' : tone === 'amber' ? 'var(--warning)' : 'var(--brand)',
          }}
        />
      </svg>
      {children && (
        <span className="relative z-10 font-bold tabular-nums cmp-ring-label flex items-center justify-center" aria-hidden="true">
          {children}
        </span>
      )}
    </span>
  );
}

export default ProgressRing;
