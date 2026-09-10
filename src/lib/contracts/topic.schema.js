import { z } from 'zod';
import { PostStatusSchema } from './post.schema';

export const TargetAccountSchema = z.enum(['personal', 'company']);

export const TopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  seriesId: z.string().default('series-1'),
  seriesName: z.string().default('Thought Leadership'),
  account: TargetAccountSchema.default('personal'),
  audience: z.string().default('B2B SaaS Founders'),
  publicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  brief: z.string().optional().default(''),
  status: PostStatusSchema.default('planned'),
  downstreamPostId: z.string().optional(),
  downstreamPostStatus: PostStatusSchema.optional(),
  createdAt: z.string(),
});

export const CreateTopicInputSchema = TopicSchema.omit({ id: true, createdAt: true }).extend({
  title: z.string().min(3, 'Title is required'),
  publicationDate: z.string().min(1, 'Publication date is required'),
});

export const UpdateTopicInputSchema = CreateTopicInputSchema.partial();
