---
title: Hero Basket Moved Up Under CTAs
date: 2026-10-30
type: delivery
status: done
---

# Hero Basket Moved Up Under CTAs

## What changed

- The hero no longer spreads its content with `justify-between`, which pushed the basket to the bottom of the screen. Content now starts at the top.
- The gap above the basket is smaller: 8px on phones and 16px from 640px up (was 24px and 32px).

## Affected files

- `web/src/components/sections/Hero.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: basket sits directly under the CTA buttons.
- Not run: phone and tablet widths, production build.

## Commit

Not committed.
