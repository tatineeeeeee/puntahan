# puntahan — Development Phases

## Completed Phases (1-29)

Phases 1-29 built the core platform: destinations, tips, votes, bookmarks,
profiles, itineraries, journals, festivals, leaderboard, admin panel,
comparison, search, mobile polish, and SEO.

## Completed: Senior Dev Audit (Phase 30)

Full-stack audit + fixes across 3 sub-phases:
- **Phase A:** Centralized auth helpers, bounded all queries, fixed orphan-tip bug, removed unsafe type assertions
- **Phase B:** Added not-found/loading/error for every route, accessible Tabs component, skip-to-content link
- **Phase C:** Split multi-component files (one per file), design system fixes, aria-labels

**Result:** Overall grade A (up from B+). Zero TypeScript errors, zero ESLint errors, all 8 quality skills passed.

---

## Phase 31: Tip Photos Inline

**Goal:** Let users attach photos to their tips. The `photosStorageIds` field already exists in the schema — wire it up.

**What to build:**
1. Add photo upload UI to `tip-form.tsx` (reuse `photo-upload.tsx` pattern)
2. Upload flow: get URL -> upload -> store ID in tip's `photosStorageIds`
3. Render photos in `tip-card.tsx` when `photosStorageIds.length > 0`
4. Generate storage URLs via `ctx.storage.getUrl()` in `tips.listByDestination` query
5. Limit: max 3 photos per tip, validate image type client-side

**Files to modify:**
- `src/components/tips/tip-form.tsx` — add photo upload section
- `src/components/tips/tip-card.tsx` — render inline photos
- `convex/tips.ts` — accept storageIds in create mutation, resolve URLs in queries

**Effort:** S-M | **Priority:** High

---

## Phase 32: Shareable Filter URLs

**Goal:** Sync browse page filters to URL search params so users can share filtered views like `?region=Visayas&budget=Budget&rating=4`.

**What to build:**
1. Read `searchParams` on page load to restore filter state
2. Write filter changes to URL via `useRouter().replace()` (no page reload)
3. Support params: `region`, `budget`, `rating`, `category`, `sort`, `q` (search)
4. "Copy link" button that copies current filtered URL
5. Clear all filters resets URL to clean `/`

**Files to modify:**
- `src/app/page.tsx` — pass searchParams to BrowsePage
- `src/components/destinations/browse-page.tsx` — sync filters <-> URL
- `src/lib/filter-utils.ts` — add parseFiltersFromURL / filtersToURL helpers

**Effort:** S | **Priority:** High

---

## Phase 33: Local Guide Badges

**Goal:** Users who contribute quality content in a specific province earn "Local Guide" status. Their tips show a verified local marker.

**What to build:**
1. Track per-province tip counts (derive from existing tips data)
2. New badge tier: "Local Guide: [Province]" — earned at 10+ tips in one province
3. Show local guide indicator on tip cards from qualified users
4. Display province-specific badges on profile page badge shelf
5. Leaderboard: "Top Local Guides" tab showing guides by province

**Files to modify:**
- `src/lib/badges.ts` — add local guide badge logic
- `src/components/tips/tip-card.tsx` — show local guide marker
- `src/components/profile/badge-shelf.tsx` — render province badges
- `convex/tips.ts` — include user province stats in tip queries

**Effort:** S-M | **Priority:** Medium

---

## Phase 34: Social Sharing Cards (OG Meta)

**Goal:** Beautiful preview cards when destination links are shared on Facebook, Twitter, Messenger, etc. Drives organic traffic.

**What to build:**
1. Dynamic `og:title`, `og:description`, `og:image` per destination via `generateMetadata`
2. Use destination hero image as OG image (generate via Convex storage URL)
3. Add `twitter:card` meta tags (large image summary)
4. Add OG meta to other key pages (home, leaderboard, festivals)
5. Test with Facebook Sharing Debugger and Twitter Card Validator

**Files to modify:**
- `src/app/destination/[slug]/page.tsx` — enhance generateMetadata
- `src/app/page.tsx` — add static OG meta
- `src/app/layout.tsx` — default OG fallbacks

**Effort:** S | **Priority:** Medium

---

## Phase 35: Printable Itinerary Export

**Goal:** "Print" button on itinerary detail that produces a clean, printer-friendly view of the full trip plan.

**What to build:**
1. Print button on itinerary detail page
2. Print-friendly CSS via `@media print` — hide nav, buttons, use black text on white
3. Layout: trip name, dates, each day with destinations, notes, and a simple map
4. Alternative: dedicated `/itinerary/[id]/print` route with clean layout
5. Include budget breakdown if tips are linked

**Files to modify/create:**
- `src/components/itineraries/itinerary-detail.tsx` — add print button
- `src/app/globals.css` — add `@media print` styles
- OR `src/app/itinerary/[token]/print/page.tsx` — dedicated print page

**Effort:** S | **Priority:** Low

---

## Phase 36: Group Trip Voting

**Goal:** Share an itinerary link where friends can suggest destinations and vote. Top-voted destinations get added to the trip.

**What to build:**
1. New `trip_suggestions` table: itineraryId, destinationId, suggestedBy (name), votes, createdAt
2. Public voting page at `/itinerary/[token]/vote` — no auth required
3. Anyone with the link can: search destinations, suggest one, vote on existing suggestions
4. Owner sees vote results on their itinerary detail page
5. "Add top voted" button to auto-populate itinerary days
6. Simple name input for anonymous voters (no account required)

