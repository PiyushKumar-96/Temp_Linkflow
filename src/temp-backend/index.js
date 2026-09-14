/**
 * LinkedFlow Temp Backend
 * Centralized mock data store and service layer.
 * All frontend screens, components, and queries accept their data, fields, and images from here.
 */

import { MASTER_POSTS } from './data/posts';
import {
  ANALYTICS_METRICS_BY_RANGE,
  ENGAGEMENT_TRENDS_BY_RANGE,
  POST_TYPE_BREAKDOWN,
  BEST_TIME_HEATMAP,
  getTopPostsForRange,
} from './data/analytics';
import { TOPICS } from './data/topics';
import { TEAM_MEMBERS, WORKSPACE_ACCOUNTS } from './data/team';
import { LIBRARY_ITEMS } from './data/content-library';
import { AVATARS, STOCK_IMAGES, STOCK_IMAGES_LIST, VISUAL_TEMPLATES, BRANDING } from './data/media';
import { POST_STATUS } from '@/lib/post-status';

const POSTS_STORAGE_KEY = 'linkedflow_master_posts';
const TEAM_STORAGE_KEY = 'linkedflow_team_members';

/**
 * Normalizes a post object to ensure all arrays and objects are safely defined.
 */
function normalizePost(post) {
  let source = post.source;
  if (!source) {
    if (post.id?.startsWith('bulk-') || post.id === 'up-3' || post.id === 'appr-003') {
      source = 'bulk_upload';
    } else if (
      post.id?.startsWith('comp-') ||
      post.id === 'up-1' ||
      post.id === 'up-4' ||
      post.id === 'appr-002' ||
      post.id === 'appr-004'
    ) {
      source = 'composer';
    } else {
      source = 'ai_generator';
    }
  }

  return {
    ...post,
    source,
    comments: Array.isArray(post.comments) ? post.comments : [],
    revisionsList: Array.isArray(post.revisionsList) ? post.revisionsList : [],
    activityLog: Array.isArray(post.activityLog) ? post.activityLog : [],
    citations: Array.isArray(post.citations) ? post.citations : [],
    hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
    qualityAudit: post.qualityAudit || {
      score: 90,
      grade: 'A',
      verdict: 'Good Virality Potential',
      hookScore: 90,
      clarityScore: 90,
      voiceScore: 90,
      readabilityWpm: 220,
      issues: [],
    },
  };
}

/**
 * Retrieves persisted posts state from localStorage or falls back to default master posts.
 */
export function getStoredPosts() {
  if (typeof window === 'undefined') return MASTER_POSTS.map(normalizePost);
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all approval queue posts exist in the returned list
        const normalized = parsed.map(normalizePost);
        const existingIds = new Set(normalized.map((p) => p.id));
        const missingApprovalPosts = MASTER_POSTS.filter(
          (p) => p.id.startsWith('appr-') && !existingIds.has(p.id)
        ).map(normalizePost);

        return [...normalized, ...missingApprovalPosts];
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return MASTER_POSTS.map(normalizePost);
}

/**
 * Saves posts to local storage.
 */
export function saveStoredPosts(posts) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Ignore storage quota error
  }
}

// Initialize storage once
if (typeof window !== 'undefined' && !localStorage.getItem(POSTS_STORAGE_KEY)) {
  saveStoredPosts(MASTER_POSTS.map(normalizePost));
}

// ==========================================
// POSTS SERVICES
// ==========================================

export async function getPosts(filter = {}) {
  const posts = getStoredPosts();
  if (filter.status) {
    return posts.filter((p) => p.status === filter.status);
  }
  return posts;
}

export async function getPostById(id) {
  const posts = getStoredPosts();
  return posts.find((p) => p.id === id || p.slug === id) || null;
}

export async function getUpcomingPosts() {
  const posts = getStoredPosts();
  const upcoming = posts.filter(
    (p) =>
      p.status === POST_STATUS.SCHEDULED || (p.status === POST_STATUS.APPROVED && p.scheduledDate)
  );
  const seen = new Set();
  return upcoming.filter((p) => {
    const key = (p.title || p.id || '').trim().toLowerCase();
    if (seen.has(key) || seen.has(p.id)) return false;
    seen.add(key);
    seen.add(p.id);
    return true;
  });
}

export async function getRecentlyPublishedPosts() {
  const posts = getStoredPosts();
  return posts.filter((p) => p.status === POST_STATUS.PUBLISHED || p.impressions);
}

