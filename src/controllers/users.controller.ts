import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { sendSuccess, sendError } from '../utils/response';

export class UsersController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.createUser(req.body);
      sendSuccess(res, user, 'User created', 201);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      const options = page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
      const users = await usersService.getAllUsers(options);
      sendSuccess(res, users, 'Users retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.getUserByGlobalId(req.params.global_id);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }
      sendSuccess(res, user, 'User retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.getUserByGlobalId(req.params.global_id);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }
      const updated = await usersService.updateUser((user as any).id, req.body);
      sendSuccess(res, updated, 'User updated');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.getUserByGlobalId(req.params.global_id);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }
      await usersService.deleteUser((user as any).id);
      sendSuccess(res, null, 'User deleted');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}

export const usersController = new UsersController();
