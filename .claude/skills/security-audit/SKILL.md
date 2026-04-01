---
name: security-audit
description: Audit code for security vulnerabilities — auth bypasses, missing validation, exposed secrets, unsafe data handling. Use when reviewing Convex functions, API routes, or auth flows.
---

Perform a full security audit on the codebase or specified files. If no file is specified, audit the entire project.

## Audit Checklist

### Authentication & Authorization
- Every public Convex mutation/query that touches user data calls `ctx.auth.getUserIdentity()`
- `getUserIdentity()` result is checked for `null` before proceeding
- Admin-only functions verify `role: "admin"` from the `users` table — never trust client claims
- No Convex `api.*` used inside server functions — must use `internal.*`
- Webhook handler (`convex/http.ts`) verifies Svix signatures before processing
- Clerk `proxy.ts` protects private routes (submit, profile, admin)

### Row-Level Security (RLS)
- Users can only read their own private data (filter by `userId === identity.subject`)
- Users can only modify their own tips — mutations check ownership before `.patch()`/`.delete()`
- Vote mutations enforce one-vote-per-user via `by_user_tip` index check
- Admin bypasses are explicit and auditable (check role, then proceed)
- `internalMutation`/`internalQuery` used for all server-only operations

### Input Validation
- All public Convex functions have `args` validators using `v.*` — no missing validators
- String inputs have reasonable max lengths (prevent abuse)
- File uploads validate type (images only) and size before accepting
- No raw user input rendered as HTML (XSS prevention)
- Budget amounts validated as positive numbers within reasonable range

### Secrets & Environment
- `.env.local` is in `.gitignore` — never committed
- No API keys, tokens, or secrets hardcoded in source files
- `CLERK_SECRET_KEY` does NOT have `NEXT_PUBLIC_` prefix
- Server-only Convex secrets are in Convex Dashboard, not `.env.local`
- No secrets logged to console in production

### Data Exposure
- Convex queries don't return more data than the client needs
- Internal user fields (role, email) not exposed in public destination/tip queries unless necessary
- Error messages don't leak internal details (stack traces, DB structure)
- No `console.log` of sensitive data (tokens, passwords, user details)

### Dependencies
- Check for known vulnerable packages: `bun audit` or `bunx npm-audit`
- `svix` used for webhook verification (not custom HMAC)
- No unused dependencies that increase attack surface

## Output Format

### Critical (must fix before deploy)
- [Issue]: [Location] — [Impact] — [Fix]

### Warnings (should fix)
- [Issue]: [Location] — [Impact] — [Fix]

### Passed Checks
- List what passed so we know coverage is complete
