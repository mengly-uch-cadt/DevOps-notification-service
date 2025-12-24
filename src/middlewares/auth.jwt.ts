import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendError } from '../utils/response';
import { JWTPayload } from '../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateJWT = (
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

  const decoded = authService.verifyToken(token);

  if (!decoded) {
    sendError(res, 'Invalid or expired token', 401);
    return;
  }

  req.user = decoded;
  next();
};
