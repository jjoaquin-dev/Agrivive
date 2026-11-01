---
title: Empty Cart Trolley Image
type: delivery
date: 2026-11-01
status: complete
---

# Empty Cart Trolley Image

## What changed

- The cart drawer's empty state now shows the shopping trolley illustration full of vegetables, instead of the crate.
- The illustration's white background was made transparent with an edge flood fill, as was done for the crate. White inside the trolley was left alone.
- The new file is `web/public/brand/empty-cart-trolley.png` (465 × 507), shown at 224px wide.

## Affected files

- `web/src/features/cart/components/CartDrawer.tsx` (empty-state image source and size).
- `web/public/brand/empty-cart-trolley.png` (new).

## Not changed

- `web/public/brand/empty-cart-crate.png` is still in the repo and is no longer referenced.

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
