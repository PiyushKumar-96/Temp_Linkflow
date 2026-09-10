import { z } from 'zod';
import { PostStatusSchema } from './post.schema';

export const CalendarItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: PostStatusSchema,
  date: z.string(),
  time: z.string().optional(),
  author: z.string(),
  authorInitials: z.string(),
  category: z.string(),
  series: z.string().optional(),
});

export const CalendarQuerySchema = z.object({
  month: z.string().optional(),
  view: z.enum(['month', 'week']).default('month'),
  member: z.string().default('all'),
  series: z.string().default('all'),
});
