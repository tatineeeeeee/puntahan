# puntahan 🗺️

> **Real tips. Real budgets. Real travelers.**

Community-powered travel guide for the Philippines — honest tips and actual peso breakdowns from people who've actually been there.

🔗 **[puntahan.vercel.app](https://puntahan.vercel.app)** &nbsp;·&nbsp; Built with Next.js 16 + Convex + Clerk

---

## Features

### Discovery
- **Browse Destinations** — Search, filter by region / category / budget / rating, grid + map view
- **Destination Detail** — Description, festivals, tags, budget ranges, community photos, nearby spots
- **Region Navigation** — NCR, Luzon, Visayas, Mindanao cards with live destination counts
- **Advanced Filters** — Budget tier, star rating, season, multi-region, has-photos toggle
- **Festival Calendar** — Philippine festivals by month with "Happening Now" banner
- **Interactive Map** — Leaflet-powered map with region pins

### Community
- **Tips System** — Share travel tips with star ratings and itemized peso breakdowns
- **Voting** — Upvote / downvote tips, best rises to top
- **Photo Gallery** — Upload and browse community photos with full-screen lightbox
- **Bookmarks** — Save destinations, mark as visited
- **User Profiles** — Stats, earned badges, tips, and saved destinations
- **Badges** — Explorer, Local Guide, Trailblazer, Wanderer, Photographer
- **Real-time Notifications** — Alerts when someone upvotes your tips
- **Leaderboard** — Top contributors, most upvoted, highest-rated destinations

### Trip Planning
- **Itinerary Builder** — Multi-day trips with destinations, budget estimates, day-by-day planning
- **Collaborative Itineraries** — Share via link with view or edit access levels
- **Barkada Voting** — Shared itinerary voting page for group trip decisions
- **Travel Checklists** — Auto-generated packing lists by destination type
- **Travel Journals** — Write and publish travel stories
- **Destination Comparison** — Side-by-side comparison with visual budget bars

### Platform
- **Dark Mode** — Animated sun/moon toggle with system preference detection
- **Filipino / English** — Locale toggle (EN / TL) throughout the UI
- **Mobile-first** — Hamburger menu, sticky bottom nav, touch-friendly
- **Admin Panel** — Dashboard stats, pending tip moderation, user management
- **Error Monitoring** — Sentry integration on client, server, and edge

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19.2 |
| Backend | Convex — database, real-time subscriptions, file storage |
| Auth | Clerk — sign-in/up, webhook sync with Convex |
| Styling | Tailwind CSS v4 — CSS-based `@theme` config in `globals.css` |
| Maps | Leaflet |
| Language | TypeScript strict mode throughout |
| Runtime | Bun — package manager & dev runtime |
| Monitoring | Sentry |
| CI | GitHub Actions |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Convex](https://convex.dev) account + project
- [Clerk](https://clerk.com) account + application

### 1 — Clone and install

```bash
git clone https://github.com/tatineeeeeee/puntahan.git
cd puntahan
bun install
```

### 2 — Environment variables

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Set these in the **Convex Dashboard** (not `.env.local`):

```
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3 — Run development servers

Open two terminals:

```bash
# Terminal 1 — Next.js
bun dev

# Terminal 2 — Convex
bunx convex dev
```

### 4 — Seed the database

```bash
bunx convex run seed:seed
```

### 5 — Open the app

[http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
puntahan/
├── src/
│   ├── app/                  # Next.js App Router pages + layouts
│   │   ├── globals.css       # Tailwind v4 @theme tokens (colors, fonts)
│   │   ├── layout.tsx        # Root layout — Clerk + Convex providers
│   │   ├── page.tsx          # Home page (browse destinations)
│   │   ├── destination/[slug]/
│   │   ├── itineraries/
│   │   ├── itinerary/[token]/
│   │   ├── festivals/
│   │   ├── journals/
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   ├── compare/
│   │   ├── admin/
│   │   └── api/              # Route handlers (health, og image)
│   ├── components/
│   │   ├── ui/               # Design system (Button, Card, Badge, Input…)
│   │   ├── layout/           # Header, Footer, BottomNav, ThemeToggle…
│   │   ├── destinations/     # Browse, cards, filters, map, gallery…
│   │   ├── tips/             # TipForm, TipCard, VoteButtons…
│   │   ├── itineraries/      # Builder, sharing, voting, checklists…
│   │   ├── journals/         # Feed + rich editor
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   ├── festivals/
│   │   ├── admin/
│   │   └── search/           # AdvancedFilterPanel
│   ├── lib/
│   │   ├── hooks/            # useTheme, useLocale, useToast, useTrack…
│   │   ├── __tests__/        # Unit tests (badges, filter-utils)
│   │   ├── filter-utils.ts
│   │   ├── badges.ts
│   │   ├── i18n.ts
│   │   └── utils.ts
│   └── proxy.ts              # Next.js 16 route protection middleware
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema (all tables)
│   ├── destinations.ts
│   ├── tips.ts
│   ├── users.ts
│   ├── itineraries.ts
│   ├── journals.ts
│   ├── festivals.ts
│   ├── leaderboard.ts
│   ├── notifications.ts
│   ├── checklists.ts
│   ├── rateLimit.ts
│   ├── crons.ts
│   ├── http.ts               # Clerk webhook handler
│   └── seed.ts               # 23 Philippine destinations
├── CLAUDE.md                 # AI coding agent guidelines
├── SECURITY.md               # Security practices + secret management
└── .env.example              # Environment variable template
```

---

## Security

See [SECURITY.md](./SECURITY.md) for secret management, auth boundaries, and rate limiting practices.

---

## License

MIT
