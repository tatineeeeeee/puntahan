---
name: ux-review
description: Quick 2-minute UX scan of a component or page. Catches obvious a11y violations, broken responsive patterns, and design system drift. Use for fast feedback during development.
---

Quick UX scan of the specified file(s). If no file specified, scan recently changed components. This is the fast version — use `/ux-audit` for a deep dive.

## What to Check (keep it fast)

### Accessibility — the obvious stuff
- `<div onClick>` instead of `<button>` → flag it
- Images missing `alt` → flag it
- Form inputs without `<label>` → flag it
- `outline-none` without a replacement focus style → flag it
- Color as only indicator (red text for errors, no icon) → flag it

### Responsive — the breaking stuff
- Fixed widths (`w-[500px]`) that will overflow on mobile → flag it
- Missing responsive grid breakpoints (`grid-cols-3` without `grid-cols-1` for mobile) → flag it
- Tiny touch targets (buttons/links smaller than 44px on mobile) → flag it
- Text that will be unreadable on mobile (text-xs for body content) → flag it

### Design System — the drift
- Hardcoded hex colors instead of project tokens (coral, teal, sand, etc.) → flag it
- Wrong font (not DM Sans) or wrong weight for context → flag it
- Inconsistent spacing (mixing arbitrary values like `p-[13px]` with scale values) → flag it
- Region badges using wrong colors → flag it

### States — the forgotten stuff
- Loading state missing (no skeleton, no spinner, just blank) → flag it
- Empty state missing (zero results shows nothing) → flag it
- Error state missing (mutation failure not handled) → flag it

## Output

Keep it short. Table format:

| Issue | Location | Fix |
|-------|----------|-----|
| `<div onClick>` — use `<button>` | file:line | Change tag |
| No loading state | file:line | Add skeleton |
| Hardcoded `#FF6B6B` | file:line | Use `text-coral` |

If nothing found: **"Looks good."**

No scores, no summaries, no fluff. Just the issues.
