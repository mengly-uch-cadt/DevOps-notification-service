import { Request, Response } from 'express';
import { accessesService } from '../services/accesses.service';
import { sendSuccess, sendError } from '../utils/response';

export class AccessesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const access = await accessesService.createAccess(req.body);
      sendSuccess(res, access, 'Access created', 201);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      const options = page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
      const accesses = await accessesService.getAllAccesses(options);
      sendSuccess(res, accesses, 'Accesses retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const access = await accessesService.getAccessByGlobalId(req.params.global_id);
      if (!access) {
        sendError(res, 'Access not found', 404);
        return;
      }
      sendSuccess(res, access, 'Access retrieved');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const access = await accessesService.getAccessByGlobalId(req.params.global_id);
      if (!access) {
        sendError(res, 'Access not found', 404);
        return;
      }
      const updated = await accessesService.updateAccess((access as any).id, req.body);
      sendSuccess(res, updated, 'Access updated');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const access = await accessesService.getAccessByGlobalId(req.params.global_id);
      if (!access) {
        sendError(res, 'Access not found', 404);
        return;
      }
      await accessesService.deleteAccess((access as any).id);
      sendSuccess(res, null, 'Access deleted');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}

export const accessesController = new AccessesController();
