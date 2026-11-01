---
title: Empty Cart Image Swap
date: 2026-11-02
type: changelog
---

# Empty Cart Image Swap

## What changed

- The buyer cart drawer's empty state now uses the green cart-with-plus illustration instead of the old trolley picture.
- The white background was removed (edge flood fill, then trimmed), so the image sits on the drawer's cream background.
- The image is 850×890 and the `Image` width/height props were updated to match.

## Files

- `web/public/brand/empty-cart-plus.png` (new)
- `web/src/features/cart/components/CartDrawer.tsx` (image `src` and dimensions)
- `web/public/brand/empty-cart-trolley.png` (no longer used; left in place)

## Verification

- `bun run typecheck` in `web/` passed.
- Browser pane on `/marketplace`: opened the cart drawer, the new image loads and shows on the cream background.
- Not checked: phone width.
