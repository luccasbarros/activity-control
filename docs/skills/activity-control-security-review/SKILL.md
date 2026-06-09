---
name: activity-control-security-review
description: Review the Activity Control Next.js technical-challenge app for practical security risks. Use when auditing or documenting security controls for auth, sessions, cookies, Server Actions, Prisma/SQLite, validation, logging, Docker, CI, dependency audit, public documentation, or pre-submission review.
---

# Activity Control Security Review

## Purpose

This project-specific skill defines a repeatable security review workflow for Activity Control. It is intentionally scoped to the local technical challenge: enough rigor to show product engineering maturity without adding production-only infrastructure.

## Review Rules

- Keep public artifacts technical and evaluator-safe.
- Use English for public code, documentation, schema names, UI text, commit messages, and security evidence.
- Do not include non-public preparation artifacts, non-public decision notes, machine-specific references, or continuation material.
- Treat every security claim as something that must be backed by code, tests, config, or verification output.

## Workflow

1. Rebuild context from the repository before judging risk:
   - `package.json`
   - `next.config.ts`
   - `src/app/actions.ts`
   - `src/app/login/actions.ts`
   - `src/lib/auth.ts`
   - `src/lib/session.ts`
   - `src/lib/password.ts`
   - `src/lib/validation.ts`
   - `src/lib/logger.ts`
   - `prisma/schema.prisma`
   - `prisma/seed.ts`
   - `Dockerfile`
   - `docker-compose.yml`
   - `.github/workflows/ci.yml`
   - `README.md`

2. Audit against `references/review-checklist.md`.

3. Classify each finding:
   - `Critical`: credential exposure, auth bypass, arbitrary data mutation, or public secret.
   - `High`: realistic session, redirect, authorization, or destructive-action risk.
   - `Medium`: missing hardening that matters for a local/internal app.
   - `Low`: documentation, hygiene, or future-production caveat.

4. Fix scoped issues immediately when the change is low-risk and aligned with the app scope.

5. Add or update tests when a security invariant becomes code:
   - session token signing, expiry, and tampering;
   - redirect sanitization;
   - validation boundaries;
   - action feedback messages;
   - password hashing behavior.

6. Run verification before reporting completion:
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm test`
   - `npm run build`
   - `npm run test:e2e`
   - `npm audit --omit=dev`

7. If the public repo changes, make a small descriptive commit and confirm CI.

## Output Shape

Lead with findings. For each finding include:

- severity;
- affected file;
- risk;
- recommended change;
- whether it was fixed.

If no material issue is found, say that clearly and list residual production caveats.

## Security Evidence

Prefer a concise public review document such as `docs/security-review.md` when a security pass needs durable evidence. It should include:

- scope;
- controls already implemented;
- findings and mitigations;
- residual trade-offs;
- verification commands;
- date of review.
