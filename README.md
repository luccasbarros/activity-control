# Activity Control

Local activity control system built with Next.js, React, TypeScript, Prisma, and SQLite.

The project was built with a Specification-Driven Development / Specification-Driven Tooling flow: the specification was written first, committed, then transformed into schema, validation, CRUD flows, filters, metrics, tests, and documentation.

## Run Locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

The SQLite database is stored at `prisma/dev.db`. The Prisma datasource uses a direct local SQLite path so the requested setup commands work without copying an `.env` file.

`npm install` runs `prisma generate` through `postinstall`, so TypeScript can resolve generated Prisma models immediately after dependency installation.

Seeded login:

- Email: `admin@example.com`
- Password: `ActivityControl123!`

## Optional Commands

```bash
npm run seed
npm test
npx playwright install chromium
npm run test:e2e
npm run lint
npm run build
npm run version:patch
```

Run `npx playwright install chromium` once before `npm run test:e2e` when the local machine does not already have the Playwright browser installed.

`npm run test:e2e` clears `.next` before starting Playwright so development and production build artifacts do not conflict.

`npx prisma migrate dev` also runs the seed command through `prisma.config.ts`.

## Optional Docker

Docker is optional. The primary setup path remains the local source workflow above.

```bash
docker compose up --build
```

The container applies migrations, seeds the local SQLite database, and starts Next.js on `http://localhost:3000`.

For local HTTP access, `docker-compose.yml` sets `AUTH_COOKIE_SECURE=false`. A real HTTPS deployment should set `AUTH_SECRET` to a private value and use secure cookies.

## Features

- Local sign-in with a seeded demo user
- Create activities
- List activities with server-side pagination
- Edit activities in a modal without losing list context
- Delete activities
- Filter by priority, category, team, and assignee
- Manage status: Pending, In progress, Done, Blocked
- Show created and updated timestamps
- Record recent create, update, and delete changes
- Route-based workspace navigation: dashboard, activities, new activity, and history
- Desktop sidebar, top account menu, and mobile bottom navigation
- Light/dark theme toggle
- Show confirmation toasts after create, update, delete, and validation errors
- Confirm destructive delete actions before submitting
- Seed representative local data
- Dashboard metrics, distribution charts, and alerts for blocked or critical work
- Structured server logs for auth and activity mutations
- Product version surfaced in the application shell
- Automated tests for validation, filters, pagination, navigation helpers, notifications, password hashing, session tokens, and change summaries
- Browser-level responsive checks with Playwright for login, dashboard navigation, edit modal, pagination, and toasts
- GitHub Actions CI for typecheck, tests, lint, build, migrations, seed, and Playwright
- Optional Docker runtime

## Specification-Driven Artifacts

- Specification: `docs/sdd-spec.md`
- Implementation plan: `docs/superpowers/plans/2026-06-09-activity-control.md`
- Product-maturity plan: `docs/superpowers/plans/2026-06-09-product-maturity.md`
- Architecture notes: `docs/architecture.md`
- AI/Skill evidence: `docs/ai-skill-usage.md`
- Security review: `docs/security-review.md`

## Architecture

The app uses the Next.js App Router with server-side data loading and Server Actions for mutations.

- `prisma/schema.prisma`: SQLite schema, enums, indexes, `Activity`, `User`, and `ActivityChange` models.
- `prisma/seed.ts`: local seed data.
- `src/lib/db.ts`: Prisma Client singleton.
- `src/lib/validation.ts`: shared Zod validation for create/update.
- `src/lib/filters.ts`: URL filter parsing and Prisma where-clause generation.
- `src/lib/pagination.ts`: page and page-size parsing with range calculation.
- `src/lib/navigation.ts`: safe return paths and query-message helpers.
- `src/lib/notifications.ts`: toast message mapping.
- `src/lib/metrics.ts`: dashboard metric calculation.
- `src/lib/logger.ts`: structured server logs for local observability.
- `src/lib/password.ts`: PBKDF2 password hashing for the seeded local account.
- `src/lib/session.ts`: signed session-token helper.
- `src/lib/auth.ts`: current-user lookup, session cookie, and route protection.
- `src/app/actions.ts`: create, update, and delete Server Actions.
- `src/app/login/*`: local login/logout flow.
- `src/app/(app)/layout.tsx`: authenticated application shell.
- `src/app/(app)/dashboard/page.tsx`: metrics, charts, alerts, and recent changes.
- `src/app/(app)/activities/page.tsx`: filters, paginated cards, edit modal, and delete flow.
- `src/app/(app)/activities/new/page.tsx`: dedicated create flow.
- `src/app/(app)/history/page.tsx`: operational change history.
- `src/components/*`: focused UI components.
- `.github/workflows/ci.yml`: repository verification workflow.

