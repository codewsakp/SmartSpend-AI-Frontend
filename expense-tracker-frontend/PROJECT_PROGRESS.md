# Project Progress

## Completed features
- Landing, Register (validation, redirect to login), Login (JWT, errors, redirect), protected routes
- Dashboard: greeting, month picker, total/budget/remaining/used cards, 6-month trend, category donut, recent transactions, quick expense, data-based highlights
- Transactions: table (desktop) / cards (mobile), search, category filter, add, edit, delete with confirmation, loading/empty/error states, toasts
- Budgets: set/update per month, spent/remaining/percent/status, "no budget" state
- Analytics: trend, category distribution, budget vs spending, monthly totals
- Profile: name, email, session expiry, logout (no password data)
- Session handling: JWT interceptor, auto sign-out on 401 or expired token

## API integrations (match backend source)
`/api/auth/register`, `/api/auth/login`, `/api/expenses` (GET/POST/PUT/DELETE), `/api/budgets` (PUT), `/api/budgets/summary`, `/api/dashboard`, `/api/dashboard/monthly-trends`, `/api/dashboard/category-breakdown`.

## AI features (pending: backend has none)
Frontend interface is built but switched off (`VITE_AI_ENABLED=false`): natural-language entry with editable preview and confirm-before-save, category suggestion, insights Q&A, monthly summary. Needs the endpoints proposed in `BACKEND_API_REFERENCE.md`.

## Files
Created/replaced: everything under `src/`, `index.html`, `vite.config.js`, `.env`, `.env.example`, `.gitignore`, `README.md`, `BACKEND_API_REFERENCE.md`, `PROJECT_PROGRESS.md`. From your batch 1, `App.jsx`, `main.jsx`, `AuthContext.jsx`, `api.js`, `authService.js` were rewritten and `ProtectedRoute` moved to `components/common`. Removed: `ComingSoon.jsx`, `App.css`, `index.css`, `styles/global.css`, template assets. `package.json` unchanged. Backend untouched.

## Verification status
- Done: all files parse (esbuild); all relative imports resolve; the UI was run in Chromium at phone/tablet/desktop widths against an in-memory mock of your backend's DTOs, with stand-in versions of the npm libraries (40 checks passed, no console errors, no horizontal overflow).
- NOT done: `npm install` / `npm run build` with the real packages (registry unreachable from the build environment), real Recharts rendering, `npm run lint`, and any test against your running Spring Boot backend.

## Known risks
- Lucide icons use current names (`CircleAlert`, `CircleCheck`, `LoaderCircle`, `ChartColumn`). If the build reports a missing icon export, rename that import.
- No pagination: the backend returns all expenses.

## Remaining tasks
1. `npm install && npm run build`; fix anything reported.
2. Run against the real backend and walk through each page.
3. Build backend AI endpoints, then set `VITE_AI_ENABLED=true`.
4. Production: same-origin deployment or backend CORS.
