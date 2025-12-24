import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller';
import { validate } from '../middlewares/validate';
import { createNotificationRequest, updateNotificationRequest } from '../requests/notifications.request';

const router = Router();

router.post('/', validate(createNotificationRequest), notificationsController.create);
router.get('/', notificationsController.getAll);
router.get('/:global_id', notificationsController.getById);
router.put('/:global_id', validate(updateNotificationRequest), notificationsController.update);
router.delete('/:global_id', notificationsController.delete);
router.patch('/:global_id/read', notificationsController.markAsRead);
router.patch('/:global_id/unread', notificationsController.markAsUnread);

export default router;
