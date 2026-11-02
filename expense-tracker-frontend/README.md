# Expense Tracker - Frontend

React frontend for the Spring Boot Expense Tracker backend (JWT auth, expenses, budgets, dashboard analytics).

## Tech stack
React, JavaScript, Vite, React Router DOM, Axios, Recharts, Lucide React, plain CSS with variables.

## Setup
Needs Node.js 20+ and the backend running on port 8080.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

## Connecting to the backend
1. Start MySQL and the Spring Boot app (needs `DB_PASSWORD` and `JWT_SECRET` environment variables) on `http://localhost:8080`.
2. Run `npm run dev`.

The backend has **no CORS configuration**, so in development Vite proxies `/api/*` to it. Keep `VITE_API_BASE_URL` empty in `.env`. If the backend is elsewhere, change `VITE_PROXY_TARGET`.

For production, serve `dist/` and the backend from the same origin (reverse proxy), or set `VITE_API_BASE_URL` and add CORS on the backend.

## Environment variables (`.env`)
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend URL. Empty means same origin (dev proxy). |
| `VITE_PROXY_TARGET` | Where the dev proxy sends `/api` (default `http://localhost:8080`). |
| `VITE_AI_ENABLED` | Keep `false` until the backend AI endpoints exist. |
| `VITE_CURRENCY`, `VITE_LOCALE` | Display format (default `INR`, `en-IN`). |

`.env` is git-ignored; commit only `.env.example`. No secrets belong in this project.

## Pages
Landing, Register, Login, Dashboard, Transactions (add/edit/delete), Budgets, Analytics, Profile (logout). Responsive: drawer menu and card lists on phones, sidebar and tables on larger screens.

## Structure
`src/components` (common, dashboard, expenses, budgets, analytics, ai), `pages`, `layouts`, `services` (Axios + one file per API area), `context`, `hooks`, `utils`, `styles`.

See `BACKEND_API_REFERENCE.md` for exact APIs, gaps and the proposed AI contract, and `PROJECT_PROGRESS.md` for status.
