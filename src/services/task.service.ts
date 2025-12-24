import { Task } from '@prisma/client';
import {
  taskRepository,
  PaginationOptions,
  PaginatedResult,
} from '../repositories/task.repo';
import { UuidUtil } from '../utils/uuid';
import { AppError } from '../middlewares/errorHandler';

export class TaskService {
  async createTask(taskContent: string): Promise<Task> {
    const global_id = UuidUtil.generate();

    const task = await taskRepository.create({
      global_id,
      task: taskContent,
    });

    return task;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError(`Task with ID ${id} not found`, 404);
    }

    return task;
  }

  async getTaskByGlobalId(global_id: string): Promise<Task> {
    const task = await taskRepository.findByGlobalId(global_id);

    if (!task) {
      throw new AppError(`Task with global ID ${global_id} not found`, 404);
    }

    return task;
  }

  async updateTask(id: number, taskContent?: string): Promise<Task> {
    const exists = await taskRepository.exists(id);

    if (!exists) {
      throw new AppError(`Task with ID ${id} not found`, 404);
    }

    if (!taskContent) {
      throw new AppError('No update data provided', 400);
    }

    const task = await taskRepository.update(id, {
      task: taskContent,
    });

    return task;
  }

  async getAllTasks(
    options: PaginationOptions
  ): Promise<PaginatedResult<Task>> {
    return await taskRepository.findAll(options);
  }
}

export const taskService = new TaskService();