**Schema changes:**
```
trip_suggestions: defineTable({
  itineraryId: v.id("itineraries"),
  destinationId: v.id("destinations"),
  suggestedBy: v.string(),
  votes: v.number(),
  createdAt: v.number(),
})
  .index("by_itinerary", ["itineraryId"])
```

**Files to create/modify:**
- `convex/schema.ts` — add trip_suggestions table
- `convex/trip-suggestions.ts` — NEW: suggest, vote, list queries/mutations
- `src/app/itinerary/[token]/vote/page.tsx` — NEW: public voting page
- `src/components/itineraries/voting-page.tsx` — NEW: voting UI
- `src/components/itineraries/itinerary-detail.tsx` — show vote results

**Effort:** M | **Priority:** High (viral growth loop)

---

## Phase 37: Weighted Vote Ranking

**Goal:** Tips ranked by weighted score instead of raw upvote count. Experienced contributors' votes count more.

**What to build:**
1. Add `weightedScore` field to tips table
2. Weight formula: `baseVote * (1 + log2(voterTipsCount + 1)) * (1 + log2(voterUpvotesReceived + 1))`
3. Recalculate on every vote cast (in castVote mutation)
4. Sort tips by weightedScore instead of raw upvotes
5. Display "Community Score" instead of raw number on tip cards

**Schema changes:**
```
// Add to tips table
weightedScore: v.number(),  // default 0
```

**Files to modify:**
- `convex/schema.ts` — add weightedScore to tips
- `convex/votes.ts` — calculate weight on vote
- `convex/tips.ts` — sort by weightedScore in queries
- `src/components/tips/tip-card.tsx` — display community score

**Effort:** M | **Priority:** Medium

---

## Phase 38: Travel Advisories

**Goal:** Admin can add advisory banners to destinations (weather warnings, safety tips, travel requirements).

**What to build:**
1. Advisory field on destinations: level (info/warning/alert), message, updatedAt
2. Admin UI: "Set Advisory" button on destination management
3. Color-coded banner on destination detail: info=teal, warning=sunset, alert=coral
4. Auto-dismiss option (advisory expires after date)
5. Show active advisories on home page as a ticker/banner

**Schema changes:**
```
// Add to destinations table
advisory: v.optional(v.object({
  level: v.union(v.literal("info"), v.literal("warning"), v.literal("alert")),
  message: v.string(),
  updatedAt: v.number(),
}))
```

**Files to modify:**
- `convex/schema.ts` — add advisory to destinations
- `convex/admin.ts` — setAdvisory mutation
- `src/components/destinations/destination-detail.tsx` — advisory banner
- `src/components/admin/admin-page.tsx` — advisory management UI

**Effort:** M | **Priority:** Medium

---

## Phase 39: Dark Mode & Light Mode Design System Overhaul

**Goal:** Production-grade dark mode with proper surface hierarchy, desaturated accents, warm tones, and WCAG AA contrast. Light mode polish pass too.

### The Problem (Current Dark Mode)

