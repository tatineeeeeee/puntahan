---
name: perf-check
description: Performance audit — React render efficiency, Convex query patterns, bundle size, image optimization, and Core Web Vitals risks. Use when the app feels slow or before shipping.
---

Audit the codebase for performance issues. If a file is specified, focus there. Otherwise, scan the full project.

## 1. React Render Efficiency

**Unnecessary re-renders**
- Parent components creating new object/array/function refs every render:
  ```tsx
  // BAD — new object every render, children re-render
  <Card style={{ color: "red" }} />
  <List items={data.filter(x => x.active)} />
  <Button onClick={() => handleClick(id)} />
  ```
- Fix: `useMemo` for derived data, `useCallback` for handlers passed to children — but only when there's an actual perf issue, not preemptively

**Expensive render paths**
- Heavy computation in component body (sort/filter large arrays every render)
- Components that render large lists without virtualization (>100 items)

**Key prop issues**
- Array index as `key` on lists that reorder, filter, or mutate → causes unnecessary DOM recreation
- Should use Convex `_id` as key

**State management**
- State stored too high — causing unrelated subtrees to re-render
- State that should be derived (computed from other state) stored separately

## 2. Convex Query Performance

**Table scans**
- `.filter()` on query results → scans every document. Must use `.withIndex()` instead
- Grep for: `\.filter\(` in `convex/` directory

**Unbounded `.collect()`**
- `.collect()` without a preceding `.take(n)` or on a table that could grow large
- Should use `.paginate()` for user-facing lists or `.take(n)` for fixed-size results

**Over-fetching**
- Queries returning more fields than the client needs (full documents when only name + id needed)
- Multiple separate queries that could be combined into one

**Redundant indexes**
- `by_foo` index is redundant if `by_foo_and_bar` exists
- Check `convex/schema.ts` for overlap

**`Date.now()` in queries**
- Reactive subscriptions won't re-run when time changes — stale data
- Grep for `Date.now()` in query functions

## 3. Bundle Size

**Large client imports**
- Check for heavy libraries imported in `"use client"` components
- Flag: moment.js (use date-fns or Intl), lodash (use native methods), full icon libraries (import individual icons)
- `next/dynamic` should be used for heavy components not needed on initial load

**Server vs Client boundary**
- Components marked `"use client"` that don't need to be — pushes more JS to the browser
- Check if `"use client"` boundary can be pushed lower (wrap only the interactive part)

**Tree shaking**
- Named imports from libraries: `import { thing } from "lib"` ✓
- Default/namespace imports: `import * as lib from "lib"` — may prevent tree shaking

## 4. Image Optimization

- All images use `next/image` — not raw `<img>` tags
- `sizes` prop present for responsive images (otherwise Next.js sends full-size)
- `priority` prop on above-the-fold hero images (LCP optimization)
- Remote patterns configured in `next.config.ts` for Convex storage domain
- No oversized images being served (check upload dimensions vs display dimensions)

## 5. Core Web Vitals Risks

**LCP (Largest Contentful Paint)**
- Hero image missing `priority` prop → late load
- Web fonts blocking render → ensure `display: swap` on DM Sans
- Server Components used where possible → less client JS = faster paint

**CLS (Cumulative Layout Shift)**
- Images without explicit dimensions → shift when loaded
- Skeleton loaders match content dimensions → no shift on data load
- Dynamic content inserted above the fold without reserved space

**INP (Interaction to Next Paint)**
- Heavy event handlers blocking the main thread
- Large state updates causing expensive re-renders on interaction
- Optimistic updates for perceived performance (votes, bookmarks)

## Output Format

### Summary
- **Risk level: LOW / MEDIUM / HIGH**
- Top 3 issues by impact

### Findings

| Impact | Category | Issue | Location | Fix |
|--------|----------|-------|----------|-----|
| High | Query perf | `.filter()` table scan | file:line | Use `.withIndex()` |
| Medium | Bundle | Full lodash imported | file:line | Use native `.map()` |
| Low | Render | Index key on filtered list | file:line | Use `_id` key |

### Quick Wins
- List 2-3 easy fixes that give the most improvement

If the codebase is clean: **"No performance issues found."**
