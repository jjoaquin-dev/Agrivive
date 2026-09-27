# Buyer Web Product Card Polish

Date: 2026-09-26

## What changed

- **Enhanced Marketplace ProductCard (`web/src/features/marketplace/components/ProductCard.tsx`)**:
  - Removed the oversized empty user avatar header and awkward circular floating buttons.
  - Expanded image container height (`h-48 sm:h-52`) with smooth micro-zoom on hover (`group-hover:scale-105 duration-500`).
  - Added floating glassmorphic category badges and live availability indicators (emerald pulse dot for available, destructive badge for sold out).
  - Cleaned stall attribution line featuring a `Store` icon, shop name, and vendor type badge (`Farm direct`, `Retail`, `Direct vendor`).
  - Implemented a full-width primary action button ("Add to cart") with instant tactile feedback ("Added to cart" checkmark transition for 1.5s).
  - Modernized card elevation, borders, and footer with crisp pickup location and distance markers.

## Why

Elevate the produce card to a mouth-watering, premium, trustworthy card aesthetic that highlights the produce, the farm/stall credibility, and the pricing, while fixing visual awkwardness and respecting the 200-line source file limit.

## Affected paths

- `web/src/features/marketplace/components/ProductCard.tsx`

## Verification

- `bun run typecheck` in `web/` passed with 0 errors.
- `bun run build` in `web/` compiled all 11 static and dynamic pages with 0 errors.
- Line count verified: `ProductCard.tsx` is 141 lines (strictly <= 200 lines).
