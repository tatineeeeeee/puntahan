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

---

# Week 11: Security Hardening Pass

Findings from the 2026-04-20 senior-engineer OWASP audit. Do these in order — each closes a specific exploitable gap. Citations are OWASP Top 10 2021 categories.

---

## Phase 63: Rotate Dev Secrets & Audit Git History

**Goal:** The 2026-04-20 audit confirmed `.env.local` contains live Clerk secret key + Clerk webhook signing secret + Convex deploy token. `.gitignore` correctly excludes `.env*` but rotate anyway as defense-in-depth before continuing.

**What to build:**
1. Clerk dashboard → API Keys → regenerate secret + publishable; update `.env.local`
2. Clerk dashboard → Webhooks → rotate signing secret; update `CLERK_WEBHOOK_SECRET` in **Convex Dashboard env vars** (not `.env.local`)
3. Run `git log --all --full-history -- .env.local` to confirm the file was never committed
4. Add `gitleaks` or `git-secrets` pre-commit hook so this can't regress
5. Document secret-rotation procedure in `SECURITY.md` (new file, ≤30 lines)

**Files to modify:**
- `.env.local` (local, not committed)
- `.husky/pre-commit` or `.github/workflows/ci.yml` — add secret scanning step
- `SECURITY.md` — NEW

**OWASP:** A02 Cryptographic Failures / A05 Security Misconfiguration

**Effort:** XS | **Priority:** Critical — do first

---

## Phase 64: Authenticate Trip Suggestion Voting

**Goal:** `convex/tripSuggestions.ts` identifies voters by free-text `voterName: v.string()`. Anyone can vote as anyone, bypass the rate limit by changing names each call, and lock the real owner out by voting with their display name first. `voters: v.array(v.string())` can also be inflated to the 1 MB document limit, DoS'ing the suggestion entirely.

**What to build:**
1. Replace `voterName: v.string()` with `getCurrentUserOrThrow(ctx)` — authenticated identity only
2. Migrate `voters: v.array(v.string())` → `v.array(v.id("users"))` in schema
3. Rate-limit `vote` mutation using `checkRateLimit(ctx, \`vote-suggestion:${user._id}\`, 60)`
4. Rate-limit `suggest` on `user._id`, not on user-supplied name
5. Decide whether anonymous users can still suggest/vote (probably no — require sign-in for group trip voting)
6. Data migration: existing `voters` string arrays get cleared or mapped to user IDs via a one-time internal mutation

**Files to modify:**
- `convex/schema.ts` — `trip_suggestions.voters` type change
- `convex/tripSuggestions.ts` — auth check, rate limit, validation
- `src/components/itineraries/voting-page.tsx` — require auth, remove name input
- `convex/migrations.ts` (or new `internalMutation`) — one-time data backfill

**OWASP:** A01 Broken Access Control / A07 Authentication Failures

**Effort:** S | **Priority:** Critical

---

## Phase 65: Itinerary Share Tokens & Editor Access Hardening

**Goal:** Three distinct access-control gaps in `convex/itineraries.ts`: share tokens never expire or rotate, editors can toggle `isPublic` (leaking owner-private itineraries), and there's no `removeCollaborator` mutation — ex-collaborators keep access forever.

**What to build:**
1. `revokeShareLink` mutation — sets `shareToken: undefined`, owner-only
2. `rotateShareLink` mutation — regenerates token, invalidating old one
3. Optional `shareTokenExpiresAt` field + check in `getByShareToken`
4. Restrict `isPublic` toggle in `update` to owner only (`if (args.isPublic !== undefined && !isOwner) throw`)
5. `removeCollaborator({ itineraryId, userId })` mutation — owner-only, cleans both `sharedWith` array and `itinerary_shares` row
6. UI: "Revoke link" button in share dialog; "Remove" button next to each collaborator
7. Fix token generation modulo bias in `itineraries.ts:6-15` (use rejection sampling or base36 from `Uint32Array`)

**Files to modify:**
- `convex/schema.ts` — add `shareTokenExpiresAt?: v.number()` (optional)
- `convex/itineraries.ts` — new mutations + `update` guard
- `src/components/itineraries/itinerary-detail.tsx` — UI for revoke/remove

