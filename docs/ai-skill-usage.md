# AI and Skill Usage Evidence

## Summary

This project used an AI coding assistant with a skill-guided workflow to support Specification-Driven Development / Specification-Driven Tooling. The skill workflow helped transform the challenge prompt into a committed specification, implementation plan, Prisma model, validation tests, CRUD UI, and documentation.

## Skill-Guided Activities

| Activity | Assisted By | Output |
| --- | --- | --- |
| Requirement structuring | SDD/specification workflow | `docs/sdd-spec.md` |
| Implementation breakdown | planning workflow | `docs/superpowers/plans/2026-06-09-activity-control.md` |
| Data model drafting | Prisma/schema assistance | `prisma/schema.prisma` |
| Validation design | TDD/validation assistance | `src/lib/validation.ts`, `src/lib/validation.test.ts` |
| Filter design | TDD/filter assistance | `src/lib/filters.ts`, `src/lib/filters.test.ts` |
| UI generation | React/Next.js component assistance | `src/components/*`, `src/app/page.tsx` |
| Documentation | documentation assistance | `README.md`, `docs/technical-rationale.md` |
| Verification discipline | verification workflow | repeated `npm test`, `npm run lint`, `npm run build`, Prisma commands |

## Human Review Boundaries

The AI assistant did not define scope autonomously. Scope was constrained by the challenge prompt and by delivery risk.

Human-owned decisions:

- Keep all project artifacts in English.
- Use a direct local SQLite datasource so the expected commands work without extra setup.
- Use Server Actions instead of API Routes.
- Use Tailwind CSS instead of ShadCN.
- Include dashboard metrics and seed data as pragmatic differentiators.
- Skip authentication, Docker, and full audit history.
- Keep commits small and descriptive.

## Evidence In The Repository

- `docs/sdd-spec.md` was committed before scaffold implementation.
- `docs/superpowers/plans/2026-06-09-activity-control.md` maps specification items to files and tasks.
- Tests were written for validation and filters before the helper implementation.
- `docs/agent-submission.md` records continuation state so project memory does not depend only on chat context.
- Commit history shows the progression from specification to implementation.

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
