# puntahan — Development Phases

## Overview

29 phases across 5 weeks (W4-W8). Each phase is 1-2 days max.

- **W4** — Foundation (Phases 1-6)
- **W5** — Content + Discovery (Phases 7-12)
- **W6** — Community + Social (Phases 13-18)
- **W7** — Power Features (Phases 19-24)
- **W8** — Polish + Deploy (Phases 25-29)

---

## W4 — Foundation

### Phase 1: Project Setup (W4 D1) — DONE
- [x] Providers (Convex+Clerk wrapper)
- [x] proxy.ts (Clerk route protection)
- [x] Root layout with providers
- [x] globals.css with @theme (tropical warm palette)
- [x] DM Sans font setup
- [x] cn() utility (clsx + tailwind-merge)

### Phase 2: Design System (W4 D2) — DONE
- [x] Logo SVG (map pin + letter P)
- [x] Button component (coral primary, teal secondary, ghost variants)
- [x] Badge component (region badges, budget badges)
- [x] Card component (sand bg, rounded, shadow)
- [x] Skeleton component (loading placeholders)
- [x] Rating component (star display)
- [x] Dark mode CSS variables (prep for Phase 24)

### Phase 3: Schema + Seed (W4 D3) — DONE
- [x] Convex schema: destinations, tips, votes, users, bookmarks, itineraries
- [x] Indexes for all query patterns
- [x] Search index on destination name
- [x] Seed 23 real PH destinations with categories/tags/seasons/festivals
- [x] Destination categories: Beach, Mountain, Historical, Island Hopping, Waterfall, City, Food Trip

### Phase 4: Auth Flow (W4 D4) — DONE
- [x] convex/auth.config.ts
- [x] convex/http.ts (Clerk webhook handler with svix verification)
- [x] convex/users.ts (upsertFromClerk, deleteFromClerk, getCurrentUser)
- [x] Sign-in page (src/app/sign-in/[[...sign-in]]/page.tsx)
- [x] Protected route config in proxy.ts (submit, profile, admin)

### Phase 5: Browse Page (W4 D5-6) — DONE
- [x] Destination card component (photo, name, region badge, budget badge, rating, category tags)
- [x] Region tabs (All / NCR / Luzon / Visayas / Mindanao) — color-coded
- [x] Category filter pills (Beach, Mountain, Historical, etc.)
- [x] Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [x] Skeleton loading state
- [x] Empty state when no results

### Phase 6: Search + Sort (W4 D7) — DONE
- [x] Search bar with debounced input (Convex full-text search)
- [x] Sort dropdown (Top Rated, Budget: Low-High, Budget: High-Low, A-Z)
- [x] Combined search + region + category + sort

---

## W5 — Content + Discovery

### Phase 7: Destination Detail Page (W5 D1-2) — DONE
- [x] Dynamic route: src/app/destination/[slug]/page.tsx
- [x] Hero image with gradient overlay
- [x] Destination name, region badge, category tags
- [x] Description section
- [x] "Best Time to Visit" display
- [x] Festival/events list for this destination
- [x] Tags display
- [x] SEO metadata (generateMetadata)
- [x] Header with Logo, nav, auth (Sign in / UserButton)

### Phase 8: Photo Gallery (W5 D3) — DONE
- [x] Community photo grid per destination (uniform grid)
- [x] Lightbox viewer (click to enlarge, arrow/keyboard navigation)
- [x] Upload photos (Convex file storage)
- [x] Photo count display

### Phase 9: Map View (W5 D4) — DONE
- [x] Install Leaflet + react-leaflet
- [x] Map toggle on browse page (grid view / map view)
- [x] Destination pins color-coded by region
- [x] Click pin → popup card with name, rating, link to detail

### Phase 10: What's Nearby (W5 D5) — DONE
- [x] Haversine distance calculation utility
- [x] "Nearby Destinations" section on detail page
- [x] Distance display (km)
- [x] Horizontal scroll card list

### Phase 11: Tips System (W5 D6-7) — DONE
- [x] convex/tips.ts (create, listByDestination, listByUser)
- [x] Submit tip form: content textarea, rating stars, budget breakdown
- [x] Tip card component (user avatar, content, budget table, timestamp)
- [x] Tip list on destination detail page
- [x] Auth-gated submit (sign-in prompt if not authenticated)
- [x] Update destination tipsCount + avgRating on tip creation

### Phase 12: Voting (W6 D1) — DONE
- [x] convex/votes.ts (castVote — toggle/switch logic)
- [x] Vote buttons component (coral upvote, gray downvote, net score)
- [x] One-vote-per-user enforcement (by_user_and_tip index)
- [x] Update tip upvotes/downvotes + user upvotesReceived counters

---

## W6 — Community + Social

### Phase 13: Bookmarks (W6 D2) — DONE
- [x] bookmarks table in Convex schema (already existed)
- [x] Heart icon toggle on destination cards and detail page
- [x] convex/bookmarks.ts (toggle, isBookmarked, listByUser, toggleVisited)
- [x] Bookmark count on destinations updated atomically

### Phase 14: User Profile (W6 D3) — DONE
- [x] Profile page (src/app/profile/page.tsx)
- [x] Clerk user avatar + name display
- [x] Stats: tips count, total upvotes received, destinations visited, bookmarks count
- [x] "My Tips" tab — list of user's submitted tips
- [x] "Been There" tab — destinations marked as visited
- [x] "Saved" tab — bookmarked destinations

