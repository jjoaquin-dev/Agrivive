---
title: Orders Empty State Box Image
date: 2026-11-02
type: changelog
---

# Orders Empty State Box Image

## What changed

- The empty state of the buyer All Orders page (`No reservations yet` / `No orders match`) shows the green box illustration instead of the shopping bag icon.
- The white background was removed with the same edge flood fill used for the cart image.

## Files

- `web/public/brand/empty-orders-box.png` (new, 1004×932)
- `web/src/features/orders/components/BuyerOrders.tsx` (icon swapped, `ShoppingBag` import removed, `next/image` import added)

## Verification

- `bun run typecheck` in `web/` passed.
- The image URL serves HTTP 200.
- Not checked in a browser: `/orders` redirects to sign-in in the browser pane, so the empty state was not rendered. Not checked: phone width.
