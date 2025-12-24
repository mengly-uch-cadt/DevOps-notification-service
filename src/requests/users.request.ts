import { z } from 'zod';
import { createUserSchema, updateUserSchema } from '../schemas/users.schema';

export const createUserRequest = z.object({
  body: createUserSchema,
});

export const updateUserRequest = z.object({
  body: updateUserSchema,
});
