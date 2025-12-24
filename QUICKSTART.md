# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your database URL and service token:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notifications_db?schema=public"
SERVICE_TOKEN=my-secret-token-123
```

### Step 3: Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:push
```

### Step 4: Start Server

```bash
npm run dev
```

Server will start at: `http://localhost:3000`

---

## 🧪 Test It Out

### 1. Health Check (Public)

```bash
curl http://localhost:3000/api/public/health
```

### 2. Create a Task (Private - requires token)

```bash
curl -X POST http://localhost:3000/api/private/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token-123" \
  -d '{"task": "My first task"}'
```

### 3. Get Task by Global ID (Public)

Replace `<global_id>` with the UUID from step 2:

```bash
curl http://localhost:3000/api/public/tasks/<global_id>
```

### 4. List All Tasks (Private)

```bash
curl http://localhost:3000/api/private/tasks \
  -H "Authorization: Bearer my-secret-token-123"
```

---

## 📁 Project Structure Summary

```
src/
├── routes/          → API endpoints
├── controllers/     → Request handlers
├── services/        → Business logic
├── repositories/    → Database operations
├── middlewares/     → Auth, validation, errors
├── schemas/         → Zod validation schemas
└── utils/           → Helper functions
```

---

## 🔑 Key Files

- **[src/server.ts](src/server.ts)** - Application entry point
- **[src/app.ts](src/app.ts)** - Express configuration
- **[src/routes/index.ts](src/routes/index.ts)** - Route registration
- **[prisma/schema.prisma](prisma/schema.prisma)** - Database schema
- **[.env.example](.env.example)** - Environment template

---

## 📚 Full Documentation

See [README.md](README.md) for complete API documentation and examples.

---

## 🛠️ Common Commands

```bash
npm run dev              # Development with hot reload
npm run build            # Build for production
npm start                # Run production build
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Create migration
```

---

## ❓ Troubleshooting

### Database connection failed
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists: `createdb notifications_db`

### Authentication failed (401)
- Check `SERVICE_TOKEN` matches in `.env`
- Ensure header format: `Authorization: Bearer <token>`

### Port already in use
- Change `PORT` in `.env`
- Or kill the process: `lsof -ti:3000 | xargs kill`

---

## 🎯 Next Steps

1. Add more models to [prisma/schema.prisma](prisma/schema.prisma)
2. Create controllers in `src/controllers/`
3. Add routes in `src/routes/`
4. Implement business logic in `src/services/`
5. Write tests (consider Jest or Vitest)

Happy coding! 🎉