**OWASP:** A01 Broken Access Control / A02 Cryptographic Failures (modulo bias)

**Effort:** S | **Priority:** Critical

---

## Phase 66: Tip Photo Ownership Verification

**Goal:** `convex/tips.ts` accepts `photosStorageIds: v.array(v.string())` with zero ownership check. Any leaked storage ID (via logs, Sentry breadcrumbs, OG cache) can be attached to arbitrary public tips, hijacking someone else's upload. `photos.generateUploadUrl` also has no rate limit and no server-side MIME/size validation — client-only checks are bypassable.

**What to build:**
1. New `photos` table: `{ storageId, uploadedBy, contentType, sizeBytes, createdAt, attachedTo?: Id<"tips" | "destinations"> }`
2. `photos.confirmUpload` mutation — called after client POSTs to upload URL; validates content-type (via `ctx.storage.getMetadata`), size (≤5MB), and `uploadedBy === user._id`
3. `tips.create` validates every `storageId` in `photosStorageIds` has a matching `photos` row owned by the current user
4. Rate-limit `photos.generateUploadUrl` and `photos.confirmUpload` (20/hour/user)
5. Reject SVG uploads (serve with `Content-Disposition: attachment` if must support) — SVG can contain JS
6. Magic-byte check in a server-side action (first 12 bytes of blob) — don't trust Content-Type alone

**Files to modify:**
- `convex/schema.ts` — add `photos` table + index `by_uploader` on `uploadedBy`
- `convex/photos.ts` — rewrite `generateUploadUrl`, add `confirmUpload`
- `convex/tips.ts` — verify photo ownership in `create` and `update`
- `src/components/destinations/photo-upload.tsx` — add `confirmUpload` call after upload
- `src/components/tips/tip-form.tsx` — same

**OWASP:** A01 Broken Access Control / A04 Insecure Design

**Effort:** M | **Priority:** High

---

## Phase 67: Analytics, Admin Surface & Rate Limiter Hardening

**Goal:** Three related hardening items: unbounded public `analytics.trackEvent` + unbounded `.collect()` in admin/analytics dashboards + rate-limiter keys being user-controllable in places.

**What to build:**
1. `analytics.trackEvent` — cap string lengths (`event ≤ 64`, `page ≤ 200`, `metadata ≤ 1000`); rate-limit per user (or session fingerprint for anonymous); reject unknown event types via `v.union(v.literal(...))` instead of `v.string()`
2. Precompute daily `analytics_rollups` via internal cron — replace the 4× `.collect()` in `analytics.dashboardStats` with a rollup read
3. Same pattern for `destinations.listTopRated` and `destinations.stats` — materialized list updated on `tips.create` / `votes.castVote`
4. `admin.allUsers` — return projected subset (name, imageUrl, role, stats) — never expose `email` or `clerkUserId` in admin list views; provide a separate `admin.getUserDetail` that logs the access
5. Audit every `rate_limits` key — must be keyed on authenticated identity, never user-supplied string. Add a lint comment pattern (`// rate-limit key: <authenticated-id>`) for future endpoints
6. Scheduled cron: prune `rate_limits` rows where `windowStart < now - WINDOW_MS` (the table currently grows unbounded)
7. Webhook failure logging in `convex/http.ts` — include svix-id, timestamp; forward to Sentry; alert on repeated failures
8. `itineraries.addCollaborator` email enumeration fix — return generic success regardless of whether email exists; send email out-of-band

**Files to modify:**
- `convex/schema.ts` — `analytics_rollups` table, `destination_stats` table
- `convex/analytics.ts` — bounded validators, rollup queries
- `convex/admin.ts` — projected user response, audit logging
- `convex/destinations.ts` — materialized stats reads
- `convex/rateLimit.ts` — cleanup cron
- `convex/crons.ts` — schedule rollups + cleanup
- `convex/http.ts` — enriched failure logging
- `convex/itineraries.ts` — `addCollaborator` generic response

**OWASP:** A04 Insecure Design / A09 Logging & Monitoring Failures / A07 (email enum)

