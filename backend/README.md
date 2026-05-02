# Backend — Gym PR Tracker API

Express (TypeScript) service backed by **PostgreSQL** and **Prisma**. It exposes JSON REST endpoints under `/api` for authentication and for CRUD on personal records (PRs) scoped per user.

## Stack

- **Express** — HTTP server and routing  
- **Prisma** — ORM and schema (`prisma/schema.prisma`)  
- **PostgreSQL** — database  
- **JWT** — issued on sign-up/sign-in; validated via `Authorization: Bearer` or `jwt` httpOnly cookie  
- **bcrypt** — password hashing  
- **Zod** — request validation (with middleware)  
- **CORS** — configurable origins for SPA dev (e.g. Vite on port 5173)

## Environment variables

Required (validated at startup via `@t3-oss/env-core` in `src/env.ts`):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (string accepted by `jsonwebtoken`, e.g. `7d`) |
| `NODE_ENV` | e.g. `development` or `production` |

Optional:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default **3000**) |
| `CORS_ORIGIN` | Comma-separated allowed browser origins. Defaults to `http://localhost:5173` if unset. |

Create a `.env` file in **`backend/`** (do not commit secrets). Example shape:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## Scripts

```bash
npm install
npm run dev
```

`dev` runs `tsc -b` then starts `node dist/src/index.js`. Ensure the database exists and Prisma schema is applied before first run.

## Database (Prisma)

From `backend/`:

```bash
npx prisma migrate dev    # development migrations
# or, when appropriate:
npx prisma db push        # prototype / sync schema without migration history
```

Generate the client after schema changes if your workflow requires it:

```bash
npx prisma generate
```

## API overview

Base path: **`/api`**.

### Auth

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/auth/signup` | Body: `{ username, password }` (min length 3). Sets httpOnly cookie; returns user id, username, token. |
| `POST` | `/api/auth/signin` | Body: `{ username, password }`. Sets cookie; returns token. |
| `POST` | `/api/auth/logout` | Clears JWT cookie. |

### Personal records (protected)

All routes below require a valid JWT (`Authorization: Bearer <token>` or cookie).

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/pr/` | Create PR; body includes `exercise_title`, `weight`, `reps`, optional `remarks`. Unique exercise title per user. |
| `GET` | `/api/pr/` | List current user’s PRs. |
| `GET` | `/api/pr/:id` | Get one PR by id (must belong to user). |
| `PUT` | `/api/pr/:id` | Update fields (partial allowed per validation schema). |
| `DELETE` | `/api/pr/:id` | Delete PR. |

### Non-JSON route

- `GET /api/` — serves an EJS view (`index`) for the legacy/HTML entry; the SPA normally calls `/api/auth/*` and `/api/pr/*` only.

## Project structure (high level)

- `src/index.ts` — app bootstrap, CORS, middleware, `/api` mount  
- `src/routes/` — routers (`auth`, `pr`, root)  
- `src/controller/` — route handlers  
- `src/middleware/` — auth, validation  
- `src/schema/` — Zod schemas  
- `prisma/` — Prisma schema and migrations  

For UI integration, point a client at `http://localhost:<PORT>/api` and configure CORS for the frontend origin.
