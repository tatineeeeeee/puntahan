---
name: frontend-check
description: Review frontend code for hydration errors, performance, React best practices, and Next.js 16 patterns. Use when reviewing components, pages, hooks, or client/server boundaries.
---

Review the specified frontend code for correctness and quality. If no file is specified, scan all components and pages.

## Hydration Error Prevention (CRITICAL)

Hydration mismatches are the #1 frontend bug. Check every component:

- **Never access browser APIs at module level or during render** — `window`, `document`, `localStorage`, `navigator` must only be used inside `useEffect` or behind `typeof window !== 'undefined'` checks
- **Never use `Date.now()`, `Math.random()`, or `crypto.randomUUID()` during render** — server and client produce different values. Generate IDs in useEffect or pass from server
- **Never conditionally render based on client-only state in initial render** — use `useEffect` + state to toggle after mount
- **Ensure `"use client"` is on every file that uses hooks, event handlers, or browser APIs** — missing this causes cryptic errors
- **Never nest `<p>` inside `<p>`, `<div>` inside `<p>`, or `<a>` inside `<a>`** — invalid HTML causes hydration mismatch
- **`next/image` must have explicit `width`/`height` or use `fill`** — missing dimensions cause layout shift and hydration issues
- **Convex `useQuery`/`useMutation` only work in client components** — these files must have `"use client"`

## React Best Practices

### Hooks
- No hooks inside conditions, loops, or nested functions
- `useEffect` cleanup functions for subscriptions, timers, event listeners
- `useMemo`/`useCallback` only when there's a measured performance need — don't premature optimize
- Custom hooks extract reusable logic — prefix with `use`

### Component Patterns
- Props are typed with interfaces, not inline `{ }` in function signature
- Destructure props in function params: `function Card({ title, children }: CardProps)`
- No `any` or `as` assertions — use proper types from Convex (`Doc`, `Id`)
- Event handlers named with `handle` prefix: `handleClick`, `handleSubmit`
- Components under 300 lines — split if larger

### Client vs Server Boundary
- Default to Server Components (no `"use client"` directive)
- Add `"use client"` ONLY when component needs: hooks, event handlers, browser APIs, Convex `useQuery`/`useMutation`
- Push `"use client"` boundary as low as possible in the component tree
- Server Components can `await` data directly — don't wrap in useEffect

## Next.js 16 Specific

- `params` and `searchParams` must be `await`ed in page/layout components
- Use `proxy.ts` not `middleware.ts`
- `generateMetadata` for SEO — must be async, must `await params`
- `loading.tsx` for Suspense boundaries per route segment
- `error.tsx` for error boundaries per route segment — must be a client component
- `next/image` configured with `images.remotePatterns` for external domains

## Performance

- No unnecessary re-renders — check if parent passes new object/array refs on every render
- Lists must have stable `key` props (Convex `_id`, not array index)
- Heavy components wrapped in `Suspense` with fallback
- Dynamic imports (`next/dynamic`) for components not needed on initial load
- Avoid importing large libraries in client components

## Tailwind v4

- No dynamic class names (`` `text-${color}` ``) — use conditional objects or maps
- Use project color tokens from `@theme` — no hardcoded hex in className
- Responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern

## Output Format

| Severity | Category | Issue | File:Line | Fix |
|----------|----------|-------|-----------|-----|
| Critical | Hydration | ... | ... | ... |
| Critical | Type Safety | ... | ... | ... |
| Warning  | Performance | ... | ... | ... |
| Suggestion | Pattern | ... | ... | ... |
