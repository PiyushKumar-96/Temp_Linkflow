'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  FileText,
  UserCheck,
  Send,
  ArrowRight,
  Check,
  Clock,
  Building2,
  User,
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  ThumbsUp,
  Heart,
} from 'lucide-react';
import { IconWorkflow } from './DashboardCustomIcons';
import { ModalShell, TONES, buttonStyles } from './DashboardPrimitives';

/* ------------------------------------------------------------------ */
/* Config                                                               */
/* ------------------------------------------------------------------ */
const STEP_MS = 3600;

const STEPS = [
  {
    title: 'Set slots in settings',
    description: 'Pick when you publish, like Tuesday and Thursday at 09:00 UTC, and where: personal profile or company page.',
    icon: Settings,
    tone: 'blue',
    actionLabel: 'Configure slots',
    route: '/settings',
  },
  {
    title: 'Plan a topic or draft a post',
    description: 'Plan campaigns in Topics, or draft with AI help: hooks, hashtags, and an image or PDF carousel.',
    icon: FileText,
    tone: 'violet',
    actionLabel: 'Open composer',
    route: '/post-creation-composer',
  },
  {
    title: 'Owner approves in the queue',
    description: 'Reviewers comment inline, request changes, or approve in one click.',
    icon: UserCheck,
    tone: 'amber',
    actionLabel: 'Open queue',
    route: '/approval-workflow',
  },
  {
    title: 'Auto-publish to LinkedIn',
    description: 'Approved posts lock, match their slot, and go out through Buffer automatically.',
    icon: Send,
    tone: 'emerald',
    actionLabel: 'View calendar',
    route: '/content-calendar',
  },
];

const STAGE_BG = {
  blue: 'from-blue-100 via-sky-50 to-white dark:from-blue-400/15 dark:via-blue-400/5 dark:to-transparent',
  violet: 'from-violet-100 via-fuchsia-50 to-white dark:from-violet-400/15 dark:via-violet-400/5 dark:to-transparent',
  amber: 'from-amber-100 via-orange-50/80 to-white dark:from-amber-400/15 dark:via-amber-400/5 dark:to-transparent',
  emerald: 'from-emerald-100 via-teal-50/80 to-white dark:from-emerald-400/15 dark:via-emerald-400/5 dark:to-transparent',
};

const PROGRESS_BAR = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
};

/* ------------------------------------------------------------------ */
/* Motion helpers                                                       */
/* Base styles are always the FINAL state; keyframes animate *from* the */
/* hidden state. So with reduced motion (animation: none) every scene   */
/* simply renders complete.                                             */
/* ------------------------------------------------------------------ */
const EASE = 'cubic-bezier(.22,1,.36,1)';
const SPRING = 'cubic-bezier(.34,1.56,.64,1)';
const anim = (name, dur, delay = 0, ease = EASE, fill = 'both') => ({
  animation: `hiw-${name} ${dur}ms ${ease} ${delay}ms ${fill}`,
});

