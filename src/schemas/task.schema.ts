import { z } from 'zod';

// Body Schemas
export const createTaskSchema = z.object({
  body: z.object({
    task: z
      .string({
        required_error: 'Task is required',
      })
      .min(1, 'Task must be at least 1 character')
      .max(500, 'Task must not exceed 500 characters'),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    task: z
      .string()
      .min(1, 'Task must be at least 1 character')
      .max(500, 'Task must not exceed 500 characters')
      .optional(),
  }),
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be a valid positive integer')
      .transform(Number)
      .refine((val) => val > 0, 'ID must be a positive integer'),
  }),
});

// Param Schemas
export const taskIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be a valid positive integer')
      .transform(Number)
      .refine((val) => val > 0, 'ID must be a positive integer'),
  }),
});

export const taskGlobalIdParamSchema = z.object({
  params: z.object({
    global_id: z
      .string({
        required_error: 'Global ID is required',
      })
      .uuid('Global ID must be a valid UUID'),
  }),
});

// Query Schemas
export const paginationQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform(Number)
      .refine((val) => val > 0, 'Page must be a positive integer'),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform(Number)
      .refine(
        (val) => val > 0 && val <= 100,
        'Limit must be between 1 and 100'
      ),
  }),
});

// Type exports
export type CreateTaskBody = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>['body'];
export type TaskIdParam = z.infer<typeof taskIdParamSchema>['params'];
export type TaskGlobalIdParam = z.infer<
  typeof taskGlobalIdParamSchema
>['params'];
export type PaginationQuery = z.infer<typeof paginationQuerySchema>['query'];
