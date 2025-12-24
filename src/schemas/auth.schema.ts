import { z } from 'zod';

export const ssoLoginSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type SSOLoginInput = z.infer<typeof ssoLoginSchema>;