const KEYFRAMES = `
@keyframes hiw-fade { from { opacity: 0; } }
@keyframes hiw-fade-up { from { opacity: 0; transform: translateY(10px); } }
@keyframes hiw-scene-in { from { opacity: 0; transform: translateY(8px) scale(.98); } }
@keyframes hiw-pop { 0% { opacity: 0; transform: scale(.5); } 70% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
@keyframes hiw-grow-x { from { transform: scaleX(0); } }
@keyframes hiw-slide-left { from { opacity: 0; transform: translateX(22px); } }
@keyframes hiw-slide-right { from { opacity: 0; transform: translateX(-22px); } }
@keyframes hiw-burst { 0% { opacity: 0; transform: scale(.7); } 12% { opacity: .6; } 100% { opacity: 0; transform: scale(2.1); } }
@keyframes hiw-track { from { background-color: #cbd5e1; } }
@keyframes hiw-knob { from { transform: translateX(0); } }
@keyframes hiw-blink { 50% { opacity: 0; } }
@keyframes hiw-bob { 50% { transform: translateY(-4px); } }
@keyframes hiw-stamp { 0% { opacity: 0; transform: scale(2) rotate(-18deg); } 55% { opacity: 1; transform: scale(.92) rotate(-7deg); } 100% { opacity: 1; transform: scale(1) rotate(-8deg); } }
@keyframes hiw-spark { 0% { opacity: 0; transform: translate(0,0) scale(.3); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1); } }
@keyframes hiw-ring-in { from { opacity: 0; } }
@keyframes hiw-lift { to { transform: translateY(-6px) scale(.95); opacity: .75; } }
@keyframes hiw-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes hiw-fly {
  0%   { opacity: 0; transform: translate(0, 0) rotate(-10deg) scale(.7); }
  12%  { opacity: 1; }
  50%  { transform: translate(54px, -50px) rotate(40deg) scale(1.1); }
  86%  { opacity: 1; }
  100% { opacity: 0; transform: translate(100px, -36px) rotate(80deg) scale(.6); }
}
@keyframes hiw-float-in {
  0% { opacity: 0; transform: translateY(8px) scale(.96); filter: blur(1.5px); }
  70% { opacity: 1; transform: translateY(-1px) scale(1.015); filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes hiw-sweep {
  0% { transform: translateX(-115%); opacity: 0; }
  15% { opacity: .8; }
  70% { opacity: .55; }
  100% { transform: translateX(115%); opacity: 0; }
}
@keyframes hiw-typing {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
@keyframes hiw-focus {
  0%, 100% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-2px) scale(1.025); }
}
@keyframes hiw-comment-in {
  0% { opacity: 0; transform: translateX(18px) scale(.94); }
  70% { opacity: 1; transform: translateX(-2px) scale(1.01); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes hiw-check {
  0% { stroke-dashoffset: 1; opacity: 0; }
  25% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes hiw-push {
  0% { transform: translateY(0) scale(1); }
  25% { transform: translateY(2px) scale(.985); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes hiw-post-launch {
  0% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
  16% { opacity: 1; transform: translate(8px,-4px) rotate(-2deg) scale(1.015); }
  100% { opacity: 0; transform: translate(94px,-54px) rotate(-8deg) scale(.72); }
}
@keyframes hiw-dash-travel { from { stroke-dashoffset: 34; } to { stroke-dashoffset: 0; } }
@keyframes hiw-feed-hit {
  0% { opacity: 0; transform: translateY(12px) scale(.92); }
  68% { opacity: 1; transform: translateY(-2px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hiw-glow {
  0% { opacity: 0; transform: scale(.7); }
  35% { opacity: .75; }
  100% { opacity: 0; transform: scale(1.45); }
}
@keyframes hiw-number-in {
  0% { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes hiw-rows { from { grid-template-rows: 0fr; } }
@keyframes hiw-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes hiw-ping { 0% { transform: scale(1); opacity: .45; } 100% { transform: scale(1.55); opacity: 0; } }
.hiw-paused * { animation-play-state: paused !important; }
`;

