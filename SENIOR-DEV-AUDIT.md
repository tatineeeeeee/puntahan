# Senior Dev Full-Stack Audit — Puntahan

> **How to use:** Paste this entire prompt into Claude Code. It will enter Plan Mode, use deep thinking, web search, and all available skills to perform a comprehensive senior-level review of the entire codebase.

---

## The Prompt

```
You are a principal full-stack engineer with 15+ years of experience shipping
production apps. You specialize in Next.js, React, Convex, Clerk, TypeScript,
and Tailwind CSS. You've led teams at companies like Vercel, Meta, and Stripe.

You are performing a COMPREHENSIVE senior-level audit of this entire codebase.
This is not a quick glance — this is a deep, multi-pass, no-stone-unturned
review as if you were onboarding as tech lead and need to understand everything
before signing off on a production release.

PROJECT CONTEXT:
- App: puntahan — Philippine travel guide platform
- Language: TypeScript (strict mode)
- Framework: Next.js 16 (App Router) + React 19.2
- Backend: Convex (real-time database, queries, mutations, actions)
- Auth: Clerk (integrated with Convex via webhook)
- Styling: Tailwind CSS v4 (CSS-based @theme config, NOT tailwind.config.ts)
- Package manager: Bun
- Deployment: Vercel (assumed)

─────────────────────────────────────────────────────
INSTRUCTIONS
─────────────────────────────────────────────────────

1. Enter Plan Mode first. Build a full audit plan before writing any code.
2. Use ultra-deep thinking (extended Chain-of-Thought) for every pass.
3. Use web search to verify:
   - Latest Next.js 16 breaking changes and best practices
   - Latest Convex patterns, anti-patterns, and known issues
   - Latest Clerk integration patterns with Convex
   - Latest React 19.2 features and deprecations
   - Latest Tailwind v4 patterns
4. Read EVERY file in the codebase. Do not skip any file.
5. Run these quality skills and incorporate their output:
   - /test-check
   - /frontend-check
   - /backend-check
   - /hydration-check
   - /security-audit
   - /perf-check
   - /ux-audit
   - /code-review
6. Cross-reference skill outputs with your own findings.
7. After all passes, provide fixes — not just descriptions.

═══════════════════════════════════════════════════════
PASS 1 — ARCHITECTURE & PROJECT STRUCTURE
═══════════════════════════════════════════════════════

Review the entire project structure and architecture decisions:

  - Is the folder structure clean and scalable?
  - Are components properly separated (ui/ vs feature/ vs layout/)?
  - Are pages thin (composing feature components, not doing logic)?
  - Is there proper separation of concerns (presentation vs logic vs data)?
  - Are there any circular dependencies or tangled imports?
  - Is the @/ path alias used consistently (no deep relative imports)?
  - Are files under 300 lines? If not, what should be split?
  - Is there one component per file? Any multi-component files?
  - Are shared types extracted to src/types/ or co-located properly?
  - Are custom hooks extracted to src/lib/hooks/?
  - Is there dead code, unused files, or orphaned components?
  - Does the project structure match what CLAUDE.md prescribes?

═══════════════════════════════════════════════════════
PASS 2 — NEXT.JS 16 & REACT 19.2 COMPLIANCE
═══════════════════════════════════════════════════════

[WEB SEARCH: "Next.js 16 breaking changes", "React 19.2 new features"]

Check every file against Next.js 16 rules:

  - Is middleware.ts still used? (deprecated — should be proxy.ts)
  - Are params and searchParams awaited in all pages/layouts?
  - Are cookies(), headers(), draftMode() awaited?
  - Are parallel routes using explicit default.js files?
  - Is images.remotePatterns used instead of deprecated images.domains?
  - Is any deprecated API still in use? (serverRuntimeConfig, publicRuntimeConfig, AMP, experimental.ppr)
  - Are "use client" directives on every file using hooks/browser APIs?
  - Is the root layout using suppressHydrationWarning on <html> and <body>?
  - Are there any Server Component / Client Component boundary violations?
  - Is "use cache" being used where appropriate (opt-in caching)?

Check React 19.2 usage:

  - Are new features like <ViewTransition>, useEffectEvent(), <Activity> used where beneficial?
  - Are deprecated React patterns still present?
  - Is useId() used for generated IDs (not Math.random or crypto.randomUUID)?
  - Are keys stable and not using array index where items reorder?

═══════════════════════════════════════════════════════
PASS 3 — CONVEX BACKEND DEEP DIVE
═══════════════════════════════════════════════════════

[WEB SEARCH: "Convex best practices 2026", "Convex query optimization"]

Audit every file in convex/:

  Schema & Types:
  - Is the schema comprehensive and well-defined?
  - Are Doc<>, Id<>, Infer<> used properly?
  - Are there redundant indexes? (if by_foo and by_foo_bar exist, remove by_foo)
  - Are validators complete on all public functions?
  - Is WithoutSystemFields used for insert/update operations?

  Queries:
  - Is .filter() used anywhere? (NEVER — use .withIndex() instead)
  - Is .collect() used on potentially large result sets? (use .paginate() or .take())
  - Is Date.now() called inside queries? (breaks subscriptions)
  - Are queries thin with logic in helper functions?
  - Are there N+1 query patterns?

  Mutations:
  - Are mutations granular? (setTeamOwner, not updateTeam)
  - Is ctx.auth.getUserIdentity() checked in every public function?
  - Are argument validators present on every public function?
  - Are internalMutation/internalQuery used for server-only logic?
  - Is api.* used inside Convex functions? (should be internal.*)

  Actions:
  - Are actions only used when Node.js is required?
  - Are runMutation + runQuery chained separately? (combine for consistency)

  File Storage:
  - Is the upload flow correct? (get URL → upload → store ID)
  - Are file types and sizes validated?

  Security:
  - Can any public function be called without auth when it shouldn't be?
  - Are there IDOR vulnerabilities? (accessing other users' data)
  - Is row-level security enforced via userId filtering?
  - Are there any mass assignment risks?

═══════════════════════════════════════════════════════
PASS 4 — CLERK AUTHENTICATION AUDIT
═══════════════════════════════════════════════════════

[WEB SEARCH: "Clerk Convex integration best practices 2026"]

  - Is provider order correct? (ClerkProvider outside, ConvexProviderWithClerk inside)
  - Is useConvexAuth() used instead of Clerk's useAuth() for Convex operations?
  - Are Authenticated/Unauthenticated/AuthLoading from convex/react (NOT Clerk)?
  - Is the webhook handler using svix for verification?
  - Is the webhook using internalMutation for upsert/delete?
  - Are CLERK_SECRET_KEY and other server secrets properly handled?
  - Is CLERK_JWT_ISSUER_DOMAIN set in Convex Dashboard (not .env.local)?
  - Are protected routes actually protected?
  - Is there any auth state leaking to unauthorized users?

═══════════════════════════════════════════════════════
PASS 5 — HYDRATION & CLIENT/SERVER BOUNDARY
═══════════════════════════════════════════════════════

Zero-tolerance scan for hydration mismatches:

  - Any window/document/localStorage/navigator access during render?
  - Any Date.now()/Math.random()/new Date() during render?
  - Any conditional rendering based on client-only state in first render?
  - Any invalid HTML nesting? (<div> in <p>, <a> in <a>)
  - Any missing "use client" on files using hooks/events/browser APIs?
  - Any useQuery/useMutation without "use client"?
  - Is suppressHydrationWarning on <html> and <body>?
  - Are there components that should be Server Components but aren't?
  - Are there components that should be Client Components but aren't?

═══════════════════════════════════════════════════════
PASS 6 — TYPESCRIPT & CODE QUALITY
═══════════════════════════════════════════════════════

  - Any use of `any` type? (NEVER — use unknown + type guards)
  - Any use of `as` type assertions? (avoid — prefer narrowing)
  - Any @ts-ignore or @ts-expect-error? (fix the actual issue)
  - Are all promises awaited? (no floating promises)
  - Are error boundaries in place for critical UI sections?
  - Is error handling consistent across the codebase?
  - Are there race conditions or TOCTOU bugs?
  - Are there functions doing too many things?
  - Is there duplicated logic that should be extracted?
  - Are imports grouped correctly? (React/Next → libs → components → lib → Convex)

═══════════════════════════════════════════════════════
PASS 7 — TAILWIND v4 & DESIGN SYSTEM
═══════════════════════════════════════════════════════

[WEB SEARCH: "Tailwind CSS v4 best practices"]

  - Is a tailwind.config.ts file present? (should NOT exist in v4)
  - Is @theme directive used correctly in globals.css?
  - Are there dynamic class names that can't be detected at build? (e.g., `text-${color}`)
  - Is @apply used excessively? (prefer utilities in JSX)
  - Does the design system match the spec? (colors, typography, spacing)
  - Are design tokens consistent? (Primary Coral #FF6B6B, Ocean Teal #0D9488, etc.)
  - Are region colors used correctly? (NCR blue, Luzon green, Visayas yellow, Mindanao purple)
  - Is DM Sans used with correct weights? (400, 500, 700)
  - Is the warm tropical aesthetic maintained throughout?
  - Are there any one-off colors or magic numbers that should be tokens?

═══════════════════════════════════════════════════════
PASS 8 — PERFORMANCE & OPTIMIZATION
═══════════════════════════════════════════════════════

  - Are images optimized with next/image? (no raw <img> tags)
  - Are images using proper width/height/priority props?
  - Is there unnecessary re-rendering? (missing memo, useMemo, useCallback where needed)
  - Are Convex subscriptions efficient? (not subscribing to more data than needed)
  - Are there large component trees that should use Suspense boundaries?
  - Is code splitting happening naturally via the App Router?
  - Are there large dependencies that could be tree-shaken or lazy loaded?
  - Is there any client-side data fetching that should be server-side?
  - Are loading/skeleton states in place for async content?
  - Are there any layout shifts (CLS) risks?
  - Are fonts loaded efficiently? (preload, font-display: swap)

═══════════════════════════════════════════════════════
PASS 9 — UX & ACCESSIBILITY
═══════════════════════════════════════════════════════

  - WCAG 2.1 AA compliance check on all interactive elements
  - Are all images using meaningful alt text?
  - Is color contrast sufficient? (especially with the warm palette)
  - Are all interactive elements keyboard accessible?
  - Are focus indicators visible?
  - Is there a skip-to-content link?
  - Are ARIA labels used where needed?
  - Is the app usable on mobile? (320px minimum)
  - Are touch targets at least 44x44px?
  - Is there proper loading state feedback?
  - Are error states clear and actionable?
  - Is the navigation intuitive and consistent?
  - Are empty states handled? (no results, no tips, no bookmarks)

═══════════════════════════════════════════════════════
PASS 10 — SECURITY (FULL OWASP 2025)
═══════════════════════════════════════════════════════

  A01: Broken Access Control
  - Missing/bypassable auth checks on Convex functions
  - IDOR on tips, votes, bookmarks, profiles
  - Privilege escalation paths
  - CSRF on state-changing mutations

  A02: Security Misconfiguration
  - Debug mode or verbose errors in production
  - Missing security headers
  - Exposed internal endpoints

  A03: Supply Chain
  - Dependencies with known CVEs
  - Unpinned versions in package.json
  - Lockfile committed?

  A04: Cryptographic Failures
  - Hardcoded secrets in source
  - Secrets in git history
  - Proper env var handling

  A05: Injection
  - XSS via user-generated content (tips, descriptions)
  - NoSQL injection via Convex queries
  - Log injection

  A06: Insecure Design
  - Rate limiting on votes, tips, bookmarks
  - Business logic flaws (vote manipulation, duplicate bookmarks)
  - Race conditions on concurrent votes

  A07: Auth Failures
  - Session management via Clerk (verify proper config)
  - Protected routes actually protected

  A09: Logging Failures
  - Are auth failures logged?
  - Is PII being logged?

  A10: Exception Handling
  - Error messages leaking internals
  - Unhandled exceptions causing crashes
  - Fail-open behavior on auth checks

─────────────────────────────────────────────────────
OUTPUT FORMAT
─────────────────────────────────────────────────────

For EACH finding, output:

### [SEVERITY] [PASS #] — Short title
- **Location:** `file/path:line` (or range)
- **Category:** Architecture | Next.js | Convex | Clerk | Hydration | TypeScript | Tailwind | Performance | UX | Security
- **Severity:** CRITICAL | HIGH | MEDIUM | LOW | INFO
- **Description:** What the issue is (1-2 sentences)
- **Why it matters:** Real-world impact if not fixed
- **Fix:** Specific code change or pattern to apply
- **Code (before -> after):**
  ```
  // BEFORE
  ...
  // AFTER
  ...
  ```

─────────────────────────────────────────────────────
FINAL DELIVERABLES
─────────────────────────────────────────────────────

After all 10 passes AND all skill outputs are reviewed, provide:

1. **Executive Summary** (5-7 sentences — overall health of the codebase)

2. **Findings Table** sorted by severity:
   | # | Severity | Pass | Category | Title | File | Status |

3. **Top 10 Priority Fixes** — highest risk + easiest fix first

4. **Architecture Score Card:**
   | Area | Grade (A-F) | Notes |
   |------|-------------|-------|
   | Project Structure | | |
   | Next.js 16 Compliance | | |
   | Convex Backend | | |
   | Auth & Security | | |
   | Hydration Safety | | |
   | TypeScript Quality | | |
   | Design System | | |
   | Performance | | |
   | UX & Accessibility | | |
   | Overall | | |

5. **Dependency Health Report** — flagged packages

6. **Overall Risk Rating:** Critical / High / Medium / Low
   with a 1-paragraph justification

7. **Tech Debt Register** — things that aren't bugs but will slow you down

8. **Recommended Next Steps:**
   - Immediate fixes (do today)
   - Short-term improvements (this week)
   - Long-term improvements (this month)
   - Tools to integrate (linting, testing, monitoring)
   - Skills to develop (areas where code shows knowledge gaps)

─────────────────────────────────────────────────────
RULES
─────────────────────────────────────────────────────

- Enter PLAN MODE first. Map out the full audit before starting.
- Use EXTENDED THINKING for every pass. Reason step-by-step.
- Use WEB SEARCH to verify latest framework versions and patterns.
- READ EVERY FILE. Do not skip any file in the codebase.
- Run ALL quality skills: /test-check, /frontend-check, /backend-check,
  /hydration-check, /security-audit, /perf-check, /ux-audit, /code-review
- Cross-reference skill outputs with your manual findings.
- Zero false positives: mark uncertain findings as "Needs Review."
- For each fix, show ACTUAL CODE CHANGES, not just descriptions.
- Track which files you've audited. Report any you couldn't reach.
- Prioritize by real-world exploitability and user impact, not theory.
- Be brutally honest. This is a senior review, not a pat on the back.
- After finding issues, FIX THEM. Don't just report — ship the fixes.
```

---

## How to Run This Audit

1. Open Claude Code in this project
2. Paste the prompt above
3. Claude will enter Plan Mode and build the audit plan
4. Let it run all 10 passes + all quality skills
5. Review findings and approve fixes

## Quick Single-Pass Variants

If you don't have time for the full audit, use these focused versions:

**Backend Only:**
```
Run PASS 3 (Convex) + PASS 4 (Clerk) + PASS 10 (Security) from SENIOR-DEV-AUDIT.md.
Use /backend-check and /security-audit skills. Fix all findings.
```

**Frontend Only:**
```
Run PASS 2 (Next.js) + PASS 5 (Hydration) + PASS 7 (Tailwind) + PASS 9 (UX) from SENIOR-DEV-AUDIT.md.
Use /frontend-check, /hydration-check, /ux-audit skills. Fix all findings.
```

**Pre-Commit Quick Check:**
```
Run PASS 6 (TypeScript) + PASS 8 (Performance) from SENIOR-DEV-AUDIT.md.
Use /test-check and /code-review skills. Fix all findings.
```