export async function getPendingReviewPosts() {
  const posts = getStoredPosts();
  return posts.filter(
    (p) => p.status === POST_STATUS.AWAITING_REVIEW || p.status === POST_STATUS.NEEDS_REVISION
  );
}

export async function getFailedPosts() {
  const posts = getStoredPosts();
  return posts.filter((p) => p.status === POST_STATUS.FAILED);
}

export async function createPost(postData) {
  const posts = getStoredPosts();
  const normalized = normalizePost({
    ...postData,
    id: postData.id || `comp-${Date.now()}`,
    source: postData.source || 'composer',
    status: postData.status || POST_STATUS.AWAITING_REVIEW,
    createdAt: postData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const nextPosts = [normalized, ...posts];
  saveStoredPosts(nextPosts);

  if (
    typeof window !== 'undefined' &&
    (normalized.status === POST_STATUS.AWAITING_REVIEW || normalized.status === 'awaiting_review')
  ) {
    try {
      const stored = localStorage.getItem('linkedflow_approval_posts');
      const approvalPosts = stored ? JSON.parse(stored) : [];
      const updated = [normalized, ...approvalPosts.filter((p) => p.id !== normalized.id)];
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  return normalized;
}

export async function updatePost(id, updates) {
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Post with id ${id} not found`);
  }
  const updatedPost = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
  const nextPosts = [...posts];
  nextPosts[index] = updatedPost;
  saveStoredPosts(nextPosts);
  return updatedPost;
}

export async function approvePost(id, authorName = 'Sarah Reeves') {
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error(`Post ${id} not found`);

  const approvalEntry = {
    id: `cmt-${Date.now()}`,
    author: authorName,
    authorInitials: authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    text: 'Approved and authorized for LinkedIn scheduling via Buffer.',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    type: 'approval',
  };

  return updatePost(id, {
    status: POST_STATUS.APPROVED,
    approvedAt: new Date().toISOString(),
    comments: [...(post.comments || []), approvalEntry],
    activityLog: [
      ...(post.activityLog || []),
      {
        id: `act-${Date.now()}`,
        actor: authorName,
        action: 'Approved post for scheduling',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
    ],
  });
}

export async function rejectPost(id, feedback, authorName = 'Sarah Reeves') {
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error(`Post ${id} not found`);

  const rejectionComment = {
    id: `cmt-${Date.now()}`,
    author: authorName,
    authorInitials: authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    text: feedback,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    type: 'rejection',
  };

  return updatePost(id, {
    status: POST_STATUS.REJECTED,
    rejectedAt: new Date().toISOString(),
    comments: [...(post.comments || []), rejectionComment],
    activityLog: [
      ...(post.activityLog || []),
      {
        id: `act-${Date.now()}`,
        actor: authorName,
        action: 'Rejected post with change requests',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        details: feedback,
      },
    ],
  });
}

export async function regeneratePost(id, brief, authorName = 'Sarah Reeves') {
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error(`Post ${id} not found`);

  const briefComment = {
    id: `cmt-${Date.now()}`,
    author: authorName,
    authorInitials: authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    text: `Revision brief requested: "${brief}"`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    type: 'revision_request',
  };

  return updatePost(id, {
    status: POST_STATUS.AWAITING_REVIEW,
    comments: [...(post.comments || []), briefComment],
    activityLog: [
      ...(post.activityLog || []),
      {
        id: `act-${Date.now()}`,
        actor: authorName,
        action: 'Regenerated draft copy with updated brief prompt',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        details: brief,
      },
    ],
  });
}

export async function addPostComment(id, text, authorName = 'Sarah Reeves', type = 'comment') {
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error(`Post ${id} not found`);

  const newComment = {
    id: `cmt-${Date.now()}`,
    author: authorName,
    authorInitials: authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    text,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    type,
  };

  return updatePost(id, {
    comments: [...(post.comments || []), newComment],
    activityLog: [
      ...(post.activityLog || []),
      {
        id: `act-${Date.now()}`,
        actor: authorName,
        action: 'Added comment',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
    ],
  });
}

// ==========================================
// ANALYTICS SERVICES
// ==========================================

export async function getAnalyticsSummary(range = 'range-30d') {
  const normalizedKey = range.startsWith('range-') ? range : `range-${range}`;
  return ANALYTICS_METRICS_BY_RANGE[normalizedKey] || ANALYTICS_METRICS_BY_RANGE['range-30d'];
}

export async function getEngagementTrends(range = 'range-30d') {
  const normalizedKey = range.startsWith('range-') ? range : `range-${range}`;
  return ENGAGEMENT_TRENDS_BY_RANGE[normalizedKey] || ENGAGEMENT_TRENDS_BY_RANGE['range-30d'];
}

export async function getPostTypeBreakdown() {
  return POST_TYPE_BREAKDOWN;
}

export async function getBestTimeHeatmap() {
  return BEST_TIME_HEATMAP;
}

export async function getTopPosts(range = 'range-30d') {
  return getTopPostsForRange(range);
}

/**
 * Exports analytics data as a downloadable CSV.
 */
export function exportAnalyticsData(range = 'range-30d', format = 'csv') {
  const normalizedRange = range.replace('range-', '');
  const metrics = ANALYTICS_METRICS_BY_RANGE[range] || ANALYTICS_METRICS_BY_RANGE['range-30d'];
  const topPosts = getTopPostsForRange(range);

  let csvContent = `data:text/csv;charset=utf-8,LinkedFlow Analytics Report - Range: ${normalizedRange}\nGenerated: ${new Date().toISOString()}\n\n`;
  csvContent += `METRIC,VALUE,CHANGE\n`;
  metrics.forEach((m) => {
    csvContent += `"${m.label}","${m.value}","${m.change}% (${m.changeLabel})"\n`;
  });

  csvContent += `\nTOP POSTS\n`;
  csvContent += `POST ID,TITLE,AUTHOR,PUBLISHED,IMPRESSIONS,REACTIONS,COMMENTS,ENGAGEMENT RATE\n`;
  topPosts.forEach((p) => {
    csvContent += `"${p.id}","${p.title.replace(/"/g, '""')}","${p.author}","${p.publishedDate}",${p.impressions},${p.reactions},${p.comments},${p.engRate}%\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `linkedin_analytics_${normalizedRange}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, count: topPosts.length };
}

// ==========================================
// OTHER ENTITY SERVICES
// ==========================================

export async function getTopics() {
  return TOPICS;
}

export async function getTeamMembers() {
  if (typeof window === 'undefined') return TEAM_MEMBERS;
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }
  return TEAM_MEMBERS;
}

export async function saveTeamMembers(members) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
  } catch {
    // Ignore error
  }
}

