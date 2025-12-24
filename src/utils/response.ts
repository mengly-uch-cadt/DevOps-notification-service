import { Response } from 'express';
import pino from 'pino';

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

// Response interfaces
export interface SuccessResponse<T = any> {
  status: 'success';
  message: string | null;
  data: T | null;
  meta?: any;
}

export interface ErrorResponse {
  status: 'error';
  message: string | null;
  data: null;
}

/**
 * Send success response
 * @param res - Express Response object
 * @param data - Response data (can be null)
 * @param message - Success message (optional)
 * @param status - HTTP status code (default: 200)
 * @param meta - Additional metadata like pagination (optional)
 */
export function sendSuccess<T = unknown>(
  res: Response,
  data: T | null = null,
  message: string | null = null,
  status = 200,
  meta?: any
): Response {
  const body: SuccessResponse<T> = {
    status: 'success',
    message: message ?? null,
    data: data,
  };

  // Add meta if provided
  if (meta) {
    body.meta = meta;
  }

  return res.status(status).json(body);
}

/**
 * Send error response
 * @param res - Express Response object
 * @param message - Error message (optional)
 * @param status - HTTP status code (default: 400)
 */
export function sendError(
  res: Response,
  message: string | null = null,
  status = 400
): Response {
  // Validate status code range (100-599). Fall back to 500 if invalid.
  const code = Number.isInteger(status) && status >= 100 && status < 600 ? status : 500;

  // Log server/internal errors (5xx) as errors. Log client errors (4xx) at info
  // to avoid noisy error-level logs for expected authorization failures.
  if (message) {
    if (code >= 500) {
      logger.error(message);
    } else {
      logger.info(message);
    }
  }

  const body: ErrorResponse = {
    status: 'error',
    message: message ?? null,
    data: null,
  };

  return res.status(code).json(body);
}

// Export default object for convenience
export default { sendSuccess, sendError };
