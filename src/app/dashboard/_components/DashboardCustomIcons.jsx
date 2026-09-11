'use client';

import React from 'react';

/* -------------------------------------------------------------------------- */
/* LinkedFlow Cockpit Custom SVG Icon Suite                                   */
/* Handcrafted, pixel-aligned 24x24 icons tailored for LinkedIn operations,  */
/* AI drafting, editorial review, and automated publishing pipelines.         */
/* Features dual-tone depth: tinted structural fills + crisp foreground paths */
/* -------------------------------------------------------------------------- */

const defaultSvgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* ========================================================================== */
/* 1. Panel & Section Badges                                                  */
/* ========================================================================== */

/**
 * 1. Pipeline Health:
 * Precision vitals waveform running through an operational content pipeline.
 * Clean, razor-sharp, uncluttered, and mathematically balanced around (12, 12).
 */
export function IconPipelineHealth({ size = 20, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path
        d="M2.5 12h4l2.5-6.5 4 13 3-8.5 2 2H21.5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 2. Today's Focus:
 * Editorial precision reticle & compass target with an active milestone pin
 * and focal agenda checkpoint.
 */
export function IconTodayFocus({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Outer subtle target aura */}
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" />
      <circle cx="12" cy="12" r="9" />
      {/* Inner focus ring */}
      <circle cx="12" cy="12" r="4.5" strokeDasharray="2.5 2.5" />
      {/* Precision reticle crosshairs */}
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      {/* Center focal beacon dot */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * 3. Attention Required:
 * Tactical protection shield with an integrated warning conduit,
 * diagnostic pulse line, and urgent alert center core.
 */
export function IconAttentionRequired({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Shield silhouette with tinted protective fill */}
      <path
        d="M12 2.5l7.5 3.5v5.8c0 5.4-3.6 10-7.5 11.2-3.9-1.2-7.5-5.8-7.5-11.2V6L12 2.5z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M12 2.5l7.5 3.5v5.8c0 5.4-3.6 10-7.5 11.2-3.9-1.2-7.5-5.8-7.5-11.2V6L12 2.5z" />
      {/* Warning core exclamation with diamond aura */}
      <path d="M12 8v4.5" strokeWidth={2.2} />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

/**
 * 4. Pending Human Review:
 * Editorial draft manuscript page with inspection magnifier lens,
 * folded document corner, and review approval stamp lines.
 */
export function IconPendingReview({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Document page with soft interior fill */}
      <path
        d="M14 2.5H6a2.5 2.5 0 0 0-2.5 2.5v14A2.5 2.5 0 0 0 6 21.5h12a2.5 2.5 0 0 0 2.5-2.5v-10l-6.5-6.5z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path d="M14 2.5H6a2.5 2.5 0 0 0-2.5 2.5v14A2.5 2.5 0 0 0 6 21.5h12a2.5 2.5 0 0 0 2.5-2.5v-10l-6.5-6.5z" />
      {/* Folded corner */}
      <path d="M14 2.5V9h6.5" />
      {/* Text draft lines */}
      <path d="M7.5 12h4.5M7.5 16h3" />
      {/* Human inspection stamp lens */}
      <circle cx="15.5" cy="15.5" r="3.2" fill="currentColor" fillOpacity="0.18" strokeWidth={1.8} />
      <path d="M17.8 17.8l2.7 2.7" strokeWidth={2} />
    </svg>
  );
}

/**
 * 5. Content Performance:
 * Ascending multi-tier growth vector with LinkedIn reach dispersion wave,
 * trend elevation bars, and a peak telemetry marker.
 */
export function IconContentPerformance({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Gradient growth trajectory fill */}
      <path
        d="M3 18l6-6.5 4.5 4L20 7.5v10.5H3z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="none"
      />
      {/* Trendline trajectory */}
      <path d="M3 18l6-6.5 4.5 4L20 7.5" strokeWidth={2} />
      {/* Peak telemetry indicator arrow */}
      <path d="M15.5 7.5H20V12" strokeWidth={2} />
      {/* Baseline performance pillars */}
      <path d="M6 19v-4.5M11 19v-6M16 19v-8.5" opacity="0.6" strokeWidth={1.7} />
      <circle cx="20" cy="7.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

/**
 * 6. Upcoming Posts:
 * Precision editorial publishing calendar with slotted queue cards,
 * day binder rings, and a forward cadence indicator.
 */
export function IconUpcomingPosts({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Calendar body with soft tone fill */}
      <rect x="3" y="4.5" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.1" />
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      {/* Top ring binders */}
      <path d="M8 2.5v4M16 2.5v4" strokeWidth={2} />
      {/* Header boundary */}
      <path d="M3 9.5h18" />
      {/* Scheduled queue dots / upcoming post slots */}
      <circle cx="7.5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="13" r="1.2" fill="currentColor" />
      <path d="M7.5 16.5h5" strokeDasharray="1.5 2" />
      {/* Forward publication marker */}
      <path d="M15 16.5l1.8-1.8m0 0l-1.8-1.8" strokeWidth={1.5} opacity="0.75" />
    </svg>
  );
}

/**
 * 7. Content Pillars:
 * Architectural thematic pillars / balanced distribution blocks with
 * foundation platform, proportional tier levels, and equilibrium beam.
 */
export function IconContentPillars({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Foundation platform */}
      <rect x="3" y="19" width="18" height="2.5" rx="1" fill="currentColor" fillOpacity="0.18" />
      {/* Pillar 1: High tier (Thought leadership) */}
      <rect x="4.5" y="6" width="3.8" height="13" rx="1.5" fill="currentColor" fillOpacity="0.14" />
      <rect x="4.5" y="6" width="3.8" height="13" rx="1.5" />
      {/* Pillar 2: Core proof (Case studies) */}
      <rect x="10.1" y="9" width="3.8" height="10" rx="1.5" fill="currentColor" fillOpacity="0.14" />
      <rect x="10.1" y="9" width="3.8" height="10" rx="1.5" />
      {/* Pillar 3: Culture & insights */}
      <rect x="15.7" y="4" width="3.8" height="15" rx="1.5" fill="currentColor" fillOpacity="0.14" />
      <rect x="15.7" y="4" width="3.8" height="15" rx="1.5" />
      {/* Balance beam header */}
      <path d="M3 4h18" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  );
}

/**
 * 8. Standard Workflow:
 * Sequential 4-stage operational circuit (Slots → Draft → Review → Publish)
 * with interconnected nodes and propulsion forward arrow.
 */
export function IconWorkflow({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Circuit loop / pipeline track */}
      <rect x="3" y="3.5" width="18" height="17" rx="3.5" fill="currentColor" fillOpacity="0.08" />
      <rect x="3" y="3.5" width="18" height="17" rx="3.5" />
      {/* Node 1: Top left (Slot) */}
      <circle cx="7.5" cy="8" r="1.7" fill="currentColor" />
      {/* Connector line 1 -> 2 */}
      <path d="M9.5 8h4.5" />
      {/* Node 2: Top right (Draft) */}
      <circle cx="16" cy="8" r="1.7" fill="currentColor" />
      {/* Connector down to 3 */}
      <path d="M16 10v3.5" />
      {/* Node 3: Bottom right (Review) */}
      <circle cx="16" cy="15.5" r="1.7" fill="currentColor" />
      {/* Connector left to 4 */}
      <path d="M14 15.5H10" />
      {/* Node 4: Bottom left (Dispatch/Publish) with propulsion chevron */}
      <circle cx="7.5" cy="15.5" r="1.7" fill="currentColor" />
      <path d="M5.5 12l2-2 2 2" strokeWidth={1.6} opacity="0.75" />
    </svg>
  );
}

/* ========================================================================== */
/* 2. Quick Action Shortcuts                                                  */
/* ========================================================================== */

/**
 * Quick Action 1: New Post
 * Drafting stylus / fountain nib creating a LinkedIn post card with
 * an AI generative spark emitter.
 */
export function IconQuickNewPost({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Background card frame with soft tone */}
      <rect x="3.5" y="4.5" width="13" height="15.5" rx="2.5" fill="currentColor" fillOpacity="0.12" />
      <rect x="3.5" y="4.5" width="13" height="15.5" rx="2.5" />
      {/* Editorial text content preview */}
      <path d="M6.5 8.5h7M6.5 12h4" />
      {/* Precision drafting quill crossing into card */}
      <path
        d="M13.8 19.5l6.5-6.5a1.8 1.8 0 0 0 0-2.5l-.8-.8a1.8 1.8 0 0 0-2.5 0l-6.5 6.5v3.3h3.3z"
        fill="currentColor"
        fillOpacity="0.22"
      />
      <path d="M13.8 19.5l6.5-6.5a1.8 1.8 0 0 0 0-2.5l-.8-.8a1.8 1.8 0 0 0-2.5 0l-6.5 6.5v3.3h3.3z" />
      {/* AI Sparkle */}
      <path d="M18.5 4v2m-1-1h2" strokeWidth={1.5} />
    </svg>
  );
}

/**
 * Quick Action 2: Plan Topic
 * Strategic topic matrix with clustered pillar nodes and concentric
 * thematic reach circles.
 */
export function IconQuickPlanTopic({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Concentric thematic rings */}
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" />
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" fill="currentColor" fillOpacity="0.14" />
      <circle cx="12" cy="12" r="5.5" />
      {/* Central topic nucleus */}
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      {/* Orbital satellite pillar nodes */}
      <circle cx="12" cy="4.5" r="1.4" fill="currentColor" />
      <circle cx="19.5" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="19.5" r="1.4" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Quick Action 3: Open Queue
 * Layered approval queue cards with verification check seal.
 */
export function IconQuickOpenQueue({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Back queue card */}
      <path d="M6 4h13a2 2 0 0 1 2 2v9" strokeDasharray="1.5 2" opacity="0.6" />
      {/* Middle queue card */}
      <rect x="4.5" y="6" width="15" height="12" rx="2" fill="currentColor" fillOpacity="0.1" opacity="0.8" />
      <rect x="4.5" y="6" width="15" height="12" rx="2" opacity="0.8" />
      {/* Front active card */}
      <rect x="2.5" y="9" width="15" height="12" rx="2.5" fill="currentColor" fillOpacity="0.18" />
      <rect x="2.5" y="9" width="15" height="12" rx="2.5" />
      {/* Verification checkmark stamp on front card */}
      <path d="M6.5 15l2.2 2.2 4.5-4.5" strokeWidth={2} />
    </svg>
  );
}

/**
 * Quick Action 4: View Reports
 * Deep analytics dispersion radar with bar telemetry & peak growth wave.
 */
export function IconQuickViewReports({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Card container */}
      <rect x="2.5" y="3.5" width="19" height="17" rx="3" fill="currentColor" fillOpacity="0.1" />
      <rect x="2.5" y="3.5" width="19" height="17" rx="3" />
      {/* Performance bar chart heights */}
      <path d="M6.5 16v-4" strokeWidth={2.4} />
      <path d="M10.5 16v-7" strokeWidth={2.4} />
      <path d="M14.5 16v-9" strokeWidth={2.4} />
      <path d="M18.5 16v-5" strokeWidth={2.4} />
      {/* Trend arc connecting peaks */}
      <path d="M5.5 12c3-5 7-6 13-3" strokeWidth={1.6} strokeDasharray="2 2" />
    </svg>
  );
}

