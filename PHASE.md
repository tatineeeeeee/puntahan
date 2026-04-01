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

### Phase 11: Tips System (W5 D6-7)
- [ ] convex/tips.ts (create, listByDestination, listByUser)
- [ ] Submit tip form: content textarea, rating stars, budget breakdown (dynamic category + amount rows), photo upload
- [ ] Tip card component (user avatar, content, budget table, photos, timestamp)
- [ ] Tip list on destination detail page
- [ ] Auth-gated submit (redirect to sign-in if not authenticated)
- [ ] Update destination tipsCount + avgRating on tip creation

### Phase 12: Voting (W6 D1)
- [ ] convex/votes.ts (castVote — toggle/switch logic)
- [ ] Vote buttons component (coral upvote, gray downvote, net score)
- [ ] One-vote-per-user enforcement (by_user_tip index)
- [ ] Optimistic updates for instant UI feedback
- [ ] Sort tips by: Most Popular, Newest, Budget Low-High
- [ ] Update tip upvotes/downvotes denormalized counters

---

## W6 — Community + Social

### Phase 13: Bookmarks (W6 D2)
- [ ] bookmarks table in Convex schema
- [ ] Heart icon toggle on destination cards and detail page
- [ ] convex/bookmarks.ts (toggle, listByUser)
- [ ] "Saved Destinations" page in profile
- [ ] Bookmark count on destinations (optional)

### Phase 14: User Profile (W6 D3)
- [ ] Profile page (src/app/profile/page.tsx)
- [ ] Clerk user avatar + name display
- [ ] Stats: tips count, total upvotes received, destinations visited, bookmarks count
- [ ] "My Tips" tab — list of user's submitted tips
- [ ] "Been There" tab — destinations marked as visited
- [ ] "Saved" tab — bookmarked destinations

### Phase 15: Badges + Reputation (W6 D4)
- [ ] Badge definitions: Explorer (5 tips), Local Guide (20 tips), Trailblazer (50 upvotes received), Wanderer (10 "Been There"), Photographer (20 photos uploaded)
- [ ] Auto-computed based on user stats
- [ ] Badge display on profile page
- [ ] Badge icon next to username on tip cards
- [ ] Badge unlock notification

### Phase 16: Notifications (W6 D5)
- [ ] notifications table in Convex schema
- [ ] Real-time notifications via Convex reactive queries
- [ ] Notification types: tip upvoted, new tip on bookmarked destination, badge earned
- [ ] Notification bell icon in header with unread count
- [ ] Notification dropdown list
- [ ] Mark as read / mark all as read

### Phase 17: Itinerary Builder (W6 D6-7)
- [ ] itineraries table in Convex schema (name, days[], userId, isPublic, sharedWith[])
- [ ] Create new itinerary page
- [ ] Add destinations to itinerary from detail page ("Add to Itinerary" button)
- [ ] Day-by-day view with drag-and-drop reorder
- [ ] Auto budget estimate (sum of community avg budgets per destination)
- [ ] Total trip duration + total estimated cost display
- [ ] Delete / rename itinerary

### Phase 18: Collaborative Itinerary (W7 D1)
- [ ] Share itinerary via unique link
- [ ] Access levels: view-only or edit
- [ ] Real-time sync (Convex reactive queries — multiple users see changes live)
- [ ] Collaborator avatars display
- [ ] "Shared with me" section in profile

---

## W7 — Power Features

### Phase 19: Destination Comparison (W7 D2)
- [ ] "Compare" checkbox on destination cards
- [ ] Comparison page (side-by-side 2-3 destinations)
- [ ] Compare: budget range, avg rating, tips count, best season, region, categories
- [ ] Visual bars/charts for budget and rating comparison
- [ ] "Winner" highlight per category

### Phase 20: Leaderboard (W7 D3)
- [ ] Leaderboard page (src/app/leaderboard/page.tsx)
- [ ] Top Contributors: most tips, most upvotes received
- [ ] Weekly Top Destination: auto-computed from upvotes that week (Convex scheduled function / cron)
- [ ] All-time top destinations by rating
- [ ] User ranking cards with avatar, name, badge, stats

### Phase 21: Travel Checklist (W7 D4)
- [ ] Checklist templates by destination type (beach, mountain, city, island hopping)
- [ ] Editable checklist with checkboxes
- [ ] Add custom items
- [ ] Attach checklist to itinerary
- [ ] Progress bar (X of Y items packed)

### Phase 22: Advanced Filters (W7 D5)
- [ ] Budget range slider (min-max PHP)
- [ ] Minimum rating filter (star selector)
- [ ] Best season filter (Dry / Rainy / Any)
- [ ] Multi-region select (combine NCR + Visayas etc.)
- [ ] Activity type multi-select (Beach AND Mountain)
- [ ] "Has photos" toggle
- [ ] Clear all filters button
- [ ] Filter count badge on filter button

### Phase 23: Admin Panel (W7 D6)
- [ ] Admin route protection (check role in Convex + UI)
- [ ] Dashboard: total users, destinations, tips, pending tips count
- [ ] Pending tips queue — approve / reject with reason
- [ ] Destination CRUD (add new, edit existing, unpublish)
- [ ] Flag / remove inappropriate content
- [ ] User management (view users, change role)

### Phase 24: Dark Mode (W7 D7)
- [ ] Warm dark palette: charcoal bg (#1C1917), warm gray surface (#292524), sand text (#FEF3C7)
- [ ] Toggle switch in header (sun/moon icon)
- [ ] Persist preference in localStorage
- [ ] Tailwind dark: variant classes
- [ ] Smooth transition between modes
- [ ] Respect system preference as default (prefers-color-scheme)

---

## W8 — Polish + Deploy

### Phase 25: Mobile Polish (W8 D1)
- [ ] Hamburger menu nav on mobile
- [ ] Horizontal scroll for region tabs on small screens
- [ ] Stacked form layouts on mobile
- [ ] Touch targets audit (minimum 44x44px)
- [ ] Bottom navigation bar on mobile (Browse, Map, Create, Profile)
- [ ] Test at 320px, 375px, 768px, 1024px, 1440px

### Phase 26: SEO + Performance (W8 D2)
- [ ] generateMetadata on all pages (title, description, OG image)
- [ ] Dynamic OG images per destination (destination photo + name overlay)
- [ ] loading.tsx per route segment (Suspense boundaries)
- [ ] error.tsx per route segment (error boundaries)
- [ ] next/image optimization with proper sizes prop
- [ ] Configure images.remotePatterns for Convex storage domain
- [ ] Lighthouse audit — target 90+ on all scores

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
| W5 | 7-12 (Content + Discovery) | Not Started |
| W6 | 13-18 (Community + Social) | Not Started |
| W7 | 19-24 (Power Features) | Not Started |
| W8 | 25-29 (Polish + Deploy) | Not Started |
