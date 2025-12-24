import { z } from 'zod';

export const createAccessSchema = z.object({
  allow_endpoint: z.string().min(1, 'Endpoint is required').max(255),
});

export const updateAccessSchema = z.object({
  allow_endpoint: z.string().min(1).max(255).optional(),
});

export type CreateAccessInput = z.infer<typeof createAccessSchema>;
export type UpdateAccessInput = z.infer<typeof updateAccessSchema>;
