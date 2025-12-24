import { BaseService, PaginationOptions } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class UsersService extends BaseService {
  async createUser(data: {
    user_id: string;
    name: string;
    hash: string;
  }) {
    return await this.create(this.prisma.users, {
      global_id: uuidv4(),
      ...data,
    });
  }

  async getUserById(id: number) {
    return await this.findById(this.prisma.users, id);
  }

  async getUserByGlobalId(global_id: string) {
    return await this.findByGlobalId(this.prisma.users, global_id);
  }

  async getAllUsers(options?: PaginationOptions) {
    if (options) {
      return await this.paginate<any>(
        this.prisma.users,
        options,
        undefined,
        { created_at: 'desc' }
      );
    }
    return await this.findMany(this.prisma.users, {
      orderBy: { created_at: 'desc' },
    });
  }

  async updateUser(id: number, data: {
    user_id?: string;
    name?: string;
    hash?: string;
  }) {
    return await this.update(this.prisma.users, id, data);
  }

  async deleteUser(id: number) {
    return await this.delete(this.prisma.users, id);
  }

  async getUserByUserId(user_id: string) {
    return await this.findOne(this.prisma.users, { user_id });
  }

  async getUserWithRelations(id: number) {
    return await this.findOne(this.prisma.users, { id }, {
      include: {
        admins: true,
        notifications: {
          orderBy: { created_at: 'desc' },
          take: 10,
        },
      },
    });
  }
}

export const usersService = new UsersService();
