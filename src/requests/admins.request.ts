import { z } from 'zod';
import { createAdminSchema, updateAdminSchema } from '../schemas/admins.schema';

export const createAdminRequest = z.object({
  body: createAdminSchema,
});

export const updateAdminRequest = z.object({
  body: updateAdminSchema,
});
