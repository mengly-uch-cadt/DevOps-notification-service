import { z } from 'zod';

export const createSettingSchema = z.object({
  body: z.object({
    slug: z.string().min(1).max(100),
    key: z.string().min(1).max(255),
    value: z.string(),
    description: z.string().optional(),
  }),
});

export const updateSettingSchema = z.object({
  body: z.object({
    slug: z.string().min(1).max(100).optional(),
    key: z.string().min(1).max(255).optional(),
    value: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
  }),
});

export const getBySlugKeySchema = z.object({
  params: z.object({
    slug: z.string(),
    key: z.string(),
  }),
});

export type CreateSettingBody = z.infer<typeof createSettingSchema>['body'];
export type UpdateSettingBody = z.infer<typeof updateSettingSchema>['body'];
export type PaginationQuery = z.infer<typeof paginationQuerySchema>['query'];
export type GetBySlugKeyParams = z.infer<typeof getBySlugKeySchema>['params'];
