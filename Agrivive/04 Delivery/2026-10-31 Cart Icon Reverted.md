---
title: Cart Icon Reverted
type: delivery
date: 2026-10-31
status: complete
---

# Cart Icon Reverted

## What changed

- Reverted the cart icon swap. Every header, product card, and cart icon uses the Lucide `ShoppingCart` icon again.
- Removed the glyph component `web/src/components/CartIcon.tsx` and the generated mask image `web/public/brand/cart-icon.png`.
- The earlier cart-icon edits had partly failed in the tool, so the imports and usages were checked and restored in the same pass.

## Affected files

- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/components/SiteHeaderMobileNav.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`
- `web/src/features/marketplace/components/ProductCardAction.tsx`
- `web/src/features/marketplace/components/ProductInfoCard.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`

## Not changed

- The cart drawer empty state already shows `agrivive-welcome-basket.png`. It was changed outside this pass and was left as it is.
- The market illustration the user sent was not applied. Where it should go is still open.

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
