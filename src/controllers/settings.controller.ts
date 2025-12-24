import { Request, Response, NextFunction } from 'express';
import { baseService } from '../services/base.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const M = baseService.prisma.settings;

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await baseService.create(M, req.body), 'Setting created', 201);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await baseService.findById(M, Number(req.params.id));
    if (!data) throw new AppError('Not found', 404);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

export const getByGlobalId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await baseService.findByGlobalId(M, req.params.global_id);
    if (!data) throw new AppError('Not found', 404);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

export const getBySlugKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await baseService.findOne(M, { slug: req.params.slug, key: req.params.key });
    if (!data) throw new AppError('Not found', 404);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setting = await baseService.findByGlobalId(M, req.params.global_id);
    if (!setting) throw new AppError('Not found', 404);
    sendSuccess(res, await baseService.update(M, (setting as any).id, req.body));
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, pagination } = await baseService.paginate(M, {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    });
    sendSuccess(res, data, undefined, 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setting = await baseService.findByGlobalId(M, req.params.global_id);
    if (!setting) throw new AppError('Not found', 404);
    await baseService.delete(M, (setting as any).id);
    sendSuccess(res, null);
  } catch (error) {
    next(error);
  }
};
