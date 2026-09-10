'use client';

import React, { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { formatDayLabel } from './DashboardPrimitives';

/* ------------------------------------------------------------------ */
/* Procedural landscape — computed once at module load, no image asset. */
/* ------------------------------------------------------------------ */
const W = 1200;
const H = 400;

const noise = (i, seed) => {
  const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

const ridge = (x, { base, amp, f1, f2, phase }) =>
  base + Math.sin(x * f1 + phase) * amp + Math.sin(x * f2 + phase * 1.7) * amp * 0.45;

/** Smooth mountain silhouette */
function mountainPath(opts) {
  let d = `M0 ${H} L0 ${ridge(0, opts).toFixed(1)}`;
  for (let x = 20; x <= W; x += 20) d += ` L${x} ${ridge(x, opts).toFixed(1)}`;
  return `${d} L${W} ${H} Z`;
}

/** Ridge covered in pine silhouettes */
function treelinePath({ seed, minH, maxH, step, gap = 0.15, ...opts }) {
  let d = `M0 ${H} L0 ${ridge(0, opts).toFixed(1)}`;
  for (let x = 0, i = 0; x < W; x += step, i++) {
    const y0 = ridge(x, opts);
    const y1 = ridge(x + step, opts);
    if (noise(i + 7, seed) < gap) {
      d += ` L${x + step} ${y1.toFixed(1)}`;
      continue;
    }
    const h = minH + noise(i, seed) * (maxH - minH);
    const tip = x + step * (0.4 + noise(i + 31, seed) * 0.2);
    d += ` L${x} ${y0.toFixed(1)} L${tip.toFixed(1)} ${(y0 - h).toFixed(1)} L${x + step} ${y1.toFixed(1)}`;
  }
  return `${d} L${W} ${H} Z`;
}

const FAR = mountainPath({ base: 222, amp: 34, f1: 0.0105, f2: 0.026, phase: 1.2 });
const MID = treelinePath({ base: 262, amp: 20, f1: 0.004, f2: 0.011, phase: 2.4, seed: 3, minH: 8, maxH: 20, step: 9 });
const NEAR = treelinePath({ base: 312, amp: 18, f1: 0.0034, f2: 0.009, phase: 0.6, seed: 11, minH: 16, maxH: 38, step: 14, gap: 0.1 });
const FRONT = treelinePath({ base: 368, amp: 12, f1: 0.0028, f2: 0.0075, phase: 4.1, seed: 23, minH: 30, maxH: 64, step: 22, gap: 0.08 });

export default function DashboardHeroCard({
  onOpenAgenda,
  attentionCount = 2,
  quote = 'Consistency turns ideas into growth.',
}) {
  const uid = useId().replace(/:/g, '');
  const today = formatDayLabel(new Date(), { year: false });

  return (
    <section className="relative isolate flex h-full min-h-[236px] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_36px_-18px_rgba(30,41,59,0.45)]">
      {/* Landscape */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#71839E" />
            <stop offset="48%" stopColor="#A9B7C9" />
            <stop offset="100%" stopColor="#D7DEE7" />
          </linearGradient>
          <radialGradient id={`sun-${uid}`} cx="0.64" cy="0.36" r="0.45">
            <stop offset="0%" stopColor="#FFF7E6" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#F9EBD2" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#E6E1DA" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E6E1DA" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`fog-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E9EEF4" stopOpacity="0" />
            <stop offset="55%" stopColor="#E9EEF4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E9EEF4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`read-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#1E293B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#sky-${uid})`} />
        <rect width={W} height={H} fill={`url(#sun-${uid})`} />
        <circle cx={W * 0.64} cy={H * 0.36} r="28" fill="#FFF9EE" opacity="0.85" />

        <path d={FAR} fill="#95A4B9" opacity="0.75" />
        <rect y="190" width={W} height="110" fill={`url(#fog-${uid})`} />
        <path d={MID} fill="#7688A1" opacity="0.9" />
        <rect y="245" width={W} height="90" fill={`url(#fog-${uid})`} />
        <path d={NEAR} fill="#56677F" />
        <rect y="300" width={W} height="70" fill={`url(#fog-${uid})`} opacity="0.7" />
        <path d={FRONT} fill="#39475C" />

        {/* Legibility wash behind the copy */}
        <rect width={W} height={H} fill={`url(#read-${uid})`} />
      </svg>

      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-md bg-white/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
          {today}
        </span>
        {quote && (
          <p className="hidden max-w-[190px] text-right text-xs italic leading-snug text-white/85 [text-shadow:0_1px_8px_rgba(30,41,59,0.35)] sm:block">
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>

      {/* Bottom copy + CTA */}
      <div className="mt-8 [text-shadow:0_1px_12px_rgba(30,41,59,0.35)]">
        <h2 className="text-[28px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[32px]">
          Let&apos;s keep
          <br />
          things moving.
        </h2>
        <p className="mt-2 text-sm font-medium text-white/90">
          {attentionCount === 0
            ? 'Nothing needs your attention today.'
            : `${attentionCount} item${attentionCount === 1 ? '' : 's'} need${attentionCount === 1 ? 's' : ''} your attention today.`}
        </p>
        <button
          type="button"
          onClick={onOpenAgenda}
          className="group mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-semibold text-slate-900 shadow-lg shadow-slate-900/15 transition-colors [text-shadow:none] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-500 cursor-pointer"
        >
          View agenda
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </button>
      </div>
    </section>
  );
}
