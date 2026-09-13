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
      className={`cmp-ring tone-${tone} ${className}`}
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="cmp-ring-track"
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

export default ProgressRing;
