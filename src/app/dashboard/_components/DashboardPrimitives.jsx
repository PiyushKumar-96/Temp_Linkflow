'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Revised Tone palette: Warm neutrals + selective color              */
const DEFAULT_TONE = {
  pill: 'bg-[color:var(--chip)] text-[color:var(--text)]',
  chip: 'bg-[color:var(--chip)] text-[color:var(--text)]',
  text: 'text-[color:var(--text-muted)]',
  dot: 'bg-[color:var(--text-muted)]',
};

const BASE_TONES = {
  blue: {
    pill: 'bg-[color:var(--brand)] text-white',
    chip: 'bg-[color:var(--brand)] text-white',
    text: 'text-[color:var(--brand)]',
    dot: 'bg-[color:var(--brand)]',
  },
  accent: {
    pill: 'bg-[color:var(--accent-tint)] text-[color:var(--accent-text)]',
    chip: 'bg-[color:var(--accent-tint)] text-[color:var(--accent-text)]',
    text: 'text-[color:var(--accent-text)]',
    dot: 'bg-[color:var(--accent)]',
  },
  lime: {
    pill: 'bg-[color:var(--accent-tint)] text-[color:var(--accent-text)]',
    chip: 'bg-[color:var(--accent-tint)] text-[color:var(--accent-text)]',
    text: 'text-[color:var(--accent-text)]',
    dot: 'bg-[color:var(--accent)]',
  },
  violet: DEFAULT_TONE,
  amber: {
    pill: 'bg-[color:var(--warning-tint)] text-[color:var(--warning-text)]',
    chip: 'bg-[color:var(--warning-tint)] text-[color:var(--warning-text)]',
    text: 'text-[color:var(--warning-text)]',
    dot: 'bg-[color:var(--warning)]',
  },
  emerald: {
    pill: 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]',
    chip: 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]',
    text: 'text-[color:var(--success-text)]',
    dot: 'bg-[color:var(--success)]',
  },
  rose: {
    pill: 'bg-[color:var(--danger-tint)] text-[color:var(--danger-text)]',
    chip: 'bg-[color:var(--danger-tint)] text-[color:var(--danger-text)]',
    text: 'text-[color:var(--danger-text)]',
    dot: 'bg-[color:var(--danger)]',
  },
  slate: DEFAULT_TONE,
  lavender: DEFAULT_TONE,
  mint: {
    pill: 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]',
    chip: 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]',
    text: 'text-[color:var(--success-text)]',
    dot: 'bg-[color:var(--success)]',
  },
  butter: {
    pill: 'bg-[color:var(--warning-tint)] text-[color:var(--warning-text)]',
    chip: 'bg-[color:var(--warning-tint)] text-[color:var(--warning-text)]',
    text: 'text-[color:var(--warning-text)]',
    dot: 'bg-[color:var(--warning)]',
  },
  sky: DEFAULT_TONE,
  periwinkle: {
    pill: 'bg-[color:var(--brand)] text-white',
    chip: 'bg-[color:var(--brand)] text-white',
    text: 'text-[color:var(--brand)]',
    dot: 'bg-[color:var(--brand)]',
  },
  statusGreen: {
    pill: 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]',
    chip: 'bg-[color:var(--success-tint)] text-[color:var(--success-text)]',
    text: 'text-[color:var(--success-text)]',
    dot: 'bg-[color:var(--success)]',
  },
  statusAmber: {
    pill: 'bg-[color:var(--warning-tint)] text-[color:var(--warning-text)]',
    chip: 'bg-[color:var(--warning-tint)] text-[color:var(--warning-text)]',
    text: 'text-[color:var(--warning-text)]',
    dot: 'bg-[color:var(--warning)]',
  },
  statusRed: {
    pill: 'bg-[color:var(--danger-tint)] text-[color:var(--danger-text)]',
    chip: 'bg-[color:var(--danger-tint)] text-[color:var(--danger-text)]',
    text: 'text-[color:var(--danger-text)]',
    dot: 'bg-[color:var(--danger)]',
  },
  dark: {
    pill: 'bg-[color:var(--text)] text-white',
    chip: 'bg-[color:var(--text)] text-white',
    text: 'text-white',
    dot: 'bg-[color:var(--text)]',
  },
  neutral: DEFAULT_TONE,
};

// Safe Proxy so TONES[undefined] or any missing key returns DEFAULT_TONE
export const TONES = new Proxy(BASE_TONES, {
  get(target, prop) {
    if (typeof prop === 'string' && prop in target) {
      return target[prop];
    }
    return DEFAULT_TONE;
  },
});

/* ------------------------------------------------------------------ */
/* Buttons                                                              */
/* ------------------------------------------------------------------ */
export const buttonStyles = {
  dark: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--brand)] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[color:var(--brand-hover)] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
  navy: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--text)] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#2A2A30] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
  outline:
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white border border-[color:var(--border)] px-4 py-2 text-xs font-semibold text-[color:var(--text)] transition-colors hover:bg-[color:var(--chip)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
  white:
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-[color:var(--text)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
  ghost:
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--text)] transition-colors hover:bg-[color:var(--chip)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
};

