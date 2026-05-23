# Security

## Reporting

Security issues: email `karl@xube.io`. Please do not open public GitHub issues for exploitable bugs.

## Secret management

All secrets live in **one of two places**, never both:

| Secret | Location |
|--------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` (client-safe by design) |
| `CLERK_SECRET_KEY` | `.env.local` (server-only, never prefix with `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` |
| `CONVEX_DEPLOY_KEY` | `.env.local` (dev) / Vercel env (prod) |
| `CLERK_JWT_ISSUER_DOMAIN` | **Convex Dashboard** — Settings → Environment Variables |
| `CLERK_WEBHOOK_SECRET` | **Convex Dashboard** — Settings → Environment Variables |

`.env.local` is in `.gitignore` (line 34: `.env*`). Never commit it. `gitleaks` runs in CI to catch regressions (`.github/workflows/ci.yml`).

## Rotating secrets

If a key is exposed (or suspected exposed), rotate all of them as a batch:

1. **Clerk publishable + secret key** — Clerk Dashboard → API Keys → regenerate. Update `.env.local` and Vercel env. Any live user sessions are invalidated.
2. **Clerk webhook signing secret** — Clerk Dashboard → Webhooks → the Convex endpoint → Rotate Signing Secret. Paste the new value into **Convex Dashboard** env vars (NOT `.env.local` — webhook verification runs on Convex's runtime).
3. **Convex deploy key** — `bunx convex dev --configure` regenerates. Update Vercel env.

After rotation, confirm git history stayed clean:

```bash
git log --all --full-history -- .env.local
```

Expected output: empty. If anything shows, the file was committed at some point — rewrite history (`git filter-repo`) or treat as permanently compromised.

## Webhook verification

`convex/http.ts` verifies Svix signatures on every Clerk webhook. Signature failures return `401` and are logged (via Sentry if configured). Do not disable verification; the only acceptable change is to add more rigor (IP allow-listing, per-id rate limiting).

## Auth boundaries

- **Server-side enforcement is the only authority.** `proxy.ts` does UX routing (redirect-to-sign-in); it is not the security boundary. Every Convex public function that touches user data must call `getCurrentUserOrThrow` or `assertAdmin` from `convex/helpers.ts`.
- **Per-resource ownership check.** Mutations that edit a doc must verify `doc.userId === user._id` before `.patch()` / `.delete()`. See `convex/itineraries.ts` for the pattern.
- **`internal.*` for server-to-server.** Never use `api.*` inside Convex server code — that's the client-facing API and bypasses internal-only enforcement.

## Rate limiting

Public mutations that write user content are rate-limited via `convex/rateLimit.ts`. Keys MUST be keyed on authenticated identity (`user._id`) — never on user-supplied strings. A cron in `convex/crons.ts` prunes expired rows.

## File uploads

Photo uploads are double-validated: client checks MIME + size for UX; server checks `ctx.storage.getMetadata` for size, content-type, and rejects SVG (JS execution risk). Upload ownership is tracked in `tip_photo_uploads` (tips) and `photos` (destinations) — tips may only attach photos the current user uploaded.
