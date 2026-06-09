# AI and Skill Usage Evidence

## Summary

This project used an AI coding assistant with a skill-guided workflow to support Specification-Driven Development / Specification-Driven Tooling. The primary documented skill was `superpowers:writing-plans`, used to transform the committed specification into a concrete implementation plan.

Supporting skills were used for focused activities:

- `superpowers:test-driven-development` for validation/filter tests.
- `build-web-apps:frontend-testing-debugging` for responsive browser validation.
- `superpowers:verification-before-completion` for final evidence before completion claims.
- `activity-control-security-review` for a project-specific security review workflow.

The skill workflow helped transform the challenge prompt into a committed specification, implementation plan, Prisma model, validation tests, CRUD UI, local auth boundary, activity history, route-based app shell, dashboard charts, responsive browser checks, Docker support, CI, local observability, security review structure, and documentation.

## Skill-Guided Activities

| Activity | Assisted By | Output |
| --- | --- | --- |
| Requirement structuring | Specification workflow assisted by AI | `docs/sdd-spec.md` |
| Implementation breakdown | `superpowers:writing-plans` | `docs/superpowers/plans/2026-06-09-activity-control.md` |
| Data model drafting | Prisma/schema assistance | `prisma/schema.prisma` |
| Validation design | `superpowers:test-driven-development` | `src/lib/validation.ts`, `src/lib/validation.test.ts` |
| Filter and pagination design | `superpowers:test-driven-development` | `src/lib/filters.ts`, `src/lib/pagination.ts`, related tests |
| Feedback design | `superpowers:test-driven-development` | `src/lib/notifications.ts`, `src/components/toast.tsx` |
| Auth helper design | `superpowers:test-driven-development` | `src/lib/password.ts`, `src/lib/session.ts`, related tests |
| Activity history design | `superpowers:test-driven-development` | `src/lib/activity-change.ts`, `src/components/change-history.tsx` |
| Responsive frontend validation | `build-web-apps:frontend-testing-debugging` | `docs/design/*`, `src/components/app-shell.tsx`, `src/components/app-navigation.tsx`, `playwright.config.ts`, `tests/e2e/responsive.spec.ts` |
| Core browser flows | `superpowers:test-driven-development` | `tests/e2e/flows.spec.ts` |
| UI generation | React/Next.js component assistance | `src/components/*`, `src/app/(app)/*` |
| Docker runtime | implementation planning assistance | `Dockerfile`, `.dockerignore`, `docker-compose.yml` |
| CI and versioning | implementation planning assistance | `.github/workflows/ci.yml`, `package.json` version scripts |
| Local observability | implementation planning assistance | `src/lib/logger.ts`, structured log event constants |
| Security review workflow | `activity-control-security-review` | `docs/skills/activity-control-security-review/*`, `docs/security-review.md` |
| Documentation | documentation assistance | `README.md`, `docs/architecture.md`, `docs/ai-skill-usage.md`, `docs/design/*` |
| Verification discipline | `superpowers:verification-before-completion` | repeated `npm test`, `npm run lint`, `npm run build`, Prisma commands, Playwright checks |

## Review Boundaries

The AI assistant did not define scope autonomously. Scope was constrained by the challenge prompt, implementation risk, and verification evidence.

Review-owned decisions:

- Keep all project artifacts in English.
- Use a direct local SQLite datasource so the expected commands work without extra setup.
- Use Server Actions instead of API Routes.
- Use Tailwind CSS instead of ShadCN.
- Include dashboard metrics and seed data as pragmatic differentiators.
- Add local authentication as a small access boundary instead of a full identity platform.
- Add lightweight activity history instead of a full event-sourcing or audit-log system.
- Add Docker as an optional runtime while keeping source execution as the primary path.
- Use route-based navigation, a desktop sidebar, and mobile bottom navigation after reviewing the first mobile menu.
- Use CSS dashboard charts instead of adding a charting dependency.
- Use structured local logs instead of adding an external monitoring service.
- Add browser-level responsive checks because this is a frontend evaluation, while keeping them focused on high-value flows.
- Keep a project-specific security review skill in the repository as public evidence, while keeping non-public continuation material outside the repository.
- Keep commits small and descriptive.

## Evidence In The Repository

- `docs/sdd-spec.md` was committed before scaffold implementation.
- `docs/superpowers/plans/2026-06-09-activity-control.md` maps specification items to files and tasks.
- `docs/superpowers/plans/2026-06-09-product-maturity.md` records the later product-maturity enhancements and completion checks.
- Tests were written for validation and filters before the helper implementation.
- Additional tests cover password hashing, session token verification, pagination, navigation helpers, notifications, and activity change summaries.
- Playwright e2e coverage checks auth/logout, create/edit/delete, filter combinations, history evidence, security headers, route navigation, pagination, toast feedback, and horizontal overflow across desktop, tablet, and mobile widths.
- `docs/design/reference.md`, `docs/design/ui-decisions.md`, and `docs/design/responsive-checklist.md` record the UI direction and responsive acceptance checks.
- `docs/skills/activity-control-security-review/` records the security review workflow and checklist used for the project.
- `docs/security-review.md` records the security findings, mitigations, and residual trade-offs.
- `.github/workflows/ci.yml` records the repeatable repository verification flow.
- Commit history shows the progression from specification to implementation.
- The implementation plan now marks completed tasks with checked boxes, making the spec-to-code progression easier to audit.

## Verification Evidence

During development, these commands were run repeatedly:

```bash
npx prisma generate
npx prisma migrate status
npm run seed
npm audit --omit=dev
npx tsc --noEmit
npm test
npx playwright install chromium
npm run test:e2e
npm run lint
npm run build
docker compose config
docker compose build
```

The final verification commands are listed here and should be re-run before submission.

## Limitations

The AI usage is documented as assisted work, not as unchecked generation. Generated code and docs were reviewed through lint, tests, build, Prisma migration checks, and manual smoke testing.
