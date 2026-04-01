---
name: ux-audit
description: Deep UX audit — WCAG 2.1 AA accessibility, responsive breakpoints, design system compliance, interaction quality, and user flow analysis. Use for thorough reviews before shipping.
---

Perform a comprehensive UX audit on the specified page or component. If no target specified, audit all pages and layouts. This is the deep version — use `/ux-review` for a quick scan.

## 1. Accessibility (WCAG 2.1 AA)

**Semantic Structure**
- Landmarks present: `<header>`, `<nav>`, `<main>`, `<footer>` — not generic `<div>`s
- Heading hierarchy: `h1` → `h2` → `h3`, no skipped levels, one `h1` per page
- Interactive elements use correct tags: `<button>` for actions, `<a>` for navigation
- Lists use `<ul>`/`<ol>`, not styled `<div>`s

**Keyboard**
- All interactive elements reachable via Tab in logical order
- No `tabIndex` > 0 (disrupts natural order)
- Modals trap focus and close on Escape
- Skip-to-content link on pages with navigation
- Custom components handle Enter + Space activation

**Screen Readers**
- Images: meaningful `alt` text, or `alt=""` + `aria-hidden="true"` for decorative
- Icon-only buttons: `aria-label` present
- Forms: `<label>` associated with every input, errors linked via `aria-describedby`
- Dynamic content: `aria-live` regions for async updates
- Loading: `aria-busy` or status role for loading states

**Color & Contrast**
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18px+ bold or 24px+): 3:1 minimum
- UI components and focus indicators: 3:1 minimum
- Information never conveyed by color alone

## 2. Responsive Design

**Breakpoints** — mentally trace the layout at each:
| Width | Expectation |
|-------|-------------|
| 320px | Single column, no overflow, no horizontal scroll |
| 375px | Standard mobile layout, readable without zoom |
| 768px | 2-column grids where appropriate |
| 1024px | Full desktop layout appears |
| 1440px | Content constrained by max-width, not stretched edge-to-edge |

**Mobile**
- Touch targets: minimum 44x44px with 8px+ spacing between
- No hover-only interactions — everything works via tap
- Base font: 16px minimum (no `text-xs` for body content)
- Input types: `type="email"`, `type="tel"`, `inputMode="numeric"` where appropriate
- Navigation: collapses to hamburger or bottom nav bar

**Images**
- All use `next/image` with `sizes` prop for responsive serving
- No images stretched or cropped incorrectly at any breakpoint
- Decorative images hidden or de-prioritized on small screens

## 3. Design System Compliance

**Colors** — every color must come from project tokens:
| Token | Hex | Usage |
|-------|-----|-------|
| Coral | `#FF6B6B` | CTAs, hearts, upvotes, branding |
| Teal | `#0D9488` | Links, tags, secondary actions |
| Warm White | `#FFFBF5` | Page background |
| Sand | `#FEF3C7` | Card backgrounds, highlights |
| Charcoal | `#1C1917` | Primary text |
| Warm Gray | `#78716C` | Secondary/muted text |
| Sunset | `#FB923C` | Budget badges, ratings |
| NCR `#3B82F6` · Luzon `#10B981` · Visayas `#F59E0B` · Mindanao `#8B5CF6` |

Flag any hardcoded hex that isn't a token. Flag any `bg-white`, `text-black`, `bg-gray-*` — should use project tokens.

**Typography**
- DM Sans throughout — no Geist, no system fonts in visible UI
- Headings: weight 700 · Body: weight 400 · Badges: weight 500, uppercase, small
- No other fonts mixed in

**Components**
- Cards: sand background, rounded-xl, consistent shadow
- Buttons: coral primary / teal secondary / ghost variants used correctly
- Region badges: correct color per region
- Spacing: Tailwind scale only — no arbitrary values like `p-[13px]`

## 4. Interaction Quality

**Loading**
- Skeleton loaders that match content shape (not generic spinners)
- No layout shift when real content replaces skeleton
- Suspense boundaries at route level (`loading.tsx`)

**Empty States**
- Friendly message + suggested action ("Be the first to add a tip!")
- Has visual element (icon or illustration) — not just text

**Error States**
- User-friendly messages (no stack traces, no "500 Internal Server Error")
- Retry action available for transient failures
- Form validation: inline errors below fields, not alert boxes
- `error.tsx` boundary present per route segment

**Optimistic Updates**
- Votes/upvotes reflect immediately before server confirms
- Bookmark toggles are instant
- Form submissions show immediate feedback (disable button, show pending state)

## 5. User Flow

- Primary CTA (coral) visually dominant — user knows the next action
- Navigation shows current location (active state on nav items)
- Nested pages have breadcrumbs or back navigation
- Destructive actions require confirmation dialog
- Success feedback: toast, redirect, or inline confirmation after mutations
- Auth-gated actions redirect to sign-in with return URL

## Output Format

### Summary
- **Score: X/10** — overall UX quality
- Critical: N · Warnings: N · Suggestions: N

### Findings

| Priority | Category | Issue | Location | Recommendation |
|----------|----------|-------|----------|----------------|
| P0 | a11y | ... | file:line | ... |
| P1 | responsive | ... | file:line | ... |
| P2 | design system | ... | file:line | ... |

### Strengths
List 2-3 things done well — good patterns to keep.
