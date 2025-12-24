import { z } from 'zod';

export const createUserSchema = z.object({
  user_id: z.string().min(1, 'User ID is required').max(50),
  name: z.string().min(1, 'Name is required').max(255),
  hash: z.string().min(1, 'Hash is required').max(255),
});

export const updateUserSchema = z.object({
  user_id: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(255).optional(),
  hash: z.string().min(1).max(255).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
