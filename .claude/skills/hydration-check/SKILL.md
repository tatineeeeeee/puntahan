---
name: hydration-check
description: Scan for hydration mismatch risks in React/Next.js components. Use after creating or modifying client components.
---

Scan the specified files (or all `"use client"` components if none specified) for hydration mismatch risks.

## What Causes Hydration Errors

Hydration fails when server-rendered HTML doesn't match what React renders on the client. These are the exact patterns to find and flag:

### Pattern 1: Browser APIs During Render
```tsx
// BAD — window doesn't exist on server
const width = window.innerWidth;
const theme = localStorage.getItem("theme");

// GOOD — access in useEffect only
const [width, setWidth] = useState(0);
useEffect(() => setWidth(window.innerWidth), []);
```
**Search for:** `window.`, `document.`, `localStorage`, `sessionStorage`, `navigator.` outside of `useEffect`

### Pattern 2: Non-Deterministic Values During Render
```tsx
// BAD — different value on server vs client
const id = crypto.randomUUID();
const now = Date.now();
const random = Math.random();

// GOOD — use useId() for IDs, pass dates from server
const id = useId();
```
**Search for:** `Date.now()`, `Math.random()`, `crypto.randomUUID()`, `new Date()` in render path (not inside useEffect/handlers)

### Pattern 3: Conditional Rendering on Client State
```tsx
// BAD — server renders null, client renders content
const [mounted, setMounted] = useState(false);
if (!mounted) return null; // server returns null, client returns content = mismatch

// GOOD — use suppressHydrationWarning for truly dynamic content
// or render same structure with different content
```

### Pattern 4: Invalid HTML Nesting
```tsx
// BAD — causes hydration mismatch
<p><div>nested block in inline</div></p>
<a href="/"><a href="/other">nested link</a></a>
<button><button>nested button</button></button>

// GOOD — use valid nesting
<div><div>block in block</div></div>
<a href="/"><span>text</span></a>
```
**Search for:** `<p>` containing block elements, nested `<a>`, nested `<button>`

### Pattern 5: Missing "use client" Directive
```tsx
// BAD — using hooks in a Server Component (no directive)
import { useState } from "react";
export function Counter() {
  const [count, setCount] = useState(0); // ERROR
}

// GOOD — add directive
"use client";
import { useState } from "react";
```
**Search for:** Files using `useState`, `useEffect`, `useQuery`, `useMutation`, `onClick`, `onChange` without `"use client"` at top

### Pattern 6: Extension/Injection Mismatch
```tsx
// BAD — browser extensions inject attributes server doesn't have
<html> // Grammarly adds data-gr-ext attributes

// GOOD — add suppressHydrationWarning on <html> and <body> in root layout
<html suppressHydrationWarning>
<body suppressHydrationWarning>
```

## Scan Procedure

1. Find all files with `"use client"` directive
2. For each file, check for patterns 1-5 above
3. Check root `layout.tsx` for pattern 6 (`suppressHydrationWarning` on `<html>` and `<body>`)
4. Check all page components for pattern 4 (invalid HTML nesting)
5. Find files using hooks/handlers WITHOUT `"use client"` (pattern 5)

## Output Format

| Risk Level | Pattern | File:Line | Code Snippet | Fix |
|------------|---------|-----------|-------------|-----|
| Critical | Browser API in render | ... | `window.innerWidth` | Move to useEffect |
| Critical | Missing "use client" | ... | `useState` without directive | Add "use client" |
| Warning | Non-deterministic | ... | `Date.now()` | Use useId() or useEffect |
| Info | Suppression missing | ... | `<html>` without suppress | Add suppressHydrationWarning |
