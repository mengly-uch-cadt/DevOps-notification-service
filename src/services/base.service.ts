import { PrismaClient } from '@prisma/client';

export class BaseService {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create<T>(model: any, data: any): Promise<T> {
    const now = new Date();
    return await model.create({
      data: {
        ...data,
        created_at: now,
        updated_at: now,
      }
    });
  }

  async findById<T>(model: any, id: number): Promise<T | null> {
    return await model.findUnique({ where: { id } });
  }

  async findByGlobalId<T>(model: any, global_id: string): Promise<T | null> {
    return await model.findUnique({ where: { global_id } });
  }

  async findOne<T>(model: any, where: any, options?: any): Promise<T | null> {
    return await model.findUnique({ where, ...options });
  }

  async findMany<T>(model: any, options?: any): Promise<T[]> {
    return await model.findMany(options);
  }

  async update<T>(model: any, id: number, data: any): Promise<T> {
    return await model.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      }
    });
  }

  async delete(model: any, id: number): Promise<void> {
    await model.delete({ where: { id } });
  }

  async count(model: any, where?: any): Promise<number> {
    return await model.count({ where });
  }

  async paginate<T>(
    model: any,
    options: PaginationOptions,
    where?: any,
    orderBy?: any
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      model.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { created_at: 'desc' },
      }),
      model.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const baseService = new BaseService();

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
