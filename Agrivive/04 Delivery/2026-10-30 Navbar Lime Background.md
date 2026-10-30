---
title: Navbar Lime Background
date: 2026-10-30
type: delivery
status: done
---

# Navbar Lime Background

## What changed

- Both landing header bars (main bar and sub-navigation) use `#E2FD56` as their background, from the shared `pillSurface` style.
- The "Register" button changed from lime to `#457D00` with white text, so it does not blend into the lime bar. Its hover colour is `#386600`, matching the search button.

## Affected files

- `web/src/features/home/components/LandingHeader.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: both bars are lime and "Register" is visible.
- Not run: phone and tablet widths, production build.

## Commit

Not committed.
