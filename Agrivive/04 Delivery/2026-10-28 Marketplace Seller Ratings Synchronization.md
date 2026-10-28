# 2026-10-28 Marketplace Seller Ratings Synchronization

## Context & Objectives
Ensure seller ratings in the buyer marketplace accurately reflect verified buyer reviews from the database rather than hardcoded mock values. When sellers have no reviews yet, display `⭐ 0`.

## Why
1. Previously, [`web/src/features/marketplace/components/MarketplaceSellerSection.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/MarketplaceSellerSection.tsx) hardcoded `rating: "4.9"` as sample data during initial layout styling, causing all stall cards to display `⭐ 4.9` regardless of whether the seller had actual reviews.
2. In accordance with honest system status and transparency, the seller rating in the marketplace stall list and interactive map popups must directly reflect aggregate scores from the `order_reviews` table. Sellers without reviews should clearly show a rating of `0`.

## What Changed
1. **Backend Seller Rating Aggregation**:
   - [`backend/src/modules/marketplace/services/marketplace.sellers.map.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/marketplace/services/marketplace.sellers.map.ts): Added a left-joined subquery aggregating `order_reviews` by `sellerId` (`round(avg(rating)::numeric, 1)::float` and `count(*)::int`), returning `rating` (`number | null`) and `reviewCount` (`number`) in `listMarketplaceSellersMap`.
2. **Frontend Type Definition**:
   - [`web/src/features/marketplace/types.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/types.ts): Added `rating?: number | null;` and `reviewCount?: number;` to `MarketplaceSellerMapResult`.
3. **Marketplace Seller Section UI**:
   - [`web/src/features/marketplace/components/MarketplaceSellerSection.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/MarketplaceSellerSection.tsx): Replaced the hardcoded `"4.9"` with dynamic rating display: formats to 1 decimal place when ratings exist, or `"0"` (`⭐ 0`) when the seller has no reviews.
4. **Map Popup Consistency**:
   - [`web/src/features/marketplace/components/seller-map-popup.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/seller-map-popup.ts): Included the `⭐ ${rating}` badge in the map pin popup to keep map view and card view identical.

## Affected Files
- `backend/src/modules/marketplace/services/marketplace.sellers.map.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`
- `web/src/features/marketplace/components/seller-map-popup.ts`

## Verification Performed
- Executed `listMarketplaceSellersMap` against live database: verified rated sellers return actual averages (`Ariannix`: 5, `Jaras`: 4.7) and unreviewed sellers return `null` rating with `reviewCount: 0`.
- Executed `bunx tsc --noEmit` in `backend/` — passed with 0 errors.
- Executed `bun build src/index.ts --outdir dist --target bun` in `backend/` — bundled cleanly in 494ms.
- Executed `bun run typecheck` (`tsc --noEmit`) in `web/` — passed with 0 errors.
- Verified line count of `MarketplaceSellerSection.tsx` is 199 lines ($\le 200$ lines).
- Verified line count of `marketplace.sellers.map.ts` is 145 lines ($\le 200$ lines).

## Commit Reference
- Commit: `8b5e1d90`
- Message: `sync marketplace seller ratings with buyer reviews`
