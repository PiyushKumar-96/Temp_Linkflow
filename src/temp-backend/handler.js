/**
 * Temp Backend Request Handler
 * Emulates HTTP request routing against the temp-backend data store.
 */

import {
  getStoredPosts,
  saveStoredPosts,
  getPostById,
  updatePost,
  approvePost,
  rejectPost,
  regeneratePost,
  addPostComment,
  getAnalyticsSummary,
  getEngagementTrends,
  getTopics,
  getTeamMembers,
  inviteTeamMember,
  updateTeamMemberRole,
  getTemplates,
  getContentLibrary,
  getMediaAssets,
} from './index';

export async function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const params = options.params || {};
  const [path] = endpoint.split('?');

  // Strip leading /api/v1 if present
  const cleanPath = path.replace(/^\/api\/v1/, '').replace(/\/$/, '') || '/';

  // --- POSTS ROUTES ---
  if (cleanPath === '/posts') {
    if (method === 'GET') {
      const posts = getStoredPosts();
      if (params.queue === 'approval') {
        const queuePosts = posts.filter(
          (p) =>
            p.id.startsWith('appr-') ||
            p.status === 'awaiting_review' ||
            p.status === 'needs_revision' ||
            p.status === 'pending' ||
            p.status === 'approved' ||
            p.status === 'rejected' ||
            p.status === 'failed'
        );
        return { posts: queuePosts, total: queuePosts.length };
      }
      if (params.status) {
        const filtered = posts.filter((p) => p.status === params.status);
        return { posts: filtered, total: filtered.length };
      }
      return { posts, total: posts.length };
    }
  }

  // Matching /posts/:id/reviews
  const reviewMatch = cleanPath.match(/^\/posts\/([^/]+)\/reviews$/);
  if (reviewMatch && method === 'POST') {
    const postId = reviewMatch[1];
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    if (body.decision === 'approve') {
      const post = await approvePost(postId, body.authorName || 'Sarah Reeves');
      return { id: postId, status: 'approved', post };
    }
    if (body.decision === 'reject') {
      const post = await rejectPost(postId, body.feedback || 'Revision requested', body.authorName || 'Sarah Reeves');
      return { id: postId, status: 'rejected', feedback: body.feedback, post };
    }
  }

  // Matching /posts/:id/regenerate
  const regenMatch = cleanPath.match(/^\/posts\/([^/]+)\/regenerate$/);
  if (regenMatch && method === 'POST') {
    const postId = regenMatch[1];
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const post = await regeneratePost(postId, body.brief || '', body.authorName || 'Sarah Reeves');
    return post;
  }

  // Matching /posts/:id/comments
  const commentMatch = cleanPath.match(/^\/posts\/([^/]+)\/comments$/);
  if (commentMatch && method === 'POST') {
    const postId = commentMatch[1];
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const post = await addPostComment(postId, body.text || '', body.authorName || 'Sarah Reeves');
    return post;
  }

  // Matching /posts/:id/approve
  const approveMatch = cleanPath.match(/^\/posts\/([^/]+)\/approve$/);
  if (approveMatch) {
    return await approvePost(approveMatch[1]);
  }

  // Matching /posts/:id
  const postMatch = cleanPath.match(/^\/posts\/([^/]+)$/);
  if (postMatch) {
    const postId = postMatch[1];
    if (method === 'GET') {
      const post = await getPostById(postId);
      if (!post) throw new Error(`Post ${postId} not found`);
      return post;
    }
    if (method === 'PATCH' || method === 'PUT') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      return await updatePost(postId, body);
    }
  }

  // --- ANALYTICS ROUTES ---
  if (cleanPath === '/analytics' || cleanPath === '/analytics/summary') {
    const range = params.range || 'range-30d';
    const summary = await getAnalyticsSummary(range);
    const trends = await getEngagementTrends(range);
    return { summary, trends };
  }

  if (cleanPath === '/analytics/trends') {
    const range = params.range || 'range-30d';
    return await getEngagementTrends(range);
  }

  // --- TOPICS ROUTES ---
  if (cleanPath === '/topics') {
    const topics = await getTopics();
    return { topics, total: topics.length };
  }

  // --- TEAM ROUTES ---
  if (cleanPath === '/team' || cleanPath === '/team/members') {
    if (method === 'GET') {
      const team = await getTeamMembers();
      return { members: team, total: team.length };
    }
  }

  if (cleanPath === '/team/invite' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    return await inviteTeamMember(body);
  }

  const roleMatch = cleanPath.match(/^\/team\/members\/([^/]+)\/role$/);
  if (roleMatch && (method === 'PATCH' || method === 'PUT')) {
    const memberId = roleMatch[1];
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    return await updateTeamMemberRole(memberId, body.role);
  }

  // --- TEMPLATES ROUTES ---
  if (cleanPath === '/templates') {
    const templates = await getTemplates();
    return { templates, total: templates.length };
  }

  // --- CONTENT LIBRARY ROUTES ---
  if (cleanPath === '/library' || cleanPath === '/content-library') {
    const items = await getContentLibrary();
    return { items, total: items.length };
  }

  // --- MEDIA ROUTES ---
  if (cleanPath === '/media') {
    return await getMediaAssets();
  }

  return null;
}
