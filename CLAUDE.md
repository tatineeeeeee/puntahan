@AGENTS.md

# puntahan — Philippine Travel Guide

A community-driven travel platform for discovering destinations across the Philippines. Users browse, upvote, and share travel spots organized by region (NCR, Luzon, Visayas, Mindanao).

## Tech Stack

- **Next.js 16** (App Router) + React 19.2
- **Convex** — backend, database, file storage, real-time subscriptions
- **Clerk** — authentication, integrated with Convex via webhook
- **Tailwind CSS v4** — CSS-based `@theme` config in `globals.css`, NOT `tailwind.config.ts`
- **TypeScript** strict mode
- **Bun** — package manager & runtime. Always use `bun` / `bunx`, NEVER npm/npx

## Project Structure

```
├── src/
│   ├── app/            # Next.js App Router pages & layouts
│   ├── components/     # React components
│   └── lib/            # Shared utilities, helpers
├── convex/             # Convex backend (schemas, queries, mutations, actions)
│   └── _generated/     # Auto-generated — never edit manually
├── public/             # Static assets
└── globals.css         # Tailwind v4 theme via @theme directive
```

Convex backend lives at project root `convex/`, NOT inside `src/`.

## Commands

- `bun dev` — Next.js dev server
- `bunx convex dev` — Convex dev server (run in parallel with `bun dev`)
- `bun run build` — production build
- `bun run lint` — ESLint

## Quality Slash Commands

- `/frontend-check` — Review components for hydration errors, React patterns, performance, Next.js 16 rules
- `/backend-check` — Review Convex functions for query efficiency, mutation safety, schema design
- `/security-audit` — Audit auth, RLS, input validation, secrets exposure, data handling
- `/ux-review` — Review accessibility, responsive design, design system compliance, UX patterns
- `/hydration-check` — Scan client components for hydration mismatch risks

---

## Hydration Rules (ZERO TOLERANCE)

These cause invisible bugs that break the app. Never write code that triggers hydration mismatch:

- **Never access `window`, `document`, `localStorage`, `navigator` during render** — only inside `useEffect`
- **Never use `Date.now()`, `Math.random()`, `new Date()` during render** — server/client values differ
- **Never conditionally render based on client-only state in first render** — use `useEffect` + `useState` to toggle after mount
- **Never nest `<div>` inside `<p>`, or `<a>` inside `<a>`** — invalid HTML = hydration mismatch
- **Always add `"use client"` to files using hooks, event handlers, or browser APIs**
- **Always add `suppressHydrationWarning` to `<html>` and `<body>` in root layout** — prevents extension-injected attribute mismatches
- **Use `useId()` for generated IDs** — not `crypto.randomUUID()` or `Math.random()`
- **Convex `useQuery`/`useMutation` require `"use client"`** — they are hooks

Run `/hydration-check` after creating or modifying any client component.

---

## Next.js 16 Rules

### Breaking Changes from 15 → 16

- `middleware.ts` is **deprecated** → use `proxy.ts` (runs on Node.js runtime, not Edge)
- `params` and `searchParams` are **async** → always `await params`, `await searchParams`
- `cookies()`, `headers()`, `draftMode()` are **async** → always `await` them
- Turbopack is the **default bundler** — no config needed
- Parallel routes require explicit `default.js` files — builds fail without them
- `images.remotePatterns` replaces `images.domains` (deprecated)
- AMP support fully removed
- `serverRuntimeConfig` / `publicRuntimeConfig` removed → use `.env` files
- `experimental.ppr` removed → use `cacheComponents` config instead

### Proxy (formerly Middleware)

```ts
// src/proxy.ts — NOT middleware.ts
export default function proxy(request: NextRequest) { ... }
```

- Export function name must be `proxy`, not `middleware`
- Runs on Node.js runtime (not Edge)
- `middleware.ts` still works but is deprecated and will be removed

### Caching

- All dynamic code runs at request time by default — caching is **opt-in** via `"use cache"` directive
- Enable Cache Components: `cacheComponents: true` in `next.config.ts`
- `revalidateTag()` now needs a second arg: `revalidateTag('tag', 'max')`
- Use `updateTag()` in Server Actions for read-your-writes semantics
- Use `refresh()` in Server Actions to refresh uncached data

### React 19.2 Features Available

