# API Examples & Testing Guide

Complete collection of API requests for testing all endpoints.

## Environment Setup

```bash
# Set these variables for easy testing
export API_URL="http://localhost:3000"
export SERVICE_TOKEN="your-secret-service-token-here"
```

---

## 📗 PUBLIC ENDPOINTS (No Authentication)

### 1. Health Check

**Request:**
```bash
curl -X GET "$API_URL/api/public/health" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Service is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2025-12-24T10:00:00.000Z",
    "uptime": 123.456
  }
}
```

---

### 2. Get Task by Global ID (Public)

**Request:**
```bash
curl -X GET "$API_URL/api/public/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "global_id": "550e8400-e29b-41d4-a716-446655440000",
    "task": "Complete project documentation",
    "created_at": "2025-12-24T10:00:00.000Z",
    "updated_at": "2025-12-24T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Task with global ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

**Validation Error (400):**
```bash
# Invalid UUID format
curl -X GET "$API_URL/api/public/tasks/invalid-uuid"
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "params.global_id",
      "message": "Global ID must be a valid UUID"
    }
  ]
}
```

---

## 🔐 PRIVATE ENDPOINTS (Require Authentication)

All private endpoints require the `Authorization` header:
```
Authorization: Bearer your-secret-service-token-here
```

---

### 3. Create Task

**Request:**
```bash
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{
    "task": "Complete project documentation"
  }'
```

**Expected Response (201):**
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "global_id": "550e8400-e29b-41d4-a716-446655440000",
    "task": "Complete project documentation",
    "created_at": "2025-12-24T10:00:00.000Z",
    "updated_at": "2025-12-24T10:00:00.000Z"
  }
}
```

**Validation Errors:**

```bash
# Missing task field
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{}'
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.task",
      "message": "Task is required"
    }
  ]
}
```

```bash
# Task too short
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"task": ""}'
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.task",
      "message": "Task must be at least 1 character"
    }
  ]
}
```

```bash
# Task too long (>500 characters)
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d "{\"task\": \"$(printf 'a%.0s' {1..501})\"}"
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.task",
      "message": "Task must not exceed 500 characters"
    }
  ]
}
```

---

### 4. Update Task by ID

**Request:**
```bash
curl -X PUT "$API_URL/api/private/tasks/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{
    "task": "Updated: Complete project documentation"
  }'
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "global_id": "550e8400-e29b-41d4-a716-446655440000",
    "task": "Updated: Complete project documentation",
    "created_at": "2025-12-24T10:00:00.000Z",
    "updated_at": "2025-12-24T10:15:00.000Z"
  }
}
```

**Error Responses:**

```bash
# Task not found
curl -X PUT "$API_URL/api/private/tasks/999" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"task": "Updated task"}'
```
```json
{
  "status": "error",
  "message": "Task with ID 999 not found"
}
```

```bash
# Invalid ID (not a number)
curl -X PUT "$API_URL/api/private/tasks/abc" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"task": "Updated task"}'
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "params.id",
      "message": "ID must be a valid positive integer"
    }
  ]
}
```

```bash
# Empty update (no data provided)
curl -X PUT "$API_URL/api/private/tasks/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{}'
```
```json
{
  "status": "error",
  "message": "No update data provided"
}
```

---

### 5. Get Task by ID

**Request:**
```bash
curl -X GET "$API_URL/api/private/tasks/id/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "global_id": "550e8400-e29b-41d4-a716-446655440000",
    "task": "Complete project documentation",
    "created_at": "2025-12-24T10:00:00.000Z",
    "updated_at": "2025-12-24T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Task with ID 1 not found"
}
```

---

### 6. Get Task by Global ID (Private)

**Request:**
```bash
curl -X GET "$API_URL/api/private/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "global_id": "550e8400-e29b-41d4-a716-446655440000",
    "task": "Complete project documentation",
    "created_at": "2025-12-24T10:00:00.000Z",
    "updated_at": "2025-12-24T10:00:00.000Z"
  }
}
```

---

### 7. List All Tasks (with Pagination)

