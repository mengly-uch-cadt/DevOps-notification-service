import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { sendSuccess } from '../utils/response';
import {
  CreateTaskBody,
  UpdateTaskBody,
  PaginationQuery,
} from '../schemas/task.schema';

export class TaskController {
  async createTask(
    req: Request<{}, {}, CreateTaskBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { task } = req.body;

      const newTask = await taskService.createTask(task);

      sendSuccess(res, newTask, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const task = await taskService.getTaskById(id);

      sendSuccess(res, task, 'Task retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTaskByGlobalId(
    req: Request<{ global_id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { global_id } = req.params;

      const task = await taskService.getTaskByGlobalId(global_id);

      sendSuccess(res, task, 'Task retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: Request<{ id: string }, {}, UpdateTaskBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { task } = req.body;

      const updatedTask = await taskService.updateTask(id, task);

      sendSuccess(res, updatedTask, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit } = req.query;

      const result = await taskService.getAllTasks({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      sendSuccess(
        res,
        result.data,
        'Tasks retrieved successfully',
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
