# AI and Skill Usage Evidence

## Summary

This project used an AI coding assistant with a skill-guided workflow to support Specification-Driven Development / Specification-Driven Tooling. The primary documented skill was `superpowers:writing-plans`, used to transform the committed specification into a concrete implementation plan.

Supporting skills were used for focused activities:

- `superpowers:test-driven-development` for validation/filter tests.
- `superpowers:verification-before-completion` for final evidence before completion claims.

The skill workflow helped transform the challenge prompt into a committed specification, implementation plan, Prisma model, validation tests, CRUD UI, local auth boundary, activity history, Docker support, and documentation.

## Skill-Guided Activities

| Activity | Assisted By | Output |
| --- | --- | --- |
| Requirement structuring | Specification workflow assisted by AI | `docs/sdd-spec.md` |
| Implementation breakdown | `superpowers:writing-plans` | `docs/superpowers/plans/2026-06-09-activity-control.md` |
| Data model drafting | Prisma/schema assistance | `prisma/schema.prisma` |
| Validation design | `superpowers:test-driven-development` | `src/lib/validation.ts`, `src/lib/validation.test.ts` |
| Filter design | `superpowers:test-driven-development` | `src/lib/filters.ts`, `src/lib/filters.test.ts` |
| Auth helper design | `superpowers:test-driven-development` | `src/lib/password.ts`, `src/lib/session.ts`, related tests |
| Activity history design | `superpowers:test-driven-development` | `src/lib/activity-change.ts`, `src/components/change-history.tsx` |
| UI generation | React/Next.js component assistance | `src/components/*`, `src/app/page.tsx` |
| Docker runtime | implementation planning assistance | `Dockerfile`, `.dockerignore`, `docker-compose.yml` |
| Documentation | documentation assistance | `README.md`, `docs/architecture.md`, `docs/ai-skill-usage.md` |
| Verification discipline | `superpowers:verification-before-completion` | repeated `npm test`, `npm run lint`, `npm run build`, Prisma commands |

## Human Review Boundaries

The AI assistant did not define scope autonomously. Scope was constrained by the challenge prompt and by delivery risk.

Human-owned decisions:

- Keep all project artifacts in English.
- Use a direct local SQLite datasource so the expected commands work without extra setup.
- Use Server Actions instead of API Routes.
- Use Tailwind CSS instead of ShadCN.
- Include dashboard metrics and seed data as pragmatic differentiators.
- Add local authentication as a small access boundary instead of a full identity platform.
- Add lightweight activity history instead of a full event-sourcing or audit-log system.
- Add Docker as an optional runtime while keeping source execution as the primary path.
- Keep commits small and descriptive.

## Evidence In The Repository

- `docs/sdd-spec.md` was committed before scaffold implementation.
- `docs/superpowers/plans/2026-06-09-activity-control.md` maps specification items to files and tasks.
- `docs/superpowers/plans/2026-06-09-product-maturity.md` records the later product-maturity enhancements and completion checks.
- Tests were written for validation and filters before the helper implementation.
- Additional tests cover password hashing, session token verification, and activity change summaries.
- `docs/agent-submission.md` records continuation state so project memory does not depend only on chat context.
- Commit history shows the progression from specification to implementation.
- The implementation plan now marks completed tasks with checked boxes, making the spec-to-code progression easier to audit.

## Verification Evidence

During development, these commands were run repeatedly:

```bash
npx prisma generate
npx prisma migrate status
npm run seed
npm test
npm run lint
npm run build
```

The final verification commands are documented in the final submission and should be re-run before submission.

## Limitations

The AI usage is documented as assisted work, not as unchecked generation. Generated code and docs were reviewed through lint, tests, build, Prisma migration checks, and manual smoke testing.
