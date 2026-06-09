# Activity Control

Local activity control system built with Next.js, React, TypeScript, Prisma, and SQLite.

The project was built with a Specification-Driven Development / Specification-Driven Tooling flow: the specification was written first, committed, then transformed into schema, validation, CRUD flows, filters, metrics, tests, and documentation.

Product name: Activity Control. SDD/SDT is the delivery method used to design, implement, and verify the application.

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
npm run lint
npm run build
```

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
- List activities
- Edit activities inline
- Delete activities
- Filter by priority, category, team, and assignee
- Manage status: Pending, In progress, Done, Blocked
- Show created and updated timestamps
- Record recent create, update, and delete changes
- Seed representative local data
- Dashboard metrics for total, pending, in-progress, blocked, and done activities
- Automated tests for validation, filters, password hashing, session tokens, and change summaries
- Optional Docker runtime

## Specification-Driven Artifacts

- Specification: `docs/sdd-spec.md`
- Implementation plan: `docs/superpowers/plans/2026-06-09-activity-control.md`
- Product-maturity plan: `docs/superpowers/plans/2026-06-09-product-maturity.md`
- Architecture notes: `docs/architecture.md`
- AI/Skill evidence: `docs/ai-skill-usage.md`
- Resume-safe submission for continuation: `docs/agent-submission.md`

## Architecture

The app uses the Next.js App Router with server-side data loading and Server Actions for mutations.

- `prisma/schema.prisma`: SQLite schema, enums, indexes, `Activity`, `User`, and `ActivityChange` models.
- `prisma/seed.ts`: local seed data.
- `src/lib/db.ts`: Prisma Client singleton.
- `src/lib/validation.ts`: shared Zod validation for create/update.
- `src/lib/filters.ts`: URL filter parsing and Prisma where-clause generation.
- `src/lib/metrics.ts`: dashboard metric calculation.
- `src/lib/password.ts`: PBKDF2 password hashing for the seeded local account.
- `src/lib/session.ts`: signed session-token helper.
- `src/lib/auth.ts`: current-user lookup, session cookie, and route protection.
- `src/app/actions.ts`: create, update, and delete Server Actions.
- `src/app/login/*`: local login/logout flow.
- `src/app/page.tsx`: server-rendered dashboard, filters, form, and list composition.
- `src/components/*`: focused UI components.

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
npm run lint
npm run build
docker compose config
docker compose build
```

Seed verification after reset returned one demo user, six activities, and six activity-change records.

Runtime smoke check:

- `/` without a session redirects to `/login`;
- `/login` returns 200 and displays the seeded demo account.

## AI / Skill Usage

AI assistance was used through a skill-guided workflow. The primary documented skill was `superpowers:writing-plans`, used to convert the committed specification into an implementation plan with files, tasks, test strategy, and commit boundaries.

Supporting skill-guided activities included `superpowers:test-driven-development` for validation/filter tests and `superpowers:verification-before-completion` for final checks.

The skill-assisted workflow supported:

- converting the challenge prompt into a Markdown specification;
- planning the implementation in small commits;
- generating the first version of React components and Prisma schema;
- creating validation, filter, session, password, and change-summary tests;
- adding a small authentication boundary and change-history model;
- reviewing documentation, Docker support, and trade-offs.

Human decisions constrained scope, reviewed the generated code, kept the UI in English, chose local-first SQLite setup, and ran verification commands. See `docs/ai-skill-usage.md` for evidence.

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