The current dark mode does a naive color swap:
- `warm-white` (#FFFBF5) → charcoal (#1C1917) — background
- `sand` (#FEF3C7) → dark stone (#292524) — cards
- `charcoal` → sand — text

This creates:
1. **No elevation** — cards (#292524) and background (#1C1917) are nearly identical
2. **Washed-out feel** — no visual hierarchy between surfaces
3. **Accent colors too harsh** — coral (#FF6B6B) and teal (#0D9488) designed for light bg are too vibrant on dark
4. **Region badges unreadable** — bright saturated colors on dark backgrounds cause eye strain
5. **No border/divider system** — elements blend together

### Industry Research

**What top apps do for dark mode:**
- **Material Design 3:** Uses 5 surface container levels (lowest → highest) with increasing lightness. Dark backgrounds are #121212 to #1E1E1E range, never pure black
- **Airbnb:** Dark mode uses warm charcoal (#222222) bg, elevated cards at #2A2A2A, desaturated pink accent
- **TripAdvisor:** Warm dark gray (#1A1A1A) bg, cards at #262626, green accent desaturated to #34D399
- **Atlas Obscura:** Deep navy-charcoal bg, warm amber accents, high-contrast white text

**Best practices (2025-2026 consensus):**
- Never pure black (#000000) — use dark grays (#121212 to #1E1E1E)
- Never pure white text — use off-white (#E8E2D9 for warm, #E0E0E0 for neutral)
- Desaturate accent colors by 10-20% for dark mode
- Use surface elevation: bg → surface → surface-elevated → surface-highest
- Borders/dividers at 10-15% white opacity, not solid colors
- Warm dark palettes use brown-tinted grays, not blue-tinted

### Proposed Dark Mode Palette

**Surfaces (warm charcoal family — brown-tinted, not blue-gray):**
```
--color-background:      #1A1614   (page bg — warm near-black)
--color-warm-white:      #1A1614   (aliased to bg for component compat)
--color-sand:            #2C2623   (cards, elevated surfaces — clearly visible)
--color-surface-hover:   #3D3530   (hover states on cards)
--color-surface-highest: #4A423C   (modals, dropdowns, popovers)
```

**Text (warm off-whites):**
```
--color-charcoal:        #F5EDE4   (primary text — warm off-white)
--color-foreground:      #F5EDE4   (body text alias)
--color-warm-gray:       #A89F97   (secondary text — warmer than current)
```

**Accents (desaturated 15% for dark mode):**
```
--color-coral:           #E8736F   (softer coral — less eye strain)
--color-teal:            #2BA89E   (slightly brighter teal — visibility)
--color-sunset:          #E8944A   (softer sunset)
```

**Region badges (desaturated for dark):**
```
--color-ncr:             #5B9BF0   (softer blue)
--color-luzon:           #34D399   (softer green)
--color-visayas:         #F0B94A   (softer yellow)
--color-mindanao:        #9D7CF0   (softer purple)
```

**Borders & Dividers:**
```
border-warm-gray/10  →  border-warm-gray/15  (slightly more visible on dark)
```

### What to Build

1. **Redesign dark mode CSS variables** in `globals.css` with the palette above
2. **Add surface-hover and surface-highest tokens** for modals, dropdowns, hover states
3. **Add dark-mode-specific accent overrides** — desaturated coral, teal, sunset, region colors
4. **Audit every component** for hardcoded colors that don't flip in dark mode
5. **Card elevation** — add subtle `ring-1 ring-white/5` or `shadow` on cards in dark mode for depth
6. **Test contrast ratios** — every text/background combo must pass WCAG AA (4.5:1 normal, 3:1 large)
7. **Light mode polish** — verify all tokens are correct, no regressions

### Contrast Verification Targets

| Combo | Light | Dark | Min Required |
|-------|-------|------|-------------|
| Primary text on bg | #1C1917 on #FFFBF5 = 15.4:1 | #F5EDE4 on #1A1614 = 14.2:1 | 4.5:1 |
| Secondary text on bg | #78716C on #FFFBF5 = 4.9:1 | #A89F97 on #1A1614 = 6.8:1 | 4.5:1 |
| Primary text on card | #1C1917 on #FEF3C7 = 13.8:1 | #F5EDE4 on #2C2623 = 10.1:1 | 4.5:1 |
| Coral on bg | #FF6B6B on #FFFBF5 = 3.8:1 | #E8736F on #1A1614 = 4.6:1 | 3:1 (large) |

### Files to Modify

- `src/app/globals.css` — full dark mode palette redesign + new tokens
- `src/components/ui/card.tsx` — dark mode elevation (ring/shadow)
- `src/components/ui/badge.tsx` — dark mode badge contrast check
- `src/components/destinations/destination-card.tsx` — card hover states
- `src/components/layout/header.tsx` — dark header border visibility
- `src/components/layout/bottom-nav.tsx` — dark bottom nav contrast
- Any component with hardcoded `bg-white`, `text-black`, or non-token colors

**Effort:** M | **Priority:** High — affects every single page

---

## Completed: Phases 31-39

All feature phases complete. Phases 31-38 added tip photos, shareable filter URLs, local guide badges, OG meta, printable itinerary, group trip voting, weighted vote ranking, and travel advisories. Phase 39 overhauled the dark/light mode design system with warm charcoal palette, WCAG AA contrast, and surface hierarchy.

---

# Week 9-10: Production Readiness & Resume Polish

---

## Phase 40: Testing Infrastructure (Vitest)

**Goal:** Add unit tests for the most complex business logic. Not 100% coverage — just enough to show you understand testing and wrote testable code. Interviewers will ask.

**What to build:**
1. Install Vitest + testing config (`vitest.config.ts`)
2. Test `filterDestinations` — all filter combinations (region, budget, rating, categories, season, hasPhotos)
3. Test `computeUserBadges` — thresholds, edge cases (0 stats, exactly at threshold, above threshold)
4. Test `computeLocalGuideBadges` — province counts above/below threshold
5. Test `filtersToSearchParams` / `searchParamsToFilters` — round-trip: filters → URL → back to same filters
6. Test weighted score formula — verify log2 weighting produces expected ranking order

**Files to create:**
- `vitest.config.ts` — Vitest configuration
- `src/lib/__tests__/filter-utils.test.ts` — filter logic tests
- `src/lib/__tests__/badges.test.ts` — badge computation tests

**Why this matters for resume:** "I wrote unit tests for core business logic using Vitest" is a checkbox every interviewer looks for. The filter and badge functions are pure logic — perfect test targets.

**Effort:** S | **Priority:** Critical for resume

---

## Phase 41: CI/CD Pipeline (GitHub Actions)

**Goal:** Automated checks on every push. Shows you understand the development lifecycle beyond just writing code.

**What to build:**
1. `.github/workflows/ci.yml` — runs on push and PR to `main`
2. Steps: install deps (`bun install`), TypeScript check (`bunx tsc --noEmit`), ESLint (`bun run lint`), Vitest (`bun test`), Convex typecheck (`bunx convex typecheck`)
3. Branch protection rule: require CI to pass before merge (document in README)
4. Add status badge to README: `![CI](https://github.com/username/puntahan/actions/workflows/ci.yml/badge.svg)`

**Files to create:**
- `.github/workflows/ci.yml` — CI pipeline definition

**Why this matters for resume:** "All PRs require passing TypeScript, ESLint, and unit tests via GitHub Actions CI" — this one sentence elevates you above 90% of student portfolios.

**Effort:** XS | **Priority:** Critical for resume

---

## Phase 42: Deploy to Vercel

**Goal:** A live, clickable demo at `puntahan.vercel.app`. This is the single highest-impact thing for your resume. A hiring manager will spend 10 seconds on your portfolio — a live link they can click and immediately see a polished app is worth more than 10 bullet points.

**What to build:**
1. Connect GitHub repo to Vercel (`vercel link`)
2. Configure environment variables in Vercel dashboard (Clerk keys, Convex URL)
3. Configure Convex production deployment (`bunx convex deploy`)
4. Verify all pages work in production (SSR, OG meta, Clerk auth, Convex real-time)
5. Set up custom domain if available, otherwise use `puntahan.vercel.app`
6. Run Lighthouse audit — target 90+ on Performance, Accessibility, Best Practices, SEO

**Files to modify:**
- `next.config.ts` — verify production-ready settings
- Vercel dashboard — env vars, build settings

**Why this matters for resume:** "Live at puntahan.vercel.app" on your resume is 10x more impactful than a GitHub link alone. Hiring managers *will* click it.

**Effort:** S | **Priority:** Critical for resume

---

## Phase 43: Error Tracking (Sentry)

**Goal:** Production-grade error monitoring. Even the free tier shows you think about observability, not just happy-path development.

**What to build:**
1. Install `@sentry/nextjs` (`bun add @sentry/nextjs`)
2. Run Sentry wizard: `bunx @sentry/wizard@latest -i nextjs`
3. Configure `sentry.client.config.ts` and `sentry.server.config.ts`
4. Add Sentry DSN to environment variables (Vercel + local)
5. Wrap root layout with Sentry error boundary
6. Test: throw a deliberate error, verify it appears in Sentry dashboard
7. Add source maps upload in CI for readable stack traces

**Files to create/modify:**
- `sentry.client.config.ts` — client-side Sentry init
- `sentry.server.config.ts` — server-side Sentry init
- `next.config.ts` — wrap with `withSentryConfig`
- `src/app/global-error.tsx` — Sentry-aware error boundary

**Why this matters for resume:** "Integrated Sentry error tracking with source maps" — shows production-mindset thinking that separates hobby projects from real engineering.

**Effort:** S | **Priority:** High

---

## Phase 44: Dynamic OG Image Generator

**Goal:** Auto-generated social sharing images with destination photo, name, rating, and region badge — instead of just passing through the hero image URL. When someone shares a puntahan link on Facebook/Twitter, the preview card looks *designed*, not just a random photo.

**What to build:**
1. Create `src/app/api/og/route.tsx` — Next.js OG Image generation using `ImageResponse` from `next/og`
2. Design template: destination hero image as background, gradient overlay, destination name in DM Sans bold, region badge, rating stars, "puntahan" watermark
3. Update `generateMetadata` in destination page to point `og:image` to `/api/og?slug=boracay`
4. Fallback: if no hero image, use a branded gradient with the puntahan coral/teal palette
5. Cache generated images (OG images don't change often)

**Files to create/modify:**
- `src/app/api/og/route.tsx` — NEW: OG image generation endpoint
- `src/app/destination/[slug]/page.tsx` — update og:image URL to use the generator

**Why this matters for resume:** Dynamic OG images are a differentiator. Most apps just pass a static image. This shows you understand the social sharing pipeline end-to-end.

**Effort:** M | **Priority:** Medium

---

## Phase 45: Filipino Language Support (i18n)

**Goal:** Toggle between English and Filipino. For a Philippine travel app, this is a culturally thoughtful touch that shows you think about your users, not just your code.

**What to build:**
1. Create `src/lib/i18n.ts` — translation dictionary with `en` and `fil` keys
2. Create `src/lib/hooks/use-locale.ts` — locale context (stored in localStorage, similar to theme)
3. Translate key UI strings: navigation labels, button text, page headings, empty states, filter labels
4. Add language toggle in header (next to theme toggle) — simple "EN / FIL" switcher
5. Keep user-generated content (tips, descriptions) in original language — only translate UI chrome
6. Use `lang` attribute on `<html>` element for accessibility

**Files to create/modify:**
- `src/lib/i18n.ts` — NEW: translation dictionary
- `src/lib/hooks/use-locale.ts` — NEW: locale hook (mirrors use-theme pattern)
- `src/components/layout/header.tsx` — add language toggle
- `src/app/layout.tsx` — dynamic `lang` attribute
- Key components — replace hardcoded strings with `t('key')` calls

**Scope limit:** Translate the ~50 most visible UI strings. Not full i18n with ICU message format — keep it simple and practical.

**Why this matters for resume:** "Implemented bilingual English/Filipino support" — shows cultural awareness and i18n experience. Hiring managers in PH companies will notice.

**Effort:** M | **Priority:** Medium

---

## Phase 46: Rate Limiting & Abuse Prevention

**Goal:** Protect public endpoints (trip voting, search) from abuse. Not critical for a portfolio demo, but mentioning "I'd add rate limiting" in an interview shows security awareness — actually *having* it is even better.

**What to build:**
1. Add rate limiting to `tripSuggestions.suggest` and `tripSuggestions.vote` — max 10 suggestions and 50 votes per IP/session per hour
2. Add rate limiting to `tips.create` — max 5 tips per user per hour
3. Use Convex scheduled functions to reset rate counters, or track in a `rate_limits` table
4. Return friendly error messages: "You're doing that too fast. Try again in a few minutes."
5. Add basic input sanitization — trim whitespace, limit string lengths in validators

**Schema changes:**
```
rate_limits: defineTable({
  key: v.string(),        // e.g., "vote:192.168.1.1" or "tip:user_abc"
  count: v.number(),
  windowStart: v.number(),
})
  .index("by_key", ["key"])
```

**Files to create/modify:**
- `convex/schema.ts` — add rate_limits table
- `convex/rateLimit.ts` — NEW: checkRateLimit helper
- `convex/tripSuggestions.ts` — add rate limit checks
- `convex/tips.ts` — add rate limit checks

**Why this matters for resume:** "Implemented rate limiting on public endpoints to prevent abuse" — security-aware thinking that junior devs rarely demonstrate.

**Effort:** S-M | **Priority:** Medium

---

## Phase 47: Analytics Dashboard

**Goal:** Track key metrics to understand how the app is used. Even basic analytics shows you think about product, not just code.

**What to build:**
1. Track page views using a lightweight approach — Convex mutation called from a client hook
2. New `analytics` table: event type, page, timestamp, optional userId
3. Admin dashboard tab: "Analytics" showing page views per day, top destinations viewed, tip submission rate, active users
4. Simple chart using a lightweight library (e.g., `recharts` or pure CSS bar charts)
5. Track: page views, tip submissions, vote casts, search queries (anonymized)

**Schema changes:**
```
analytics_events: defineTable({
  event: v.string(),      // "page_view", "tip_created", "vote_cast", "search"
  page: v.optional(v.string()),
  userId: v.optional(v.id("users")),
  metadata: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_event_and_date", ["event", "createdAt"])
```

**Files to create/modify:**
- `convex/schema.ts` — add analytics_events table
- `convex/analytics.ts` — NEW: trackEvent mutation, dashboard queries
- `src/lib/hooks/use-track.ts` — NEW: client-side tracking hook
- `src/components/admin/analytics-tab.tsx` — NEW: analytics dashboard UI
- `src/components/admin/admin-page.tsx` — add Analytics tab

**Why this matters for resume:** "Built an analytics dashboard tracking user engagement metrics" — shows product thinking.

**Effort:** M | **Priority:** Low

---

## Phase 48: README & Documentation Polish

**Goal:** The README is your project's front door. It should sell the project in 30 seconds with screenshots, a live demo link, and a clear tech stack summary.

**What to build:**
1. Hero section: project name, one-line description, live demo link, screenshot (light + dark mode side by side)
2. Features section: bullet list with icons/emojis for each major feature
3. Tech stack section: logos/badges for Next.js, Convex, Clerk, Tailwind, TypeScript, Vercel
4. "Technical Decisions" section: 3-4 paragraphs on *why* you chose this stack, why Convex over Firebase, why data-theme over prefers-color-scheme, why weighted voting
5. Getting started: `bun install`, `bun dev`, `bunx convex dev` — 3 commands to run locally
6. Screenshots: home page, destination detail, dark mode, mobile view, admin panel
7. Architecture diagram: simple box diagram showing Next.js → Convex → Clerk data flow
8. Record a 90-second Loom demo video and embed the link

**Files to create/modify:**
- `README.md` — complete rewrite
- `public/screenshots/` — add 4-6 screenshots

**Why this matters for resume:** The README is what hiring managers see first on GitHub. A polished README with screenshots and a demo video is the difference between "looks interesting" and "let me schedule an interview."

**Effort:** S | **Priority:** Critical for resume

---

## Phase 49: Onboarding Flow

**Goal:** First-time users see a guided walkthrough that showcases the app's features. This is the first thing someone sees when they visit your live demo — make it count. Also great for portfolio demos and Loom recordings.

**What to build:**
1. Detect first visit via localStorage flag (`puntahan_onboarded`)
2. Multi-step onboarding modal/overlay (3-4 steps):
   - **Step 1:** "Welcome to puntahan!" — hero with app description, coral CTA to continue
   - **Step 2:** "Discover destinations" — highlight the browse/filter/search area
   - **Step 3:** "Share your tips" — explain the community-driven aspect, tip photos, voting
   - **Step 4:** "Plan your trip" — itineraries, group voting, print & share
3. Animated transitions between steps (subtle slide or fade)
4. "Skip" button and progress dots
5. On completion, set localStorage flag so it doesn't show again
6. Add "Replay Tour" button in profile or footer for demo purposes

**Files to create/modify:**
- `src/components/onboarding/onboarding-modal.tsx` — NEW: multi-step modal component
- `src/lib/hooks/use-onboarding.ts` — NEW: localStorage-backed hook
- `src/app/page.tsx` — render onboarding on first visit

**Why this matters for resume:** Onboarding shows UX thinking. When you demo the app in interviews or Loom, the onboarding *is* the demo script.

**Effort:** M | **Priority:** High — first impression for every visitor

---

## Phase 50: Footer & About Page

**Goal:** Professional footer with links, credits, and an About page that tells the story of the project. Every polished app has a footer — its absence makes the app feel incomplete.

**What to build:**
1. **Footer component** with 3 columns:
   - **Explore:** Home, Destinations, Leaderboard, Festivals
   - **Account:** Profile, Itineraries, Saved
   - **About:** About puntahan, GitHub, Tech Stack
2. Social/credit links: "Built by Justine" + GitHub icon
3. Dark mode aware — uses design tokens
4. Responsive: stacks on mobile, 3-col on desktop
5. **About page** (`/about`):
   - Project story: why you built it, what inspired it
   - Tech stack with logos
   - Feature highlights with screenshots
   - "Built with" section crediting open source tools
   - Link to GitHub repo

**Files to create/modify:**
- `src/components/layout/footer.tsx` — NEW: footer component
- `src/app/layout.tsx` — add Footer below main content
- `src/app/about/page.tsx` — NEW: about page

**Why this matters for resume:** A footer grounds the app as a complete product. The About page doubles as a portfolio piece — link to it directly from your resume.

**Effort:** S | **Priority:** High — polishes the entire app feel

---

## Phase 51: Feature Polish Pass

**Goal:** Go deeper on existing features instead of adding new ones. Turn "it works" into "it's polished." This is what separates a student project from a portfolio piece.

**What to build:**
1. **Empty states everywhere** — custom illustrations or messages for: no tips yet, no bookmarks, no itineraries, empty search results, no notifications
2. **Loading skeletons** — ensure every page/component that loads data has a proper skeleton (audit all `useQuery` calls)
3. **Toast notifications** — success/error feedback for: tip submitted, photo uploaded, itinerary created, advisory set, vote cast (use a simple toast component, not a library)
4. **Keyboard navigation** — ensure Tab order is logical, Enter/Space triggers buttons, Escape closes modals
5. **Micro-interactions** — subtle hover effects on cards, vote button animation (scale bump on click), smooth scroll to new tip after submission
6. **Mobile polish** — test every page at 375px width, fix any overflow or truncation issues

**Files to create/modify:**
- `src/components/ui/toast.tsx` — NEW: toast notification component
- `src/lib/hooks/use-toast.ts` — NEW: toast context hook
- Various components — add empty states, loading skeletons, toast triggers

**Why this matters for resume:** Polish is what hiring managers notice. They won't read your code first — they'll *use* the app. Smooth transitions, helpful empty states, and toast feedback make the app feel professional.

**Effort:** M | **Priority:** High — biggest perceived quality improvement

---

## Phase 52: Destination Hero Photo Gallery

**Goal:** The destination detail page currently shows only one hero image. Add a scrollable photo gallery in the hero area using community-uploaded photos + the hero image.

**What to build:**
1. Combine hero image + community photos into a hero gallery
2. Swipeable on mobile (touch gestures), arrow buttons on desktop
3. Photo count indicator (1/5, 2/5, etc.)
4. Click to open fullscreen lightbox (reuse existing `lightbox.tsx`)
5. "Add your photo" CTA if less than 5 photos exist

**Files to modify:**
- `src/components/destinations/destination-detail.tsx` — replace static hero with gallery
- `src/components/destinations/photo-gallery.tsx` — integrate with hero section

**Effort:** S-M | **Priority:** Medium

---

## Phase 53: "Back to Top" + Scroll Progress

**Goal:** Long destination pages need a way to jump back. Add a floating "back to top" button that appears after scrolling, and a thin progress bar at the top of the page.

**What to build:**
1. Floating "back to top" button — appears after scrolling 300px, smooth scroll on click
2. Thin progress bar at the top of the viewport (uses `scroll` event + `requestAnimationFrame`)
3. Uses coral color for the progress bar, warm-white for the button
4. Disappears on short pages where scrolling isn't needed

**Files to create:**
- `src/components/ui/scroll-to-top.tsx` — NEW
- `src/components/ui/scroll-progress.tsx` — NEW
- `src/app/layout.tsx` — add both components

**Effort:** XS | **Priority:** Low

---

## Phase 54: Destination Nearby Map Preview

**Goal:** The destination detail page has a "Nearby Destinations" section that's just a list. Add a small interactive map showing the current destination + nearby ones as pins.

**What to build:**
1. Small Leaflet map (200px height) in the sidebar of destination detail
2. Show current destination as a coral pin, nearby ones as teal pins
3. Click a pin to navigate to that destination
4. Reuse existing `map-view.tsx` patterns

**Files to modify:**
- `src/components/destinations/nearby-destinations.tsx` — add mini map above list
- `src/components/destinations/destination-detail.tsx` — adjust sidebar layout

**Effort:** S | **Priority:** Low

---

## Phase 55: Homepage Redesign — Hero That Sells puntahan's Identity

**Why not just copy Airbnb:** Airbnb's search-first hero exists because users come to *book* a specific place. puntahan users come to *discover* — they don't know where they want to go yet. A search bar hero is wrong for a discovery platform with 23 destinations. The hero should answer: "Why should I use puntahan instead of just Googling 'Philippines travel'?"

**What makes puntahan different from every other travel site:**
- Real peso budget breakdowns from actual travelers (not hotel marketing prices)
- Community tips with weighted voting (experienced travelers' opinions count more)
- Barkada trip planning with group voting
- Filipino-first — organized by Philippine regions, not global

**What to build:**
1. Full-width hero with a beautiful Philippine destination photo as background (rotate through seed photos)
2. Gradient overlay for readability
3. Headline: **"Real tips. Real budgets. Real travelers."** — this is puntahan's pitch, not "Discover the Philippines"
4. Subtitle: "Community-powered travel guide for the Philippines — honest tips and actual peso breakdowns from people who've been there"
5. Single CTA: "Start Exploring" button (coral) — scrolls to the destination grid
6. Small stats row inside hero: "23 destinations · 4 regions · community-driven" — shows the app has substance
7. On mobile: shorter hero, stacked layout
8. Keep the existing search bar BELOW the hero where it is now — search is a tool, not the identity

**Files to modify:**
- `src/app/page.tsx` — replace plain `<h1>` with hero component
- `src/components/destinations/hero-section.tsx` — NEW: hero with background image + pitch

**Effort:** M | **Priority:** High — defines what puntahan is at first glance

---

## Phase 56: Region Entry Points (The Filipino Mental Model)

**Why not Airbnb-style category tabs:** Airbnb has millions of listings so category filtering (Beach, Mountain, etc.) makes sense. puntahan has 23 destinations — scrolling 7 category tabs to filter 23 items is overkill. But Filipinos naturally think in **regions** first: "Should we go to Visayas or Mindanao?" That's the real mental model.

**What to build:**
1. Four region cards in a row directly below the hero
2. Each card uses the region's own color from the design system (NCR blue, Luzon green, Visayas amber, Mindanao purple)
3. Card content: region name, destination count (e.g., "Luzon · 8 destinations"), a representative photo from that region's destinations
4. Clicking a region card filters the grid below AND updates the URL (`?region=Visayas`)
5. Active region shows a selected state; clicking again deselects (shows all)
6. Responsive: 2x2 grid on mobile, 4 in a row on desktop

**Why this is puntahan-specific:** No other travel app organizes by NCR/Luzon/Visayas/Mindanao. This is distinctly Filipino. A tourist visiting the Philippines can immediately understand the geography.

**Files to create/modify:**
- `src/components/destinations/region-cards.tsx` — NEW: four region entry point cards
- `src/components/destinations/browse-page.tsx` — render above grid, connect to filter state + URL sync

**Effort:** S | **Priority:** High — gives Filipino structure to the discovery flow

---

## Phase 57: Smarter Card Grid for a Small Catalog

**Why NOT just add a 4th column:** With 23 destinations, 4 columns means only ~6 rows of cards. The page ends too quickly and feels empty. The problem isn't columns — it's that 3 columns at `max-w-6xl` leaves wasted space on the SIDES on wide monitors.

**What to actually do:**
1. Widen the container from `max-w-6xl` (1152px) to `max-w-7xl` (1280px) — fills more screen
2. Keep 3 columns on `lg:` — cards get slightly wider and the images look better
3. Add 4th column ONLY at `2xl:` (1536px+) — for users on ultra-wide monitors, not regular laptops
4. Make destination cards slightly taller — increase hero image from `h-40` to `h-48` so photos have more presence
5. Add a subtle hover lift effect: `hover:-translate-y-1 transition-transform` on cards

**Files to modify:**
- `src/app/page.tsx` — widen to `max-w-7xl`
- `src/components/destinations/destination-grid.tsx` — `lg:grid-cols-3 2xl:grid-cols-4`
- `src/components/destinations/destination-card.tsx` — taller image, hover lift

**Effort:** XS | **Priority:** Medium — looks better without feeling empty

---

## Phase 58: "Community Picks" Highlight Strip

**Why NOT a generic "Trending" section:** With 23 destinations and early-stage community activity, "trending" would show the same cards as the main grid — it adds nothing. What puntahan needs is to showcase its **unique value**: the community. Show that real people leave real tips here.

**What to build:**
1. A horizontal strip between the region cards and the main grid
2. Heading: "Community Picks" — shows the 3-4 destinations with the most tips + highest ratings
3. Each card is wider than normal (landscape format), showing: hero image, destination name, tip count, average rating, and a PREVIEW of the top-rated tip (first 80 characters)
4. This is puntahan's social proof — "Real people left real tips here, this isn't a ghost town"
5. Only show this section if at least 3 destinations have tips (don't show empty social proof)

**Files to create/modify:**
- `src/components/destinations/community-picks.tsx` — NEW: horizontal highlight with tip previews
- `src/components/destinations/browse-page.tsx` — render between regions and grid
- `convex/destinations.ts` — add `listTopRated` query (filter tipsCount > 0, sort by avgRating, take 4)

**Effort:** S-M | **Priority:** Medium — proves the community is real

---

## Phase 59: Budget Quick-Filters (puntahan's Killer Feature)

**Why this instead of more category tabs:** Every travel site has category filters. Almost none let you filter by ACTUAL BUDGET with real peso amounts. This is puntahan's differentiator — real budget data from real travelers. Make it visible, not hidden in the advanced filter panel.

**What to build:**
1. Three tappable budget pills directly above the card grid: "Budget (under ₱5k)" · "Mid-range (₱5k-15k)" · "Luxury (₱15k+)"
2. Single-select — tap one to filter, tap again to clear
3. Works alongside region filter (can combine: "Visayas + Budget")
4. Syncs to URL params (`?budget=Budget`)
5. Shows count on each pill: "Budget (12)" so users know what to expect

**Why this is puntahan-specific:** This is the feature you'd talk about in interviews — "Unlike TripAdvisor, puntahan shows real budget data from actual travelers, and users can filter destinations by actual cost range." No other travel platform does this with community-sourced data.

**Files to create/modify:**
- `src/components/destinations/budget-pills.tsx` — NEW: three budget filter pills
- `src/components/destinations/browse-page.tsx` — render above grid, connect to filter + URL

**Effort:** S | **Priority:** High — showcases puntahan's unique value

---

## Build Order (Week 9-10)

| Order | Phase | Feature | Effort | Category |
|-------|-------|---------|--------|----------|
| 1 | 55 | Hero — "Real tips. Real budgets." | M | Identity — sells what puntahan is |
| 2 | 56 | Region Entry Points (PH mental model) | S | Discovery — Filipino-first navigation |
| 3 | 59 | Budget Quick-Filters (killer feature) | S | Discovery — puntahan's differentiator |
| 4 | 57 | Smarter Card Grid | XS | Layout — wider, taller, hover lift |
| 5 | 58 | Community Picks (social proof) | S-M | Trust — proves the community is real |
| 6 | 60 | Tip Preview on Cards | XS | Trust — shows community is active |
| 7 | 61 | "Add Your Tip" Floating CTA | XS | Engagement — lowers contribution barrier |
| 8 | 62 | Top Contributors Strip | S | Trust — real people with real badges |
## Phase 60: Tip Preview on Destination Cards

**Why:** The research says social proof must be visible on the homepage, not buried in detail pages. Right now, destination cards show a rating and tip count — but users can't tell if those tips are real or useful. Showing the first line of the top tip proves there's real community content.

**What to build:**
1. On each destination card, below the categories, show a 1-line preview of the highest-rated tip
2. Format: `"Great beach, uncrowded in October..." — Maria` (truncated to ~60 chars + author name)
3. Only show if the destination has at least 1 tip
4. Subtle warm-gray text, small font — it shouldn't dominate the card, just prove there's content
5. Requires adding top tip data to the destination list query (or fetching separately)

**Files to modify:**
- `convex/destinations.ts` — include top tip preview in list query
- `src/components/destinations/destination-card.tsx` — render tip preview line

**Effort:** XS | **Priority:** High — biggest trust signal improvement

---

## Phase 61: "Been Here? Share a Tip" Floating CTA

**Why:** The UX Magazine research says contribution CTAs should be prominent, not hidden. Currently, sharing a tip requires: click destination → scroll to tips → click "Share a Tip." For a community platform that lives or dies on user content, contributing should be frictionless.

**What to build:**
1. On destination detail page, add a fixed-bottom CTA bar (above bottom nav on mobile): "Been to [Name]? Share your tip"
2. Clicking it smooth-scrolls to the tip form and auto-opens it
3. Only shows for authenticated users who haven't tipped this destination yet
4. Disappears once user starts scrolling into the tips section (they've seen it)
5. Uses coral background for visibility

**Files to modify:**
- `src/components/destinations/destination-detail.tsx` — add floating CTA bar
- `src/components/tips/tip-form.tsx` — accept a ref to trigger scroll-to + open

**Effort:** XS | **Priority:** Medium — lowers the barrier to contribute

---

## Phase 62: Top Contributors Strip

**Why:** User profiles with credibility markers (badges, tip counts) build trust — the research is clear on this. puntahan already has badges and weighted voting, but they're invisible unless you visit someone's profile. Surfacing top contributors on the homepage proves real humans use this app.

**What to build:**
1. Small horizontal section on homepage: "Top Contributors"
2. Show 5 users with the most tips: avatar, name, badge icon, tip count
3. Clicking a contributor links to the leaderboard page
4. Only show if at least 3 users have tips (don't show empty social proof)
5. Compact design — not a full section, just a thin strip between community picks and the grid

**Files to create/modify:**
- `src/components/destinations/top-contributors.tsx` — NEW: compact contributor strip
- `src/components/destinations/browse-page.tsx` — render between sections

**Effort:** S | **Priority:** Medium — proves the community has real people

---

| 6 | 49 | Onboarding Flow | M | UX — first impression |
| 7 | 50 | Footer & About Page | S | UX — completes the product |
| 8 | 51 | Feature Polish Pass | M | UX — toasts, empty states, skeletons |
| 9 | 52 | Hero Photo Gallery | S-M | UX — visual polish |
| 10 | 53 | Back to Top + Progress | XS | UX — micro interaction |
| 11 | 54 | Nearby Map Preview | S | UX — map enhancement |
| 12 | 44 | Dynamic OG Images | M | Feature — social sharing |
| 13 | 45 | Filipino i18n | M | Feature — bilingual support |
| 14 | 46 | Rate Limiting | S-M | Security — abuse prevention |
| 15 | 47 | Analytics Dashboard | M | Feature — admin metrics |
| 16 | 40 | Testing (Vitest) | S | Infra — unit tests |
| 17 | 41 | CI/CD (GitHub Actions) | XS | Infra — automated checks |
| 18 | 43 | Error Tracking (Sentry) | S | Infra — observability |
| 19 | 48 | README & Docs | S | Docs — screenshots, demo video |
| 20 | 42 | Deploy to Vercel | S | Ship — go live |
