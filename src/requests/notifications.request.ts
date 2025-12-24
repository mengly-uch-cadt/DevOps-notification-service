import { z } from 'zod';
import { createNotificationSchema, updateNotificationSchema } from '../schemas/notifications.schema';

export const createNotificationRequest = z.object({
  body: createNotificationSchema,
});

export const updateNotificationRequest = z.object({
  body: updateNotificationSchema,
});
