import { Request, Response, NextFunction } from 'express';
import { UuidUtil } from '../utils/uuid';

export const createRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.body = {
    global_id: UuidUtil.generate(),
    slug: req.body.slug,
    key: req.body.key,
    value: req.body.value,
    description: req.body.description,
  };
  next();
};

export const updateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const data: any = {};
  if (req.body.slug !== undefined) data.slug = req.body.slug;
  if (req.body.key !== undefined) data.key = req.body.key;
  if (req.body.value !== undefined) data.value = req.body.value;
  if (req.body.description !== undefined) data.description = req.body.description;
  req.body = data;
  next();
};

export const idRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.params.id = req.params.id;
  next();
};

export const globalIdRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.params.global_id = req.params.global_id;
  next();
};

export const slugKeyRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.params.slug = req.params.slug;
  req.params.key = req.params.key;
  next();
};

export const paginationRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.query.page = req.query.page || '1';
  req.query.limit = req.query.limit || '10';
  next();
};
