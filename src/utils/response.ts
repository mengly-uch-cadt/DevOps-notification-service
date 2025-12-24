import { Response, Request } from 'express';
import pino from 'pino';

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

// Language type (extend as needed)
export type Language = 'en' | 'km';

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
 * Transform bilingual fields based on language preference
 * This function handles objects with _en and _km suffixed fields
 */
function transformResponseLang<T>(data: T, lang: Language): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => transformResponseLang(item, lang)) as T;
  }

  // Handle objects
  const result: any = {};
  const entries = Object.entries(data);

  for (const [key, value] of entries) {
    // Check if this is a bilingual field (ends with _en or _km)
    if (key.endsWith('_en') || key.endsWith('_km')) {
      const baseKey = key.slice(0, -3); // Remove _en or _km suffix
      const preferredKey = `${baseKey}_${lang}`;
      const fallbackKey = lang === 'en' ? `${baseKey}_km` : `${baseKey}_en`;

      // Only add the base key once (when we encounter the preferred language)
      if (key === preferredKey) {
        result[baseKey] = (data as any)[preferredKey] ?? (data as any)[fallbackKey] ?? null;
      }
    } else {
      // Recursively transform nested objects/arrays
      result[key] = transformResponseLang(value, lang);
    }
  }

  return result as T;
}

/**
 * Strip audit fields from response data
 * Removes fields like created_at, updated_at, deleted_at, etc.
 */
function stripAuditFields<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => stripAuditFields(item)) as T;
  }

  // Fields to strip
  const auditFields = [
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  // Handle objects
  const result: any = {};
  const entries = Object.entries(data);

  for (const [key, value] of entries) {
    if (!auditFields.includes(key)) {
      result[key] = stripAuditFields(value);
    }
  }

  return result as T;
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
  // Get language from request (set by langMiddleware if available)
  const req = res.req as Request;
  const lang = ((req as any)?.lang || 'en') as Language;

  // Transform bilingual fields based on language
  const transformedData = transformResponseLang(data, lang);

  // Check if audit fields should be stripped (set by middleware)
  const shouldStrip = Boolean((res.locals as Record<string, any>)?.stripAuditFields);
  const finalData = shouldStrip ? stripAuditFields(transformedData) : transformedData;

  const body: SuccessResponse<T> = {
    status: 'success',
    message: message ?? null,
    data: finalData,
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
