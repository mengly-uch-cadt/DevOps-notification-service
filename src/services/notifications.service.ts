import { BaseService, PaginationOptions } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class NotificationsService extends BaseService {
  async updateNotificationByGlobalId(global_id: string, data: {
    title?: string;
    body?: string;
    status?: string;
  }) {
    return await this.prisma.notifications.update({
      where: { global_id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }
  async createNotification(data: {
    user_id: string;
    title: string;
    body: string;
    status: string;
  }) {
    // Find user by global_id
    const user = await this.prisma.users.findUnique({ where: { global_id: data.user_id } });
    if (!user) throw new Error('User not found');
    return await this.create(this.prisma.notifications, {
      global_id: uuidv4(),
      user_id: user.id,
      title: data.title,
      body: data.body,
      status: data.status,
    });
  }

  async getNotificationById(id: number) {
    return await this.findById(this.prisma.notifications, id);
  }

  async getNotificationByGlobalId(global_id: string) {
    return await this.findByGlobalId(this.prisma.notifications, global_id);
  }

  async getAllNotifications(options?: PaginationOptions) {
    if (options) {
      return await this.paginate<any>(
        this.prisma.notifications,
        options,
        undefined,
        { created_at: 'desc' }
      );
    }
    return await this.findMany(this.prisma.notifications, {
      include: { users: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateNotification(id: number, data: {
    title?: string;
    body?: string;
    status?: string;
  }) {
    return await this.update(this.prisma.notifications, id, data);
  }

  async deleteNotification(id: number) {
    return await this.delete(this.prisma.notifications, id);
  }

  async getNotificationsByUserId(user_id: number, status?: string) {
    const where: any = { user_id };
    if (status) {
      where.status = status;
    }
    return await this.findMany(this.prisma.notifications, {
      where,
      include: { users: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(id: number) {
    return await this.update(this.prisma.notifications, id, { status: 'read' });
  }

  async markAsUnread(id: number) {
    return await this.update(this.prisma.notifications, id, { status: 'unread' });
  }
}

export const notificationsService = new NotificationsService();
