# Gym Personal Record Tracker

A small full-stack project: an Express + PostgreSQL API for tracking gym personal records (weight × reps per exercise), plus a React SPA that talks to it.

## Disclosure (frontend)

**I did not build the frontend myself.** The UI in `frontend/` was produced with **AI assistance** (generated code and design choices). I’m stating this explicitly so it’s clear where my own work sits versus tooling—I focus on backend work, and I don’t want anyone reviewing this repo (for example, a recruiter) to assume I authored the frontend as part of my core skill set.

The **backend** under `backend/` is what I’m treating as my primary contribution in this repository.

## Repository layout

| Path | Role |
|------|------|
| `backend/` | REST API (Express, Prisma, JWT). See [backend/README.md](./backend/README.md). |
| `frontend/` | Vite + React + TypeScript SPA (AI-assisted). |

## Prerequisites

- **Node.js** (LTS recommended)
- **PostgreSQL** for the API database

## Quick start

### 1. Backend

From `backend/`, configure `.env` (see [backend/README.md](./backend/README.md)), install dependencies, run migrations if needed, then:

```bash
cd backend
npm install
npm run dev
```

Default API base URL is typically `http://localhost:3000` with routes under `/api`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL, e.g. http://localhost:3000/api
npm run dev
```

The dev server is usually **http://localhost:5173**. Ensure the backend allows this origin via `CORS_ORIGIN` (comma-separated if you need several URLs).

### Frontend URL vs API paths (common confusion)

- **`https://your-app.vercel.app/login`** — This is the **React app route** for the login screen. It is **not** supposed to match the backend path. The browser loads the SPA; JavaScript then calls the API on Railway.
- **Backend auth endpoints** (no `/login` name):
  - Sign-in: **`POST /api/auth/signin`**
  - Sign-up: **`POST /api/auth/signup`**
  - Log out: **`POST /api/auth/logout`**

So the full sign-up URL your frontend calls is:

`{VITE_API_BASE_URL}/auth/signup`

which resolves to:

`https://<your-railway-host>/api/auth/signup`

when `VITE_API_BASE_URL` is `https://<your-railway-host>/api`.

### Deploying: Vercel (frontend) + Railway (backend)

1. **Railway — `CORS_ORIGIN`**  
   Set to your **exact** Vercel origin(s), e.g. `https://your-app.vercel.app`.  
   For Preview deployments, add multiple origins separated by commas (no spaces unless trimmed).  
   If this is wrong or missing, the browser blocks requests and sign-up/sign-in look like generic failures.

2. **Vercel — `VITE_API_BASE_URL`**  
   Must be your **public Railway HTTPS URL** with the **`/api` suffix**, no trailing slash, for example:

   `https://your-service.up.railway.app/api`

   Vite reads this **at build time**. After you add or change it in the Vercel project settings, **trigger a new deployment**.

3. **Wrong base URL** — If you omit `/api`, requests go to `https://railway-host/auth/signup` instead of `/api/auth/signup` and will fail.

## Environment variables (overview)

- **Backend:** `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`; optional `PORT`, `CORS_ORIGIN`.
- **Frontend:** `VITE_API_BASE_URL` (must include the `/api` prefix if your API is mounted there).

Details and validation rules are documented in [backend/README.md](./backend/README.md).

## License

See repository metadata / package files unless otherwise noted.
