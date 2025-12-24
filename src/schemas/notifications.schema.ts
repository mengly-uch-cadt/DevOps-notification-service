import { z } from 'zod';

export const createNotificationSchema = z.object({
  user_id: z.string().min(1, 'User global_id is required'),
  title: z.string().min(1, 'Title is required').max(255),
  body: z.string().min(1, 'Body is required'),
  status: z.enum(['read', 'unread']).default('unread'),
});

export const updateNotificationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  body: z.string().min(1).optional(),
  status: z.enum(['read', 'unread']).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
