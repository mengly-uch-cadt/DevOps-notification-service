# Quick Reference Card

One-page reference for the Notifications System API.

## 🚀 Setup (3 commands)

```bash
npm install
cp .env.example .env  # Edit DATABASE_URL and SERVICE_TOKEN
npm run prisma:generate && npm run prisma:push && npm run dev
```

## 📋 NPM Scripts

```bash
npm run dev              # Development with hot reload
npm run build            # Build TypeScript
npm start                # Run production build
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create migration
npm run prisma:push      # Push schema (dev)
npm run prisma:studio    # Database GUI
```

## 🌐 API Endpoints

**Base URLs:**
- Public: `http://localhost:3000/api/public`
- Private: `http://localhost:3000/api/private`

### Public (No Auth)

```bash
GET  /api/public/health
GET  /api/public/tasks/:global_id
```

### Private (Requires: Authorization: Bearer <token>)

```bash
POST /api/private/tasks                # Create
PUT  /api/private/tasks/:id            # Update
GET  /api/private/tasks/id/:id         # Get by ID
GET  /api/private/tasks/:global_id     # Get by UUID
GET  /api/private/tasks?page=1&limit=10 # List
```

## 📝 Quick Test

```bash
# 1. Health check
curl http://localhost:3000/api/public/health

# 2. Create task
curl -X POST http://localhost:3000/api/private/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"task": "Test task"}'

# 3. List tasks
curl "http://localhost:3000/api/private/tasks?page=1&limit=10" \
  -H "Authorization: Bearer your-token"
```

## 🗂️ Project Structure

```
src/
├── routes/          → API endpoints
├── controllers/     → Request handlers
├── services/        → Business logic
├── repositories/    → Database operations
├── middlewares/     → Auth, validation, errors
├── schemas/         → Zod validation
└── utils/           → Helpers
```

## 📦 Database Model

```prisma
Task {
  id         Int      @id @default(autoincrement())
  global_id  String   @unique (UUID v4)
  task       String   (1-500 chars)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

## ✅ Response Format

**Success:**
```json
{
  "status": "success",
  "message": "...",
  "data": {...},
  "meta": {...}
}
```

**Error:**
```json
{
  "status": "error",
  "message": "...",
  "errors": [...]
}
```

## 🔢 HTTP Status Codes

- `200` - OK (GET, PUT)
- `201` - Created (POST)
- `400` - Validation error
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

## 🔐 Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
SERVICE_TOKEN=your-secret-token
LOG_LEVEL=info
```

## 📚 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **DB**: PostgreSQL
- **Validation**: Zod
- **Security**: Helmet + CORS
- **Logging**: Pino-HTTP

## 🛠️ Common Tasks

**Add new endpoint:**
1. Schema: `src/schemas/`
2. Repository: `src/repositories/`
3. Service: `src/services/`
4. Controller: `src/controllers/`
5. Routes: `src/routes/`

**Database changes:**
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate client
npm run prisma:generate
# 3. Create migration
npm run prisma:migrate
```

**View database:**
```bash
npm run prisma:studio  # Opens at localhost:5555
```

## 🐛 Troubleshooting

**Port in use:**
```bash
lsof -ti:3000 | xargs kill
```

**Database error:**
```bash
# Check connection
psql $DATABASE_URL
# Reset database
npx prisma migrate reset
```

**Type errors:**
```bash
npm run prisma:generate  # Regenerate Prisma types
```

## 📖 Documentation

- [README.md](README.md) - Full docs
- [QUICKSTART.md](QUICKSTART.md) - 5min setup
- [API_EXAMPLES.md](API_EXAMPLES.md) - curl examples
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture

## 🎯 Key Files

| File | What to do |
|------|------------|
| `src/server.ts` | Server config |
| `prisma/schema.prisma` | Database models |
| `src/routes/*.ts` | Add routes |
| `.env` | Configuration |

---

**Need help?** Check [README.md](README.md) for detailed documentation.
