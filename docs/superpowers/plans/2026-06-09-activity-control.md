# Activity Control Implementation Plan

> Internal implementation checklist kept to show SDD/SDT traceability from plan to implementation.

**Goal:** Build a local Next.js/React/TypeScript activity control app backed by SQLite/Prisma and traceable to `docs/sdd-spec.md`.

**Architecture:** Use the Next.js App Router with Server Components for reading data and Server Actions for mutations. Keep Prisma access in `src/lib/db.ts`, validation in `src/lib/validation.ts`, filter parsing in `src/lib/filters.ts`, and UI composition in small components under `src/components`.

**Tech Stack:** Next.js, React, TypeScript, Prisma, SQLite, Zod, Tailwind CSS, Vitest.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `.gitignore`

- [x] Install Next.js, React, TypeScript, Tailwind, Prisma, Zod, Vitest.
- [x] Add scripts: `dev`, `build`, `lint`, `test`, `seed`.
- [x] Create the App Router base layout and first page.
- [x] Commit as `chore: scaffold next activity control app`.

### Task 2: Prisma Data Layer

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/options.ts`

- [x] Define the `Activity` model and enums from `docs/sdd-spec.md`.
- [x] Configure local SQLite datasource.
- [x] Add representative seed records covering all statuses and priorities.
- [x] Run `npx prisma migrate dev --name init`.
- [x] Commit as `feat: add prisma sqlite activity model`.

### Task 3: Validation and Filtering

**Files:**
- Create: `src/lib/validation.ts`
- Create: `src/lib/filters.ts`
- Create: `src/lib/metrics.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/validation.test.ts`
- Create: `src/lib/filters.test.ts`

- [x] Write tests for required fields and invalid enum values.
- [x] Watch tests fail before implementation.
- [x] Implement Zod validation shared by create/update actions.
- [x] Write tests for combined filters.
- [x] Implement Prisma where-clause filter parsing.
- [x] Commit as `feat: add activity validation and filters`.

### Task 4: CRUD and Dashboard UI

**Files:**
- Create: `src/app/actions.ts`
- Create: `src/components/activity-form.tsx`
- Create: `src/components/activity-table.tsx`
- Create: `src/components/filter-bar.tsx`
- Create: `src/components/metric-cards.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [x] Implement Server Actions for create, update, and delete.
- [x] Build a responsive form with create/edit modes.
- [x] Build filter controls using URL query parameters.
- [x] Build a table/list with status, priority, dates, edit, and delete controls.
- [x] Build metric cards from server-derived counts.
- [x] Commit as `feat: implement activity crud interface`.

### Task 5: Documentation and Evidence

**Files:**
- Create: `README.md`
- Create: `docs/ai-skill-usage.md`

- [x] Document setup commands exactly as requested.
- [x] Explain architecture, validation, Prisma/SQLite, and trade-offs.
- [x] Record skill/AI usage with human review boundaries.
- [x] Commit as `docs: add setup and ai evidence`.

### Task 6: Final Verification

**Commands:**
- `npm run lint`
- `npm test`
- `npm run build`
- `npx prisma migrate reset --force`
- `npm run dev`

- [x] Verify app runs locally.
- [x] Verify create/edit/delete/filter via smoke checks and code-path verification.
- [x] Verify seed data appears after migration reset.
- [x] Commit final fixes if needed.
