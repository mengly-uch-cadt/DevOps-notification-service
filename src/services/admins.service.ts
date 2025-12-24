import { BaseService, PaginationOptions } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class AdminsService extends BaseService {
  async createAdmin(data: {
    user_id: number;
    name: string;
  }) {
    return await this.create(this.prisma.admins, {
      global_id: uuidv4(),
      ...data,
    });
  }

  async getAdminById(id: number) {
    return await this.findById(this.prisma.admins, id);
  }

  async getAdminByGlobalId(global_id: string) {
    return await this.findByGlobalId(this.prisma.admins, global_id);
  }

  async getAllAdmins(options?: PaginationOptions) {
    if (options) {
      return await this.paginate<any>(
        this.prisma.admins,
        options,
        undefined,
        { created_at: 'desc' }
      );
    }
    return await this.findMany(this.prisma.admins, {
      include: { users: true },
    });
  }

  async updateAdmin(id: number, data: {
    user_id?: number;
    name?: string;
  }) {
    return await this.update(this.prisma.admins, id, data);
  }

  async deleteAdmin(id: number) {
    return await this.delete(this.prisma.admins, id);
  }

  async getAdminsByUserId(user_id: number) {
    return await this.findMany(this.prisma.admins, {
      where: { user_id },
      include: { users: true },
    });
  }
}

export const adminsService = new AdminsService();
