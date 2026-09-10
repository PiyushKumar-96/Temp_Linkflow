'use client';

import React from 'react';
import {
  Pulse,
  CheckSquareOffset,
  ShieldWarning,
  FileText,
  ChartLineUp,
  CalendarDots,
  Columns,
  Lightning,
  NotePencil,
  Target,
  Cards,
} from '@phosphor-icons/react';

/* ------------------------------------------------------------------ */
/* Phosphor Icons — Duotone Suite for LinkedFlow Dashboard            */
/* Official Phosphor Duotone aesthetic with multi-layer depth & tones */
/* ------------------------------------------------------------------ */

/** 1. Pipeline Health — Duotone Pulse */
export function IconPipelineHealth({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <Pulse size={size} weight={weight} className={className} {...props} />;
}

/** 2. Today's Focus — Duotone CheckSquareOffset */
export function IconTodayFocus({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <CheckSquareOffset size={size} weight={weight} className={className} {...props} />;
}

/** 3. Attention Required — Duotone ShieldWarning */
export function IconAttentionRequired({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <ShieldWarning size={size} weight={weight} className={className} {...props} />;
}

/** 4. Pending Human Review — Duotone FileText */
export function IconPendingReview({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <FileText size={size} weight={weight} className={className} {...props} />;
}

/** 5. Content Performance — Duotone ChartLineUp */
export function IconContentPerformance({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <ChartLineUp size={size} weight={weight} className={className} {...props} />;
}

/** 6. Upcoming Posts — Duotone CalendarDots */
export function IconUpcomingPosts({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <CalendarDots size={size} weight={weight} className={className} {...props} />;
}

/** 7. Content Pillars — Duotone Columns */
export function IconContentPillars({ size = 19, className = '', weight = 'duotone', ...props }) {
  return <Columns size={size} weight={weight} className={className} {...props} />;
}

/** 8. Standard Workflow — Duotone Lightning */
export function IconWorkflow({ size = 20, className = '', weight = 'duotone', ...props }) {
  return <Lightning size={size} weight={weight} className={className} {...props} />;
}

/** Quick Action 1: New Post — Duotone NotePencil */
export function IconQuickNewPost({ size = 20, className = '', weight = 'duotone', ...props }) {
  return <NotePencil size={size} weight={weight} className={className} {...props} />;
}

/** Quick Action 2: Plan Topic — Duotone Target */
export function IconQuickPlanTopic({ size = 20, className = '', weight = 'duotone', ...props }) {
  return <Target size={size} weight={weight} className={className} {...props} />;
}

/** Quick Action 3: Open Queue — Duotone Cards */
export function IconQuickOpenQueue({ size = 20, className = '', weight = 'duotone', ...props }) {
  return <Cards size={size} weight={weight} className={className} {...props} />;
}

/** Quick Action 4: View Reports — Duotone ChartLineUp */
export function IconQuickViewReports({ size = 20, className = '', weight = 'duotone', ...props }) {
  return <ChartLineUp size={size} weight={weight} className={className} {...props} />;
}
