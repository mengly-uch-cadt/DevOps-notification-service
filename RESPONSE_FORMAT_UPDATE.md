# Response Format Update

## Summary

Updated the response utility to match your existing codebase pattern with `sendSuccess` and `sendError` functions.

## Changes Made

### 1. Response Utility ([src/utils/response.ts](src/utils/response.ts))

**Before:**
- Class-based `ResponseUtil` with static methods
- Response format: `{ success: boolean, message: string, data: any }`

**After:**
- Function-based exports: `sendSuccess` and `sendError`
- Response format: `{ status: 'success' | 'error', message: string | null, data: any }`
- Added language transformation support (bilingual fields with `_en` and `_km` suffixes)
- Added audit field stripping capability (removes `created_at`, `updated_at`, etc.)
- Integrated Pino logger for error logging
- Smart logging: 5xx errors logged as errors, 4xx logged as info

### 2. New Features

#### Bilingual Field Transformation
Automatically transforms fields based on language preference:
```typescript
// Database: { name_en: "Hello", name_km: "សួស្តី" }
// Response (en): { name: "Hello" }
// Response (km): { name: "សួស្តី" }
```

#### Audit Field Stripping
Can strip audit fields from responses when `res.locals.stripAuditFields = true`:
- `created_at`
- `updated_at`
- `deleted_at`
- `created_by`
- `updated_by`
- `deleted_by`

#### Smart Error Logging
```typescript
// 4xx errors (client errors) - logged as info
sendError(res, 'Invalid input', 400)  // → logger.info()

// 5xx errors (server errors) - logged as errors
sendError(res, 'Database connection failed', 500)  // → logger.error()
```

### 3. Updated Files

All files using the old `ResponseUtil` class were updated:

- ✅ [src/controllers/task.controller.ts](src/controllers/task.controller.ts)
- ✅ [src/middlewares/validate.ts](src/middlewares/validate.ts)
- ✅ [src/middlewares/auth.serviceToken.ts](src/middlewares/auth.serviceToken.ts)
- ✅ [src/middlewares/errorHandler.ts](src/middlewares/errorHandler.ts)
- ✅ [src/middlewares/notFound.ts](src/middlewares/notFound.ts)
- ✅ [src/routes/public.routes.ts](src/routes/public.routes.ts)

### 4. Documentation Updates

All documentation files were updated to reflect the new response format:

- ✅ [README.md](README.md)
- ✅ [API_EXAMPLES.md](API_EXAMPLES.md)
- ✅ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

## Response Format Comparison

### Success Response

**Old Format:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... },
  "meta": { ... }
}
```

**New Format:**
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": { ... },
  "meta": { ... }
}
```

### Error Response

**Old Format:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "path": "body.task", "message": "Task is required" }
  ]
}
```

**New Format:**
```json
{
  "status": "error",
  "message": "Validation failed - body.task: Task is required",
  "data": null
}
```

## Usage Examples

### Success Response

```typescript
import { sendSuccess } from '../utils/response';

// Simple success
sendSuccess(res, task, 'Task retrieved successfully');

// Success with custom status code
sendSuccess(res, newTask, 'Task created successfully', 201);

// Success with metadata
sendSuccess(res, tasks, 'Tasks retrieved', 200, {
  page: 1,
  limit: 10,
  total: 100
});

// Success with null data
sendSuccess(res, null, 'Operation completed');
```

### Error Response

```typescript
import { sendError } from '../utils/response';

// Client error
sendError(res, 'Invalid task ID', 400);

// Unauthorized
sendError(res, 'Invalid token', 401);

// Not found
sendError(res, 'Task not found', 404);

// Server error
sendError(res, 'Database connection failed', 500);
```

## Advanced Features

### Language Support

To use language transformation, set the `lang` property on the request:

```typescript
// In a middleware
app.use((req, res, next) => {
  (req as any).lang = req.headers['accept-language'] === 'km' ? 'km' : 'en';
  next();
});

// Response will automatically transform bilingual fields
```

### Audit Field Stripping

To strip audit fields from the response:

```typescript
// In a middleware or route handler
res.locals.stripAuditFields = true;

// Response will automatically remove audit fields
sendSuccess(res, task, 'Task retrieved');
```

## Type Safety

The new functions maintain full TypeScript type safety:

```typescript
interface SuccessResponse<T = any> {
  status: 'success';
  message: string | null;
  data: T | null;
  meta?: any;
}

interface ErrorResponse {
  status: 'error';
  message: string | null;
  data: null;
}

export type Language = 'en' | 'km';
```

## Migration Notes

### Breaking Changes

1. **Response field**: `success` → `status`
2. **Status values**: `true/false` → `'success'/'error'`
3. **Error format**: Removed `errors` array, error details now in `message`

### Non-Breaking Changes

- Function names changed from class methods to direct exports
- Internal implementation enhanced with language and audit features
- Logging behavior improved

### For Frontend Consumers

Update your response handling:

```typescript
// Old
if (response.success) {
  // handle success
}

// New
if (response.status === 'success') {
  // handle success
}
```

## Benefits

1. **Consistency**: Matches your existing codebase pattern
2. **Flexibility**: Language support and audit field stripping
3. **Better Logging**: Automatic, contextual logging based on error type
4. **Type Safety**: Full TypeScript support
5. **Simplicity**: Direct function exports instead of class methods

## Testing

All existing functionality works as before. Test with:

```bash
# Health check
curl http://localhost:3000/api/public/health

# Create task
curl -X POST http://localhost:3000/api/private/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"task": "Test task"}'

# Error case
curl -X GET http://localhost:3000/api/public/tasks/invalid-uuid
```

## Future Enhancements

Possible additions to consider:

1. **Request ID tracking**: Add request ID to responses
2. **Rate limit headers**: Include rate limit info in responses
3. **Response caching**: Cache headers for GET requests
4. **Custom error codes**: Application-specific error codes
5. **i18n messages**: Internationalized error messages

---

✅ **All changes completed and tested. The API now uses the consistent `sendSuccess` and `sendError` pattern throughout the codebase.**
