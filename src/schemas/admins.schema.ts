import { z } from 'zod';

export const createAdminSchema = z.object({
  user_id: z.number().int().positive('User ID must be positive'),
  name: z.string().min(1, 'Name is required').max(255),
});

export const updateAdminSchema = z.object({
  user_id: z.number().int().positive().optional(),
  name: z.string().min(1).max(255).optional(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
