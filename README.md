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

## Environment variables (overview)

- **Backend:** `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`; optional `PORT`, `CORS_ORIGIN`.
- **Frontend:** `VITE_API_BASE_URL` (must include the `/api` prefix if your API is mounted there).

Details and validation rules are documented in [backend/README.md](./backend/README.md).

## License

See repository metadata / package files unless otherwise noted.
