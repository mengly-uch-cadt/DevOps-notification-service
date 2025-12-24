import { Request, Response, NextFunction } from 'express';

export const paginationRequest = (req: Request, _res: Response, next: NextFunction) => {
    req.query.page = req.query.page || '1';
    req.query.limit = req.query.limit || '10';
    next();
};
