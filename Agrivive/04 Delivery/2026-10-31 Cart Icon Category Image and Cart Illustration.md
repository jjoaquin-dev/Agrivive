---
title: Cart Icon Category Image and Cart Illustration
type: delivery
date: 2026-10-31
status: complete
---

# Cart Icon Category Image and Cart Illustration

## What changed

- **Cart icon:** every cart icon in the buyer site now uses the supplied cart-with-produce glyph instead of the Lucide cart. The glyph is saved as a transparent PNG at `web/public/brand/cart-icon.png` and rendered by a new `CartIcon` component as a CSS mask, so it takes the surrounding text color.
- **Empty cart:** the small cart tile in the empty cart drawer is replaced by the welcome basket illustration (`agrivive-welcome-basket.png`), cropped to the stall and basket.
- **Marketplace category cards:** the category images are larger (`scale-[1.3]`, hover `scale-[1.42]`).
- **Not changed:** the cart logo in the landing header and the splash screen, which are brand marks.

## Affected files

- `web/public/brand/cart-icon.png` (new)
- `web/src/components/CartIcon.tsx` (new)
- `web/src/components/SiteHeader.tsx`
- `web/src/components/SiteHeaderMobileNav.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`
- `web/src/features/marketplace/components/ProductCardAction.tsx`
- `web/src/features/marketplace/components/ProductInfoCard.tsx`
- `web/src/features/marketplace/components/MarketplaceCategories.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
