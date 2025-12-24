import { Request, Response } from 'express';
import { adminsService } from '../services/admins.service';
import { sendSuccess, sendError } from '../utils/response';

export class AdminsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const admin = await adminsService.createAdmin(req.body);
      sendSuccess(res, admin, 'Admin created', 201);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      const options = page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
      const admins = await adminsService.getAllAdmins(options);
      sendSuccess(res, admins, 'Admins retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const admin = await adminsService.getAdminByGlobalId(req.params.global_id);
      if (!admin) {
        sendError(res, 'Admin not found', 404);
        return;
      }
      sendSuccess(res, admin, 'Admin retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const admin = await adminsService.getAdminByGlobalId(req.params.global_id);
      if (!admin) {
        sendError(res, 'Admin not found', 404);
        return;
      }
      const updated = await adminsService.updateAdmin((admin as any).id, req.body);
      sendSuccess(res, updated, 'Admin updated');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const admin = await adminsService.getAdminByGlobalId(req.params.global_id);
      if (!admin) {
        sendError(res, 'Admin not found', 404);
        return;
      }
      await adminsService.deleteAdmin((admin as any).id);
      sendSuccess(res, null, 'Admin deleted');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}

export const adminsController = new AdminsController();
