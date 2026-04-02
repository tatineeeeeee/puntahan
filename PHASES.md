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

## Build Order

| Phase | Feature | Effort | Impact |
|-------|---------|--------|--------|
| 31 | Tip Photos Inline | S-M | High — biggest visible improvement |
| 32 | Shareable Filter URLs | S | High — instant UX win |
| 33 | Local Guide Badges | S-M | Medium — community growth |
| 34 | Social Sharing Cards | S | Medium — organic traffic |
| 35 | Printable Itinerary | S | Low — nice-to-have utility |
| 36 | Group Trip Voting | M | High — viral growth loop |
| 37 | Weighted Vote Ranking | M | Medium — content quality |
| 38 | Travel Advisories | M | Medium — trust & safety |
