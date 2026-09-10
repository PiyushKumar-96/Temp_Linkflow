import { z } from 'zod';

export const MetricItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  change: z.string().optional(),
  isPositive: z.boolean().default(true),
  period: z.string().default('vs last period'),
});

export const EngagementTrendPointSchema = z.object({
  date: z.string(),
  impressions: z.number(),
  reactions: z.number(),
  comments: z.number(),
});

export const TopPostSchema = z.object({
  id: z.string(),
  excerpt: z.string(),
  author: z.string(),
  authorInitials: z.string(),
  publishedDate: z.string(),
  impressions: z.number(),
  reactions: z.number(),
  comments: z.number(),
  reposts: z.number(),
  engRate: z.number(),
  trend: z.enum(['up', 'down', 'neutral']).default('up'),
  category: z.string(),
});