/**
 * Quick Actions Panel Header:
 * High-speed shortcut trigger / accelerator star with directional impulse chevron.
 */
export function IconQuickShortcuts({ size = 20, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      {/* Dynamic diamond badge */}
      <rect
        x="12"
        y="2.5"
        width="13"
        height="13"
        rx="3"
        transform="rotate(45 12 2.5)"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <rect x="12" y="2.5" width="13" height="13" rx="3" transform="rotate(45 12 2.5)" />
      {/* Lightning forward accelerator */}
      <path d="M13 7l-3.5 5.5h3L11 17l4.5-6h-3.2L14 7h-1z" fill="currentColor" />
    </svg>
  );
}

/**
 * How it works play indicator:
 * Radar circle with forward propulsion play wedge.
 */
export function IconWorkflowHowItWorks({ size = 15, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.14" />
      <circle cx="12" cy="12" r="9" />
      <polygon points="10,8.5 16,12 10,15.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ========================================================================== */
/* 3. Cockpit Header & Greeting Accents                                       */
/* ========================================================================== */

/** Morning greeting: warm solar disc rising above clean horizon */
export function IconGreetingMorning({ size = 16, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path d="M3 17h18" />
      <path d="M6.5 17a5.5 5.5 0 0 1 11 0" fill="currentColor" fillOpacity="0.2" />
      <path d="M6.5 17a5.5 5.5 0 0 1 11 0" />
      <path d="M12 3v3M4.5 8.5l2 1.5M19.5 8.5l-2 1.5" />
    </svg>
  );
}

/** Afternoon greeting: radiant sun with atmospheric cloud curve */
export function IconGreetingAfternoon({ size = 16, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <circle cx="10" cy="9.5" r="4.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="10" cy="9.5" r="4.5" />
      <path d="M10 2.5v2M4.5 5.5l1.5 1M16 11.5a4 4 0 0 1 4 4 3 3 0 0 1-3 3H7a4 4 0 0 1 0-8c.4 0 .8.05 1.2.15" />
    </svg>
  );
}

/** Evening greeting: crescent moon with celestial starlet */
export function IconGreetingEvening({ size = 16, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path
        d="M17.5 13.5A7.5 7.5 0 0 1 8.5 4.5 8 8 0 1 0 17.5 13.5z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M17.5 13.5A7.5 7.5 0 0 1 8.5 4.5 8 8 0 1 0 17.5 13.5z" />
      <path d="M16 5.5v2m-1-1h2" strokeWidth={1.5} />
    </svg>
  );
}

/** Header Date Tablet Calendar Icon */
export function IconHeaderCalendar({ size = 14, strokeWidth = 2.2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.14" />
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 2v3M16 2v3M3 8.5h18" />
      <circle cx="12" cy="13.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

/** Verified account / Operations role shield */
export function IconVerifiedRole({ size = 12, strokeWidth = 2.2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path
        d="M12 2l7 3.2v5c0 4.8-3.2 8.8-7 9.8-3.8-1-7-5-7-9.8v-5L12 2z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M12 2l7 3.2v5c0 4.8-3.2 8.8-7 9.8-3.8-1-7-5-7-9.8v-5L12 2z" />
      <path d="M9.5 11l1.8 1.8 3.5-3.5" strokeWidth={2.4} />
    </svg>
  );
}

/** Luxury diamond sparkle */
export function IconGenerativeSparkle({ size = 14, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M8 0c.3 3.8 3.8 6.5 8 8-4.2 1.5-7.7 4.2-8 8-.3-3.8-3.8-6.5-8-8 4.2-1.5 7.7-4.2 8-8z" />
    </svg>
  );
}

/** Clean geometric plus for primary CTA */
export function IconComposePlus({ size = 14, strokeWidth = 2.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ========================================================================== */
/* 4. Content Format Types                                                    */
/* ========================================================================== */

/** Carousel format: multi-page layered slide deck with progression pagination */
export function IconFormatCarousel({ size = 16, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="7" y="3" width="13" height="14" rx="2" fill="currentColor" fillOpacity="0.08" opacity="0.6" />
      <rect x="7" y="3" width="13" height="14" rx="2" opacity="0.6" />
      <rect x="3" y="6" width="13" height="14" rx="2.5" fill="currentColor" fillOpacity="0.18" />
      <rect x="3" y="6" width="13" height="14" rx="2.5" />
      <path d="M7 11.5l2 2.5 3-3.5" />
      <circle cx="6.5" cy="16.5" r="0.8" fill="currentColor" />
      <circle cx="9.5" cy="16.5" r="0.8" fill="currentColor" />
      <circle cx="12.5" cy="16.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

/** Image format: visual photo card with lens aperture & mountain skyline */
export function IconFormatImage({ size = 16, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.12" />
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.8" fill="currentColor" />
      <path d="M3 16.5l5.5-5 4 4 3-2.5 5.5 4.5" />
    </svg>
  );
}

/** Text format: typography paragraph with quotation hook */
export function IconFormatText({ size = 16, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" fill="currentColor" fillOpacity="0.1" />
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M7 8h10M7 11.5h8M7 15h5" />
    </svg>
  );
}

/** Video format: cinema slate / video player frame */
export function IconFormatVideo({ size = 16, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" fill="currentColor" fillOpacity="0.1" />
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <polygon points="10,8.5 16,12 10,15.5" fill="currentColor" />
    </svg>
  );
}

/** Infographic format: structured data insights matrix */
export function IconFormatInfographic({ size = 16, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="3" y="3.5" width="18" height="17" rx="3" fill="currentColor" fillOpacity="0.08" />
      <rect x="3" y="3.5" width="18" height="17" rx="3" />
      <path d="M3 9h18M9 3v18" />
      <rect x="12" y="12" width="6" height="5.5" rx="1" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

/* ========================================================================== */
/* 5. Publishing Targets                                                      */
/* ========================================================================== */

/** Company page: high-rise corporate office tower */
export function IconTargetCompany({ size = 14, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <rect x="4" y="3" width="11" height="18" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <rect x="4" y="3" width="11" height="18" rx="1.5" />
      <path d="M15 8h4a1.5 1.5 0 0 1 1.5 1.5V21H15" />
      <path d="M8 7h3M8 11h3M8 15h3M8 21v-3h3v3" />
    </svg>
  );
}

/** Personal profile: executive portrait silhouette */
export function IconTargetPersonal({ size = 14, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <circle cx="12" cy="7.5" r="4.2" fill="currentColor" fillOpacity="0.15" />
      <circle cx="12" cy="7.5" r="4.2" />
      <path d="M4.5 19.5c0-3.5 3.3-6 7.5-6s7.5 2.5 7.5 6" />
    </svg>
  );
}

/* ========================================================================== */
/* 6. Operational Incident & Action Icons                                     */
/* ========================================================================== */

/** Pipeline Failure: faceted warning diamond */
export function IconPipelineFailure({ size = 18, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path
        d="M10.3 3.2a2 2 0 0 1 3.4 0l8 14A2 2 0 0 1 20 20.2H4a2 2 0 0 1-1.7-3l8-14z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M10.3 3.2a2 2 0 0 1 3.4 0l8 14A2 2 0 0 1 20 20.2H4a2 2 0 0 1-1.7-3l8-14z" />
      <path d="M12 9v4.5" strokeWidth={2.4} />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** Retry Dispatch: dual orbital sync impulse arrows */
export function IconRetryDispatch({ size = 14, strokeWidth = 2.2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" />
      <path d="M3 21v-5h5" />
      <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

/** Manual Publish: download container with outgoing publication arrow */
export function IconManualPublish({ size = 14, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path d="M4 14.5v3.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.5" />
      <path d="M12 3v11M7.5 7.5L12 3l4.5 4.5" strokeWidth={2.2} />
    </svg>
  );
}

/** Attempts count retry loop badge */
export function IconAttemptsCount({ size = 12, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <path d="M19 12a7 7 0 1 1-2.5-5.3L19 9" />
      <path d="M19 5v4h-4" />
    </svg>
  );
}

/** Precision clock time badge */
export function IconPrecisionClock({ size = 12, strokeWidth = 2, className = '', ...props }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...defaultSvgProps} {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
