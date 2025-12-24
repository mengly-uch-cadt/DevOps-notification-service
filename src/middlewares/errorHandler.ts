import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle Prisma errors
  if (err.message.includes('Unique constraint failed')) {
    sendError(res, 'Already exists', 409);
    return;
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    500
  );
};
