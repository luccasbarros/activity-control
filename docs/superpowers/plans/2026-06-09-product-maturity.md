# Product Maturity Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add small senior-level product engineering signals without making the activity control app unnecessarily complex.

**Architecture:** Keep the app local-first. Add a simple auth boundary with a seeded user and signed cookie, record lightweight activity changes from Server Actions, provide optional Docker execution, and document the architecture/trade-offs.

**Tech Stack:** Next.js App Router, React, TypeScript, Prisma, SQLite, Tailwind CSS, Vitest, Docker.

---

### Task 1: Spec And Plan

**Files:**
- Modify: `docs/sdd-spec.md`
- Create: `docs/superpowers/plans/2026-06-09-product-maturity.md`

- [x] Add product-maturity enhancements to the SDD spec.
- [x] Create this implementation plan.
- [x] Commit as `docs: specify product maturity enhancements`.

### Task 2: Local Authentication

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Create: `src/lib/password.ts`
- Create: `src/lib/password.test.ts`
- Create: `src/lib/session.ts`
- Create: `src/lib/session.test.ts`
- Create: `src/lib/auth.ts`
- Create: `src/app/login/page.tsx`
- Create: `src/app/login/actions.ts`
- Modify: `src/app/page.tsx`

- [x] Write password hashing and session token tests first.
- [x] Add `User` and `UserRole` to Prisma.
- [x] Generate a migration.
- [x] Seed a demo user.
- [x] Implement login/logout and protect the dashboard.
- [x] Verify expected commands still work.
- [x] Commit as `feat: add local auth and activity history`.

### Task 3: Activity Change History

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `src/lib/activity-change.ts`
- Create: `src/lib/activity-change.test.ts`
- Modify: `src/app/actions.ts`
- Create: `src/components/change-history.tsx`
- Modify: `src/app/page.tsx`

- [x] Write change-summary tests first.
- [x] Add `ActivityChange` and `ActivityChangeType` to Prisma.
- [x] Generate a migration.
- [x] Record create, update, and delete events from Server Actions.
- [x] Render recent changes on the dashboard.
- [x] Commit as `feat: add local auth and activity history`.

### Task 4: Docker Support

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `docker-compose.yml`
- Modify: `package.json`
- Modify: `README.md`

- [ ] Add a production start script.
- [ ] Add optional Docker build/run files.
- [ ] Document Docker as optional, not the primary evaluator path.
- [ ] Commit as `chore: add optional docker runtime`.

### Task 5: Architecture And Verification Docs

**Files:**
- Create: `docs/architecture.md`
- Modify: `README.md`
- Modify: `docs/ai-skill-usage.md`
- Modify: `docs/agent-submission.md`
- Modify: `docs/superpowers/plans/2026-06-09-product-maturity.md`

- [ ] Add concise architecture documentation.
- [ ] Update README with auth, history, Docker, references, and verification.
- [ ] Update skill evidence to include architecture/documentation assistance.
- [ ] Mark this plan complete.
- [ ] Run `npm test`, `npm run lint`, `npm run build`, and Prisma migration checks.
- [ ] Commit as `docs: document architecture and verification`.
