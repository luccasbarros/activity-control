# Activity Control SDD

Local activity control system built with Next.js, React, TypeScript, Prisma, and SQLite.

The project follows a Specification-Driven Development / Specification-Driven Tooling flow: the specification was written first, committed, then transformed into schema, validation, CRUD flows, filters, metrics, tests, and documentation.

## Run Locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

The SQLite database is stored at `prisma/dev.db`. The Prisma datasource uses a direct local SQLite path so the expected evaluator commands work without copying an `.env` file.

## Optional Commands

```bash
npm run seed
npm test
npm run lint
npm run build
```

`npx prisma migrate dev` also runs the seed command through `prisma.config.ts`.

## Features

- Create activities
- List activities
- Edit activities inline
- Delete activities
- Filter by priority, category, team, and assignee
- Manage status: Pending, In progress, Done, Blocked
- Show created and updated timestamps
- Seed representative local data
- Dashboard metrics for total, pending, in-progress, blocked, and done activities
- Automated tests for validation and filter behavior

## SDD/SDT Artifacts

- Specification: `docs/sdd-spec.md`
- Implementation plan: `docs/superpowers/plans/2026-06-09-activity-control.md`
- AI/Skill evidence: `docs/ai-skill-usage.md`
- Technical notes and trade-offs: `docs/technical-rationale.md`
- Resume-safe submission for continuation: `docs/agent-submission.md`

## Architecture

The app uses the Next.js App Router with server-side data loading and Server Actions for mutations.

- `prisma/schema.prisma`: SQLite schema, enums, indexes, and `Activity` model.
- `prisma/seed.ts`: local seed data.
- `src/lib/db.ts`: Prisma Client singleton.
- `src/lib/validation.ts`: shared Zod validation for create/update.
- `src/lib/filters.ts`: URL filter parsing and Prisma where-clause generation.
- `src/lib/metrics.ts`: dashboard metric calculation.
- `src/app/actions.ts`: create, update, and delete Server Actions.
- `src/app/page.tsx`: server-rendered dashboard, filters, form, and list composition.
- `src/components/*`: focused UI components.

## Validation

Validation is enforced in two layers:

1. Browser-level constraints on form fields for fast user feedback.
2. Server-side Zod validation before writing to SQLite.

Prisma enums and the SQLite schema provide the persistence boundary. Tests cover required fields, invalid enum values, and combined filters.

## AI / Skill Usage

AI assistance was used through a skill-guided workflow for:

- converting the challenge prompt into a Markdown specification;
- planning the implementation in small commits;
- generating the first version of React components and Prisma schema;
- creating validation and filter tests;
- reviewing documentation and trade-offs.

Human decisions constrained scope, reviewed the generated code, kept the UI in English, chose local-first SQLite setup, and ran verification commands. See `docs/ai-skill-usage.md` for evidence.

## Trade-Offs

- Server Actions were used instead of API Routes because the app is a local App Router CRUD tool and does not need a public API surface.
- Tailwind CSS was used instead of ShadCN to keep the deadline focused on working behavior and documentation.
- Authentication was intentionally skipped because it was not required and would add setup and data-model complexity.
- Docker was skipped because the expected run path is local source execution.
- A full audit-history feature was skipped; `createdAt` and `updatedAt` satisfy the required tracking and keep scope controlled.
- `npm audit fix --force` was not used because forcing major dependency changes close to delivery could create avoidable risk.

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