**Request:**
```bash
# Default pagination (page=1, limit=10)
curl -X GET "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN"

# Custom pagination
curl -X GET "$API_URL/api/private/tasks?page=2&limit=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 3,
      "global_id": "c9a8b7d6-e5f4-4321-9876-543210fedcba",
      "task": "Third task",
      "created_at": "2025-12-24T10:30:00.000Z",
      "updated_at": "2025-12-24T10:30:00.000Z"
    },
    {
      "id": 2,
      "global_id": "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
      "task": "Second task",
      "created_at": "2025-12-24T10:15:00.000Z",
      "updated_at": "2025-12-24T10:15:00.000Z"
    },
    {
      "id": 1,
      "global_id": "550e8400-e29b-41d4-a716-446655440000",
      "task": "First task",
      "created_at": "2025-12-24T10:00:00.000Z",
      "updated_at": "2025-12-24T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

**Validation Errors:**

```bash
# Invalid page (negative)
curl -X GET "$API_URL/api/private/tasks?page=0" \
  -H "Authorization: Bearer $SERVICE_TOKEN"
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "query.page",
      "message": "Page must be a positive integer"
    }
  ]
}
```

```bash
# Invalid limit (exceeds 100)
curl -X GET "$API_URL/api/private/tasks?limit=101" \
  -H "Authorization: Bearer $SERVICE_TOKEN"
```
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "query.limit",
      "message": "Limit must be between 1 and 100"
    }
  ]
}
```

---

## 🚫 AUTHENTICATION ERRORS

### Missing Authorization Header

**Request:**
```bash
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -d '{"task": "Test task"}'
```

**Response (401):**
```json
{
  "status": "error",
  "message": "Authorization header is required"
}
```

---

### Invalid Authorization Format

**Request:**
```bash
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: InvalidFormat" \
  -d '{"task": "Test task"}'
```

**Response (401):**
```json
{
  "status": "error",
  "message": "Invalid authorization format. Use: Bearer <token>"
}
```

---

### Invalid Service Token

**Request:**
```bash
curl -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong-token" \
  -d '{"task": "Test task"}'
```

**Response (401):**
```json
{
  "status": "error",
  "message": "Invalid service token"
}
```

---

## 🔄 COMPLETE WORKFLOW EXAMPLE

```bash
#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
SERVICE_TOKEN="your-secret-service-token-here"

echo "=== Notifications System API Test ==="
echo ""

# 1. Health Check
echo "1. Testing health endpoint..."
curl -s -X GET "$API_URL/api/public/health" | jq '.'
echo ""

# 2. Create first task
echo "2. Creating first task..."
RESPONSE1=$(curl -s -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"task": "Write API documentation"}')
echo $RESPONSE1 | jq '.'
GLOBAL_ID1=$(echo $RESPONSE1 | jq -r '.data.global_id')
TASK_ID1=$(echo $RESPONSE1 | jq -r '.data.id')
echo ""

# 3. Create second task
echo "3. Creating second task..."
RESPONSE2=$(curl -s -X POST "$API_URL/api/private/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"task": "Test all endpoints"}')
echo $RESPONSE2 | jq '.'
GLOBAL_ID2=$(echo $RESPONSE2 | jq -r '.data.global_id')
echo ""

# 4. Get task by ID
echo "4. Getting task by ID ($TASK_ID1)..."
curl -s -X GET "$API_URL/api/private/tasks/id/$TASK_ID1" \
  -H "Authorization: Bearer $SERVICE_TOKEN" | jq '.'
echo ""

# 5. Get task by Global ID (public)
echo "5. Getting task by Global ID (public) ($GLOBAL_ID1)..."
curl -s -X GET "$API_URL/api/public/tasks/$GLOBAL_ID1" | jq '.'
echo ""

# 6. Update task
echo "6. Updating task..."
curl -s -X PUT "$API_URL/api/private/tasks/$TASK_ID1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"task": "Updated: Write comprehensive API documentation"}' | jq '.'
echo ""

# 7. List all tasks
echo "7. Listing all tasks..."
curl -s -X GET "$API_URL/api/private/tasks?page=1&limit=10" \
  -H "Authorization: Bearer $SERVICE_TOKEN" | jq '.'
echo ""

echo "=== Test Complete ==="
```

**Save as `test-api.sh` and run:**
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📊 HTTP Status Codes Summary

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST (create) |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid auth token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server/database errors |

---

## 🧪 Testing Tips

1. **Use `jq` for pretty JSON output:**
   ```bash
   curl ... | jq '.'
   ```

2. **Save response to variable:**
   ```bash
   RESPONSE=$(curl -s ...)
   echo $RESPONSE | jq '.data.global_id'
   ```

3. **Test error cases:**
   - Missing required fields
   - Invalid data types
   - Boundary values (0, negative, too large)
   - Invalid UUIDs
   - Non-existent resources

4. **Use Postman/Insomnia:**
   - Import these examples
   - Save as collection
   - Set environment variables

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are version 4 format
- Pagination default: page=1, limit=10
- Maximum limit: 100 items per page
- Tasks ordered by `created_at` DESC (newest first)
- `updated_at` auto-updates on PUT requests

---

For more information, see [README.md](README.md)
