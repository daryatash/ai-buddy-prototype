import { z } from 'zod';

export const RoleSchema = z.enum(['intern', 'mentor', 'manager']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: RoleSchema,
  team: z.string(),
  email: z.string().email(),
  messenger: z.string().optional(),
  phone: z.string().optional(),
  avatarInitials: z.string().max(2),
  mentorId: z.string().optional(),
  hrBpId: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const ChecklistItemStatusSchema = z.enum([
  'todo',
  'in_progress',
  'done',
  'blocked',
]);

export const ChecklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: ChecklistItemStatusSchema,
  blockedReason: z.string().optional(),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// этап (первый день / неделя / месяц)
export const ChecklistStageSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(ChecklistItemSchema),
});
export type ChecklistStage = z.infer<typeof ChecklistStageSchema>;

export const ChecklistSchema = z.object({
  stages: z.array(ChecklistStageSchema),
});
export type Checklist = z.infer<typeof ChecklistSchema>;

export const MessageAuthorSchema = z.enum(['user', 'bot']);

export const ActionCardSchema = z.object({
  kind: z.literal('leave_request'),
  title: z.string(),
  fields: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  status: z.enum(['proposal', 'sending', 'result']),
  resultMessage: z.string().optional(),
  requestId: z.string().optional(),
});
export type ActionCard = z.infer<typeof ActionCardSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  author: MessageAuthorSchema,
  content: z.string(),
  createdAt: z.string(),
  actionCard: ActionCardSchema.optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const LeaveRequestResponseSchema = z.object({
  requestId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  message: z.string(),
});
export type LeaveRequestResponse = z.infer<typeof LeaveRequestResponseSchema>;