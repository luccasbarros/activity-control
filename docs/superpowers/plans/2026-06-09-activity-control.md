# Activity Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

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

- [ ] Install Next.js, React, TypeScript, Tailwind, Prisma, Zod, Vitest.
- [ ] Add scripts: `dev`, `build`, `lint`, `test`, `seed`.
- [ ] Create the App Router base layout and first page.
- [ ] Commit as `chore: scaffold next activity control app`.

### Task 2: Prisma Data Layer

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/options.ts`

- [ ] Define the `Activity` model and enums from `docs/sdd-spec.md`.
- [ ] Configure SQLite datasource with `DATABASE_URL`.
- [ ] Add representative seed records covering all statuses and priorities.
- [ ] Run `npx prisma migrate dev --name init`.
- [ ] Commit as `feat: add prisma sqlite activity model`.

### Task 3: Validation and Filtering

**Files:**
- Create: `src/lib/validation.ts`
- Create: `src/lib/filters.ts`
- Create: `src/lib/metrics.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/validation.test.ts`
- Create: `src/lib/filters.test.ts`

- [ ] Write tests for required fields and invalid enum values.
- [ ] Watch tests fail before implementation.
- [ ] Implement Zod validation shared by create/update actions.
- [ ] Write tests for combined filters.
- [ ] Implement Prisma where-clause filter parsing.
- [ ] Commit as `feat: add activity validation and filters`.

### Task 4: CRUD and Dashboard UI

**Files:**
- Create: `src/app/actions.ts`
- Create: `src/components/activity-form.tsx`
- Create: `src/components/activity-table.tsx`
- Create: `src/components/filter-bar.tsx`
- Create: `src/components/metric-cards.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] Implement Server Actions for create, update, and delete.
- [ ] Build a responsive form with create/edit modes.
- [ ] Build filter controls using URL query parameters.
- [ ] Build a table/list with status, priority, dates, edit, and delete controls.
- [ ] Build metric cards from server-derived counts.
- [ ] Commit as `feat: implement activity crud interface`.

### Task 5: Documentation and Evidence

**Files:**
- Create: `README.md`
- Create: `docs/ai-skill-usage.md`
- Create: `docs/technical-rationale.md`

- [ ] Document setup commands exactly as expected by the evaluator.
- [ ] Explain architecture, validation, Prisma/SQLite, and trade-offs.
- [ ] Record skill/AI usage with human review boundaries.
- [ ] Add technical rationale notes: why each major choice was made, trade-offs, and alternatives.
- [ ] Commit as `docs: add setup ai evidence and technical notes`.

### Task 6: Final Verification

**Commands:**
- `npm run lint`
- `npm test`
- `npm run build`
- `npx prisma migrate reset --force`
- `npm run dev`

- [ ] Verify app runs locally.
- [ ] Verify create/edit/delete/filter manually.
- [ ] Verify seed data appears after migration reset.
- [ ] Commit final fixes if needed.
