'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Tone palette — one place to tune every status colour on the page.   */
/* ------------------------------------------------------------------ */
export const TONES = {
  slate: {
    chip: 'bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300',
    pill: 'bg-slate-100 text-slate-600 ring-slate-500/15 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
    dot: 'bg-slate-400',
    text: 'text-slate-600 dark:text-slate-300',
  },
  blue: {
    chip: 'bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300',
    pill: 'bg-blue-50 text-blue-700 ring-blue-600/15 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20',
    dot: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-300',
  },
  indigo: {
    chip: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300',
    pill: 'bg-indigo-50 text-indigo-700 ring-indigo-600/15 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20',
    dot: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-300',
  },
  violet: {
    chip: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300',
    pill: 'bg-violet-50 text-violet-700 ring-violet-600/15 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20',
    dot: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-300',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-300',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300',
    pill: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-300',
  },
  rose: {
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300',
    pill: 'bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-300',
  },
};

const tone = (name) => TONES[name] || TONES.slate;

/* ------------------------------------------------------------------ */
/* Buttons                                                              */
/* ------------------------------------------------------------------ */
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card';

export const buttonStyles = {
  dark: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm shadow-slate-900/20 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 cursor-pointer ${focusRing}`,
  outline: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${focusRing}`,
  ghost: `inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer ${focusRing}`,
};

/* ------------------------------------------------------------------ */
/* Surfaces                                                             */
/* ------------------------------------------------------------------ */
export function Panel({ as: Tag = 'section', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-14px_rgba(15,23,42,0.10)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function PanelHeader({ icon: Icon, tone: toneName = 'slate', title, badge, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 ${className}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon && (
          <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${tone(toneName).chip}`}>
            <Icon size={15} strokeWidth={2.2} />
          </span>
        )}
        <h3 className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
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
      className={`group inline-flex items-center gap-1 rounded-md text-xs font-semibold text-primary transition-colors hover:text-primary/80 cursor-pointer ${focusRing} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </button>
  );
}

export function Pill({ tone: toneName = 'slate', dot = false, pulse = false, icon: Icon, children, className = '' }) {
  const t = tone(toneName);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${t.pill} ${className}`}
    >
      {dot && (
        <span className="relative flex size-1.5">
          {pulse && (
            <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${t.dot}`} />
          )}
          <span className={`relative inline-flex size-1.5 rounded-full ${t.dot}`} />
        </span>
      )}
      {Icon && <Icon size={11} strokeWidth={2.4} />}
      {children}
    </span>
  );
}

export function LiveDot({ label = 'Live' }) {
  return (
    <span className="relative flex size-2 shrink-0" title={label}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
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
      className={`grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer ${focusRing} ${className}`}
    >
      {children}
    </button>
  );
}

const AVATAR_TONES = ['blue', 'violet', 'emerald', 'amber', 'rose', 'indigo'];

export function Avatar({ src, name = '', size = 'size-8', textSize = 'text-[11px]', className = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const toneName = AVATAR_TONES[(name.charCodeAt(0) || 0) % AVATAR_TONES.length];
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-card ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${size} grid shrink-0 place-items-center rounded-full ${textSize} font-bold ring-2 ring-card ${tone(toneName).chip} ${className}`}
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
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
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
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] animate-in fade-in duration-150 motion-reduce:animate-none"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 motion-reduce:animate-none`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone(toneName).chip}`}>
                <Icon size={18} />
              </span>
            )}
            <div>
              <h2 id={titleId} className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer ${focusRing}`}
          >
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3.5">
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
