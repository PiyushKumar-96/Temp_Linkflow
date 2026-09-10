import { z } from 'zod';

export const ReviewDecisionTypeSchema = z.enum([
  'approve',
  'edit',
  'reject',
  'change_brief',
  'download_manual',
]);

export const ReviewDecisionPayloadSchema = z.object({
  postId: z.string(),
  decision: ReviewDecisionTypeSchema,
  feedback: z.string().optional(),
  targetTopicOrPrompt: z.string().optional(),
  reviewerRole: z.string().default('owner'),
});

export const ReviewCommentSchema = z.object({
  id: z.string(),
  author: z.string(),
  authorRole: z.string().default('Reviewer'),
  type: z.enum(['comment', 'revision_request', 'approval', 'rejection']).default('comment'),
  time: z.string(),
  content: z.string(),
});