function CountUp({ to, delay = 0, duration = 1100 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const timer = setTimeout(() => {
      const tick = (ts) => {
        if (start === undefined) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        setValue(Math.round(to * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay, duration]);
  return <span className="tabular-nums">{value}</span>;
}

/* Small reusable bits used across scenes */
const cardSurface = 'rounded-2xl border border-border/70 bg-card';
const FloatingChip = ({ tone = 'emerald', icon: Icon, children }) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold shadow-lg shadow-slate-900/10 ring-1 ring-inset ring-border/70 ${TONES[tone]?.text || 'text-foreground'}`}
  >
    {Icon && <Icon size={12} strokeWidth={2.5} />}
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Scene 1 — slots light up in a week grid                             */
/* ------------------------------------------------------------------ */
function SlotsScene() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '13:00', '17:00'];
  const picked = { '1-0': 0, '3-0': 1 }; // `${day}-${time}` -> order it lights up

  return (
    <>
      <div
        className={`absolute left-[22px] top-[18px] w-[276px] p-3.5 shadow-[0_18px_40px_-18px_rgba(37,99,235,0.45)] ${cardSurface}`}
        style={anim('fade-up', 500)}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Publishing slots</span>
          <span className="text-[10px] font-medium text-muted-foreground">UTC</span>
        </div>

        <div className="mt-3 grid grid-cols-[34px_repeat(5,minmax(0,1fr))] gap-1.5">
          <span />
          {days.map((d, i) => (
            <span key={d} className="text-center text-[10px] font-medium text-muted-foreground" style={anim('fade', 300, 150 + i * 50)}>
              {d}
            </span>
          ))}
          {times.map((t, r) => (
            <React.Fragment key={t}>
              <span className="self-center text-[10px] text-muted-foreground tabular-nums" style={anim('fade', 300, 250 + r * 60)}>
                {t}
              </span>
              {days.map((d, c) => {
                const order = picked[`${c}-${r}`];
                return (
                  <span
                    key={d}
                    className="relative h-7 rounded-md bg-muted/80"
                    style={anim('pop', 380, 250 + (r * 5 + c) * 35, SPRING)}
                  >
                    {order !== undefined && (
                      <>
                        <span
                          className="absolute inset-0 rounded-md bg-blue-400 opacity-0"
                          style={anim('burst', 750, 1050 + order * 350)}
                        />
                        <span
                          className="absolute inset-0 grid place-items-center rounded-md bg-blue-500 text-white shadow-md shadow-blue-500/40"
                          style={anim('pop', 450, 950 + order * 350, SPRING)}
                        >
                          <Clock size={12} strokeWidth={2.5} />
                        </span>
                      </>
                    )}
                  </span>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
          {[
            { label: 'Company page', icon: Building2 },
            { label: 'Personal profile', icon: User },
          ].map((row, i) => (
            <div key={row.label} className="flex items-center justify-between" style={anim('fade-up', 400, 1550 + i * 120)}>
              <span className="flex items-center gap-1.5 text-[11px] text-foreground">
                <row.icon size={12} className="text-muted-foreground" />
                {row.label}
              </span>
              <span className="relative h-4 w-[30px] rounded-full bg-blue-500" style={anim('track', 320, 1850 + i * 200)}>
                <span
                  className="absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm"
                  style={{ transform: 'translateX(14px)', ...anim('knob', 320, 1850 + i * 200) }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <span className="absolute right-[4px] top-[2px]" style={anim('pop', 450, 2450, SPRING)}>
        <FloatingChip tone="emerald" icon={Check}>2 slots set</FloatingChip>
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 2 — AI writes the LinkedIn post                                 */
/* ------------------------------------------------------------------ */
function DraftScene() {
  return (
    <>
      {/* LinkedIn composer */}
      <div
        className={`absolute left-[16px] top-[20px] w-[288px] overflow-hidden shadow-[0_24px_55px_-24px_rgba(15,23,42,0.32)] ${cardSurface}`}
        style={anim('float-in', 500)}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-[#0A66C2] text-[15px] font-black text-white">in</span>
            <span className="text-[11px] font-semibold text-foreground">Create a post</span>
          </div>
          <span
            className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
            style={anim('pop', 340, 340, SPRING)}
          >
            <span className="inline-flex items-center gap-1"><Sparkles size={10} /> AI writing</span>
          </span>
        </div>

        <div className="px-3.5 pb-3.5 pt-3">
          <div className="flex items-start gap-2.5">
            <span className="size-8 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" style={anim('pop', 350, 180, SPRING)} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-foreground">Aarav Mehta</span>
                <span className="text-[9px] text-muted-foreground">• 1st</span>
              </div>
              <span className="block text-[8px] text-muted-foreground">Product & Growth</span>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-muted/25 p-2.5 ring-1 ring-inset ring-border/60">
            <p className="text-[10px] leading-[1.55] text-foreground/85">
              <span className="font-semibold">The best automation isn't the one that runs fastest.</span>{' '}
              <span className="text-foreground/70">It's the one that keeps your team focused on the work that matters.</span>
            </p>
            <p
              className="mt-2 text-[10px] leading-[1.55] text-foreground/75"
              style={anim('typing', 720, 760, 'cubic-bezier(.33,1,.68,1)')}
            >
              Schedule the repetitive work. Keep the human judgment.
            </p>
            <p
              className="mt-2 text-[10px] font-medium text-[#0A66C2]"
              style={anim('fade-up', 330, 1430)}
            >
              #automation&nbsp;&nbsp;#productivity&nbsp;&nbsp;#ai
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
              <span className="grid size-4 place-items-center rounded-full bg-muted">
                <span className="text-[7px]">☺</span>
              </span>
              Add media
              <span className="ml-1 h-3 w-px bg-border" />
              <span>Anyone can comment</span>
            </div>
            <span
              className="rounded-full bg-[#0A66C2] px-3 py-1 text-[9px] font-bold text-white shadow-sm"
              style={anim('pop', 340, 2050, SPRING)}
            >
              Post
            </span>
          </div>
        </div>
      </div>

      {/* AI generation signal sweeps through the composer. */}
      <span
        className="absolute left-[42px] top-[126px] h-12 w-[2px] rounded-full bg-violet-400/70 opacity-0 blur-[1px]"
        style={anim('sweep', 800, 560, EASE)}
      />
      <span className="absolute right-[4px] top-[12px]" style={anim('pop', 420, 500, SPRING)}>
        <span className="block" style={{ animation: 'hiw-bob 2.5s ease-in-out 1s infinite' }}>
          <FloatingChip tone="violet" icon={Sparkles}>Generating post</FloatingChip>
        </span>
      </span>
      <span className="absolute bottom-[5px] left-[4px]" style={anim('pop', 400, 2760, SPRING)}>
        <FloatingChip tone="emerald" icon={Check}>Draft ready for approval</FloatingChip>
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 3 — approve the exact LinkedIn post AI just created             */
/* ------------------------------------------------------------------ */
const SPARKS = [
  { dx: '-42px', dy: '-22px', c: 'bg-emerald-400' },
  { dx: '-28px', dy: '26px', c: 'bg-amber-400' },
  { dx: '40px', dy: '-28px', c: 'bg-emerald-500' },
  { dx: '48px', dy: '12px', c: 'bg-amber-300' },
  { dx: '5px', dy: '-34px', c: 'bg-emerald-300' },
];

function ApproveScene() {
  return (
    <>
      {/* Approval queue around the same LinkedIn post */}
      <div
        className={`absolute left-[8px] top-[22px] w-[232px] overflow-hidden shadow-[0_22px_48px_-22px_rgba(15,23,42,0.34)] ${cardSurface}`}
        style={anim('float-in', 480)}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-[#0A66C2] text-[12px] font-black text-white">in</span>
            <span className="text-[10px] font-semibold text-foreground">Approval queue</span>
          </div>
          <span
            className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[8px] font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
            style={anim('pop', 300, 260, SPRING)}
          >
            Needs approval
          </span>
        </div>

        <div className="p-3">
          <div className="flex items-start gap-2">
            <span className="size-7 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-semibold text-foreground">Aarav Mehta <span className="font-normal text-muted-foreground">• 1st</span></div>
              <div className="text-[8px] text-muted-foreground">Product & Growth · Draft</div>
            </div>
          </div>

          <div className="mt-2.5 rounded-lg border border-border/60 bg-muted/15 p-2.5">
            <p className="text-[9px] leading-[1.55] text-foreground/85">
              <span className="font-semibold">The best automation isn't the one that runs fastest.</span>{' '}
              It's the one that keeps your team focused on what matters.
            </p>
            <p className="mt-1.5 text-[9px] text-foreground/70">
              Schedule the repetitive work. Keep the human judgment.
            </p>
            <p className="mt-1.5 text-[9px] font-medium text-[#0A66C2]">#automation&nbsp; #productivity&nbsp; #ai</p>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[8px] text-muted-foreground">Scheduled • Tue, 09:00 UTC</span>
            <span
              className="grid size-7 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
              style={anim('pop', 360, 2050, SPRING)}
            >
              <Check size={13} strokeWidth={3} />
            </span>
          </div>
        </div>
      </div>

      {/* Human reviewer feedback */}
      <div
        className="absolute right-[0px] top-[48px] w-[156px] rounded-xl rounded-tl-sm border border-border/70 bg-card p-2 shadow-lg shadow-slate-900/10"
        style={{ animation: `hiw-comment-in 460ms ${EASE} 680ms both` }}
      >
        <div className="flex items-start gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700">LT</span>
          <div>
            <p className="text-[9px] font-semibold text-foreground">Lisa</p>
            <p className="text-[10px] leading-snug text-muted-foreground">Looks good — ready to publish.</p>
          </div>
        </div>
      </div>

      <div
        className="absolute right-[16px] top-[116px] flex items-center gap-1.5 rounded-xl rounded-tr-sm bg-violet-600 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg shadow-violet-600/25"
        style={anim('slide-left', 420, 1320, SPRING)}
      >
        <Check size={11} strokeWidth={3} />
        Final review passed
      </div>

      {/* Approval commit */}
      <div className="absolute left-[72px] top-[186px]">
        <span
          className="absolute inset-[-8px] rounded-2xl bg-emerald-400/25"
          style={anim('glow', 700, 2220)}
        />
        <span
          className="absolute inset-0 rounded-xl border-2 border-emerald-400 opacity-0"
          style={anim('burst', 800, 2240)}
        />
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className={`absolute left-1/2 top-1/2 size-1.5 rounded-full opacity-0 ${s.c}`}
            style={{ '--dx': s.dx, '--dy': s.dy, ...anim('spark', 680, 2280 + i * 24) }}
          />
        ))}
        <span
          className="relative flex items-center gap-1.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/95 px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-lg shadow-emerald-600/20 dark:bg-emerald-950/90 dark:text-emerald-300"
          style={{ transform: 'rotate(-7deg)', ...anim('stamp', 560, 2140, SPRING) }}
        >
          <span className="grid size-4 place-items-center rounded-full bg-emerald-500 text-white">
            <Check size={11} strokeWidth={3.5} />
          </span>
          Approved
        </span>
      </div>

      <span className="absolute bottom-[4px] right-[4px]" style={anim('pop', 360, 2920, SPRING)}>
        <FloatingChip tone="emerald" icon={Check}>Queued for LinkedIn</FloatingChip>
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 4 — the approved post appears in the LinkedIn feed               */
/* ------------------------------------------------------------------ */
function PublishScene() {
  return (
    <>
      {/* Simplified LinkedIn desktop feed */}
      <div
        className={`absolute left-[2px] top-[8px] h-[254px] w-[316px] overflow-hidden ${cardSurface}`}
        style={anim('float-in', 520, 120)}
      >
        <div className="flex items-center gap-2 border-b border-border/60 bg-card px-3 py-2">
          <span className="grid size-7 place-items-center rounded-md bg-[#0A66C2] text-[15px] font-black text-white">in</span>
          <span className="h-5 flex-1 rounded-full bg-muted/60 px-2 text-[8px] leading-5 text-muted-foreground">Search</span>
          <span className="size-4 rounded-full bg-muted" />
          <span className="size-4 rounded-full bg-muted" />
        </div>

        <div className="grid grid-cols-[82px_1fr] gap-2 p-2">
          <div className="rounded-lg border border-border/60 bg-muted/25 p-2">
            <span className="mx-auto block size-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
            <span className="mx-auto mt-2 block h-1.5 w-12 rounded-full bg-foreground/40" />
            <span className="mx-auto mt-1 block h-1 w-16 rounded-full bg-muted-foreground/20" />
            <div className="mt-3 space-y-1.5">
              <span className="block h-1.5 w-full rounded bg-muted-foreground/15" />
              <span className="block h-1.5 w-3/4 rounded bg-muted-foreground/15" />
              <span className="block h-1.5 w-5/6 rounded bg-muted-foreground/15" />
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            {/* The new post enters the feed as the destination. */}
            <div
              className="rounded-xl border border-border/70 bg-card p-2.5 shadow-sm"
              style={{ animation: `hiw-feed-hit 560ms ${EASE} 1900ms both` }}
            >
              <div className="flex items-start gap-2">
                <span className="size-7 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-semibold text-foreground">Aarav Mehta <span className="font-normal text-muted-foreground">• 1st</span></div>
                  <div className="text-[8px] text-muted-foreground">Product & Growth · Just now</div>
                </div>
                <span
                  className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                  style={anim('pop', 300, 2140, SPRING)}
                >
                  Published
                </span>
              </div>

              <p className="mt-2 text-[9px] leading-[1.55] text-foreground/85">
                <span className="font-semibold">The best automation isn't the one that runs fastest.</span>{' '}
                It's the one that keeps your team focused on the work that matters.
              </p>
              <p className="mt-1.5 text-[9px] text-foreground/70">
                Schedule the repetitive work. Keep the human judgment.
              </p>
              <p className="mt-1.5 text-[9px] font-medium text-[#0A66C2]">
                #automation&nbsp;&nbsp;#productivity&nbsp;&nbsp;#ai
              </p>

              <div
                className="mt-2 flex items-center gap-1 text-[8px] text-muted-foreground"
                style={anim('fade-up', 280, 2280)}
              >
                <span className="flex -space-x-1">
                  <span className="grid size-3.5 place-items-center rounded-full bg-blue-500 text-white ring-1 ring-card">
                    <ThumbsUp size={7} strokeWidth={3} />
                  </span>
                  <span className="grid size-3.5 place-items-center rounded-full bg-rose-500 text-white ring-1 ring-card">
                    <Heart size={7} strokeWidth={3} />
                  </span>
                </span>
                <span style={anim('number-in', 280, 2320)}>
                  <CountUp to={128} delay={2320} />
                </span>
              </div>

              <div className="mt-2 grid grid-cols-4 border-t border-border/60 pt-1.5 text-center text-[8px] font-semibold text-muted-foreground">
                <span>Like</span>
                <span>Comment</span>
                <span>Repost</span>
                <span>Send</span>
              </div>
            </div>

            <div className="rounded-xl bg-muted/55 p-2">
              <div className="flex gap-2">
                <span className="size-6 rounded-full bg-muted-foreground/20" />
                <div className="flex-1 space-y-1.5">
                  <span className="block h-1.5 w-16 rounded-full bg-muted-foreground/20" />
                  <span className="block h-1.5 w-full rounded-full bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <span
          className="pointer-events-none absolute right-[40px] top-[72px] size-16 rounded-full bg-[#0A66C2]/10"
          style={anim('glow', 900, 1880)}
        />
      </div>

      {/* Connector makes the automation legible without overpowering the LinkedIn destination. */}
      <span
        className="absolute left-[2px] bottom-[7px]"
        style={anim('pop', 420, 1840, SPRING)}
      >
        <FloatingChip tone="emerald" icon={Send}>Published to LinkedIn</FloatingChip>
      </span>

      {/* Small delivery pulse near the destination. */}
      <span
        className="absolute right-[8px] bottom-[8px] grid size-7 place-items-center rounded-full bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/25"
        style={anim('pop', 360, 2020, SPRING)}
      >
        <Send size={12} strokeWidth={2.6} />
      </span>
    </>
  );
}

const SCENES = [SlotsScene, DraftScene, ApproveScene, PublishScene];

/* ------------------------------------------------------------------ */
/* Modal                                                                */
/* ------------------------------------------------------------------ */
export default function DashboardWorkflowModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0); // bump to remount (replay) scene animations

  // Restart the tour every time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setActive(0);
    setPlaying(true);
    setRun((r) => r + 1);
  }, [isOpen]);

  const goTo = useCallback((idx) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, idx));
    setActive(next);
    setPlaying(true);
    setRun((r) => r + 1);
  }, []);

  // Auto-advance step timer (cycles continuously through all 4 steps)
  useEffect(() => {
    if (!isOpen || !playing) return;

    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
      setRun((r) => r + 1);
    }, STEP_MS);

    return () => clearTimeout(timer);
  }, [isOpen, playing, active, run]);

  const handlePlayback = () => {
    setPlaying((p) => !p);
  };

  // ← / → move between steps
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') goTo(active + 1);
      if (e.key === 'ArrowLeft') goTo(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, active, goTo]);

  const Scene = SCENES[active];
  const paused = !playing;

  const TONE_RINGS = {
    blue: 'ring-2 ring-inset ring-[#0A66C2] shadow-sm',
    violet: 'ring-2 ring-inset ring-[#2E7CC4] shadow-sm',
    amber: 'ring-2 ring-inset ring-[#E8A33D] shadow-sm',
    emerald: 'ring-2 ring-inset ring-[#0F8A5F] shadow-sm',
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={IconWorkflow}
      tone="violet"
      title="How the workflow works"
      subtitle="Follow one post from idea to LinkedIn"
      maxWidth="max-w-3xl"
      footer={
        <>
          <div className="mr-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayback}
              className={`${buttonStyles.ghost} h-9 min-w-[88px] justify-start cursor-pointer`}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              Step {active + 1} of {STEPS.length}
            </span>
          </div>
          <button type="button" onClick={onClose} className={`${buttonStyles.dark} h-9 cursor-pointer`}>
            Got it
          </button>
        </>
      }
    >
      <style precedence="hiw-keyframes">{KEYFRAMES}</style>

      <div className="hiw-root allow-motion grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Stage */}
        <div
          aria-hidden="true"
          className={`relative h-[290px] overflow-hidden rounded-2xl ring-1 ring-inset ring-border/60 md:h-auto md:min-h-[372px] ${paused ? 'hiw-paused' : ''}`}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.tone}
              className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-700 ${STAGE_BG[s.tone]} ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(15,23,42,0.07)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

          <div className="absolute left-1/2 top-1/2 h-[270px] w-[320px] -translate-x-1/2 -translate-y-1/2 scale-[0.92] sm:scale-100">
            <div key={`${active}-${run}`} className="relative h-full w-full" style={anim('scene-in', 450)}>
              <Scene />
            </div>
          </div>
        </div>

        {/* Step list */}
        <ol className="flex flex-col gap-1.5 p-1">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === active;
            const isDone = idx < active;
            const activeRing = TONE_RINGS[step.tone] || 'ring-2 ring-inset ring-primary';

            return (
              <li
                key={step.title}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive ? `bg-card ${activeRing}` : 'ring-1 ring-inset ring-border/50 hover:bg-muted/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-current={isActive ? 'step' : undefined}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                >
                  <span className="relative grid size-9 shrink-0 place-items-center">
                    {isActive && (
                      <span
                        className={`absolute inset-0 rounded-xl ${TONES[step.tone]?.chip || ''}`}
                        style={{ animation: 'hiw-ping 1.8s cubic-bezier(0,0,.2,1) infinite' }}
                      />
                    )}
                    <span
                      className={`relative grid size-9 place-items-center rounded-xl transition-colors duration-300 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isActive
                            ? TONES[step.tone]?.chip || ''
                            : 'bg-muted/70 text-muted-foreground'
                      }`}
                    >
                      {isDone ? (
                        <Check key="done" size={16} strokeWidth={3} style={anim('pop', 400, 0, SPRING)} />
                      ) : (
                        <Icon size={16} />
                      )}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium text-muted-foreground">Step {idx + 1}</span>
                    <span
                      className={`block text-sm font-semibold transition-colors ${
                        isActive ? 'text-foreground' : 'text-foreground/70'
                      }`}
                    >
                      {step.title}
                    </span>
                  </span>
                </button>

                {/* Expanding detail */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
                  aria-hidden={!isActive}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="pb-3.5 pl-[60px] pr-3.5">
                      <p className="text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                      <button
                        type="button"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          onClose();
                          navigate(step.route);
                        }}
                        className={`${buttonStyles.outline} mt-2.5 h-8 px-3 cursor-pointer`}
                      >
                        {step.actionLabel}
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step timer */}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[3.5px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <span
                      key={`${active}-${run}`}
                      className={`block h-full w-full ${PROGRESS_BAR[step.tone]}`}
                      style={{
                        transformOrigin: 'left',
                        animation: playing ? `hiw-progress ${STEP_MS}ms linear forwards` : 'none',
                        transform: playing ? undefined : 'scaleX(1)',
                      }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </ModalShell>
  );
}
