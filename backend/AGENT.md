# Backend Agent Guide

## Commands

```powershell
cd backend
npm install
npm run dev       # tsx watch src/server.ts
npm run build     # TypeScript check/build
npm start         # runs src/server.ts
```

Environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, and optional `REDIS_URL`; see `.env.example`. Never log secrets. Load dotenv before importing clients that read environment variables; ESM imports run before `server.ts` body code.

## Structure

- `src/server.ts` starts the app.
- `src/modules/index.ts` mounts versioned routes.
- Feature modules use routes, controllers, services, DAOs, and validation schemas.
- Shared middleware is in `src/middlewares`;
- JWT/password helpers are in `src/utils`;
- clients are in `src/lib`;
- errors/config/types are in their matching directories.

`prisma/schema.prisma` and `prisma/migrations/` are source-controlled. `generated/prisma/` is generated; never edit it.

## Current API

Base path: `/api/v1`

- `GET /api/v1/`: health response.
- `POST /api/v1/auth/register`: validates `email`, `name`, and an 8-72 character `password`; creates a user and JWT cookie.
- `POST /api/v1/auth/login`: validates `email` and `password`; returns a JWT cookie.
- `POST /api/v1/auth/logout`: expires the JWT cookie.
- `GET /api/v1/tasks`: lists the user's tasks.
- `GET /api/v1/tasks/:id`: gets one owned task.
- `POST /api/v1/tasks`: creates a task.
- `PATCH /api/v1/tasks/:id`: updates a task.
- `DELETE /api/v1/tasks/:id`: deletes a task.
- `GET /api/v1/time-logs`: lists the user's time logs.
- `POST /api/v1/time-logs/start`: starts a task timer.
- `POST /api/v1/time-logs/:id/stop`: stops an active timer and stores seconds.
- `GET /api/v1/dashboard`: returns today's task and time summary.

Use `validate(schema)` in routes. `authMiddleware` accepts a bearer token or `auth_token` cookie and sets `request.userId`.

## Database And Prisma

`User` contains `id`, unique `email`, `name`, `passwordHash`, `createdAt`, and `updatedAt`. Hash passwords with the shared bcrypt helper; never persist or return raw passwords.

Prisma uses the PostgreSQL adapter and a custom generated output. Import the client from:

```ts
import { PrismaClient } from "../../generated/prisma/client.js";
```

The relative depth changes by file location. In this setup, do not replace this with `@prisma/client`. Run Prisma commands from `backend/` with a valid `DATABASE_URL`.

## Conventions

- Strict TypeScript/ESM: local imports use `.js` extensions.
- Controllers are HTTP-only; services are Express-independent; DAOs own Prisma calls.
- Use `AuthError` for expected failures and shared helpers for JWT, hashing, cookies, and validation.
- Do not commit `.env`, secrets, generated output, or unrelated formatting.

## Before Finishing Changes

1. Run `cd backend; npm run build`.
2. For schema changes, update the client and add a migration.
3. Verify route mounting and generated-client import paths.
4. Update this guide when commands or architecture change.