See `docs/architecture.md` for the request flow, boundaries, trade-offs, and future paths.

## Validation

Validation is enforced in two layers:

1. Browser-level constraints on form fields for fast user feedback.
2. Server-side Zod validation before writing to SQLite.

Prisma enums and the SQLite schema provide the persistence boundary. Tests cover required fields, invalid enum values, and combined filters.

## Verification Snapshot

The latest local verification covered:

```bash
npx prisma migrate reset --force
npx prisma migrate dev
npx tsc --noEmit
npm test
npx playwright install chromium
npm run test:e2e
npm run lint
npm run build
docker compose config
docker compose build
```

Seed verification after reset returned one demo user, six activities, and six activity-change records.

Runtime smoke check:

- `/` without a session redirects to `/login`;
- `/login` returns 200 and displays the seeded demo account.
- authenticated list pages render pagination state;
- confirmation toasts render from action query messages.
- Playwright responsive checks passed on desktop, tablet, and mobile viewports with no horizontal overflow across dashboard, activities, create, and history routes.
- Visual screenshots were reviewed for desktop and mobile shell behavior, including sidebar, top account menu, mobile bottom navigation, dashboard charts, and activity cards.

## AI / Skill Usage

AI assistance was used through a skill-guided workflow. The primary documented skill was `superpowers:writing-plans`, used to convert the committed specification into an implementation plan with files, tasks, test strategy, and commit boundaries.

Supporting skill-guided activities included `superpowers:test-driven-development` for validation/filter tests, `build-web-apps:frontend-testing-debugging` for responsive browser validation, and `superpowers:verification-before-completion` for final checks.

A sanitized project-specific security review skill is included at `docs/skills/activity-control-security-review/`. It documents the repeatable review workflow used for auth, sessions, Server Actions, validation, logging, Docker, CI, dependency audit, and public-repository hygiene. The resulting review is recorded in `docs/security-review.md`.

The skill-assisted workflow supported:

- converting the challenge prompt into a Markdown specification;
- planning the implementation in small commits;
- generating the first version of React components and Prisma schema;
- creating validation, filter, session, password, and change-summary tests;
- adding Playwright responsive smoke coverage for the main frontend routes and edit modal;
- adding a small authentication boundary and change-history model;
- reviewing documentation, Docker support, CI, local observability, and trade-offs.
- documenting a repeatable security review checklist for the project.

Planning assistance constrained scope, reviewed the generated code, kept the UI in English, chose local-first SQLite setup, and ran verification commands. See `docs/ai-skill-usage.md` for evidence.

## Trade-Offs

- Server Actions were used instead of API Routes because the app is a local App Router CRUD tool and does not need a public API surface.
- Tailwind CSS was used instead of ShadCN to keep the implementation focused on working behavior and documentation.
- Authentication was implemented as a small local boundary, not as a full identity platform. In a production internal tool, this would move to OAuth, SSO, or a managed identity provider.
- Docker was added as an optional runtime, but the primary path remains local source execution because that is the command sequence requested in the challenge.
- Lightweight change history was implemented for operational visibility. Full event sourcing or field-level audit trails were intentionally left out because they would be excessive for the scope.
- `npm audit fix --force` was not used because forcing major dependency changes close to delivery could create avoidable risk.

## Technical References

- Next.js App Router and Server Actions: https://nextjs.org/docs/app
- Prisma SQLite and migrations: https://www.prisma.io/docs/orm/overview/databases/sqlite
- Docker Compose: https://docs.docker.com/compose/

## Commit Flow

The commit history intentionally shows the SDD sequence:

1. Specification first.
2. Implementation plan.
3. Next.js scaffold.
4. Language decision.
5. Prisma/SQLite model.
6. Validation and filters with tests.
7. CRUD interface.
8. Documentation and final verification.
9. Product-maturity enhancements: local auth, change history, Docker, and architecture notes.
