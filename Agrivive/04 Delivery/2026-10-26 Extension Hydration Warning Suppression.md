# 2026-10-26 Extension Hydration Warning Suppression

## Context & Objectives
In the web application, a red Next.js development overlay appeared stating: *"A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"*, referencing injected Grammarly extension attributes on `<body>` (`data-new-gr-c-s-check-loaded` and `data-gr-ext-installed`). The objective was to suppress this benign extension-induced warning so it does not interfere with the user experience.

## Why
- Client environments commonly include browser extensions (Grammarly, translation tools, password autofill, etc.) that inject DOM attributes into `<html>` and `<body>` prior to React hydration.
- Per Postel's Law (*"Be conservative in what you send, liberal in what you accept"*), web root wrappers should tolerate client extension attributes gracefully without halting execution or displaying blocking error overlays.

## What Changed
- **`web/app/layout.tsx`**:
  - Added `suppressHydrationWarning` to `<html lang="en" className="font-body" suppressHydrationWarning>` and `<body className="font-body antialiased" suppressHydrationWarning>`.

## Affected Files
- `web/app/layout.tsx`

## Verification Performed
- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` — exited with code 0.
- Verified line limits: `web/app/layout.tsx` (46 lines) is strictly $\le 200$ lines.
- Verified live hot-reloading on active development server at `http://localhost:3001`.
