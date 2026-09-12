'use client';

import React, { useEffect, useMemo, useState } from 'react';

/**
 * Time-aware atmospheric scene for the dashboard hero card.
 *
 * Colours live as `stop-color` / `fill` values, both of which are animatable
 * CSS properties, so a phase change is a plain cross-fade rather than a JS
 * tween or a swap of pre-rendered images.
 *
 * Terrain is generated from a seeded PRNG rather than hand-written path data:
 * irregular ridge heights and tree spacing are what stop it reading as a
 * repeating sawtooth. The seeds are constants, so the silhouette is identical
 * on every render and between server and client.
 */

export const PHASES = ['dawn', 'morning', 'day', 'dusk', 'night'];

/**
 * Every palette keeps a dark left edge. Overlaid white text sits in that zone,
 * so contrast survives regardless of how bright the right side becomes.
 */
const PALETTES = {
  dawn: {
    skyFrom: '#2B3048',
    skyMid: '#6B5A6E',
    skyTo: '#C89078',
    orb: '#FFE0C2',
    ridgeFar: '#9E8894',
    ridgeMid: '#6E6076',
    ridgeNear: '#4A4258',
    treeFar: '#332E42',
    treeNear: '#1D1A28',
    orbX: 430,
    orbY: 196,
    orbScale: 0.94,
  },
  morning: {
    skyFrom: '#333A4E',
    skyMid: '#7B8BA0',
    skyTo: '#CDB79C',
    orb: '#FFF2DA',
    ridgeFar: '#A8B0BC',
    ridgeMid: '#7C8694',
    ridgeNear: '#565F70',
    treeFar: '#3A4252',
    treeNear: '#232936',
    orbX: 476,
    orbY: 148,
    orbScale: 1,
  },
  day: {
    skyFrom: '#2E3D52',
    skyMid: '#6D89A6',
    skyTo: '#A8C0D4',
    orb: '#FFFBF0',
    ridgeFar: '#B3C3D2',
    ridgeMid: '#8194A8',
    ridgeNear: '#5A6B80',
    treeFar: '#3C4A5C',
    treeNear: '#243040',
    orbX: 536,
    orbY: 108,
    orbScale: 1,
  },
  dusk: {
    skyFrom: '#1E1C34',
    skyMid: '#6A4560',
    skyTo: '#C4785C',
    orb: '#FFD2A6',
    ridgeFar: '#8A6270',
    ridgeMid: '#5E4458',
    ridgeNear: '#3C2E40',
    treeFar: '#2A2030',
    treeNear: '#16121C',
    orbX: 592,
    orbY: 214,
    orbScale: 1.12,
  },
  night: {
    skyFrom: '#0E1220',
    skyMid: '#1C2438',
    skyTo: '#333D58',
    orb: '#D6DEF0',
    ridgeFar: '#414C68',
    ridgeMid: '#2C3548',
    ridgeNear: '#1D2433',
    treeFar: '#151A26',
    treeNear: '#0A0D14',
    orbX: 498,
    orbY: 118,
    orbScale: 0.58,
  },
};