**Effort:** M | **Priority:** High

---

# Week 12+: Distinctly Filipino Features

12 feature ideas grounded in Philippine travel realities — culture, transport, weather, language, food, disaster response. Ranked top three: 68+69 (Signal Bagyo + Ayuda Mode, build together), 70 (Paano Pumunta), 76 (Kain Tayo).

---

## Phase 68: Signal Bagyo — PAGASA Typhoon Overlay

**Goal:** Real-time typhoon advisory per destination during bagyo season (Jun-Nov). Surfaces Signal 1-5 warnings on destination cards and detail pages, pushes notifications to users with bookmarks or itineraries in affected provinces.

**What to build:**
1. Nightly Convex cron fetches latest PAGASA Tropical Cyclone Bulletins via the MIT-licensed [`pagasa-parser`](https://github.com/pagasa-parser) npm package (no official PAGASA API exists — parser extracts from PDF/web)
2. New tables: `typhoon_bulletins` (name, category, bulletin_no, issued_at, raw_payload) and `typhoon_signals` (bulletin_id, province_slug, signal: 1-5)
3. Destinations get a banner on detail and card: color-coded by signal (yellow=1, orange=2-3, red=4-5), text: "Signal 3 — Bagyong Kiko (as of 5PM)"
4. New route `/typhoon/[name]` — lists every puntahan destination in the bulletin's path
5. Scheduled internal mutation: notify users whose `bookmarks` or `itineraries.days` contain affected destinations within 48 hours
6. Historical frequency display per destination ("July: 3.2 typhoons avg") — aggregate from past bulletins

**Files to create/modify:**
- `convex/schema.ts` — two new tables
- `convex/typhoons.ts` — NEW: cron action, list queries, signal lookups
- `convex/crons.ts` — schedule hourly fetch during typhoon season
- `src/components/destinations/typhoon-banner.tsx` — NEW
- `src/app/typhoon/[name]/page.tsx` — NEW
- `convex/notifications.ts` — typhoon notification type

**External deps:** `pagasa-parser` npm package (MIT)

**Effort:** M | **Priority:** High — strongest portfolio story

---

## Phase 69: Ayuda Mode — Disaster Response Flip

**Goal:** When a destination's typhoon signal hits ≥3 (from Phase 68), the page *flips* from travel guide to mutual aid: community-submitted donation drives, safety check-ins, re-open status reports. This is the feature that says "I understand in PH, travel and disaster response are the same problem."

**What to build:**
1. Destination page conditionally flips when `activeSignal >= 3`: photo gallery dims, banner replaces with "BAGYONG [NAME] — This area needs help"
2. New table `relief_drives`: organizer, GCash/bank, needs list (food/water/medicine), verified flag for established NGOs (Caritas, Red Cross, AKAP)
3. Public mutation to submit a drive; admin verification for NGO-tier flag
4. New table `safety_checkins`: user, destinationId, status ("safe" | "affected" | "need_help"), timestamp — community-driven (like FB Safety Check)
5. Post-storm `reopen_reports`: community-verified "which resorts are back, which roads passable"
6. Moderation: report false drives, auto-archive after typhoon clears

**Files to create/modify:**
- `convex/schema.ts` — three new tables
- `convex/relief.ts` — NEW: drives, check-ins, reopen reports
- `src/components/destinations/ayuda-mode.tsx` — NEW: the flipped UI
- `src/components/destinations/destination-detail.tsx` — conditional render
- `src/components/admin/verify-drives-tab.tsx` — NEW admin UI

**Depends on:** Phase 68 (needs active-signal data)

**Effort:** L | **Priority:** High — emotional resonance, portfolio cornerstone

---

## Phase 70: Paano Pumunta — Community Transport Legs

**Goal:** Google Maps doesn't know you take Ceres Liner to Moalboal for ₱180. This is tribal knowledge in Facebook groups. puntahan surfaces it with community-submitted, fare-drift-detected transport chains.

**What to build:**
1. New table `transport_legs`: `{ destinationId, fromHub, mode: "jeepney"|"tricycle"|"habal-habal"|"bus"|"fastcraft"|"RORO"|"van", farePhp, durationMinutes, operator?, notes, userId, votes }`
2. Pre-seed with LTFRB 2026 base fares (jeep ₱14+₱2/km, city aircon bus ₱18+₱2.98/km) so it's not empty on launch
3. Form on each destination: "Add a leg" from a dropdown of common hubs (Manila, Cebu, Davao, CDO, Baguio, Iloilo, Tacloban)
4. Stacked timeline render per origin hub: total peso + total time, citable sources per leg
5. Fare-drift detection: if latest 3 submissions for a leg differ >15% from top-voted, flag for review
6. Filter: "Show only destinations reachable from [hub] for under ₱[amount]"

**Files to create/modify:**
- `convex/schema.ts` — `transport_legs` + `transport_votes` + `transport_hubs` tables
- `convex/transport.ts` — NEW: addLeg, voteLeg, listByDestination, detectDrift
- `src/components/destinations/transport-timeline.tsx` — NEW
- `src/components/destinations/destination-detail.tsx` — new "Paano Pumunta" section

**Effort:** M | **Priority:** High — solves real Filipino pain, leverages community

---

## Phase 71: Fiesta Mode — Festival-Aware Destination Surfacing

**Goal:** Upgrade the existing festival calendar. Link each festival to destinationId + provinceSlug; warn in itinerary builder when dates overlap a fiesta (crowded, 2× lodging prices); surface community tips for each festival.

**What to build:**
1. Extend existing `festivals` table: add `destinationIds: v.array(v.id("destinations"))`, `provinceSlug: v.string()`, `expectedCrowdLevel: "low"|"medium"|"high"|"extreme"`
2. Destination page banner: "MassKara runs Oct 19–25 — expect 2× hotel prices, book now" (only if within 60 days of fiesta)
3. Itinerary builder warning: "Your Baguio trip overlaps Panagbenga — crowded"
4. `/fiesta-calendar` grid view by month; click a festival → filters destinations to that province
5. Community tips sub-thread per festival: parade routes, road closures, where locals watch from

**Files to modify:**
- `convex/schema.ts` — festival fields
- `convex/festivals.ts` — listWithDestinations, overlapCheck for itineraries
- `convex/itineraries.ts` — add festival-overlap warning to queries
- `src/components/destinations/festival-banner.tsx` — NEW
- `src/app/festivals/page.tsx` — upgrade to grid + filter view

**Effort:** S | **Priority:** Medium

---

## Phase 72: Pisoboard — Real Peso Median Breakdowns

**Goal:** Budget pills ("Budget/Mid/Luxury") are generic. Filipinos ask "magkano talaga?" — actual peso amounts from actual travelers. Show median peso per category with "kuripot" and "pasabog" toggles (tightwad vs splurge).

**What to build:**
1. New table `cost_items`: `{ destinationId, category: "transport"|"entrance"|"meals"|"accommodation"|"pasalubong", amountPhp, tier: "kuripot"|"mid"|"pasabog", submittedAt, userId, votes }`
2. Submission form under each destination: pick category + amount + tier
3. Per-destination card computing **medians per category** (so outliers don't skew)
4. "Kuripot mode" / "Pasabog mode" toggle: shows cheapest-only or splurge-only numbers
5. Derived total: "3-day Sagada for 1 pax: ₱3,450 (kuripot) – ₱8,200 (pasabog)"
6. Data quality: require 3+ submissions per category before showing numbers; else "Help us — share your peso amount"

**Files to create/modify:**
- `convex/schema.ts` — `cost_items` table with indexes `by_destination_category`, `by_destination_tier`
- `convex/costs.ts` — NEW: add, list, computeMedian queries
- `src/components/destinations/pisoboard.tsx` — NEW
- `src/components/destinations/destination-detail.tsx` — integrate

**Effort:** M | **Priority:** Medium-High

---

## Phase 73: Diskwento Mode — Senior/PWD 20% Discount Visibility

**Goal:** RA 9994 (seniors) and RA 10754 (PWDs) legally mandate 20% off fare + hotels + restaurants. No PH travel site surfaces it. Profile toggle makes every peso figure across puntahan render with strikethrough + discounted value.

**What to build:**
1. Profile toggle: "I'm a senior citizen / PWD" (private boolean, never displayed on public profile)
2. UI layer: when enabled, every `₱X` figure shows `~~₱X~~ ₱0.8X`
3. Per-destination "Accessibility & discount notes" section: community-submitted reports of which establishments honored the discount without hassle vs which needed escalation
4. Printable "Know Your Rights" card at `/diskwento/rights` — RA citations, counter-script, NCDA/DSWD hotlines
5. Optional: filter "Show destinations with 3+ confirmed-compliant establishments"

**Files to create/modify:**
- `convex/schema.ts` — `users.discountEligibility: v.optional(v.union(v.literal("senior"), v.literal("pwd")))`; new `accessibility_reports` table
- `convex/users.ts` — `setDiscountEligibility` mutation
- `convex/accessibility.ts` — NEW: submit, list reports
- `src/lib/hooks/use-discount.ts` — NEW: context hook
- `src/components/ui/peso.tsx` — NEW: peso-rendering component that auto-applies discount
- `src/app/diskwento/rights/page.tsx` — NEW: printable rights card
- Every place displaying peso figures — replace raw `₱{n}` with `<Peso value={n} />`

**Effort:** S-M | **Priority:** Medium — socially meaningful, low cost

---

## Phase 74: Barkada Split — Filipino-Role Group Expense Splitter

**Goal:** Extend existing group trip voting with a bill-splitter tuned to Filipino group dynamics. Auto-computes "si Juan owes Maria ₱450" net settlements. Role tags ("Kuripot" / "Pasabog" / "Treasurer") make the dynamics explicit. GCash/Maya deep links for settling up.

**What to build:**
1. New tables: `group_expenses` (payer, amount, category, itineraryId, splitAmong: userIds[], receipt photo?) and `group_settlements` (from, to, amount, itineraryId, settled_at?)
2. Inside itinerary detail, "Expenses" tab: anyone adds expense; auto-computes debt graph via simplified settlement algorithm
3. Collaborator role tags in `itineraries.sharedWith`: `kuripot` | `pasabog` | `treasurer`
4. Treasurer sees all receipts + export CSV; pasabog is suggested as payer for splurge items
5. Deep link `gcash://send?amount=...&message=...` from settlement row (fallback to copy-amount on iOS/non-GCash users)
6. "Settled" toggle per settlement; reopen if someone disputes

**Files to create/modify:**
- `convex/schema.ts` — two new tables; collaborator role enum
- `convex/expenses.ts` — NEW: add, list, computeSettlements
- `src/components/itineraries/expenses-tab.tsx` — NEW
- `src/components/itineraries/itinerary-detail.tsx` — new tab

**Effort:** M | **Priority:** Medium-High

---

## Phase 75: Wika Wiki — Regional Language Phrase Cheat Sheets

**Goal:** Many urban Filipinos don't speak Ilocano, Cebuano, Waray, Hiligaynon, Bikol. You're effectively a tourist in your own country going from Manila to Bohol. Show survival phrases contextually per region with optional community audio clips.

**What to build:**
1. Static seed: ~30 survival phrases per language (Tagalog, Cebuano, Ilocano, Hiligaynon, Waray, Bikol, Chavacano) — greetings, numbers, "how much", "where's the CR", "thank you"
2. Destination detail shows language card contextually based on `destination.region` / `province` (Bohol → Cebuano; Ilocos → Ilocano)
3. Community extension: users add/upvote phrases; optional audio clip upload (reuse existing Convex storage + `photos` pattern from Phase 66)
4. Copy-to-clipboard button on each phrase
5. `/wika` route: browse all phrases by language

**Files to create/modify:**
- `convex/schema.ts` — `phrases` table `{ language, ph, en, audioStorageId?, votes, submittedBy, approved }`
- `convex/phrases.ts` — NEW: list, submit, upvote
- `src/components/destinations/phrase-card.tsx` — NEW
- `src/app/wika/page.tsx` — NEW
- `convex/seed.ts` — add phrase seed data

**Effort:** S | **Priority:** Medium

---

## Phase 76: Kain Tayo — Regional Food Passport

**Goal:** Food is destination-bound in PH in a way it isn't most places. You don't go to Cebu and not eat lechon. Gamify the existing photo + badge system: collect regional must-eats, earn Food Passport badges per region. Adds pasalubong recommendations per destination.

**What to build:**
1. New table `dishes`: `{ name, regionSlug, descriptionPh, descriptionEn, bestEatenAt: string[], priceRangePhp, iconStorageId? }` — pre-seeded with ~50 dishes (lechon, sisig, batchoy, pancit habhab, bicol express, Vigan bagnet, pastil, kinilaw, etc.)
2. Destination detail links to `mustEats: Id<"dishes">[]` (Cebu → lechon, Iloilo → batchoy, Lucban → pancit habhab)
3. Users log dishes via photo upload (reuses existing photo flow); new table `food_passport_entries: { userId, dishId, photoStorageId, destinationId, tastedAt }`
4. Badge tier: "Food Passport: [Region]" at 5+ dishes logged in that region; new leaderboard tab "Top Food Explorers"
5. Pasalubong tab per region: `pasalubong_items` table (Cebu dried mangoes, Davao durian candy, Iloilo barquillos, Vigan bagnet, Baguio strawberry jam) — community-extensible
6. "You're missing X" nudges on dish list: grayed-out card with "tap to see where" link

**Files to create/modify:**
- `convex/schema.ts` — `dishes`, `food_passport_entries`, `pasalubong_items` tables
- `convex/food.ts` — NEW: logDish, listDishesByRegion, computePassport
- `src/lib/badges.ts` — add food passport badge logic
- `src/components/destinations/must-eats.tsx` — NEW
- `src/components/destinations/pasalubong-tab.tsx` — NEW
- `src/components/profile/food-passport-shelf.tsx` — NEW
- `convex/seed.ts` — dishes + pasalubong seed

**Effort:** M | **Priority:** High — joyful demo screenshot, extends existing infra

---

## Phase 77: Tita Stay — Homestay & Pamilyahan Directory

**Goal:** Agoda/Booking miss the entire "Tita Baby has a room sa Sagada, ₱500/night, text mo lang" economy. Community-submitted homestays with contact methods (Messenger link, OTP-verified mobile, GCash-receive number), moderated for dead numbers.

**What to build:**
1. New `accommodations` table: `{ destinationId, type: "homestay"|"hotel"|"resort"|"hostel"|"camping", name, contactMethod: "fb"|"mobile"|"gcash", contactValue, pricePhpPerNight, roomCount, specialty, verified, submittedBy }`
2. Submission form with type-specific contact fields; mobile numbers verified via SMS OTP (Clerk-adjacent or Convex action + SMS provider)
3. "Nagbigay ng service" rating instead of stars — community checklist: hot shower, Wi-Fi, food included, AC, friendly tita
4. `stay_confirmations` table: users report successful stays; 3 confirmations = "community verified" badge on listing
5. Report dead-number flow; auto-hide after 2 reports until re-verified
6. Rate-limit submissions (already have rate limiting infra)

**Files to create/modify:**
- `convex/schema.ts` — `accommodations`, `accommodation_reports`, `stay_confirmations`
- `convex/accommodations.ts` — NEW
- `convex/sms.ts` — NEW (OTP verification action)
- `src/components/accommodations/` — NEW directory
- `src/app/accommodation/[id]/page.tsx` — NEW

**Effort:** M-L | **Priority:** Medium — high moderation burden

---

## Phase 78: Signal Check — Telco Coverage Reports

**Goal:** "May signal ba ang Globe sa Batanes?" is a universal pre-trip question. Telco coverage maps exist but are aspirational marketing. Community reports give ground truth.

**What to build:**
1. New `signal_reports` table: `{ destinationId, telco: "Globe"|"Smart"|"DITO"|"TNT"|"TM", strength: 1-5, speedMbps?, lastMeasured, submittedBy }`
2. Destination page shows three bars: "Globe: 4/5 (n=28), Smart: 2/5 (n=19), DITO: 1/5 (n=6)"
3. Filter: "Show only destinations with ≥3 signal for [my carrier]"
4. Optional: PWA offline-first caching — "Download this destination" caches the destination detail page for no-signal use
5. Aggregation: weight recent reports higher (exponential decay); show "last measured X days ago"

**Files to create/modify:**
- `convex/schema.ts` — `signal_reports` table
- `convex/signals.ts` — NEW: submit, listByDestination, aggregate
- `src/components/destinations/signal-bars.tsx` — NEW
- `public/sw.js` — Service Worker for offline caching (optional sub-phase)

**Effort:** S | **Priority:** Medium

---

## Phase 79: Balikbayan Mode — OFW Persona Features

**Goal:** Millions of OFWs plan yearly trips home — distinct persona with distinct needs: multi-province family rounds, pasalubong shopping with customs rules, crowd advisories for NAIA during Holy Week / Undas / Christmas.

**What to build:**
1. Profile toggle: "I'm a Balikbayan / OFW based in [country dropdown]"
2. Unlocks **multi-province itinerary template**: "Manila 2d → Pampanga 1d lola → Cebu 3d in-laws → Bohol 2d kids" with estimated domestic-flight costs (PAL/Cebu Pacific/AirAsia reference data)
3. **Pasalubong Planner** module: pick items per destination (reuses Phase 76 pasalubong data), auto-calcs total weight/cost, warns against prohibited customs items (no dried fish in checked bags to US/UAE, no fresh fruit to AU, etc.) — static `customs_rules.json` per country
4. "Share trip plan with Tita in PH" — reuses existing share-token but public-read-only and Tita can comment (new `itinerary_comments` table for non-collaborator feedback)
5. Surface crowd advisories: "NAIA Terminal 1 is a warzone Dec 22-24; fly Dec 20 or Dec 26" — static advisory config with in-code dates for Holy Week, Undas, Christmas exodus

**Files to create/modify:**
- `convex/schema.ts` — `users.balikbayanCountry?`, `itinerary_comments` table
- `convex/itineraries.ts` — comment mutations
- `src/lib/customs-rules.ts` — static data per country
- `src/components/itineraries/pasalubong-planner.tsx` — NEW
- `src/components/itineraries/crowd-advisory.tsx` — NEW
- `src/app/profile/page.tsx` — balikbayan toggle

**Depends on:** Phase 76 (pasalubong data)

**Effort:** M | **Priority:** Medium

---

## Build Order — Security First, Then Features

| Order | Phase | Feature | Effort | Category |
|-------|-------|---------|--------|----------|
| 1 | 63 | Rotate dev secrets + git audit | XS | Security — critical, do first |
| 2 | 64 | Authenticate trip suggestion voting | S | Security — critical |
| 3 | 65 | Itinerary share token & editor hardening | S | Security — critical |
| 4 | 66 | Tip photo ownership verification | M | Security — high |
| 5 | 67 | Analytics, admin, rate-limit hardening | M | Security — high |
| 6 | 68 | Signal Bagyo (PAGASA overlay) | M | Feature — distinctly PH |
| 7 | 69 | Ayuda Mode (disaster response flip) | L | Feature — portfolio cornerstone |
| 8 | 70 | Paano Pumunta (community transport) | M | Feature — distinctly PH |
| 9 | 76 | Kain Tayo (food passport) | M | Feature — joyful demo |
| 10 | 72 | Pisoboard (peso medians) | M | Feature — useful |
| 11 | 74 | Barkada Split (group expenses) | M | Feature — cultural |
| 12 | 71 | Fiesta Mode (festival surfacing) | S | Feature — extends existing |
| 13 | 73 | Diskwento Mode (senior/PWD) | S-M | Feature — socially meaningful |
| 14 | 75 | Wika Wiki (regional phrases) | S | Feature — charming |
| 15 | 78 | Signal Check (telco coverage) | S | Feature — practical |
| 16 | 79 | Balikbayan Mode (OFW persona) | M | Feature — underserved users |
| 17 | 77 | Tita Stay (homestay directory) | M-L | Feature — novel, moderation-heavy |
