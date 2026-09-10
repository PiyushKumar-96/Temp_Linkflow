import { z } from 'zod';
import { POST_STATUS } from '../post-status';

export const PostStatusSchema = z.enum([
  POST_STATUS.PLANNED,
  POST_STATUS.GENERATING,
  POST_STATUS.AUTO_REVIEW,
  POST_STATUS.NEEDS_REVISION,
  POST_STATUS.AWAITING_REVIEW,
  POST_STATUS.APPROVED,
  POST_STATUS.SCHEDULED,
  POST_STATUS.PUBLISHED,
  POST_STATUS.FAILED,
  POST_STATUS.REJECTED,
  POST_STATUS.MANUAL,
]);

export const VisualAssetSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().default(''),
  format: z.enum(['image', 'carousel', 'infographic', 'none']).default('image'),
  isSelected: z.boolean().default(false),
  slideIndex: z.number().optional(),
});

export const QualityAuditSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.string().default('A'),
  verdict: z.string().default(''),
  hookScore: z.number().min(0).max(100).default(90),
  clarityScore: z.number().min(0).max(100).default(90),
  voiceScore: z.number().min(0).max(100).default(90),
  readabilityWpm: z.number().default(220),
  issues: z
    .array(
      z.object({
        type: z.string(),
        severity: z.enum(['low', 'medium', 'high']),
        message: z.string(),
        suggestion: z.string().optional(),
      })
    )
    .default([]),
});

export const CitationSourceSchema = z.object({
  id: z.string(),
  claim: z.string(),
  sourceName: z.string(),
  url: z.string().url(),
  verifiedDate: z.string().default(''),
  confidence: z.number().min(0).max(100).default(95),
});

export const RevisionSchema = z.object({
  id: z.string(),
  versionNumber: z.number(),
  createdAt: z.string(),
  author: z.string(),
  authorType: z.enum(['ai', 'human']).default('human'),
  summary: z.string(),
  contentDiff: z.string().optional(),
});

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  hook: z.string().default(''),
  content: z.string(),
  cta: z.string().default(''),
  status: PostStatusSchema.default(POST_STATUS.PLANNED),
  category: z.string().default('Thought Leadership'),
  series: z.string().optional(),
  author: z.string().default('Sarah Reeves'),
  authorRole: z.string().default('Author'),
  authorInitials: z.string().default('SR'),
  accountId: z.enum(['company', 'personal']).default('company'),
  accountName: z.string().default('Acme Corp'),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  dueDate: z.string().optional(),
  submittedAt: z.string().optional(),
  publishedAt: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
  visuals: z.array(VisualAssetSchema).default([]),
  selectedVisualUrl: z.string().optional(),
  visualFormat: z.enum(['image', 'carousel', 'infographic', 'none']).default('image'),
  qualityAudit: QualityAuditSchema.optional(),
  citations: z.array(CitationSourceSchema).default([]),
  revisions: z.array(RevisionSchema).default([]),
  activityLog: z
    .array(
      z.object({
        id: z.string(),
        actor: z.string(),
        action: z.string(),
        timestamp: z.string(),
        details: z.string().optional(),
      })
    )
    .default([]),
});

export const PostCreateSchema = PostSchema.omit({ id: true }).partial({
  revisions: true,
  activityLog: true,
});

export const PostUpdateSchema = PostSchema.partial();
