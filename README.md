# Notifications System - REST API

Production-ready REST API built with Node.js, TypeScript, Express, Prisma, and Zod validation.

## Features

- **Clean Architecture**: Routes → Controllers → Services → Repository pattern
- **Type Safety**: Full TypeScript implementation
- **Validation**: Zod schemas for request validation
- **Database**: Prisma ORM with PostgreSQL
- **Security**: Helmet, CORS, Service Token authentication
- **Logging**: Pino-HTTP for structured logging
- **Error Handling**: Centralized error handler with consistent responses
- **Response Format**: Standardized JSON responses

## Project Structure

```
notifications-system/
├── prisma/
│   └── schema.prisma              # Prisma schema definition
├── src/
│   ├── controllers/
│   │   └── task.controller.ts     # Request handlers
│   ├── services/
│   │   └── task.service.ts        # Business logic
│   ├── repositories/
│   │   └── task.repo.ts           # Database operations
│   ├── routes/
│   │   ├── index.ts               # Main router
│   │   ├── public.routes.ts       # Public endpoints
│   │   ├── private.routes.ts      # Protected endpoints
│   │   └── task.routes.ts         # Task route definitions
│   ├── middlewares/
│   │   ├── auth.serviceToken.ts   # Service token authentication
│   │   ├── validate.ts            # Zod validation middleware
│   │   ├── errorHandler.ts        # Global error handler
│   │   └── notFound.ts            # 404 handler
│   ├── schemas/
│   │   └── task.schema.ts         # Zod validation schemas
│   ├── utils/
│   │   ├── response.ts            # Response utilities
│   │   └── uuid.ts                # UUID utilities
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x (or MySQL >= 8.x)
- npm or yarn

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/notifications_db?schema=public"

# For MySQL, use:
# DATABASE_URL="mysql://user:password@localhost:3306/notifications_db"

SERVICE_TOKEN=your-secret-service-token-here
LOG_LEVEL=info
```

3. **Set up the database**

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Or push schema without migrations (for development)
npm run prisma:push
```

4. **Start the server**

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start at `http://localhost:3000`

## Database Schema

### Task Model

```prisma
model Task {
  id         Int      @id @default(autoincrement())
  global_id  String   @unique @db.VarChar(36)
  task       String   @db.VarChar(500)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

## API Endpoints

### Base URLs

- **Public API**: `http://localhost:3000/api/public`
- **Private API**: `http://localhost:3000/api/private` (requires authentication)

### Response Format

All responses follow this structure:

**Success Response:**
```json
{
  "status": "success",
  "message": "Success message",
  "data": { ... },
  "meta": { ... }  // Optional (pagination, etc.)
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error message",
  "data": null
}
```

### Public Endpoints

#### Health Check
```bash
GET /api/public/health
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/public/health
```

**Response:**
```json
{
  "status": "success",
  "message": "Service is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2025-12-24T10:30:00.000Z",
    "uptime": 123.456
  }
}
```

#### Get Task by Global ID (Public)
```bash
GET /api/public/tasks/:global_id
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/public/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
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

### Private Endpoints

All private endpoints require a service token in the Authorization header:

```
Authorization: Bearer your-secret-service-token-here
```

#### Create Task
```bash
POST /api/private/tasks
Content-Type: application/json
Authorization: Bearer <SERVICE_TOKEN>

{
  "task": "Task description"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/private/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here" \
  -d '{
    "task": "Complete project documentation"
  }'
```

**Response (201 Created):**
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

#### Update Task
```bash
PUT /api/private/tasks/:id
Content-Type: application/json
Authorization: Bearer <SERVICE_TOKEN>

{
  "task": "Updated task description"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/private/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here" \
  -d '{
    "task": "Updated: Complete project documentation"
  }'
```

**Response (200 OK):**
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

#### Get Task by ID
```bash
GET /api/private/tasks/id/:id
Authorization: Bearer <SERVICE_TOKEN>
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/private/tasks/id/1 \
  -H "Authorization: Bearer your-secret-service-token-here"
```

#### Get Task by Global ID (Private)
```bash
GET /api/private/tasks/:global_id
Authorization: Bearer <SERVICE_TOKEN>
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/private/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer your-secret-service-token-here"
```

#### List All Tasks (with Pagination)
```bash
GET /api/private/tasks?page=1&limit=10
Authorization: Bearer <SERVICE_TOKEN>
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/private/tasks?page=1&limit=10" \
  -H "Authorization: Bearer your-secret-service-token-here"
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "global_id": "550e8400-e29b-41d4-a716-446655440000",
      "task": "Complete project documentation",
      "created_at": "2025-12-24T10:00:00.000Z",
      "updated_at": "2025-12-24T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## Validation Rules

### Create Task
- `task`: required, string, 1-500 characters

### Update Task
- `task`: optional, string, 1-500 characters

### Parameters
- `id`: positive integer
- `global_id`: valid UUID v4 format

### Pagination
- `page`: positive integer (default: 1)
- `limit`: 1-100 (default: 10)

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Example Error Responses

### Validation Error (400)
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

### Authentication Error (401)
```json
{
  "status": "error",
  "message": "Invalid service token"
}
```

### Not Found Error (404)
```json
{
  "status": "error",
  "message": "Task with ID 999 not found"
}
```

## NPM Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database (dev)
npm run prisma:studio    # Open Prisma Studio GUI
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Environment mode | development | No |
| PORT | Server port | 3000 | No |
| DATABASE_URL | Database connection string | - | Yes |
| SERVICE_TOKEN | Service authentication token | - | Yes |
| LOG_LEVEL | Logging level | info | No |
| CORS_ORIGIN | CORS allowed origin | * | No |

## Development

### Using Prisma Studio

View and edit your database with Prisma Studio:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Testing with cURL

Complete workflow example:

```bash
# 1. Check health
curl -X GET http://localhost:3000/api/public/health

# 2. Create a task (private)
TASK_RESPONSE=$(curl -X POST http://localhost:3000/api/private/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here" \
  -d '{"task": "My first task"}')

echo $TASK_RESPONSE

# 3. Extract global_id from response (using jq)
GLOBAL_ID=$(echo $TASK_RESPONSE | jq -r '.data.global_id')

# 4. Get task by global_id (public)
curl -X GET http://localhost:3000/api/public/tasks/$GLOBAL_ID

# 5. Update task by id (private)
curl -X PUT http://localhost:3000/api/private/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-service-token-here" \
  -d '{"task": "Updated task description"}'

# 6. List all tasks (private)
curl -X GET "http://localhost:3000/api/private/tasks?page=1&limit=5" \
  -H "Authorization: Bearer your-secret-service-token-here"
```

## Production Deployment

### Build for production

```bash
npm run build
```

### Set production environment variables

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://..."
SERVICE_TOKEN="strong-random-token"
LOG_LEVEL=warn
```

### Start production server

```bash
npm start
```

### Using PM2 (recommended)

```bash
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name notifications-api

# Monitor
pm2 monit

# View logs
pm2 logs notifications-api

# Restart
pm2 restart notifications-api
```

## License

ISC

## Author

DevOps Final Project - CADT Y4T1
