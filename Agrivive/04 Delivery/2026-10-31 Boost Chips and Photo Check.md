# 2026-10-31 Boost Chips and Photo Check

Finishes the two items listed as not done in [[2026-10-31 Boost UI Aligned With Backend]].

## What changed and why
- **Boost chip on listing and analytics cards.** `GET /seller/products` now returns `boost` for each listing (`seller.product.list.boost.ts`): the state, the next price drop time, rounds done, and whether a price drop is waiting for the seller to boost again. The Listings card and the Analytics visibility card show a chip such as "Boosted · next drop 5:40 PM", "Posting now", "Boosted · lowest price reached", "Boost did not post", or "Price dropped · Boost again". The card button reads **View Boost** once a boost was sent. Analytics already takes its products from this same API, so no analytics endpoint changed.
- **Old helper removed.** `utils/promotion-eligibility` is deleted. The Boost photo route (`integrations.social-product-image.ts`) now checks directly that the listing is active, public, in stock and priced.
- Files: `backend/src/modules/seller/services/seller.product.list.ts`, `seller.product.list.boost.ts`, `integrations.social-product-image.ts`; mobile `BoostChip.tsx`, `ProductCard.tsx`, `VisibilityBreakdownCard.tsx`, `boost/types.ts`, `inventory/types.ts`; `backend/API_ENDPOINTS.md`.

## Verification
Backend `bunx tsc --noEmit` and mobile `bun run typecheck` pass. Not tested on a device.
