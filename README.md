# Task Board — Render Trial App

Full-stack kanban task board for testing [Render](https://render.com) deployments.

- **Frontend:** React + Vite (Static Site)
- **Backend:** Node.js + Express + TypeScript (Web Service)
- **Database:** PostgreSQL via Prisma

## Local setup

### 1. PostgreSQL

Create a local database and copy the connection string.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run db:push
npm run db:seed
npm run dev
```

API runs at `http://localhost:3001`.

Health checks:

- `GET /health` — service status
- `GET /health/db` — database connectivity

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Deploy on Render

### PostgreSQL

1. Create a **PostgreSQL** instance on Render.
2. Copy the **Internal Database URL** for the backend service.

### Backend (Web Service)

Deploy from the **repo root** — root `package.json` installs and builds all sub-projects.

| Setting | Value |
|---------|-------|
| Root Directory | *(leave blank)* |
| Build Command | `npm install && npm run build && npm run db:push` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Environment variables:

- `DATABASE_URL` — from Render Postgres
- `CORS_ORIGIN` — your frontend URL (e.g. `https://your-app.onrender.com`)
- `NODE_ENV` — `production`

Optional: run `npm run db:seed` once after first deploy (Render Shell).

### Frontend (Static Site)

| Setting | Value |
|---------|-------|
| Root Directory | *(leave blank)* |
| Build Command | `npm install && npm run build:frontend` |
| Publish Directory | `frontend/dist` |

Environment variable:

- `VITE_API_URL` — your backend URL (e.g. `https://your-api.onrender.com`)

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
