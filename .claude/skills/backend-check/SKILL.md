---
name: backend-check
description: Review Convex backend code for query efficiency, mutation safety, schema design, and Convex-specific best practices. Use when reviewing convex/ directory files.
---

Review the specified Convex backend code for correctness and quality. If no file is specified, audit the entire `convex/` directory.

## Convex Query Rules

- **Never use `.filter()` on queries** — use `.withIndex()` or `.withSearchIndex()`. `.filter()` scans every document in the table
- **Limit `.collect()` to < 1000 docs** — use `.paginate()`, `.take(n)`, or add indexes
- **Never use `Date.now()` in query functions** — reactive subscriptions won't update when time changes. Pass time from client or use scheduled functions
- **Always await all promises** — missing `await` on `ctx.db.patch()`, `ctx.scheduler.runAfter()` etc. silently fails
- **Remove redundant indexes** — `by_foo` is redundant if `by_foo_and_bar` exists (unless sort order differs)

## Convex Mutation Rules

- **All public mutations must validate args** with `v.*` validators — no exceptions
- **Check `ctx.auth.getUserIdentity()` in every user-facing mutation** — return early or throw if null
- **Verify ownership before `.patch()`/`.delete()`** — never let users modify others' data
- **Update denormalized counters atomically** — `tipsCount`, `avgRating`, `upvotes`, `downvotes` must be updated in the same mutation that creates/deletes the source document
- **Use `internalMutation` for server-only operations** — webhook handlers, scheduled jobs, admin actions called from other Convex functions

## Schema Design

- Every table has a proper schema in `convex/schema.ts` — no untyped tables
- Indexes exist for every `.withIndex()` call — missing index = runtime error
- `searchIndex` defined for any field using `.withSearchIndex()`
- Use `v.union()` + `v.literal()` for enums (region, role, voteType) — not bare `v.string()`
- Denormalized fields documented with comments explaining what updates them

## Type Safety

- Use `Doc<"tableName">` and `Id<"tableName">` from `convex/_generated/dataModel` — never `string` for IDs
- Use `Infer<typeof validator>` to derive types from validators — don't duplicate type definitions
- Use `WithoutSystemFields` for insert payloads
- Pass table name as first arg to `ctx.db.get()`, `.patch()`, `.replace()`, `.delete()`
- Never use `v.any()` unless wrapping external types (like `UserJSON` from Clerk) — and add a comment explaining why

## Action Rules

- Only use `ctx.runAction` when calling Node.js-specific libraries — prefer plain TypeScript functions
- Never chain separate `ctx.runMutation` + `ctx.runQuery` in actions — they may not be consistent. Combine into one mutation
- Actions are NOT transactional — don't assume atomicity across multiple `ctx.run*` calls
- HTTP actions (`httpAction`) must validate request bodies and return proper status codes

## Code Organization

- Keep Convex function handlers thin — extract logic into plain TypeScript helper functions in `convex/model/` or similar
- Shared helpers (like `getCurrentUser`, `userByExternalId`) should be plain async functions taking `ctx` as parameter
- Group related functions by domain: `destinations.ts`, `tips.ts`, `votes.ts`, `users.ts`
- Internal functions in the same file as public ones — prefix with `internal` naming convention

## Output Format

| Severity | Category | Issue | File:Line | Fix |
|----------|----------|-------|-----------|-----|
| Critical | Security | ... | ... | ... |
| Critical | Query Perf | ... | ... | ... |
| Warning  | Schema | ... | ... | ... |
| Suggestion | Organization | ... | ... | ... |
