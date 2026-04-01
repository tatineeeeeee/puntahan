# Phase 1: Project Setup — Implementation Prompt

You are building **puntahan**, a Philippine travel guide app. The scaffold exists (Next.js 16 + Convex + Clerk + Tailwind v4 installed), but zero app code has been written. Your job is to complete Phase 1: Project Setup.

Read `CLAUDE.md` first — it contains every rule you must follow. Read `AGENTS.md` too — it tells you to check Next.js 16 docs in `node_modules/next/dist/docs/` before writing code.

---

## What exists now

- `src/app/layout.tsx` — default Next.js layout with Geist fonts, generic metadata, missing `suppressHydrationWarning`
- `src/app/page.tsx` — stock Next.js welcome page
- `src/app/globals.css` — default theme, no tropical palette
- `convex/` — only auto-generated files, no schema or functions
- `next.config.ts` — empty config
- `package.json` — all deps installed (next 16.2.1, react 19.2, convex, @clerk/nextjs, clsx, tailwind-merge)
- `.env.local` — exists with keys (don't read or log its contents)

---

## Tasks (complete ALL of these)

### 1. `cn()` utility
Create `src/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2. `globals.css` — Tropical warm palette
Replace the current `globals.css` with the project's design system. Use `@import "tailwindcss"` and the `@theme inline` directive. Define all color tokens as CSS custom properties:

| Token | Variable | Hex |
|-------|----------|-----|
| Primary Coral | `--color-coral` | `#FF6B6B` |
| Ocean Teal | `--color-teal` | `#0D9488` |
| Warm White | `--color-warm-white` | `#FFFBF5` |
| Sand | `--color-sand` | `#FEF3C7` |
| Charcoal | `--color-charcoal` | `#1C1917` |
| Warm Gray | `--color-warm-gray` | `#78716C` |
| Sunset Orange | `--color-sunset` | `#FB923C` |
| NCR | `--color-ncr` | `#3B82F6` |
| Luzon | `--color-luzon` | `#10B981` |
| Visayas | `--color-visayas` | `#F59E0B` |
| Mindanao | `--color-mindanao` | `#8B5CF6` |

Also set up:
- `--color-background: #FFFBF5` (warm white as default bg)
- `--color-foreground: #1C1917` (charcoal as default text)
- DM Sans as `--font-sans` (you'll configure the font in layout.tsx)
- Body styles: `background: var(--color-background)`, `color: var(--color-foreground)`, `font-family: var(--font-sans)`

### 3. DM Sans font setup
In `layout.tsx`, replace Geist fonts with DM Sans from `next/font/google`:
```ts
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});
```
Apply the CSS variable class to `<html>`.

### 4. Convex + Clerk providers
Create `src/components/providers/convex-client-provider.tsx`:
- This is a `"use client"` component
- Import `ConvexProviderWithClerk` from `convex/react-clerk`
- Import `ClerkProvider, useAuth` from `@clerk/nextjs`
- Import `ConvexReactClient` from `convex/react`
- Create a `ConvexReactClient` instance outside the component (module-level), using `process.env.NEXT_PUBLIC_CONVEX_URL!`
- Export a `ConvexClientProvider` component that wraps children in `ClerkProvider` → `ConvexProviderWithClerk` (pass `useAuth` to it)

### 5. Root layout update (`src/app/layout.tsx`)
- Import and wrap children with `ConvexClientProvider`
- Add `suppressHydrationWarning` to BOTH `<html>` and `<body>` tags
- Update metadata: `title: "puntahan — Discover the Philippines"`, `description: "Community-driven travel guide for Philippine destinations"`
- Use the DM Sans font variable class on `<html>`
- Set `lang="en"` on `<html>`
- Body classes: `min-h-dvh bg-background text-foreground font-sans antialiased`

### 6. Placeholder home page
Replace `src/app/page.tsx` with a simple centered layout:
- "puntahan" as an `<h1>` in coral color, DM Sans bold
- Tagline: "Discover the Philippines" as a `<p>` in warm gray
- This is a **Server Component** — no `"use client"` needed
- Use Tailwind utility classes with the project's color tokens

### 7. `proxy.ts` (Clerk route protection)
Create `src/proxy.ts`. Check the Next.js 16 docs in `node_modules/next/dist/docs/` for the correct proxy.ts API — do NOT use middleware.ts patterns.

The proxy should:
- Use `clerkMiddleware()` from `@clerk/nextjs/server` (Clerk still exports this, it works in proxy.ts)
- Protect routes: `/submit(.*)`, `/profile(.*)`, `/admin(.*)`
- Public routes: `/`, `/destination(.*)`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/(.*)`, `/clerk-users-webhook`

**IMPORTANT**: Before writing proxy.ts, read the Next.js 16 docs at `node_modules/next/dist/docs/` to understand the proxy API. The function export name, config, and behavior differ from middleware.ts.

---

## Rules to follow

1. **Read `CLAUDE.md` fully before starting** — it has hydration rules, Convex rules, Tailwind v4 rules, and code quality rules
2. **Read Next.js 16 docs** at `node_modules/next/dist/docs/` before writing proxy.ts or layout.tsx
3. **No `any` types** — use proper TypeScript types everywhere
4. **No `tailwind.config.ts`** — Tailwind v4 uses CSS-based config only
5. **`"use client"` only where needed** — the provider file needs it, the page and layout do NOT
6. **Use `@/` path alias** for all imports
7. **One component per file**, max 300 lines
8. **After finishing, run `/test-check`** to verify TypeScript compiles and lint passes
9. **Then run `/hydration-check`** to verify no hydration risks were introduced

---

## File tree after completion

```
src/
├── app/
│   ├── globals.css          # Tropical warm palette @theme
│   ├── layout.tsx           # DM Sans + providers + suppressHydrationWarning
│   └── page.tsx             # Simple placeholder home
├── components/
│   └── providers/
│       └── convex-client-provider.tsx  # Convex + Clerk wrapper
├── lib/
│   └── utils.ts             # cn() utility
└── proxy.ts                 # Clerk route protection (NOT middleware.ts)
```
