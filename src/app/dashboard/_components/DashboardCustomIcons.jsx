'use client';

import React from 'react';

/* ------------------------------------------------------------------ */
/* Custom Premium Icon Set for LinkedFlow Dashboard                    */
/* Designed with multi-tone depth, gradient accents & precision vector */
/* ------------------------------------------------------------------ */

/** 1. Pipeline Health — vital cardiogram pulse wave & orbital energy node */
export function IconPipelineHealth({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeDasharray="2.5 3" opacity="0.35" />
      <path
        d="M3 12h3.5l2.5-5.5 3.5 11 2.5-7.5 2 4h4"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M3 12h3.5l2.5-5.5 3.5 11 2.5-7.5 2 4h4" />
      <circle cx="15" cy="10" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 2. Today's Focus — precision focus target reticle & verified task card */
export function IconTodayFocus({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.3" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" strokeWidth="1.6" opacity="0.55" />
      <rect x="7" y="7" width="10" height="10" rx="2.5" fill="currentColor" fillOpacity="0.15" strokeWidth="1.6" />
      <path d="M9.5 12l1.8 1.8 3.5-3.8" strokeWidth="2.2" />
    </svg>
  );
}

/** 3. Attention Required — faceted cyber alert shield with exclamation core */
export function IconAttentionRequired({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M12 2.5l7 3.5v5.5c0 5-3.5 8.8-7 10-3.5-1.2-7-5-7-10V6l7-3.5z"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="6" strokeWidth="1" strokeDasharray="1.5 2.5" opacity="0.25" />
      <path d="M12 7.5v5" strokeWidth="2.3" />
      <circle cx="12" cy="15.8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 4. Pending Human Review — editorial manuscript with verification seal stamp */
export function IconPendingReview({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M6.5 3h7.5l5 5v11a2 2 0 01-2 2H6.5a2 2 0 01-2-2V5a2 2 0 012-2z"
        fill="currentColor"
        fillOpacity="0.12"
        strokeWidth="1.8"
      />
      <path d="M14 3v5h5" strokeWidth="1.5" opacity="0.7" />
      <path d="M8 11.5h6M8 14.5h4" strokeWidth="1.6" opacity="0.5" />
      <circle cx="15.5" cy="16" r="4.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
      <circle cx="15.5" cy="16" r="4" strokeWidth="1.6" />
      <path d="M14 16l1.2 1.2 2.3-2.3" strokeWidth="1.8" />
    </svg>
  );
}

/** 5. Content Performance — exponential analytics trendline with growth spark */
export function IconContentPerformance({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3.5" y="14" width="3.5" height="7" rx="1" fill="currentColor" fillOpacity="0.14" strokeWidth="1.5" />
      <rect x="10" y="9.5" width="3.5" height="11.5" rx="1" fill="currentColor" fillOpacity="0.2" strokeWidth="1.5" />
      <rect x="16.5" y="5.5" width="3.5" height="15.5" rx="1" fill="currentColor" fillOpacity="0.26" strokeWidth="1.5" />
      <path d="M3.5 12l5.5-5 5 4 6.5-7.5" strokeWidth="2.2" />
      <path d="M16.5 3.5h4.5v4.5" strokeWidth="2.2" />
      <circle cx="21" cy="3.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 6. Upcoming Posts — precision broadcast calendar & schedule telemetry */
export function IconUpcomingPosts({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3.5" y="4.5" width="17" height="16" rx="3.5" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <path d="M3.5 9h17" strokeWidth="1.5" opacity="0.6" />
      <path d="M7.5 2.5v3.5M16.5 2.5v3.5" strokeWidth="2" />
      <circle cx="12" cy="14.5" r="4.2" strokeWidth="1.5" />
      <path d="M12 12.2v2.3l1.6 1" strokeWidth="1.6" />
      <path d="M17.5 12a5 5 0 010 5" strokeWidth="1.5" opacity="0.45" />
    </svg>
  );
}

/** 7. Content Pillars — 4-quadrant strategic radar compass & orbital nodes */
export function IconContentPillars({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.35" />
      <rect x="10.5" y="3.5" width="3" height="4.5" rx="1.2" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
      <rect x="10.5" y="16" width="3" height="4.5" rx="1.2" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
      <rect x="3.5" y="10.5" width="4.5" height="3" rx="1.2" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
      <rect x="16" y="10.5" width="4.5" height="3" rx="1.2" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 8. Standard Workflow — electric lightning flow loop & power nodes */
export function IconWorkflow({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M4 12a8 8 0 0115.5-2.8M20 12a8 8 0 01-15.5 2.8"
        strokeWidth="1.4"
        strokeDasharray="2 3"
        opacity="0.45"
      />
      <path
        d="M13 2.5L5.5 13h5l-1.5 8.5L18.5 11h-5.5l2-8.5z"
        fill="currentColor"
        fillOpacity="0.18"
        strokeWidth="1.8"
      />
      <circle cx="13" cy="2.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="21.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Quick Action 1: New Post */
export function IconQuickNewPost({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <path d="M12 7.5v9M7.5 12h9" strokeWidth="2.4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Quick Action 2: Plan Topic */
export function IconQuickPlanTopic({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9.2" strokeWidth="1.7" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="5.6" strokeWidth="1.7" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2" strokeWidth="1.6" opacity="0.6" />
    </svg>
  );
}

/** Quick Action 3: Open Queue */
export function IconQuickOpenQueue({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="6.5" y="3" width="14" height="14" rx="3" strokeWidth="1.4" opacity="0.45" />
      <rect x="3" y="6.5" width="14" height="14" rx="3" fill="currentColor" fillOpacity="0.16" strokeWidth="1.8" />
      <path d="M6.5 13.5l2.6 2.6 5.2-5.2" strokeWidth="2.3" />
    </svg>
  );
}

/** Quick Action 4: View Reports */
export function IconQuickViewReports({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3.5" width="18" height="17" rx="3.5" fill="currentColor" fillOpacity="0.1" strokeWidth="1.6" />
      <path d="M7 16v-4M12 16V8M17 16v-6" strokeWidth="2.4" />
      <path d="M4.5 9l4.5-3.5 4 2.5 6-4.5" strokeWidth="1.6" opacity="0.75" />
      <circle cx="19" cy="3.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
