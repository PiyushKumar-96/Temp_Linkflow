'use client';

import React from 'react';

export function Segmented({
  options = [],
  value,
  onChange,
  label,
  size = 'md',
  inline = false,
  className = '',
}) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = options[(index + dir + options.length) % options.length];
    onChange && onChange(next.value);
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
            onClick={() => onChange && onChange(option.value)}
          >
            {Icon && <Icon size={14} aria-hidden="true" />}
            {!option.iconOnly && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default Segmented;
