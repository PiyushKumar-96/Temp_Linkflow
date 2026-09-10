import { z } from 'zod';

export const ScheduleSlotSchema = z.object({
  id: z.string(),
  day: z.string(),
  time: z.string(),
  active: z.boolean().default(true),
});

export const SeriesSettingSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Series name is required'),
  cadence: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).default('weekly'),
  guidelines: z.string().default(''),
});

export const BrandVoiceRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  bannedWords: z.array(z.string()).default([]),
  requiredTerms: z.array(z.string()).default([]),
  maxHashtags: z.number().default(5),
  enforceFirstPerson: z.boolean().default(true),
});

export const WorkspaceSettingsSchema = z.object({
  schedule: z.array(ScheduleSlotSchema).default([]),
  series: z.array(SeriesSettingSchema).default([]),
  brandVoice: BrandVoiceRuleSchema.optional(),
  timezone: z.string().default('UTC'),
});
