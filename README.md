# puntahan — Discover the Philippines

A community-driven travel guide for discovering destinations across the Philippines. Users browse, upvote, and share travel spots organized by region (NCR, Luzon, Visayas, Mindanao).

## Features

- **Browse Destinations** — Search, filter by region/category/budget/rating, sort, grid + map view
- **Destination Details** — Description, festivals, tags, budget, photos, nearby destinations
- **Tips System** — Share travel tips with ratings and budget breakdowns
- **Voting** — Upvote/downvote tips with toggle/switch logic
- **Photo Gallery** — Upload and browse community photos with lightbox viewer
- **Bookmarks** — Save destinations with heart toggle, mark as visited
- **User Profile** — Stats, badges, tips, bookmarks, visited destinations
- **Badges** — Earn Explorer, Local Guide, Trailblazer, Wanderer, Photographer badges
- **Notifications** — Real-time alerts for upvotes on your tips
- **Itinerary Builder** — Plan multi-day trips, add destinations, budget estimates
- **Collaborative Itineraries** — Share via link, view/edit access levels
- **Destination Comparison** — Side-by-side comparison with visual bars
- **Leaderboard** — Top contributors, most upvoted, top-rated destinations
- **Travel Checklists** — Auto-generated packing lists by destination type
- **Advanced Filters** — Budget range, rating, season, multi-region, has-photos
- **Admin Panel** — Dashboard stats, pending tips, user management
- **Dark Mode** — Sun/moon toggle with system preference detection
- **Festival Calendar** — PH festivals by month with "Happening Now" banner
- **Travel Journals** — Write and share travel stories
- **Mobile Responsive** — Hamburger menu, bottom nav bar, touch-friendly

## Tech Stack

- **Next.js 16** (App Router) + React 19.2
- **Convex** — Backend, database, file storage, real-time subscriptions
- **Clerk** — Authentication (webhook sync with Convex)
- **Tailwind CSS v4** — CSS-based `@theme` config
- **Leaflet** — Interactive maps
- **TypeScript** — Strict mode throughout
- **Bun** — Package manager & runtime

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Convex](https://convex.dev) account
- [Clerk](https://clerk.com) account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tatineeeeeee/puntahan.git
   cd puntahan
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   # .env.local
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

4. Set Convex environment variables (in [Convex Dashboard](https://dashboard.convex.dev)):
   ```
   CLERK_JWT_ISSUER_DOMAIN=your_clerk_domain
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

5. Run development servers (in separate terminals):
   ```bash
   bun dev          # Next.js dev server
   bunx convex dev  # Convex dev server
   ```

6. Seed the database:
   ```bash
   bunx convex run seed:seed
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/             # Next.js App Router pages
  components/      # React components (ui/, destinations/, tips/, etc.)
  lib/             # Utilities, hooks, helpers
convex/            # Convex backend (schema, queries, mutations)
```

## License

MIT