const W = 680;
const H = 400;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A soft, irregular horizon line. Heights wander rather than zig-zag. */
function buildRidge(seed, baseY, amplitude, segments) {
  const rand = mulberry32(seed);
  const step = W / segments;
  const pts = [];
  let y = baseY;
  for (let i = 0; i <= segments; i += 1) {
    y += (rand() - 0.5) * amplitude;
    y = Math.max(baseY - amplitude, Math.min(baseY + amplitude * 0.6, y));
    pts.push(`${(i * step).toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M0 ${H} L${pts.join(' L')} L${W} ${H} Z`;
}

/** Conifer silhouettes with varied height and spacing. */
function buildTreeline(seed, baseY, minH, maxH, minStep, maxStep) {
  const rand = mulberry32(seed);
  let x = -10;
  let d = `M${x} ${H}`;
  while (x < W + 10) {
    const step = minStep + rand() * (maxStep - minStep);
    const h = minH + rand() * (maxH - minH);
    const half = step / 2;
    d += ` L${(x + half).toFixed(1)} ${(baseY - h).toFixed(1)} L${(x + step).toFixed(1)} ${baseY.toFixed(1)}`;
    x += step;
  }
  return `${d} L${x.toFixed(1)} ${H} Z`;
}

const RIDGE_FAR = buildRidge(9137, 292, 34, 9);
const RIDGE_MID = buildRidge(4471, 326, 26, 11);
const RIDGE_NEAR = buildRidge(2803, 358, 18, 13);
const TREE_FAR = buildTreeline(6619, 372, 12, 26, 13, 21);
const TREE_NEAR = buildTreeline(1223, 398, 18, 40, 9, 16);

export function getPhase(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 7) return 'dawn';
  if (h >= 7 && h < 11) return 'morning';
  if (h >= 11 && h < 16) return 'day';
  if (h >= 16 && h < 20) return 'dusk';
  return 'night';
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function HeroScene({
  phase: phaseOverride,
  transitionMs = 1600,
  className = '',
}) {
  const [autoPhase, setAutoPhase] = useState(() => getPhase());
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (phaseOverride) return undefined;
    const tick = () => setAutoPhase(getPhase());
    const id = window.setInterval(tick, 60_000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [phaseOverride]);

  const phase = phaseOverride ?? autoPhase;
  const p = PALETTES[phase] ?? PALETTES.day;

  const ease = useMemo(
    () => (reducedMotion ? '0ms linear' : `${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`),
    [reducedMotion, transitionMs],
  );

  const fill = (color, opacity) => ({
    fill: color,
    opacity,
    transition: `fill ${ease}`,
  });
  const stop = (color) => ({ stopColor: color, transition: `stop-color ${ease}` });

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky runs dark-left to light-right, so text always sits on the dark end. */}
        <linearGradient id="heroSky" x1="0" y1="0.15" x2="1" y2="0.85">
          <stop offset="0%" style={stop(p.skyFrom)} />
          <stop offset="52%" style={stop(p.skyMid)} />
          <stop offset="100%" style={stop(p.skyTo)} />
        </linearGradient>

        {/* Radial falloff — a flat disc behind the orb is what created the visible ring. */}
        <radialGradient id="heroGlow">
          <stop offset="0%" style={{ ...stop(p.orb), stopOpacity: 0.5 }} />
          <stop offset="45%" style={{ ...stop(p.orb), stopOpacity: 0.16 }} />
          <stop offset="100%" style={{ ...stop(p.orb), stopOpacity: 0 }} />
        </radialGradient>

        {/* Haze at the horizon pushes the far ridges back. */}
        <linearGradient id="heroHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ ...stop(p.skyMid), stopOpacity: 0 }} />
          <stop offset="100%" style={{ ...stop(p.skyMid), stopOpacity: 0.55 }} />
        </linearGradient>

        {/* Text-side scrim. Belt and braces on top of the dark sky stop. */}
        <linearGradient id="heroScrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.46" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>

        {/* Fades the treeline out toward the text side instead of cutting it off. */}
        <linearGradient id="heroTreeFadeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="26%" stopColor="#6E6E6E" />
          <stop offset="58%" stopColor="#FFFFFF" />
        </linearGradient>
        <mask id="heroTreeFade">
          <rect x="0" y="0" width={W} height={H} fill="url(#heroTreeFadeGrad)" />
        </mask>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#heroSky)" />

      <g
        style={{
          transform: `translate(${p.orbX}px, ${p.orbY}px) scale(${p.orbScale})`,
          transition: `transform ${ease}`,
        }}
      >
        <circle r="120" fill="url(#heroGlow)" />
        <circle r="25" style={fill(p.orb, 0.9)} />
      </g>

      <path d={RIDGE_FAR} style={fill(p.ridgeFar, 0.32)} />
      <path d={RIDGE_MID} style={fill(p.ridgeMid, 0.5)} />
      <rect x="0" y="230" width={W} height={120} fill="url(#heroHaze)" />
      <path d={RIDGE_NEAR} style={fill(p.ridgeNear, 0.72)} />

      <g mask="url(#heroTreeFade)">
        <path d={TREE_FAR} style={fill(p.treeFar, 0.82)} />
        <path d={TREE_NEAR} style={fill(p.treeNear, 1)} />
      </g>

      <rect x="0" y="0" width={W} height={H} fill="url(#heroScrim)" />
    </svg>
  );
}
