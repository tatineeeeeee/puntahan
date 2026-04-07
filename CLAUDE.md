@AGENTS.md

# puntahan — Philippine Travel Guide

Community-driven travel platform for the Philippines. Users browse, upvote, and share travel spots by region (NCR, Luzon, Visayas, Mindanao).

## Tech Stack

- **Next.js 16** (App Router) + React 19.2
- **Convex** — backend, database, file storage, real-time subscriptions
- **Clerk** — authentication, integrated with Convex via webhook
- **Tailwind CSS v4** — CSS-based `@theme` config in `globals.css`, NOT `tailwind.config.ts`
- **TypeScript** strict mode
- **Bun** — package manager & runtime. Always use `bun` / `bunx`, NEVER npm/npx

Convex backend lives at project root `convex/`, NOT inside `src/`.

## Commands

- `bun dev` — Next.js dev server
- `bunx convex dev` — Convex dev server (run in parallel with `bun dev`)
- `bun run build` — production build
- `bun run lint` — ESLint

---

## Hydration Rules (ZERO TOLERANCE)

These cause invisible bugs that break the app:

- **Never access `window`, `document`, `localStorage`, `navigator` during render** — only inside `useEffect`
- **Never use `Date.now()`, `Math.random()`, `new Date()` during render** — server/client values differ
- **Never conditionally render based on client-only state in first render** — use `useEffect` + `useState` to toggle after mount
- **Never nest `<div>` inside `<p>`, or `<a>` inside `<a>`** — invalid HTML = hydration mismatch
- **Always add `"use client"` to files using hooks, event handlers, or browser APIs**
- **Always add `suppressHydrationWarning` to `<html>` and `<body>` in root layout**
- **Use `useId()` for generated IDs** — not `crypto.randomUUID()` or `Math.random()`
- **Convex `useQuery`/`useMutation` require `"use client"`** — they are hooks

---

## Accessibility Rules

- **Toggle buttons MUST use `aria-pressed`** — visual styling alone is not enough for screen readers
- **Icon-only buttons MUST have `aria-label`** — no visible text means no accessible name
- **Expandable panels MUST use `aria-expanded`** — e.g., filter panels, dropdowns, mobile menus
- **All interactive elements must be keyboard-operable** — if it has `onClick`, it needs to work with Enter/Space too
- **Color alone must never convey meaning** — pair with icons or text (e.g., region badges use both color AND label)

---

## UX Input Rules

- **Number inputs must allow empty state** — never snap to a default value while the user is typing. Use `value={val || ""}` to show empty when value is the default
- **Always handle loading, error, AND empty states** — every `useQuery` result needs all three
- **Debounce rapid interactions** — search fields, filter changes, and buttons that trigger mutations

---

## Next.js 16 Breaking Changes

- `middleware.ts` is **deprecated** → use `proxy.ts` (runs on Node.js, not Edge). Export function name must be `proxy`
- `params` and `searchParams` are **async** → always `await params`, `await searchParams`
- `cookies()`, `headers()`, `draftMode()` are **async** → always `await` them
- Parallel routes require explicit `default.js` files — builds fail without them
- `images.remotePatterns` replaces `images.domains` (deprecated)
- Caching is **opt-in** via `"use cache"` directive — all dynamic code runs at request time by default

---

## Convex Rules

- **Never use `.filter()` on queries** — use `.withIndex()` or `.withSearchIndex()` (`.filter()` scans every document)
- **Limit `.collect()`** to small result sets (< 1000 docs) — use `.paginate()`, `.take()`, or indexes for large sets
- **Never use `Date.now()` in queries** — subscribed queries won't re-run when time changes
- **Never use `api.*` inside Convex functions** — use `internal.*` for server-to-server calls
- **All public functions must have argument validators** — clients can pass any value without them
- **Check `ctx.auth.getUserIdentity()` in every public function** that needs auth
- Use **internal functions** (`internalMutation`, `internalQuery`) for server-only logic
- Photo uploads: (1) get upload URL via mutation → (2) client uploads directly → (3) store storage ID

---

## Clerk + Convex Integration

- Provider order: `ClerkProvider` wraps outside → `ConvexProviderWithClerk` inside
- Use `Authenticated`, `Unauthenticated`, `AuthLoading` from `convex/react` — NOT Clerk equivalents
- Use `useConvexAuth()` for auth state — NOT Clerk's `useAuth()` for Convex operations
- `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, Convex URL
- **Convex Dashboard** (not .env.local): `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_WEBHOOK_SECRET`

---

## Tailwind v4 Rules

- Theme defined via `@theme` directive in `globals.css` — **no `tailwind.config.ts` exists**
- **Never use dynamic class names** (e.g., `` `text-${color}` ``) — Tailwind generates CSS statically
- **Don't create a `tailwind.config.ts`** — v4 uses CSS-based config only
- Design tokens are in `globals.css` — read it for colors, fonts, and spacing

---

## Code Quality Rules

- **Max ~300 lines per file** — split into smaller modules if exceeded
- **One component per file** — no multi-component files
- **Never use `any`** — use `unknown` and narrow, or proper Convex types (`Doc`, `Id`, `Infer`)
- **Never use `@ts-ignore` or `@ts-expect-error`** — fix the actual type issue
- Use `@/` path alias for all imports — never use relative imports that go up more than one level

---

## Security Rules

- **Never commit `.env.local`** — must be in `.gitignore`
- **Never hardcode API keys or secrets** in source code
- Server-only secrets (`CLERK_SECRET_KEY`) must never have `NEXT_PUBLIC_` prefix
- Convex server secrets go in **Convex Dashboard env vars**, not `.env.local`
- Users can only read/modify their own data — always filter by `userId` in queries

---

## Performance — Philippine Context

Target users are on LTE/3G in provinces, using mid-range Android devices:

- **Always use Next.js `<Image>`** — never raw `<img>`. Lazy loading and format optimization are non-negotiable
- **Skeleton loaders on all async data** — every `useQuery` result that can be `undefined` must show a skeleton
- **No heavy libraries without justification** — every dependency adds to bundle size
- **Optimize images for mobile** — use appropriate `sizes` prop, keep hero images under 200KB
