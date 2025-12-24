import { BaseService, PaginationOptions } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class AccessesService extends BaseService {
  async createAccess(data: {
    allow_endpoint: string;
    token: string;
  }) {
    return await this.create(this.prisma.accesses, {
      global_id: uuidv4(),
      ...data,
    });
  }

  async getAccessById(id: number) {
    return await this.findById(this.prisma.accesses, id);
  }

  async getAccessByGlobalId(global_id: string) {
    return await this.findByGlobalId(this.prisma.accesses, global_id);
  }

  async getAllAccesses(options?: PaginationOptions) {
    if (options) {
      return await this.paginate<any>(this.prisma.accesses, options);
    }
    return await this.findMany(this.prisma.accesses);
  }

  async updateAccess(id: number, data: {
    allow_endpoint?: string;
    token?: string;
  }) {
    return await this.update(this.prisma.accesses, id, data);
  }

  async deleteAccess(id: number) {
    return await this.delete(this.prisma.accesses, id);
  }

  async getAccessByToken(token: string) {
    return await this.findOne(this.prisma.accesses, { token });
  }
}

export const accessesService = new AccessesService();
