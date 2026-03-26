---
name: ux-review
description: Review UI/UX for accessibility, usability, responsive design, and design system consistency. Use when reviewing components, pages, or layouts.
allowed-tools: Read, Grep, Glob, Agent
---

Review the specified component or page for UX quality. If no file is specified, review all recently changed files.

## Checklist

### Accessibility (a11y)
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>` — not `<div onClick>`)
- All images have meaningful `alt` text (or `alt=""` for decorative)
- ARIA labels on interactive elements without visible text
- Keyboard navigable — every interactive element reachable via Tab, activated via Enter/Space
- Focus indicators visible (never `outline: none` without replacement)
- Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- Form inputs have associated `<label>` elements
- Error messages linked to inputs via `aria-describedby`

### Responsive Design
- Works at 320px, 375px, 768px, 1024px, 1440px widths
- No horizontal scroll on mobile
- Touch targets minimum 44x44px on mobile
- Text readable without zoom on mobile (min 16px base)
- Images use `next/image` with proper `sizes` prop
- Grid switches from multi-column to single-column on mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

### Design System Compliance
- Uses project color tokens (coral, teal, warm-white, sand, charcoal, warm-gray, sunset) — no hardcoded hex values
- Typography uses DM Sans at correct weights (400/500/700)
- Region badges use correct region colors (NCR blue, Luzon green, Visayas yellow, Mindanao purple)
- Consistent spacing scale (Tailwind spacing utilities)
- Cards use sand background with rounded corners

### User Experience
- Loading states for async data (skeleton loaders, not spinners)
- Empty states when no data (not blank screens)
- Error states with helpful messages and retry actions
- Optimistic updates for user actions (votes, form submissions)
- Clear visual hierarchy — primary CTA (coral) stands out
- Navigation is intuitive — user knows where they are

## Output Format

Report as a table:

| Severity | Category | Issue | File:Line | Fix |
|----------|----------|-------|-----------|-----|
| Critical | ... | ... | ... | ... |
| Warning  | ... | ... | ... | ... |
| Suggestion | ... | ... | ... | ... |
