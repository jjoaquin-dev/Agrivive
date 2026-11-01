---
title: Empty Cart Crate Image
type: delivery
date: 2026-10-31
status: complete
---

# Empty Cart Crate Image

## What changed

- The cart drawer's empty state now shows a wooden vegetable crate instead of the market-stall card (`agrivive-welcome-basket.png`).
- The crate image had a white background. An edge-connected flood fill made the outer white transparent. White inside the crate was left alone.
- The new image is `web/public/brand/empty-cart-crate.png` (490 × 427). It is shown at 224px wide with no card around it.

## Affected files

- `web/src/features/cart/components/CartDrawer.tsx` (empty-state image only).
- `web/public/brand/empty-cart-crate.png` (new).

## Not changed

- `web/public/brand/agrivive-welcome-basket.png` is still in the repo and is no longer referenced by the cart drawer.

## Verification

- `bun run typecheck` in `web/` passed.
- The background removal was checked by viewing the output image. The transparency was not checked in a browser.
- Not checked in a browser.
