# Settings API Testing Guide

Base URL: `http://localhost:3000`

## Authentication
All endpoints require Service Token authentication in the header:
```
Authorization: Bearer your-secret-service-token-here-change-in-production
```

---

## 1. Create Setting
**POST** `/private/settings`

### Headers
```
Content-Type: application/json
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### Body
```json
{
  "slug": "app",
  "key": "theme",
  "value": "dark",
  "description": "Application theme setting"
}
```

### cURL
```bash
curl -X POST http://localhost:3000/private/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production" \
  -d '{
    "slug": "app",
    "key": "theme",
    "value": "dark",
    "description": "Application theme setting"
  }'
```

---

## 2. Get All Settings (Paginated)
**GET** `/private/settings?page=1&limit=10`

### Headers
```
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### Query Parameters
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

### cURL
```bash
curl -X GET "http://localhost:3000/private/settings?page=1&limit=10" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production"
```

---

## 3. Get Setting by ID
**GET** `/private/settings/id/:id`

### Headers
```
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### cURL
```bash
curl -X GET http://localhost:3000/private/settings/id/1 \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production"
```

---

## 4. Get Setting by Global ID
**GET** `/private/settings/global/:global_id`

### Headers
```
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### cURL
```bash
curl -X GET http://localhost:3000/private/settings/global/{uuid-here} \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production"
```

---

## 5. Get Setting by Slug and Key
**GET** `/private/settings/:slug/:key`

### Headers
```
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### cURL
```bash
curl -X GET http://localhost:3000/private/settings/app/theme \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production"
```

---

## 6. Update Setting
**PUT** `/private/settings/:id`

### Headers
```
Content-Type: application/json
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### Body (all fields optional)
```json
{
  "slug": "app",
  "key": "theme",
  "value": "light",
  "description": "Updated application theme"
}
```

### cURL
```bash
curl -X PUT http://localhost:3000/private/settings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production" \
  -d '{
    "value": "light",
    "description": "Updated to light theme"
  }'
```

---

## 7. Delete Setting
**DELETE** `/private/settings/:id`

### Headers
```
Authorization: Bearer your-secret-service-token-here-change-in-production
```

### cURL
```bash
curl -X DELETE http://localhost:3000/private/settings/1 \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production"
```

---

## Example Test Scenarios

### Scenario 1: Create Multiple Settings
```bash
# Create setting 1
curl -X POST http://localhost:3000/private/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production" \
  -d '{
    "slug": "app",
    "key": "language",
    "value": "en",
    "description": "Application language"
  }'

# Create setting 2
curl -X POST http://localhost:3000/private/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production" \
  -d '{
    "slug": "app",
    "key": "timezone",
    "value": "UTC",
    "description": "Application timezone"
  }'

# Create setting 3
curl -X POST http://localhost:3000/private/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production" \
  -d '{
    "slug": "notification",
    "key": "email_enabled",
    "value": "true",
    "description": "Enable email notifications"
  }'
```

### Scenario 2: Retrieve and Update
```bash
# Get by slug and key
curl -X GET http://localhost:3000/private/settings/app/language \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production"

# Update the setting
curl -X PUT http://localhost:3000/private/settings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here-change-in-production" \
  -d '{
    "value": "kh"
  }'
```

---

## Postman Collection JSON

```json
{
  "info": {
    "name": "Settings API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Setting",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer your-secret-service-token-here-change-in-production"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"slug\": \"app\",\n  \"key\": \"theme\",\n  \"value\": \"dark\",\n  \"description\": \"Application theme setting\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/private/settings",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["private", "settings"]
        }
      }
    },
    {
      "name": "Get All Settings",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer your-secret-service-token-here-change-in-production"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/private/settings?page=1&limit=10",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["private", "settings"],
          "query": [
            {"key": "page", "value": "1"},
            {"key": "limit", "value": "10"}
          ]
        }
      }
    },
    {
      "name": "Get Setting by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer your-secret-service-token-here-change-in-production"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/private/settings/id/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["private", "settings", "id", "1"]
        }
      }
    },
    {
      "name": "Get Setting by Slug/Key",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer your-secret-service-token-here-change-in-production"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/private/settings/app/theme",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["private", "settings", "app", "theme"]
        }
      }
    },
    {
      "name": "Update Setting",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer your-secret-service-token-here-change-in-production"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"value\": \"light\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/private/settings/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["private", "settings", "1"]
        }
      }
    },
    {
      "name": "Delete Setting",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer your-secret-service-token-here-change-in-production"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/private/settings/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["private", "settings", "1"]
        }
      }
    }
  ]
}
```

---

## Expected Response Format

### Success Response
```json
{
  "success": true,
  "message": "Setting created",
  "data": {
    "id": 1,
    "global_id": "uuid-here",
    "slug": "app",
    "key": "theme",
    "value": "dark",
    "description": "Application theme setting",
    "created_at": "2025-12-24T15:30:00.000Z",
    "updated_at": "2025-12-24T15:30:00.000Z"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Settings retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Not found",
  "error": "Not found"
}
```
