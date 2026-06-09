# Product Maturity Enhancement Plan

> Internal implementation checklist kept to show SDD/SDT traceability from plan to implementation.

**Goal:** Add focused product enhancements that support a realistic internal activity workflow while keeping the local setup simple.

**Architecture:** Keep the app local-first. Add a simple auth boundary with a seeded user and signed cookie, record lightweight activity changes from Server Actions, provide optional Docker execution, and document the architecture/trade-offs.

**Tech Stack:** Next.js App Router, React, TypeScript, Prisma, SQLite, Tailwind CSS, Vitest, Playwright, Docker.

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

- [x] Add a production start script.
- [x] Add optional Docker build/run files.
- [x] Document Docker as optional, not the primary source setup path.
- [x] Commit as `chore: add optional docker runtime`.

### Task 5: Architecture And Verification Docs

**Files:**
- Create: `docs/architecture.md`
- Modify: `README.md`
- Modify: `docs/ai-skill-usage.md`
- Modify: `docs/agent-submission.md`
- Modify: `docs/superpowers/plans/2026-06-09-product-maturity.md`

- [x] Add concise architecture documentation.
- [x] Update README with auth, history, Docker, references, and verification.
- [x] Update skill evidence to include architecture/documentation assistance.
- [x] Mark this plan complete.
- [x] Run `npm test`, `npm run lint`, `npm run build`, and Prisma migration checks.
- [x] Commit as `docs: document architecture and verification`.

### Task 6: Section Navigation And Responsive E2E

**Files:**
- Create: `src/components/section-navigation.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/metric-cards.tsx`
- Modify: `src/components/change-history.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/e2e/responsive.spec.ts`
- Modify: `README.md`
- Modify: `docs/sdd-spec.md`
- Modify: `docs/architecture.md`
- Modify: `docs/ai-skill-usage.md`

- [x] Add stable section anchors for Overview, Recent changes, Create activity, and Activity list.
- [x] Add a responsive dashboard section menu.
- [x] Validate the menu in mobile Playwright coverage.
- [x] Confirm screenshots do not show horizontal overflow.
