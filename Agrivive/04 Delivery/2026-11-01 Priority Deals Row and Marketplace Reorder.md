---
title: Priority Deals Row and Marketplace Reorder
type: delivery
date: 2026-11-01
status: done-unverified-in-browser
---

# Priority Deals Row and Marketplace Reorder

## What changed

- **New endpoint** `GET /marketplace/products/deals` (optional `limit`, 1-12, default 8). It returns products that are both in the AHP/TOPSIS "Priority Boost" tier (score >= 0.60) and priced at most 70% of `basePrice` (30%+ off). Results keep AHP order. Response: `{ products, evaluatedAt }`, with the same product shape as `/marketplace/products`. No auth.
- **Buyer marketplace row** "Priority deals" placed directly under the hero. Phones get a swipeable row, desktop gets a 4-column grid. The row hides when there are no deals or the request fails.
- **Reordered marketplace**: Hero, Priority deals, categories (phones), filters, products grid, then the seller map section (moved below the products).
- **Cleanup**: removed the footer sort links (`?sort=price_asc`, `?sort=recent`), which nothing read. Deleted unused components `MarketplacePrice.tsx`, `SimilarProduceSection.tsx`, `MarketplaceLocationFilter.tsx`.

## Affected files

- `backend/src/modules/marketplace/index.ts`: mounts the deals route before the products route.
- `backend/src/modules/marketplace/index/marketplace.products.deals.ts` (new): route.
- `backend/src/modules/marketplace/model/marketplace.products.deals.ts` (new): query model.
- `backend/src/modules/marketplace/services/marketplace.products.deals.ts` (new): reuses `loadEligibleVisibilityCandidates` and `rankVisibilityCandidates`.
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`: `serializeProduct` is now exported. No behavior change.
- `web/src/features/marketplace/api/marketplace.ts`: `listMarketplaceDeals`.
- `web/src/features/marketplace/components/MarketplaceDealsRow.tsx` (new).
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`: new order.
- `web/src/features/marketplace/components/MarketplaceFooter.tsx`: removed sort links.

## Decisions

- "Very low price" = current price at most 70% of base price. This matches the existing "% OFF" badge logic.
- "Priority boosted" = live AHP tier, computed per request. Sent seller boost records are not used.
- The deals endpoint always uses AHP, not the `VISIBILITY_POLICY` switch. This matches `seller/weightedvisibility`.

## Verification

- `bunx tsc --noEmit` in `backend/`: passed.
- `bun build src/index.ts` in `backend/`: bundled into a scratch folder. `dist/` was not rebuilt, so tracked `dist/` files are unchanged.
- `bun run typecheck` and `bun run build` in `web/`: passed.
- Browser: the shared dev server on port 3001 rendered the marketplace hero and loading skeletons. The backend was not running, so the deals data path was not exercised. Desktop and phone layout of the row are still unchecked.

## Risks and follow-ups

- AHP ranks the whole eligible pool on each request. A cache is the next step if this gets slow.
- Under `VISIBILITY_POLICY=legacy`, the grid tier (0.70) and this row (0.60, AHP) can disagree.
- A product can appear twice on the page (row and grid). `ProductCard` sets `id="seller-card-<sellerId>"`, so duplicate DOM ids can occur. Not fixed.
- Job scoring (`check-seller-promotion-eligibility`) still stores placeholder scores (0.5, "Priority Boost"). Not changed.
- `MarketplaceFilters.tsx` still exports the `MarketplaceFilterValues` type used by four files. Its unused `MarketplaceFilters` component is left in place.

## Owner manual test

- Method: `GET`
- Path: `/marketplace/products/deals?limit=8`
- Headers: none
- Expected: 200, `{ "products": [...], "evaluatedAt": "<ISO time>" }`. Every item has `visibilityTier: "Priority Boost"` and `productPrice <= 0.7 * basePrice`.
- Status: not yet tested by owner.

Related: [[00-LATEST]], [[2026-10-31 Cart Icon Category Image and Cart Illustration]]
