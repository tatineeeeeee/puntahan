---
name: code-review
description: Senior dev PR-style review of changed or specified files. Checks correctness, patterns, security, performance, and readability. Use before committing.
---

Review code changes like a senior developer doing a PR review. If a file is specified, review that file. Otherwise, review all uncommitted changes (`git diff` + `git diff --cached` + untracked files).

## Review Process

### Step 1: Understand the change
- Read the diff or specified files
- Identify what the change is doing (new feature, bug fix, refactor, etc.)
- Check if the approach makes sense for the goal

### Step 2: Check for correctness

**Logic**
- Does the code do what it claims to do?
- Are edge cases handled? (null, empty array, undefined, zero, negative numbers)
- Are async operations properly awaited? (no floating promises)
- Are error paths handled? (what happens when the API call fails?)

**Types**
- No `any`, `as` assertions, `@ts-ignore`, or `@ts-expect-error`
- Convex types used correctly: `Doc<"table">`, `Id<"table">`, `Infer<typeof validator>`
- Props interfaces defined, not inline

**React/Next.js**
- `"use client"` present on files using hooks, events, browser APIs, Convex hooks
- `"use client"` NOT present on files that don't need it (keep server boundary high)
- `params` and `searchParams` awaited (Next.js 16)
- No hydration risks (browser APIs in render, non-deterministic values, invalid HTML nesting)

### Step 3: Check for security

- Public Convex functions: `args` validators present? Auth check present?
- User input validated before use?
- No secrets hardcoded, no sensitive data logged
- Ownership verified before mutation (user can't modify others' data)

### Step 4: Check for performance

- Convex queries use `.withIndex()` not `.filter()`
- `.collect()` only on small result sets — `.take()` or `.paginate()` for large ones
- No unnecessary re-renders (new object/array refs created every render)
- Lists use stable `key` props (Convex `_id`, not array index)
- Heavy operations not in the render path

### Step 5: Check for readability & patterns

- Files under 300 lines
- One component per file
- Imports use `@/` alias, grouped correctly
- No dead code, no commented-out code, no TODO comments without context
- Variable names are descriptive (not `data`, `temp`, `x`, `result`)
- Functions do one thing — not 50-line functions mixing concerns

### Step 6: Check against project conventions (CLAUDE.md)

- Colors use project tokens, not hardcoded hex
- DM Sans font, correct weights
- Convex rules followed (no `api.*` in server functions, no `Date.now()` in queries)
- Tailwind v4 patterns (no `tailwind.config.ts`, no dynamic class names)

## Output Format

### Verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION

### Issues

| Severity | Issue | Location | Suggestion |
|----------|-------|----------|------------|
| blocker | Must fix before merge | file:line | How to fix |
| warning | Should fix, not blocking | file:line | How to fix |
| nit | Style/preference, take or leave | file:line | Alternative |

### Summary
- 1-2 sentences: what's good, what needs work
- If approving: note any non-blocking suggestions for future

Keep the review honest but constructive. Flag real problems, skip nitpicks on code you didn't write or that was already there.
