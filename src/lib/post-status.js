/**
 * Post Status Domain Model
 * Single source of truth for post lifecycle states across LinkedFlow.
 */

export const POST_STATUS = Object.freeze({
  PLANNED: 'planned',
  GENERATING: 'generating',
  AUTO_REVIEW: 'auto_review',
  NEEDS_REVISION: 'needs_revision',
  AWAITING_REVIEW: 'awaiting_review',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  FAILED: 'failed',
  REJECTED: 'rejected',
  MANUAL: 'manual',
});

/**
 * Display metadata per post status
 */
export const STATUS_META = Object.freeze({
  [POST_STATUS.PLANNED]: {
    label: 'Planned',
    token: 'status-planned',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    isTerminal: false,
    description: 'Topic planned and scheduled for generation',
  },
  [POST_STATUS.GENERATING]: {
    label: 'Generating',
    token: 'status-generating',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500 animate-pulse',
    isTerminal: false,
    description: 'AI model is creating copy and visuals',
  },
  [POST_STATUS.AUTO_REVIEW]: {
    label: 'Auto Review',
    token: 'status-auto-review',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500 animate-pulse',
    isTerminal: false,
    description: 'Automated audit evaluating hook contrast & compliance',
  },
  [POST_STATUS.NEEDS_REVISION]: {
    label: 'Needs Revision',
    token: 'status-needs-revision',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    isTerminal: false,
    description: 'Changes requested by reviewer or automated check',
  },
  [POST_STATUS.AWAITING_REVIEW]: {
    label: 'Awaiting Review',
    token: 'status-awaiting-review',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
    isTerminal: false,
    description: 'Draft ready for human approval',
  },
  [POST_STATUS.APPROVED]: {
    label: 'Approved',
    token: 'status-approved',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    isTerminal: false,
    description: 'Approved by account owner for scheduling',
  },
  [POST_STATUS.SCHEDULED]: {
    label: 'Scheduled',
    token: 'status-scheduled',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
    isTerminal: false,
    description: 'Queued in Buffer buffer for automatic publishing',
  },
  [POST_STATUS.PUBLISHED]: {
    label: 'Published',
    token: 'status-published',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotClass: 'bg-teal-600',
    isTerminal: true,
    description: 'Live on LinkedIn',
  },
  [POST_STATUS.FAILED]: {
    label: 'Failed',
    token: 'status-failed',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    isTerminal: true,
    description: 'Publishing error or API failure',
  },
  [POST_STATUS.REJECTED]: {
    label: 'Rejected',
    token: 'status-rejected',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    isTerminal: true,
    description: 'Declined by reviewer',
  },
  [POST_STATUS.MANUAL]: {
    label: 'Manual Publish',
    token: 'status-manual',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    dotClass: 'bg-orange-500',
    isTerminal: true,
    description: 'Exported for manual posting directly on LinkedIn',
  },
});

/**
 * Normalizes legacy or informal status strings into the canonical POST_STATUS enum
 * @param {string} rawStatus
 * @returns {string} canonical status key
 */
export function normalizeStatus(rawStatus) {
  if (!rawStatus) return POST_STATUS.PLANNED;
  const s = String(rawStatus).toLowerCase().trim().replace(/[\s-]+/g, '_');

  switch (s) {
    case 'draft':
    case 'planned':
      return POST_STATUS.PLANNED;
    case 'generating':
    case 'in_generation':
      return POST_STATUS.GENERATING;
    case 'auto_review':
    case 'evaluating':
      return POST_STATUS.AUTO_REVIEW;
    case 'needs_revision':
    case 'revision_requested':
    case 'revision':
      return POST_STATUS.NEEDS_REVISION;
    case 'pending':
    case 'pending_review':
    case 'awaiting_review':
      return POST_STATUS.AWAITING_REVIEW;
    case 'approved':
      return POST_STATUS.APPROVED;
    case 'scheduled':
      return POST_STATUS.SCHEDULED;
    case 'published':
    case 'archived':
      return POST_STATUS.PUBLISHED;
    case 'failed':
    case 'error':
      return POST_STATUS.FAILED;
    case 'rejected':
      return POST_STATUS.REJECTED;
    case 'manual':
    case 'manual_publish':
      return POST_STATUS.MANUAL;
    default:
      return POST_STATUS.PLANNED;
  }
}

/**
 * Predicate helpers
 */
export function isTerminal(status) {
  const canonical = normalizeStatus(status);
  return Boolean(STATUS_META[canonical]?.isTerminal);
}

export function isInProgress(status) {
  const canonical = normalizeStatus(status);
  return (
    canonical === POST_STATUS.GENERATING ||
    canonical === POST_STATUS.AUTO_REVIEW
  );
}

export function canReview(status) {
  const canonical = normalizeStatus(status);
  return (
    canonical === POST_STATUS.AWAITING_REVIEW ||
    canonical === POST_STATUS.NEEDS_REVISION ||
    canonical === POST_STATUS.APPROVED
  );
}

