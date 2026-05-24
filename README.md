# puntahan 🗺️

> **Real tips. Real budgets. Real travelers.**

Community-powered travel guide for the Philippines — honest tips and actual peso breakdowns from people who've actually been there.

🔗 **[puntahan.vercel.app](https://puntahan.vercel.app)** &nbsp;·&nbsp; Built with Next.js 16 + Convex + Clerk &nbsp;·&nbsp; [![CI](https://github.com/tatineeeeeee/puntahan/actions/workflows/ci.yml/badge.svg)](https://github.com/tatineeeeeee/puntahan/actions/workflows/ci.yml)

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
- **Destination Suggestions** — Suggest destinations to a shared itinerary; collaborators vote them up
- **Barkada Voting** — Shared voting page for group decisions on where to go
- **Travel Checklists** — Auto-generated packing lists by destination category
- **Travel Journals** — Write and publish travel stories
- **Destination Comparison** — Side-by-side comparison with visual budget bars

### Platform
- **Dark Mode** — Animated sun/moon toggle with system preference detection
- **Filipino / English** — Locale toggle (EN / TL) throughout the UI
- **Mobile-first** — Hamburger menu, sticky bottom nav, touch-friendly
- **Onboarding Walkthrough** — 4-step modal guiding first-time users through key features
- **About Page** — Project mission, how it works, and tech credits
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
| Animations | Motion (Framer Motion v12) — transitions and micro-interactions |
| Maps | Leaflet |
| Language | TypeScript strict mode throughout |
| Runtime | Bun — package manager & dev runtime |
| Monitoring | Sentry |
| Analytics | Vercel Analytics |
| CI | GitHub Actions |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Convex](https://convex.dev) account + project
- [Clerk](https://clerk.com) account + application
- [Sentry](https://sentry.io) project *(optional — error monitoring)*

### 1 — Clone and install

```bash
git clone https://github.com/tatineeeeeee/puntahan.git
cd puntahan
bun install
```

### 2 — Initialize Convex

Log in and link your Convex project (first time only):

```bash
bunx convex login
bunx convex dev --configure
```

This creates your deployment and gives you your `NEXT_PUBLIC_CONVEX_URL`. Note the URL — you'll need it in the next step. Leave this terminal running.

### 3 — Environment variables

Create `.env.local` at the project root (use `.env.example` as a template):

```env
# Clerk — Clerk Dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex — from step 2 output
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# App URL — localhost for dev, your real domain in production
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=sntrys_...   # only needed for CI source-map uploads
```

### 4 — Set up Clerk webhook

> ⚠️ **Do not skip this step.** When a user signs up, Clerk fires a webhook that creates their record in Convex. Without it, authentication will appear to work but the user won't exist in the database and every protected action will fail.

1. Open **Clerk Dashboard** → your app → **Webhooks** → **Add Endpoint**
2. Set the endpoint URL to:
   ```
   https://<your-deployment>.convex.cloud/clerk-users-webhook
   ```
   *(the subdomain comes from your `NEXT_PUBLIC_CONVEX_URL`)*
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`
4. Click **Create** and copy the **Signing Secret**

Now open **Convex Dashboard** → your project → **Settings** → **Environment Variables** and add:

| Key | Value |
|---|---|
| `CLERK_JWT_ISSUER_DOMAIN` | Your Clerk issuer URL — found in Clerk Dashboard → API Keys → "Issuer" |
| `CLERK_WEBHOOK_SECRET` | The signing secret you just copied |

### 5 — Run development servers

Open two terminals:

```bash
# Terminal 1 — Convex (if not already running from step 2)
bunx convex dev

# Terminal 2 — Next.js
bun dev
```

### 6 — Seed the database

```bash
# Seed 23 Philippine destinations
bunx convex run seed:seed

# Optional — seed 69 sample tips across all destinations (5 Filipino traveler personas)
bunx convex run seedTips:seedTips
```

### 7 — Open the app

[http://localhost:3000](http://localhost:3000)

---

## Commands

| Command | Description |
|---|---|
| `bun dev` | Start Next.js dev server |
| `bunx convex dev` | Start Convex backend (run alongside `bun dev`) |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run test` | Run unit tests (vitest) |
| `bun run test:watch` | Unit tests in watch mode |
| `bunx tsc --noEmit` | TypeScript check |
| `bunx convex typecheck` | Convex function type check |

---

## Project Structure

```
puntahan/
├── src/
│   ├── app/                            # Next.js App Router pages + layouts
│   │   ├── globals.css                 # Tailwind v4 @theme tokens (colors, fonts)
│   │   ├── layout.tsx                  # Root layout — Clerk + Convex providers
│   │   ├── page.tsx                    # Home page (browse destinations)
│   │   ├── error.tsx                   # App-level error boundary
│   │   ├── loading.tsx                 # Root loading skeleton
│   │   ├── not-found.tsx               # 404 page
│   │   ├── robots.ts                   # robots.txt route handler
│   │   ├── sitemap.ts                  # sitemap.xml route handler
│   │   ├── about/                      # About page — mission + how it works
│   │   ├── destination/[slug]/         # Destination detail
│   │   ├── itineraries/                # Itinerary list + builder
│   │   ├── itinerary/[token]/          # Shared itinerary view
│   │   │   └── vote/                   # Barkada voting page
│   │   ├── festivals/                  # Festival calendar
│   │   ├── journals/                   # Travel journals feed
│   │   ├── leaderboard/                # Top contributors + destinations
│   │   ├── profile/                    # User profile
│   │   ├── compare/                    # Destination comparison
│   │   ├── admin/                      # Admin dashboard
│   │   ├── sign-in/[[...sign-in]]/     # Clerk catch-all sign-in route
│   │   └── api/                        # Route handlers (health check, OG image)
│   ├── components/
│   │   ├── ui/                         # Design system (Button, Card, Badge, Input…)
│   │   ├── layout/                     # Header, Footer, BottomNav, ThemeToggle…
│   │   ├── destinations/               # Browse, cards, filters, map, gallery…
│   │   ├── tips/                       # TipForm, TipCard, VoteButtons…
│   │   ├── itineraries/                # Builder, sharing, voting…
│   │   ├── checklists/                 # ChecklistPanel
│   │   ├── journals/                   # Feed + rich editor
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   ├── festivals/
│   │   ├── compare/                    # ComparisonPage, ComparisonBar, FloatingButton
│   │   ├── admin/
│   │   ├── analytics/                  # PageTracker (internal event tracking)
│   │   ├── onboarding/                 # OnboardingModal, OnboardingTrigger
│   │   ├── providers/                  # ConvexClientProvider
│   │   └── search/                     # AdvancedFilterPanel
│   ├── lib/
│   │   ├── hooks/                      # useTheme, useLocale, useToast, useTrack, useOnboarding…
│   │   ├── __tests__/                  # Unit tests (badges, filter-utils)
│   │   ├── checklist-templates.ts      # Packing list data by destination category
│   │   ├── comparison-context.tsx      # React context for destination comparison state
│   │   ├── filter-utils.ts
│   │   ├── badges.ts
│   │   ├── haversine.ts                # Distance calculation for nearby spots
│   │   ├── i18n.ts
│   │   └── utils.ts
│   └── proxy.ts                        # Next.js 16 route protection (replaces middleware)
├── convex/                             # Convex backend
│   ├── schema.ts                       # Database schema (all tables)
│   ├── helpers.ts                      # getCurrentUserOrThrow, assertAdmin
│   ├── auth.config.ts                  # Clerk auth configuration
│   ├── destinations.ts
│   ├── tips.ts
│   ├── votes.ts                        # Tip upvote / downvote mutations
│   ├── users.ts
│   ├── photos.ts                       # Destination photo upload and management
│   ├── bookmarks.ts
│   ├── itineraries.ts
│   ├── tripSuggestions.ts              # Suggest + vote on destinations within an itinerary
│   ├── journals.ts
│   ├── festivals.ts
│   ├── leaderboard.ts
│   ├── notifications.ts
│   ├── checklists.ts
│   ├── admin.ts
│   ├── analytics.ts                    # Internal event tracking (page views, tips, votes, searches)
│   ├── rateLimit.ts
│   ├── migrations.ts
│   ├── crons.ts
│   ├── http.ts                         # Clerk webhook handler
│   ├── seed.ts                         # 23 Philippine destinations
│   └── seedTips.ts                     # 69 sample tips with 5 Filipino traveler personas
├── vitest.config.ts
├── CLAUDE.md                           # AI coding agent guidelines
├── SECURITY.md                         # Security practices + secret management
└── .env.example                        # Environment variable template
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new)
2. In Vercel → **Settings** → **Environment Variables**, add all vars from `.env.local`:
   - All `NEXT_PUBLIC_*` variables
   - `CLERK_SECRET_KEY`
   - `SENTRY_AUTH_TOKEN` *(enables source-map uploads during production builds)*
   - Set `NEXT_PUBLIC_APP_URL` to your production Vercel URL
3. Get a Convex deploy key: **Convex Dashboard** → your project → **Settings** → **Deploy Key**. Add it to Vercel as `CONVEX_DEPLOY_KEY`
4. Vercel runs `bun run build` automatically on every push to `main`

> The Clerk webhook URL doesn't change after deployment — it always points to your Convex cloud URL.

### GitHub Actions CI

The CI workflow requires two repository secrets to build successfully. Add them at:
**GitHub** → your repo → **Settings** → **Secrets and variables** → **Actions**

| Secret | Where to get it |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex Dashboard → Settings |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the conventions in [CLAUDE.md](./CLAUDE.md) — especially hydration rules, Convex query patterns, and the 300-line file limit
4. Make sure all checks pass locally before opening a PR:
   ```bash
   bun run lint && bunx tsc --noEmit && bun run test && bunx convex typecheck
   ```
5. Open a pull request against `main` — CI runs the full suite automatically

---

## Security

See [SECURITY.md](./SECURITY.md) for secret management, auth boundaries, and rate limiting practices.

---

## License

MIT — see [LICENSE](./LICENSE)