- View Transitions via `<ViewTransition>`
- `useEffectEvent()` for non-reactive effect logic
- `<Activity>` for background rendering with maintained state
- React Compiler support (opt-in via `reactCompiler: true` in next.config)

---

## Convex Rules

### Queries & Mutations

- **Always await all promises** — use `no-floating-promises` ESLint rule
- **Never use `.filter()` on queries** — use `.withIndex()` or `.withSearchIndex()` instead (`.filter()` scans every document)
- **Limit `.collect()`** to small result sets (< 1000 docs) — use `.paginate()`, `.take()`, or indexes for large sets
- **Remove redundant indexes** — if you have `by_foo` and `by_foo_and_bar`, only keep `by_foo_and_bar`
- **Never use `Date.now()` in queries** — subscribed queries won't re-run when time changes. Pass time from client or use scheduled functions
- **Never use `api.*` inside Convex functions** — use `internal.*` for server-to-server calls
- **Keep query/mutation handlers thin** — put logic in plain TypeScript helper functions (easier to test and refactor)

### Schema & Types

- Define schema early — without it, database methods return `Promise<any>`
- Use `Doc<"tableName">` and `Id<"tableName">` from `convex/_generated/dataModel`
- Use `Infer<typeof validator>` to derive types from validators — don't duplicate type definitions
- Use `WithoutSystemFields` when inserting/updating documents
- Always pass table name as first arg to `ctx.db.get()`, `.patch()`, `.replace()`, `.delete()`

### Security

- **All public functions must have argument validators** — clients can pass any value without them
- **Check `ctx.auth.getUserIdentity()` in every public function** that needs auth
- Use **internal functions** (`internalMutation`, `internalQuery`) for server-only logic — they can't be called from clients
- Create granular mutations (`setTeamOwner`, `setTeamName`) instead of broad ones (`updateTeam`)
- Never use spoofable identifiers (email) for access control — use Convex IDs or Clerk user IDs

### Actions

- Only use `runAction` when you need Node.js-specific libraries — prefer plain TypeScript functions
- Don't chain `ctx.runMutation` + `ctx.runQuery` separately in actions — combine into a single call for consistency (separate calls may not be consistent with each other)

### File Storage

- Photo uploads use Convex built-in file storage
- Flow: (1) call mutation to get upload URL → (2) client uploads file directly → (3) store returned storage ID in document

---

## Clerk Rules

### Integration with Convex

- Provider order: `ClerkProvider` wraps outside → `ConvexProviderWithClerk` inside
- Import `ConvexProviderWithClerk` from `convex/react-clerk`
- Use `Authenticated`, `Unauthenticated`, `AuthLoading` from `convex/react` — NOT Clerk equivalents
- Use `useConvexAuth()` to check auth state — NOT Clerk's `useAuth()` for Convex operations

### Auth Config

```ts
// convex/auth.config.ts
export default {
  providers: [{
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
    applicationID: "convex",
  }],
};
```

### Webhook

- Path: `/clerk-users-webhook`
- Events: `user.created`, `user.updated`, `user.deleted`
- Verify with `svix` library (needs `bun add svix`)
- Handler uses `httpAction` in `convex/http.ts`
- Use `internalMutation` for upsert/delete — webhook handler calls `ctx.runMutation(internal.users.upsertFromClerk, ...)`

### Server-Side Helpers

- `auth()` — get session/user data in Server Components and Route Handlers
- `currentUser()` — get full user object server-side
- `clerkMiddleware()` — goes in `proxy.ts` for route protection

### Client Hooks

- `useUser()` — current user data
- `useAuth()` — auth state (but prefer `useConvexAuth()` when working with Convex)
- `<SignInButton>`, `<UserButton>` — prebuilt UI components

### Environment Variables

