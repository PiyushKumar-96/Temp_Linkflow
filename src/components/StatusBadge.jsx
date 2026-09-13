import React from 'react';
import { normalizeStatus, STATUS_META } from '@/lib/post-status';

/**
 * Canonical StatusBadge component driven by post-status.js domain model.
 *
 * @param {Object} props
 * @param {string} props.status - Any post status string (canonical or legacy)
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Visual sizing
 * @param {boolean} [props.showDot=true] - Display status dot
 * @param {string} [props.className=''] - Additional styling classes
 */
export default function StatusBadge({ status, size = 'md', showDot = true, className = '' }) {
  const canonical = normalizeStatus(status);
  const meta = STATUS_META[canonical] || STATUS_META.planned;

  const sizeClasses =
    {
      sm: 'text-[11px] px-2 py-0.5 gap-1.5',
      md: 'text-xs px-2.5 py-1 gap-1.5',
      lg: 'text-sm px-3 py-1.5 gap-2',
    }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  const dotSizeClasses =
    {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    }[size] || 'w-2 h-2';

  return (
    <span
      data-status={canonical}
      title={meta.description}
      className={`inline-flex items-center font-600 rounded-full border transition-colors select-none ${meta.badgeClass} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${meta.dotClass} ${dotSizeClasses}`}
          aria-hidden="true"
        />
      )}
      <span className="leading-none">{meta.label}</span>
    </span>
  );
}
