import { z } from 'zod';

export const ssoLoginRequest = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});
