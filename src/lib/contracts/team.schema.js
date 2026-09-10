import { z } from 'zod';

export const TeamMemberRoleSchema = z.enum(['owner', 'marketing', 'reviewer']);
export const TeamMemberStatusSchema = z.enum(['active', 'pending', 'inactive']);

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: TeamMemberRoleSchema,
  status: TeamMemberStatusSchema,
  initials: z.string(),
  joinedAt: z.string(),
  avatarUrl: z.string().optional(),
});

export const InviteMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: TeamMemberRoleSchema.default('marketing'),
});