/* ------------------------------------------------------------------ */
/* Surfaces                                                             */
/* ------------------------------------------------------------------ */
export function Panel({ as: Tag = 'section', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-[24px] bg-[color:var(--card)] text-[color:var(--text)] shadow-[0_1px_3px_rgba(27,27,31,0.04)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CornerArrowButton({ onClick, label = 'Open', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`size-8 shrink-0 rounded-full bg-[color:var(--chip)] hover:bg-[color:var(--brand)] text-[color:var(--text)] hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${className}`}
    >
      <ArrowUpRight size={15} strokeWidth={2.4} />
    </button>
  );
}

export function PanelHeader({ title, badge, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <h3 className="text-base font-semibold text-[color:var(--text)] tracking-tight">{title}</h3>
        {badge}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export function PanelLink({ onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--text)] transition-colors hover:bg-[color:var(--brand)] hover:text-white cursor-pointer ${className}`}
    >
      <span>{children}</span>
      <ArrowUpRight size={13} strokeWidth={2} />
    </button>
  );
}

export function Pill({
  tone: toneName = 'neutral',
  dot = false,
  pulse = false,
  icon: Icon,
  children,
  className = '',
}) {
  const t = TONES[toneName] || TONES.neutral;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.pill} ${className}`}
    >
      {dot && (
        <span className="relative flex size-1.5">
          {pulse && (
            <span
              className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${t.dot}`}
            />
          )}
          <span className={`relative inline-flex size-1.5 rounded-full ${t.dot}`} />
        </span>
      )}
      {Icon && <Icon size={12} strokeWidth={2.2} />}
      {children}
    </span>
  );
}

export function LiveDot({ label = 'Live' }) {
  return (
    <span className="relative flex size-2 shrink-0" title={label}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--success)] opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex size-2 rounded-full bg-[color:var(--success)]" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function IconButton({ label, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-7 shrink-0 place-items-center rounded-full text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--chip)] hover:text-[color:var(--text)] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function Avatar({
  src,
  name = '',
  size = 'size-8',
  textSize = 'text-[11px]',
  className = '',
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const toneKeys = ['sky', 'violet', 'lavender', 'blue'];
  const toneKey = toneKeys[(name.charCodeAt(0) || 0) % toneKeys.length];
  const t = TONES[toneKey] || TONES.sky;
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${size} grid shrink-0 place-items-center rounded-full ${textSize} font-bold ring-2 ring-white ${t.pill} ${className}`}
    >
      {initials || '?'}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Modal shell — shared by the agenda and workflow dialogs              */
/* ------------------------------------------------------------------ */
export function ModalShell({
  isOpen,
  onClose,
  icon: Icon,
  tone: toneName = 'blue',
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the dialog itself (not the close button) so no focus ring flashes on open
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#0B2942]/50 backdrop-blur-[2px] animate-in fade-in duration-150 motion-reduce:animate-none"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex outline-none max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--text)] shadow-2xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-5 border-b border-[color:var(--border)]">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[color:var(--chip)] text-[color:var(--text)]">
                <Icon size={16} />
              </span>
            )}
            <div>
              <h2
                id={titleId}
                className="text-base font-semibold tracking-tight text-[color:var(--text)]"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--chip)] hover:text-[color:var(--text)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--border)] bg-[color:var(--track-warm)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Date helpers — keep every date on the page in one format             */
/* ------------------------------------------------------------------ */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "Thu, 10 Sep 2026" (or "Thu, 10 Sep" with year: false) */
export function formatDayLabel(date = new Date(), { year = true } = {}) {
  const day = String(date.getDate()).padStart(2, '0');
  const base = `${WEEKDAYS[date.getDay()]}, ${day} ${MONTHS[date.getMonth()]}`;
  return year ? `${base} ${date.getFullYear()}` : base;
}

export function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return { text: 'Good morning', period: 'morning' };
  if (h < 17) return { text: 'Good afternoon', period: 'afternoon' };
  return { text: 'Good evening', period: 'evening' };
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * "2026-09-12 09:30 UTC" -> "Sat, 12 Sep, 09:30 UTC".
 * Keeps the wall-clock time exactly as stored; falls back to the raw string.
 */
export function formatSlot(value) {
  if (!value || typeof value !== 'string') return value || '';
  const m = value.match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?\s*([A-Za-z]{2,5})?/);
  if (!m) return value;
  const [, y, mo, d, hh, mm, tz] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  const dayPart = `${WEEKDAYS[date.getDay()]}, ${Number(d)} ${MONTHS[date.getMonth()]}`;
  if (!hh) return dayPart;
  return `${dayPart}, ${hh}:${mm}${tz ? ` ${tz}` : ''}`;
}
