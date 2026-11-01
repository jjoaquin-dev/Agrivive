---
title: Header Icon Hover Shake
type: delivery
date: 2026-10-31
status: complete
---

# Header Icon Hover Shake

## What changed

- The message icon and the bell icon in the buyer header shake a little when the user hovers over their button.
- Each button has `group`, and each icon has the `icon-shake-on-hover` class. The shake keyframes are in `web/app/globals.css`.
- The shake is turned off under `prefers-reduced-motion`.

## Affected files

- `web/src/components/BuyerSiteHeader.tsx`
- `web/app/globals.css`

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