export function canPublish(status) {
  const canonical = normalizeStatus(status);
  return (
    canonical === POST_STATUS.APPROVED ||
    canonical === POST_STATUS.SCHEDULED ||
    canonical === POST_STATUS.FAILED
  );
}

/**
 * Ordered status list for filter UIs and table views
 */
export const STATUS_FILTER_ORDER = Object.freeze([
  POST_STATUS.AWAITING_REVIEW,
  POST_STATUS.NEEDS_REVISION,
  POST_STATUS.GENERATING,
  POST_STATUS.AUTO_REVIEW,
  POST_STATUS.PLANNED,
  POST_STATUS.APPROVED,
  POST_STATUS.SCHEDULED,
  POST_STATUS.PUBLISHED,
  POST_STATUS.MANUAL,
  POST_STATUS.FAILED,
  POST_STATUS.REJECTED,
]);

/**
 * 4-5 High-level User-Facing Buckets (reduces 11 raw statuses to 4 core stages + attention)
 */
export const STATUS_BUCKET = Object.freeze({
  ALL: 'all',
  PLANNED: 'planned',
  IN_REVIEW: 'in_review',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ATTENTION: 'attention',
});

export const STATUS_BUCKET_META = Object.freeze({
  [STATUS_BUCKET.PLANNED]: {
    id: STATUS_BUCKET.PLANNED,
    label: 'Draft & Planned',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    description: 'Post idea planned or generating with AI',
    statuses: [POST_STATUS.PLANNED, POST_STATUS.GENERATING],
  },
  [STATUS_BUCKET.IN_REVIEW]: {
    id: STATUS_BUCKET.IN_REVIEW,
    label: 'In Review',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    description: 'Draft ready for human evaluation or revision',
    statuses: [POST_STATUS.AUTO_REVIEW, POST_STATUS.AWAITING_REVIEW, POST_STATUS.NEEDS_REVISION],
  },
  [STATUS_BUCKET.SCHEDULED]: {
    id: STATUS_BUCKET.SCHEDULED,
    label: 'Scheduled',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    description: 'Approved by owner; locked into publishing schedule',
    statuses: [POST_STATUS.APPROVED, POST_STATUS.SCHEDULED],
  },
  [STATUS_BUCKET.PUBLISHED]: {
    id: STATUS_BUCKET.PUBLISHED,
    label: 'Published',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotClass: 'bg-teal-600',
    description: 'Live on LinkedIn or manually posted',
    statuses: [POST_STATUS.PUBLISHED, POST_STATUS.MANUAL],
  },
  [STATUS_BUCKET.ATTENTION]: {
    id: STATUS_BUCKET.ATTENTION,
    label: 'Needs Attention',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    description: 'Posting failed or rejected by owner',
    statuses: [POST_STATUS.FAILED, POST_STATUS.REJECTED],
  },
});

export const STATUS_BUCKET_LIST = Object.freeze([
  STATUS_BUCKET_META[STATUS_BUCKET.IN_REVIEW],
  STATUS_BUCKET_META[STATUS_BUCKET.SCHEDULED],
  STATUS_BUCKET_META[STATUS_BUCKET.PLANNED],
  STATUS_BUCKET_META[STATUS_BUCKET.PUBLISHED],
  STATUS_BUCKET_META[STATUS_BUCKET.ATTENTION],
]);

/**
 * Returns the high-level user-facing bucket for any status
 * @param {string} status
 * @returns {string} bucket id ('planned' | 'in_review' | 'scheduled' | 'published' | 'attention')
 */
export function getStatusBucket(status) {
  const canonical = normalizeStatus(status);
  switch (canonical) {
    case POST_STATUS.PLANNED:
    case POST_STATUS.GENERATING:
      return STATUS_BUCKET.PLANNED;
    case POST_STATUS.AUTO_REVIEW:
    case POST_STATUS.AWAITING_REVIEW:
    case POST_STATUS.NEEDS_REVISION:
      return STATUS_BUCKET.IN_REVIEW;
    case POST_STATUS.APPROVED:
    case POST_STATUS.SCHEDULED:
      return STATUS_BUCKET.SCHEDULED;
    case POST_STATUS.PUBLISHED:
    case POST_STATUS.MANUAL:
      return STATUS_BUCKET.PUBLISHED;
    case POST_STATUS.FAILED:
    case POST_STATUS.REJECTED:
      return STATUS_BUCKET.ATTENTION;
    default:
      return STATUS_BUCKET.PLANNED;
  }
}

/**
 * Checks if a status matches a user bucket filter
 */
export function matchesStatusBucket(status, bucket) {
  if (!bucket || bucket === 'all' || bucket === STATUS_BUCKET.ALL) return true;
  return getStatusBucket(status) === bucket;
}

