import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const authenticateServiceToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    sendError(res, 'Authorization header is required', 401);
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    sendError(res, 'Invalid authorization format. Use: Bearer <token>', 401);
    return;
  }

  const token = parts[1];
  const serviceToken = process.env.SERVICE_TOKEN;

  if (!serviceToken) {
    sendError(res, 'Service token not configured', 500);
    return;
  }

  if (token !== serviceToken) {
    sendError(res, 'Invalid service token', 401);
    return;
  }

  next();
};
