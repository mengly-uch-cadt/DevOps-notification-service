import { z } from 'zod';
import { createAccessSchema, updateAccessSchema } from '../schemas/accesses.schema';

export const createAccessRequest = z.object({
  body: createAccessSchema,
});

export const updateAccessRequest = z.object({
  body: updateAccessSchema,
});
