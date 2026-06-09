# Security Review

Review date: 2026-06-09

## Scope

This review used the project-specific skill in `docs/skills/activity-control-security-review/` and covered:

- authentication and session handling;
- cookie behavior;
- Server Actions and redirect handling;
- server-side validation;
- Prisma and SQLite data access;
- structured local logs;
- Docker runtime;
- CI verification;
- dependency audit;
- public repository hygiene.

## Material Findings

No critical or high-severity issue was found during this review.

## Fixed Findings

| Severity | Area | Finding | Mitigation |
| --- | --- | --- | --- |
| Medium | Session secret | The session helper used a demo fallback secret in every environment. | Production now requires an explicit `AUTH_SECRET`; the demo fallback only works outside production. |
| Medium | Session lifetime | Signed session payloads did not carry their own expiry. | Session tokens now include `expiresAt`, and verification rejects expired tokens. |
| Low | Cookie clearing | Logout deleted the cookie by name only. | Logout now clears the cookie with the same security attributes and `maxAge: 0`. |
| Low | Security headers | The app did not define security headers. | `next.config.ts` now sets frame, referrer, MIME sniffing, permissions, and limited CSP headers. |
| Low | Docker runtime | The production image ran as the default root user. | The runtime stage now copies files for the `node` user and runs as `USER node`. |
| Low | CI environment | CI did not set an explicit session secret. | CI now sets a demo-only `AUTH_SECRET` for repeatable verification. |

## Existing Controls

- All activity mutations require a current user through `requireCurrentUser()`.
- Login errors remain generic.
- Passwords are stored as PBKDF2 hashes with per-password salts.
- Activity form input is validated server-side with Zod.
- Priority, category, and status are constrained by Prisma enums and validation enums.
- Redirect targets are sanitized to local paths before mutation feedback redirects.
- Structured logs record action outcomes without password or token values.
- Delete actions require confirmation UI and use Server Actions instead of exposing a public API surface.
- `npm audit --omit=dev` is part of the verification flow.

## Residual Trade-Offs

- The seeded user is a documented local demo account. A deployed internal tool should use SSO, OAuth, or a managed identity provider.
- There is no rate limiting because the app is intended for local evaluation. A real deployment should add rate limiting at the edge or platform layer.
- The app uses local SQLite because the challenge expects local source execution. Production deployment would require backup, retention, and operational ownership decisions.
- Role-based authorization is intentionally minimal. The current app has a small authentication boundary, not a full multi-tenant permission model.
- The CSP is intentionally limited to low-risk directives so it does not break Next.js scripts during local evaluation.

## Verification Commands

Run before delivery:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```
