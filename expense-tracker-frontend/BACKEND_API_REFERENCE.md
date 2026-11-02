# Backend API Reference

Discovered from the backend source you provided (`ExpenseTracker.zip`, package `com.sakshi.expensetracker`). The source code is the only source of truth. This frontend never modifies the backend.

**Base URL:** `http://localhost:8080` (`server.port=8080`).
**Auth:** stateless JWT. Send `Authorization: Bearer <token>` on every endpoint except register/login. The user is identified from the token (subject = email); **no user id is ever sent by the client**. Tokens last 86,400,000 ms (24 h). A missing/invalid/expired token gives HTTP `401` (Spring `sendError`, default Spring error body, not `ApiErrorResponse`).
**Money:** `BigDecimal` as JSON numbers. **Dates:** `LocalDate` as `"YYYY-MM-DD"`.

## Error format (`GlobalExceptionHandler`)

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed",
  "path": "/api/expenses", "validationErrors": { "amount": "Amount must be greater than zero" } }
```

| Status | When |
|---|---|
| 400 | Body validation (`validationErrors` filled), query-param validation, `IllegalArgumentException` (e.g. "Email is already registered") |
| 401 | Bad login ("Invalid email or password"); missing/invalid/expired JWT |
| 404 | `EntityNotFoundException` ("Expense not found", "Budget not found for 2026-11") |
| 500 | Any other exception: "An unexpected error occurred" |

## Auth (public)

### `POST /api/auth/register` → `201`
Request: `{ "name": required, "email": required + valid, "password": required, min 8 }`
Response: `{ "id", "name", "email", "message": "Registration successful" }`
Email is trimmed and lower-cased. Duplicate → 400 "Email is already registered". Role is always `ROLE_USER`.

### `POST /api/auth/login` → `200`
Request: `{ "email", "password" }`
Response: `{ "id", "name", "email", "token", "tokenType": "Bearer" }`

## Expenses (JWT; always scoped to the signed-in user)

`ExpenseRequest`: `{ "amount": number required >0, "category": required non-blank, "description": string|null, "expenseDate": "YYYY-MM-DD" required, "paymentMethod": string|null }`
`ExpenseResponse`: `{ "id", "amount", "category", "description", "expenseDate", "paymentMethod" }`

| Method and path | Result |
|---|---|
| `POST /api/expenses` | `201` ExpenseResponse |
| `GET /api/expenses` | `200` ExpenseResponse[] (newest first). No pagination, search or filters, so the frontend filters client-side. |
| `GET /api/expenses/{id}` | `200` ExpenseResponse or 404 |
| `PUT /api/expenses/{id}` | `200` ExpenseResponse (full replace) or 404 |
| `DELETE /api/expenses/{id}` | `204` or 404 |

`category` and `paymentMethod` are free text on the backend; the UI only suggests values.

## Budgets (JWT)

### `PUT /api/budgets` → `200`
Creates or updates the budget for a month. Request: `{ "amount": >0, "year": 2020-2100, "month": 1-12 }`. Response: `{ "id", "amount", "year", "month" }`.

### `GET /api/budgets/summary?year=&month=` → `200`
Response: `{ "budgetAmount", "totalSpent", "remainingAmount", "percentageUsed", "status" }`, `status` = `WITHIN_BUDGET` | `OVER_BUDGET`.
**Returns `404` if no budget exists for that month.** The frontend treats this as "not set".

## Dashboard (JWT; `year` 2020-2100, `month` 1-12)

| Endpoint | Response |
|---|---|
| `GET /api/dashboard?year=&month=` | `{ summary, categoryBreakdown, monthlyTrends, recentTransactions }` (used by the Dashboard page) |
| `GET /api/dashboard/summary` | `{ totalExpenses, monthlyBudget, remainingBudget, percentageUsed, budgetStatus }`. No budget: those three are `null`, `budgetStatus = "BUDGET_NOT_SET"` |
| `GET /api/dashboard/category-breakdown` | `[{ category, totalAmount, percentage }]`, highest first |
| `GET /api/dashboard/monthly-trends` | `[{ month: "November", year, totalAmount }]`, 6 entries, oldest first |
| `GET /api/dashboard/recent-transactions` | latest 5 ExpenseResponse (no params, not month-filtered) |

## Gaps and limitations (documented, not changed)

1. **No CORS configuration.** A browser app on another origin (`localhost:5173`) is blocked. In development the frontend uses a Vite proxy (`/api` to `http://localhost:8080`). For production use one origin (reverse proxy) or add CORS to the backend.
2. **No AI endpoints.** No Spring AI / Ollama code or dependency exists yet. See the proposed contract below.
3. **No profile / "current user" endpoint**, no profile edit, no password change. Name and email come from the login response (never the password).
4. **No logout/refresh endpoint.** Logout discards the token client-side; it stays valid until expiry.
5. Budget history has no endpoint, so Analytics calls `/api/budgets/summary` once per month in the 6-month window.
6. `application.properties` needs the `DB_PASSWORD` and `JWT_SECRET` (Base64) environment variables.

## AI: proposed contract (NOT implemented in the backend)

`src/services/aiService.js` targets these, enabled with `VITE_AI_ENABLED=true`. They are proposals: edit `AI_ENDPOINTS` to match what you build. React never talks to Ollama, only Spring Boot does, and the backend must compute all totals itself (the model only explains them).

| Feature | Proposed endpoint | Request | Response |
|---|---|---|---|
| Natural-language entry | `POST /api/ai/expenses/parse` | `{ "text": "Coffee 80 using UPI" }` | `{ amount, category, description, expenseDate, paymentMethod }` (nullable). Must NOT save. |
| Category suggestion | `POST /api/ai/expenses/categorize` | `{ "description" }` | `{ "category" }` |
| Insights Q&A | `POST /api/ai/insights/ask` | `{ "question", "year", "month" }` | `{ "answer" }` |
| Monthly summary | `GET /api/ai/insights/monthly-summary?year=&month=` | none | `{ "summary" }` |

UI flow: text, parse, editable preview, user confirms, saved through the normal `POST /api/expenses`, dashboard refreshes. AI calls use a 60 s timeout.