export async function inviteTeamMember(memberData) {
  const members = await getTeamMembers();
  const initials = memberData.name
    ? memberData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'TU';
  const newMember = {
    id: `usr-${Date.now()}`,
    name: memberData.name,
    email: memberData.email,
    role: memberData.role || 'marketing',
    title:
      memberData.role === 'owner'
        ? 'Account Owner'
        : memberData.role === 'reviewer'
          ? 'Content Reviewer'
          : 'Marketing Contributor',
    status: 'pending',
    initials,
    joinedAt: new Date().toISOString().slice(0, 10),
    lastActive: 'Never',
    postsCreated: 0,
    postsApproved: 0,
  };
  const next = [...members, newMember];
  await saveTeamMembers(next);
  return newMember;
}

export async function updateTeamMemberRole(id, role) {
  const members = await getTeamMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) throw new Error(`Member ${id} not found`);
  const updated = { ...members[index], role };
  const next = [...members];
  next[index] = updated;
  await saveTeamMembers(next);
  return updated;
}

export async function getWorkspaceAccounts() {
  return WORKSPACE_ACCOUNTS;
}

export async function getContentLibrary() {
  return LIBRARY_ITEMS;
}

export async function getMediaAssets() {
  return {
    avatars: AVATARS,
    stockImages: STOCK_IMAGES,
    stockImagesList: STOCK_IMAGES_LIST,
    templates: VISUAL_TEMPLATES,
    branding: BRANDING,
  };
}

// Export raw collections for direct imports
export {
  MASTER_POSTS,
  TOPICS,
  TEAM_MEMBERS,
  WORKSPACE_ACCOUNTS,
  LIBRARY_ITEMS,
  AVATARS,
  STOCK_IMAGES,
  STOCK_IMAGES_LIST,
  VISUAL_TEMPLATES,
  BRANDING,
  ANALYTICS_METRICS_BY_RANGE,
  ENGAGEMENT_TRENDS_BY_RANGE,
  POST_TYPE_BREAKDOWN,
  BEST_TIME_HEATMAP,
};