### Phase 15: Badges + Reputation (W6 D4) — DONE
- [x] Badge definitions: Explorer (5 tips), Local Guide (20 tips), Trailblazer (50 upvotes), Wanderer (10 visited), Photographer (20 photos)
- [x] Auto-computed based on user stats
- [x] Badge display on profile page with progress bars
- [x] Badge icon next to username on tip cards

### Phase 16: Notifications (W6 D5) — DONE
- [x] notifications table in Convex schema
- [x] Real-time notifications via Convex reactive queries
- [x] Notification types: tip upvoted (with trigger in votes.ts)
- [x] Notification bell icon in header with unread count
- [x] Notification dropdown list
- [x] Mark as read / mark all as read

### Phase 17: Itinerary Builder (W6 D6-7) — DONE
- [x] itineraries table already in schema, convex/itineraries.ts CRUD
- [x] Create new itinerary page
- [x] Add destinations to itinerary via search
- [x] Day-by-day view with add/remove days and destinations
- [x] Auto budget estimate (sum of destination budgets)
- [x] Total trip duration + destination count display
- [x] Delete itinerary

### Phase 18: Collaborative Itinerary (W7 D1) — DONE
- [x] Share itinerary via unique link (share token)
- [x] Access levels: view-only or edit
- [x] Real-time sync (Convex reactive queries)
- [x] Collaborator avatars display
- [x] Add collaborator by email
- [x] Shared itinerary view page (/itinerary/[token])

---

## W7 — Power Features

### Phase 19: Destination Comparison (W7 D2) — DONE
- [x] "Compare" checkbox on destination cards (max 3)
- [x] Comparison page (side-by-side destinations)
- [x] Compare: budget range, avg rating, tips count, best season, categories
- [x] Visual bars for budget and rating comparison
- [x] Winner highlight with star icon
- [x] Floating "Compare (N)" button

### Phase 20: Leaderboard (W7 D3) — DONE
- [x] Leaderboard page with tabbed interface
- [x] Top Contributors: most tips
- [x] Most Upvoted: most upvotes received
- [x] All-time top destinations by rating
- [x] Ranking with medal emojis, avatar, name, stats

### Phase 21: Travel Checklist (W7 D4) — DONE
- [x] Checklist templates by destination type (Beach, Mountain, City, Island Hopping, Historical, Food Trip)
- [x] Editable checklist with checkboxes
- [x] Add custom items + remove items
- [x] Attach checklist to itinerary
- [x] Progress bar (X of Y items packed)

### Phase 22: Advanced Filters (W7 D5) — DONE
- [x] Budget range inputs (min-max PHP)
- [x] Minimum rating filter (0-5 selector)
- [x] Best season filter (Dry / Rainy / Any)
- [x] Multi-region select
- [x] Activity type multi-select
- [x] "Has photos" toggle
- [x] Clear all filters button
- [x] Filter count badge on filter button

### Phase 23: Admin Panel (W7 D6) — DONE
- [x] Admin route protection (assertAdmin in Convex + role check in UI)
- [x] Dashboard: total users, destinations, tips, pending tips count
- [x] Pending tips queue — approve / reject
- [x] User management (view users, change role)
- [x] Admin link in header (conditional on role)

### Phase 24: Dark Mode (W7 D7) — DONE
- [x] Warm dark palette via CSS variable swap on [data-theme="dark"]
- [x] Toggle in header (sun/moon icon)
- [x] Persist preference in localStorage
- [x] Smooth transition (transition on body)
- [x] Respect system preference as default (prefers-color-scheme)
- [x] Hydration-safe via useSyncExternalStore

---

## W8 — Polish + Deploy

### Phase 25: Mobile Polish (W8 D1) — DONE
- [x] Hamburger menu nav on mobile (hidden on sm+)
- [x] Bottom navigation bar on mobile (Browse, Trips, Top, Profile)
- [x] Desktop nav hidden on mobile, mobile menu hidden on desktop
- [x] Bottom padding on content area for bottom nav

### Phase 26: SEO + Performance (W8 D2) — DONE
- [x] generateMetadata on all pages
- [x] Root loading.tsx (Suspense boundary)
- [x] Root error.tsx (error boundary with retry)
- [x] Configure images.remotePatterns for Convex + Clerk domains

### Phase 27: Trip Journal (W8 D3)
- [ ] journals table in Convex schema
- [ ] Write about completed trips: title, story (rich text or markdown), photos, route taken
- [ ] Public travel log displayed on user profile
- [ ] Link journal entries to destinations
- [ ] Journal feed page (browse community journals)

### Phase 28: Festival Calendar (W8 D4)
- [ ] Calendar view page (src/app/festivals/page.tsx)
- [ ] PH festivals by month (Sinulog, Ati-Atihan, Pahiyas, MassKara, Panagbenga, etc.)
- [ ] Each festival linked to its destination
- [ ] "Happening Now" / "Coming Up" banner on homepage
- [ ] Filter by month / region

### Phase 29: Deploy + README (W8 D5)
- [ ] Vercel deployment setup
- [ ] Production Clerk keys
- [ ] Production Convex deployment (`bunx convex deploy`)
- [ ] README with project description, screenshots, tech stack, setup instructions
- [ ] GitHub repository cleanup
- [ ] Final cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Progress Tracker

| Week | Phases | Status |
|------|--------|--------|
| W4 | 1-6 (Foundation) | COMPLETE |
| W5 | 7-12 (Content + Discovery) | COMPLETE |
| W6 | 13-18 (Community + Social) | COMPLETE |
| W7 | 19-24 (Power Features) | COMPLETE |
| W8 | 25-29 (Polish + Deploy) | Not Started |