- `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, Convex URL
- **Convex Dashboard** (not .env.local): `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_WEBHOOK_SECRET`

---

## Tailwind v4 Rules

### Configuration

- Theme defined via `@theme` directive in `globals.css` — **no `tailwind.config.ts` exists**
- Import: `@import "tailwindcss";` at top of CSS file
- Custom values defined as CSS variables inside `@theme { }`
- Uses `@tailwindcss/postcss` plugin (not Vite plugin — we're on Next.js)

### Anti-Patterns

- **Never use dynamic class names** that can't be detected at build time (e.g., `` `text-${color}` ``) — Tailwind generates CSS statically
- **Don't create a `tailwind.config.ts`** — v4 uses CSS-based config only
- **Don't use `@apply` excessively** — prefer utility classes directly in JSX

### Typography

- DM Sans font family (weights: 400 Regular, 500 Medium, 700 Bold)
- Headings: DM Sans 700
- Body: DM Sans 400
- Badges/Tags: DM Sans 500, uppercase, small

---

## Design System

Tropical warm palette — the app should feel sunny, inviting, and distinctly Filipino.

| Token            | Hex       | Usage                          |
| ---------------- | --------- | ------------------------------ |
| Primary Coral    | `#FF6B6B` | CTAs, hearts/upvotes, branding |
| Ocean Teal       | `#0D9488` | Links, tags, secondary actions |
| Warm White (bg)  | `#FFFBF5` | Page background                |
| Sand (surface)   | `#FEF3C7` | Cards, highlighted sections    |
| Charcoal (text)  | `#1C1917` | Primary text                   |
| Warm Gray (text) | `#78716C` | Secondary/muted text           |
| Sunset Orange    | `#FB923C` | Budget badges, ratings         |

Region colors: NCR `#3B82F6` · Luzon `#10B981` · Visayas `#F59E0B` · Mindanao `#8B5CF6`

---

## Code Quality Rules

### File & Component Size

- **Max ~300 lines per file** — if a file exceeds this, split into smaller modules
- **One component per file** — no multi-component files
- **Extract reusable logic into custom hooks** (`src/lib/hooks/`)
- **Extract shared types into `src/types/`** — never define types inline across multiple files

### No `any` Type

- **Never use `any`** — use `unknown` and narrow with type guards, or use proper Convex types (`Doc`, `Id`, `Infer`)
- **Never use `as` type assertions** unless absolutely unavoidable — prefer type narrowing
- **Never use `@ts-ignore` or `@ts-expect-error`** — fix the actual type issue

### Component Architecture

```
src/components/
├── ui/              # Primitive reusable components (Button, Badge, Card, Input, Skeleton)
├── layout/          # App shell (Header, Footer, Logo)
├── destinations/    # Destination-specific components
├── tips/            # Tip-specific components
├── search/          # Search & filter components
└── providers/       # Context providers (Convex+Clerk wrapper)
```

- **UI components are generic** — no business logic, only props + styling
- **Feature components compose UI components** — destinations/, tips/, search/ import from ui/
- **Pages are thin** — `app/*/page.tsx` should mostly compose feature components, minimal logic

### Import Patterns

- Use `@/` path alias for all imports (configured in tsconfig)
- Group imports: (1) React/Next, (2) third-party libs, (3) `@/components`, (4) `@/lib`, (5) Convex API
- Never use relative imports that go up more than one level (`../../` is a code smell)

---

## Security Rules

### Authentication & Authorization

- **Every Convex mutation/query touching user data MUST check `ctx.auth.getUserIdentity()`**
- **Never trust client data** — always validate on the server (Convex function) side
- **Use `internalMutation`/`internalQuery` for server-only logic** — these can't be called from clients
- **Admin routes must double-check role** in both the Convex function AND the UI layer

### Row-Level Security (RLS) Pattern

- Users can only read/modify their own data (tips, votes, profile)
- Always filter by `userId` in queries: `.withIndex("by_user", q => q.eq("userId", identity.subject))`
- Admin role bypass must be explicitly checked via the `users` table `role` field
- Create helper functions like `getCurrentUserOrThrow(ctx)` and reuse across all protected functions

### Data Validation

- All public Convex functions must have `args` validators using `v.*` — no exceptions
- Validate file types and sizes before accepting uploads
- Sanitize user-generated content (tip text, descriptions) before storing
- Never expose internal IDs or sensitive fields in API responses unnecessarily

### Environment & Secrets

- **Never commit `.env.local`** — must be in `.gitignore`
- **Never hardcode API keys, URLs, or secrets** in source code
- Server-only secrets (`CLERK_SECRET_KEY`) must never have `NEXT_PUBLIC_` prefix
- Convex server secrets go in **Convex Dashboard env vars**, not `.env.local`

---

## Verification

After any change, confirm it works by:

1. Check TypeScript: `bunx tsc --noEmit`
2. Check lint: `bun run lint`
3. Verify Convex schema didn't break: check `bunx convex dev` console for errors
4. For UI changes: visually confirm in browser at `localhost:3000`
