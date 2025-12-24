# Project Structure

Complete folder tree for the Notifications System API.

```
notifications-system/
│
├── prisma/
│   └── schema.prisma                    # Prisma schema (Task model)
│
├── src/
│   ├── controllers/
│   │   └── task.controller.ts           # Task request handlers
│   │
│   ├── services/
│   │   └── task.service.ts              # Task business logic
│   │
│   ├── repositories/
│   │   └── task.repo.ts                 # Task database operations
│   │
│   ├── routes/
│   │   ├── index.ts                     # Main router (mounts public/private)
│   │   ├── public.routes.ts             # Public API routes
│   │   ├── private.routes.ts            # Private API routes (with auth)
│   │   └── task.routes.ts               # Task route definitions
│   │
│   ├── middlewares/
│   │   ├── auth.serviceToken.ts         # Service token authentication
│   │   ├── validate.ts                  # Zod validation middleware
│   │   ├── errorHandler.ts              # Global error handler
│   │   └── notFound.ts                  # 404 handler
│   │
│   ├── schemas/
│   │   └── task.schema.ts               # Zod validation schemas
│   │
│   ├── utils/
│   │   ├── response.ts                  # Response utility functions
│   │   └── uuid.ts                      # UUID generation/validation
│   │
│   ├── app.ts                           # Express app configuration
│   └── server.ts                        # Server entry point
│
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore rules
├── package.json                         # NPM dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
│
├── README.md                            # Complete documentation
├── QUICKSTART.md                        # 5-minute quick start
├── API_EXAMPLES.md                      # API testing examples
└── PROJECT_STRUCTURE.md                 # This file
```

## File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts, and metadata |
| `tsconfig.json` | TypeScript compiler configuration |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore patterns |

### Database

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition (Task model) |

### Application Core

| File | Purpose |
|------|---------|
| `src/server.ts` | Application entry point, server startup |
| `src/app.ts` | Express app setup, middleware configuration |

### Routes Layer

| File | Purpose |
|------|---------|
| `src/routes/index.ts` | Main router, mounts /public and /private |
| `src/routes/public.routes.ts` | Public endpoints (health, public tasks) |
| `src/routes/private.routes.ts` | Private endpoints (requires auth) |
| `src/routes/task.routes.ts` | Task route definitions (both public & private) |

### Controllers Layer

| File | Purpose |
|------|---------|
| `src/controllers/task.controller.ts` | Request handlers for task operations |

### Services Layer

| File | Purpose |
|------|---------|
| `src/services/task.service.ts` | Business logic for tasks |

### Repository Layer

| File | Purpose |
|------|---------|
| `src/repositories/task.repo.ts` | Database operations using Prisma |

### Middleware

| File | Purpose |
|------|---------|
| `src/middlewares/auth.serviceToken.ts` | Service token authentication |
| `src/middlewares/validate.ts` | Zod schema validation |
| `src/middlewares/errorHandler.ts` | Global error handling |
| `src/middlewares/notFound.ts` | 404 route handler |

### Schemas

| File | Purpose |
|------|---------|
| `src/schemas/task.schema.ts` | Zod validation schemas for tasks |

### Utils

| File | Purpose |
|------|---------|
| `src/utils/response.ts` | Response formatting utilities |
| `src/utils/uuid.ts` | UUID generation and validation |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete API documentation |
| `QUICKSTART.md` | 5-minute setup guide |
| `API_EXAMPLES.md` | API request examples & testing |
| `PROJECT_STRUCTURE.md` | This file - project structure overview |

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  ROUTES LAYER                                           │
│  • index.ts (main router)                               │
│  • public.routes.ts (no auth)                           │
│  • private.routes.ts (with auth)                        │
│  • task.routes.ts (task endpoints)                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  MIDDLEWARE LAYER                                       │
│  • auth.serviceToken.ts (authentication)                │
│  • validate.ts (Zod validation)                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER                                       │
│  • task.controller.ts (request handling)                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                          │
│  • task.service.ts (business logic)                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER                                       │
│  • task.repo.ts (database operations)                   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL via Prisma)                       │
└─────────────────────────────────────────────────────────┘
```

## Request Flow Example

**Creating a Task:**

1. **Client** sends POST request to `/api/private/tasks`
2. **Routes** (`private.routes.ts`) receives request
3. **Middleware** (`auth.serviceToken.ts`) validates Bearer token
4. **Middleware** (`validate.ts`) validates request body with Zod
5. **Controller** (`task.controller.ts`) handles the request
6. **Service** (`task.service.ts`) applies business logic (generate UUID)
7. **Repository** (`task.repo.ts`) performs database operation
8. **Response** flows back up through layers to client

## Key Design Patterns

### Clean Architecture
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Flow**: Routes → Controllers → Services → Repositories
- **Testability**: Each layer can be tested independently

### Middleware Pipeline
```
Request → Auth → Validation → Controller → Error Handler → Response
```

### Consistent Response Format
All responses use `ResponseUtil` for consistent structure:
```typescript
{
  success: boolean,
  message: string,
  data?: any,
  meta?: any,
  errors?: any[]
}
```

## Adding New Features

### To add a new entity (e.g., "User"):

1. **Database**: Add model to `prisma/schema.prisma`
2. **Repository**: Create `src/repositories/user.repo.ts`
3. **Service**: Create `src/services/user.service.ts`
4. **Controller**: Create `src/controllers/user.controller.ts`
5. **Schemas**: Create `src/schemas/user.schema.ts`
6. **Routes**: Create routes in `src/routes/user.routes.ts`
7. **Mount**: Add to `public.routes.ts` or `private.routes.ts`

## File Size Overview

| Category | Files | Lines of Code (approx) |
|----------|-------|------------------------|
| Routes | 4 | ~150 |
| Controllers | 1 | ~100 |
| Services | 1 | ~80 |
| Repositories | 1 | ~100 |
| Middlewares | 4 | ~150 |
| Schemas | 1 | ~80 |
| Utils | 2 | ~100 |
| Core | 2 | ~150 |
| **Total** | **16** | **~910** |

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Pino-HTTP
- **Environment**: dotenv
- **UUID**: uuid (v4)

---

For setup instructions, see [QUICKSTART.md](QUICKSTART.md)  
For API documentation, see [README.md](README.md)  
For testing examples, see [API_EXAMPLES.md](API_EXAMPLES.md)
