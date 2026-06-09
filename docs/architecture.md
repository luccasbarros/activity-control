# Architecture Notes

Activity Control is a local-first activity management app. The architecture keeps the project scope small while showing how the product could grow without rewriting the core.

## Request Flow

```text
Browser
  -> Next.js App Router
  -> Authenticated app shell
  -> Server Components for route data
  -> Server Actions for mutations
  -> Auth boundary
  -> Prisma Client
  -> SQLite database file
```

Dashboard, activities, new activity, and history are server-rendered routes inside an authenticated route group. Filters are encoded as URL query parameters, parsed on the server, and translated into Prisma `where` input. Mutations run through Server Actions, emit structured logs, write activity history, and revalidate affected routes after writes.

## Main Boundaries

| Boundary | Files | Responsibility |
| --- | --- | --- |
| App shell | `src/app/(app)/layout.tsx`, `src/components/app-shell.tsx`, `src/components/app-navigation.tsx` | Protect the workspace, render desktop sidebar, mobile bottom navigation, account controls, theme toggle, and product version. |
| Route composition | `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/activities/page.tsx`, `src/app/(app)/activities/new/page.tsx`, `src/app/(app)/history/page.tsx` | Render metrics, charts, filters, pagination, forms, activities, feedback, and history in separate work areas. |
| Authentication | `src/app/login/*`, `src/lib/auth.ts`, `src/lib/session.ts`, `src/lib/password.ts` | Seeded login, signed HTTP-only cookie, current-user lookup, logout. |
| Validation | `src/lib/validation.ts` | Validate required fields, lengths, and enum values before persistence. |
| Filtering | `src/lib/filters.ts` | Normalize query params and build Prisma filters. |
| Pagination | `src/lib/pagination.ts`, `src/components/pagination-controls.tsx` | Parse page state, calculate ranges, and render navigation while preserving filters. |
| Feedback | `src/lib/notifications.ts`, `src/components/toast.tsx` | Convert action results into visible confirmation or error toasts. |
| Dashboard monitoring | `src/lib/metrics.ts`, `src/components/metric-cards.tsx`, `src/components/dashboard-panels.tsx` | Show counts, distributions, and alerts for blocked or critical work. |
| Observability | `src/lib/logger.ts`, `src/lib/constants.ts` | Emit structured server logs for auth and activity mutations. |
| Persistence | `prisma/schema.prisma`, `src/lib/db.ts` | Define SQLite schema, Prisma models, indexes, and client access. |
| Activity history | `src/lib/activity-change.ts`, `src/components/change-history.tsx` | Summarize create/update/delete events and render recent changes. |
| Theme | `src/components/theme-toggle.tsx`, `src/app/globals.css` | Provide light/dark theme through CSS variables and local preference. |
| Verification | `src/lib/*.test.ts`, `tests/e2e/responsive.spec.ts`, `.github/workflows/ci.yml` | Cover logic that is easy to regress, browser-level responsive behavior, and repository-level CI. |

## Data Model Shape

```text
User
  1 -> many ActivityChange

Activity
  1 -> many ActivityChange
```

`Activity` is the core domain model. `User` exists to create a clear local auth boundary. `ActivityChange` is a lightweight operational history, not a full event-sourcing system.

## Authentication Decision

The challenge did not require authentication, but a simple local gate was added because internal activity systems normally need an access boundary.

Implemented:

- seeded demo admin user;
- PBKDF2 password hashing with per-user salt;
- signed session token;
- HTTP-only session cookie;
- protected dashboard;
- logout action.

Trade-off: this is intentionally not OAuth, SSO, RBAC, password reset, or invitation management. Those are valid next steps for a real company tool, but they are beyond this project scope.

## Navigation And UI Decision

The first version used in-page sections. The final product uses dedicated routes because the app now has distinct work modes:

- `/dashboard` for overview, charts, alerts, and recent changes;
- `/activities` for filtering, pagination, edit modal, and delete flow;
- `/activities/new` for focused creation;
- `/history` for chronological activity changes.

Desktop uses a persistent sidebar and top account area. Mobile uses bottom navigation so the main routes stay reachable without a cramped grid menu.

Trade-off: route-based navigation adds a little file structure, but it improves scanability, browser history, direct linking, mobile ergonomics, and future expansion.

## Change History Decision

Recent changes are recorded from the same Server Actions that mutate activities.

Why this path:

- create/update/delete behavior stays centralized;
- history writes are transactional with activity writes;
- the dashboard can show auditability without introducing a separate event pipeline.

Trade-off: the history stores summaries, not a full before/after diff. A compliance-heavy product would need field-level diffs, actor permissions, retention rules, and possibly immutable append-only storage.

## Observability Decision

The app records visible activity history in SQLite and emits structured JSON logs from auth and activity Server Actions.

Why this path:

- local reviewers can inspect important actions in the terminal;
- the code demonstrates event naming and failure reasons without adding a service dependency;
- activity history keeps user-visible auditability separate from operational logs.

Trade-off: this is not external monitoring. A deployed product should add request tracing, error aggregation, metrics, and alerting through a service such as OpenTelemetry plus an observability backend.

## Dashboard Chart Decision

Dashboard distributions use lightweight CSS bars instead of a charting library.

Why this path:

- the data is small and categorical;
- the charts remain accessible as regular HTML;
- no large dependency is added for simple count distributions.

Trade-off: richer analytics would eventually justify a charting package, especially for time series, drill-downs, or complex tooltips.

## SQLite And Prisma Decision

SQLite and Prisma directly satisfy the data requirement. The Prisma datasource uses `file:./dev.db` so the requested setup commands work without creating an `.env` file.

Trade-off: a multi-environment production setup should move the datasource to `env("DATABASE_URL")`, externalize secrets, and use a server database such as PostgreSQL. For local evaluation, direct SQLite is simpler and more reproducible.

## Docker Decision

Docker is provided as an optional runtime:

```bash
docker compose up --build
```

The local source path remains the primary path:

```bash
npm install
npx prisma migrate dev
npm run dev
```

Trade-off: the Docker image is intentionally straightforward and includes the app plus dependencies. It is suitable for reviewing containerization, not optimized as a minimal production image.

## Testing Strategy

Automated tests focus on logic that can silently break:

- validation rules;
- filter normalization;
- pagination range calculation;
- safe return-path and query-message generation;
- toast message mapping;
- password hashing;
- session signing and tamper rejection;
- activity update summary generation.
- responsive browser behavior for login, route navigation, edit modal, pagination, toasts, and horizontal overflow.

Manual verification should still cover full business flows that intentionally mutate data: create, edit, delete, filter, and recent changes.

GitHub Actions repeats migration, seed, typecheck, unit tests, lint, production build, and Playwright checks for push and pull-request events.

## Future Paths

- Replace local auth with OAuth or SSO.
- Add role-based permissions for admin/member workflows.
- Expand Playwright coverage from responsive smoke checks into full browser-level CRUD and auth edge cases.
- Add full-text search for larger activity volume.
- Move to PostgreSQL if multi-user concurrency becomes important.
- Add field-level audit diffs if compliance requirements appear.
- Add OpenTelemetry-compatible structured tracing if deployed beyond local review.
