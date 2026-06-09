# Architecture Notes

Activity Control is a local-first activity management app. The architecture keeps the challenge scope small while showing how the product could grow without rewriting the core.

## Request Flow

```text
Browser
  -> Next.js App Router
  -> Server Components for dashboard data
  -> Server Actions for mutations
  -> Auth boundary
  -> Prisma Client
  -> SQLite database file
```

The dashboard is server-rendered. Filters are encoded as URL query parameters, parsed on the server, and translated into Prisma `where` input. Mutations run through Server Actions and revalidate the dashboard after writes.

## Main Boundaries

| Boundary | Files | Responsibility |
| --- | --- | --- |
| UI composition | `src/app/page.tsx`, `src/components/*` | Render metrics, filters, forms, activities, and recent changes. |
| Authentication | `src/app/login/*`, `src/lib/auth.ts`, `src/lib/session.ts`, `src/lib/password.ts` | Seeded login, signed HTTP-only cookie, current-user lookup, logout. |
| Validation | `src/lib/validation.ts` | Validate required fields, lengths, and enum values before persistence. |
| Filtering | `src/lib/filters.ts` | Normalize query params and build Prisma filters. |
| Persistence | `prisma/schema.prisma`, `src/lib/db.ts` | Define SQLite schema, Prisma models, indexes, and client access. |
| Activity history | `src/lib/activity-change.ts`, `src/components/change-history.tsx` | Summarize create/update/delete events and render recent changes. |
| Verification | `src/lib/*.test.ts` | Cover logic that is easy to regress under a short deadline. |

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

Trade-off: this is intentionally not OAuth, SSO, RBAC, password reset, or invitation management. Those are valid next steps for a real company tool, but they would be oversized for this local technical challenge.

## Change History Decision

Recent changes are recorded from the same Server Actions that mutate activities.

Why this path:

- create/update/delete behavior stays centralized;
- history writes are transactional with activity writes;
- the dashboard can show auditability without introducing a separate event pipeline.

Trade-off: the history stores summaries, not a full before/after diff. A compliance-heavy product would need field-level diffs, actor permissions, retention rules, and possibly immutable append-only storage.

## SQLite And Prisma Decision

SQLite and Prisma directly satisfy the challenge. The Prisma datasource uses `file:./dev.db` so the requested evaluator commands work without creating an `.env` file.

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
- password hashing;
- session signing and tamper rejection;
- activity update summary generation.

Manual verification should cover the browser flow: login, create, edit, delete, filter, and recent changes.

## Future Paths

- Replace local auth with OAuth or SSO.
- Add role-based permissions for admin/member workflows.
- Add Playwright tests for browser-level CRUD and auth flows.
- Add pagination/search for larger activity volume.
- Move to PostgreSQL if multi-user concurrency becomes important.
- Add field-level audit diffs if compliance requirements appear.
