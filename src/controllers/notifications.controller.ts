import { Request, Response } from 'express';
import { notificationsService } from '../services/notifications.service';
import { telegramService } from '../services/telegram.service';
import { sendSuccess, sendError } from '../utils/response';

export class NotificationsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      req.body.status = 'processing';
      let notification = await notificationsService.createNotification(req.body);

      // Send notification to Telegram group
      const telegramStatus = await telegramService.sendNotification({
        title: req.body.title,
        body: req.body.body,
      });

      // Update the status based on Telegram sending result
      notification = await notificationsService.updateNotificationByGlobalId(
        (notification as any).global_id,
        { status: telegramStatus }
      );

      sendSuccess(res, notification, 'Notification created', 201);
    } catch (error: any) {
      // if have error during creation, log error and set status to 'failed' using global_id if available
      if ((error as any).global_id) {
        await notificationsService.updateNotificationByGlobalId((error as any).global_id, { status: 'failed' });
      }
      sendError(res, error.message, 500);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await notificationsService.getAllNotifications({ page, limit });
      if (Array.isArray(result)) {
        sendSuccess(res, result, 'Notifications retrieved');
      } else {
        sendSuccess(res, result.data, 'Notifications retrieved', 200, result.pagination);
      }
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const notification = await notificationsService.getNotificationByGlobalId(req.params.global_id);
      if (!notification) {
        sendError(res, 'Notification not found', 404);
        return;
      }
      sendSuccess(res, notification, 'Notification retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const notification = await notificationsService.getNotificationByGlobalId(req.params.global_id);
      if (!notification) {
        sendError(res, 'Notification not found', 404);
        return;
      }
      const updated = await notificationsService.updateNotification((notification as any).id, req.body);
      sendSuccess(res, updated, 'Notification updated');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const notification = await notificationsService.getNotificationByGlobalId(req.params.global_id);
      if (!notification) {
        sendError(res, 'Notification not found', 404);
        return;
      }
      await notificationsService.deleteNotification((notification as any).id);
      sendSuccess(res, null, 'Notification deleted');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const notification = await notificationsService.getNotificationByGlobalId(req.params.global_id);
      if (!notification) {
        sendError(res, 'Notification not found', 404);
        return;
      }
      const updated = await notificationsService.markAsRead((notification as any).id);
      sendSuccess(res, updated, 'Notification marked as read');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async markAsUnread(req: Request, res: Response): Promise<void> {
    try {
      const notification = await notificationsService.getNotificationByGlobalId(req.params.global_id);
      if (!notification) {
        sendError(res, 'Notification not found', 404);
        return;
      }
      const updated = await notificationsService.markAsUnread((notification as any).id);
      sendSuccess(res, updated, 'Notification marked as unread');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}

export const notificationsController = new NotificationsController();
