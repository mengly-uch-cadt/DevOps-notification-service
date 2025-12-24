import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTaskData {
  global_id: string;
  task: string;
}

export interface UpdateTaskData {
  task?: string;
}

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

export class TaskRepository {
  async create(data: CreateTaskData): Promise<Task> {
    return await prisma.task.create({
      data,
    });
  }

  async findById(id: number): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: { id },
    });
  }

  async findByGlobalId(global_id: string): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: { global_id },
    });
  }

  async update(id: number, data: UpdateTaskData): Promise<Task> {
    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Task>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.task.count(),
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

  async exists(id: number): Promise<boolean> {
    const count = await prisma.task.count({
      where: { id },
    });
    return count > 0;
  }

  async existsByGlobalId(global_id: string): Promise<boolean> {
    const count = await prisma.task.count({
      where: { global_id },
    });
    return count > 0;
  }
}

export const taskRepository = new TaskRepository();
