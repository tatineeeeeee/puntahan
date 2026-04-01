---
name: test-check
description: Run TypeScript, ESLint, and Convex type checks. Reports pass/fail summary with actionable errors. Use after any code change.
---

Run all verification checks and report a single pass/fail summary. Do NOT fix anything — only report.

## Checks

Run these in parallel where possible. If one fails, still run the rest.

### 1. TypeScript (`bunx tsc --noEmit`)
- The gatekeeper — type errors block everything
- Report each error as `file:line — message`
- If >10 errors, show first 10 and note the total count

### 2. ESLint (`bun run lint`)
- Report errors (blocking) separately from warnings (non-blocking)
- Note which errors are auto-fixable (`bun run lint --fix` would resolve them)

### 3. Convex Typecheck (`bunx convex typecheck 2>&1 || true`)
- Validates schema, function signatures, index references
- If Convex isn't configured yet (no `convex/schema.ts` or missing env vars), report SKIP — don't error out
- Common issues: missing `await`, wrong validator types, referencing nonexistent indexes

### 4. Next.js Build (`bun run build`) — ONLY if `--full` argument is passed
- Slow check, skip by default
- Catches SSR errors, missing exports, bad imports that TypeScript alone misses

## Output

```
## Check Results

| Check      | Status    | Details                          |
|------------|-----------|----------------------------------|
| TypeScript | PASS/FAIL | 0 errors / N errors              |
| ESLint     | PASS/FAIL | 0 issues / N errors, M warnings  |
| Convex     | PASS/FAIL/SKIP | Valid / N errors / not configured |
| Build      | PASS/FAIL/SKIP | Clean / N errors / not requested |

### Errors
1. **file:line** — error message — suggested fix
2. ...
```

If everything passes: just say **"All checks passed."** — nothing more.

## Rules
- Run from project root
- Never fix code — report only
- Run checks in parallel when possible (tsc and lint don't depend on each other)
- Convex typecheck is best-effort — if the command doesn't exist or env isn't set, SKIP gracefully
