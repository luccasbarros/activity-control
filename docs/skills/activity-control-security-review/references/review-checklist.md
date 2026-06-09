# Activity Control Security Checklist

## Authentication And Sessions

- Require an authenticated user for all app routes and Server Actions.
- Keep login errors generic.
- Use `httpOnly`, `sameSite`, `path`, and secure-cookie behavior intentionally.
- Avoid a predictable session signing secret in production.
- Verify signed session tokens reject tampering and expiry.
- Clear cookies with matching options where possible.
- Do not log passwords, tokens, salts, hashes, or raw cookies.

## Server Actions And Redirects

- Treat `FormData` as untrusted input.
- Validate all submitted fields server-side.
- Do not trust client-provided activity IDs without authorization checks.
- Prevent open redirects from any `returnTo`, `next`, or query-driven navigation.
- Revalidate only the needed routes after mutation.
- Use generic user-facing errors for failures that could disclose internals.

## Data Model And Prisma

- Keep enums constrained in Prisma and validation code.
- Use length limits for user-entered text fields.
- Avoid storing secrets in seed data beyond documented demo credentials.
- Confirm destructive operations are scoped and intentional.
- Check relations for expected cascade behavior.

## Frontend Safety

- Avoid `dangerouslySetInnerHTML`.
- Render user-entered strings as text.
- Keep delete actions behind confirmation UI.
- Show success/error toasts without leaking internal exception details.
- Keep accessibility and mobile behavior intact after hardening.

## Logging And Observability

- Emit structured logs for important actions.
- Include event type, actor ID, and target ID when useful.
- Avoid sensitive payloads.
- Keep local logs simple; do not introduce external monitoring dependencies unless explicitly requested.

## Dependencies And CI

- Run `npm audit --omit=dev`.
- Pin and review dependency changes.
- Keep CI running lint, typecheck, tests, build, and e2e coverage.
- Avoid `npm audit fix --force` unless the resulting dependency changes are reviewed.

## Docker And Runtime

- Keep Docker optional if source execution is the required evaluation path.
- Document demo-only environment values.
- Prefer non-root runtime user when practical.
- Keep production caveats explicit: real `AUTH_SECRET`, HTTPS, secure cookies, managed identity if deployed.

## Public Repository Hygiene

- Do not commit non-public preparation artifacts, machine-specific references, non-public notes, or continuation material.
- Keep public documentation technical and evaluator-safe.
- Keep all public-facing strings in English.
