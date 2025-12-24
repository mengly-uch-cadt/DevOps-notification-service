import { BaseService, PaginationOptions } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class AccessesService extends BaseService {
  async createAccess(data: {
    allow_endpoint: string;
  }) {
    // Generate a random 250-character hexadecimal token
    const token = Array.from({ length: 250 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return await this.create(this.prisma.accesses, {
      global_id: uuidv4(),
      allow_endpoint: data.allow_endpoint,
      token,
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
  }) {
    // Regenerate a random 250-character hexadecimal token on update
    const token = Array.from({ length: 250 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return await this.update(this.prisma.accesses, id, {
      ...data,
      token,
    });
  }

  async deleteAccess(id: number) {
    return await this.delete(this.prisma.accesses, id);
  }

  async getAccessByToken(token: string) {
    return await this.findOne(this.prisma.accesses, { token });
  }

  async validateBasicAuth(allow_endpoint: string, token: string): Promise<boolean> {
    const access = await this.findOne(this.prisma.accesses, {
      allow_endpoint,
      token,
    });
    return !!access;
  }

  async isAllowedOrigin(origin: string): Promise<boolean> {
    const access = await this.findOne(this.prisma.accesses, {
      allow_endpoint: origin,
    });
    return !!access;
  }
}

export const accessesService = new AccessesService();

// Export standalone function for CORS
export async function isAllowedOrigin(origin: string): Promise<boolean> {
  return accessesService.isAllowedOrigin(origin);
}
