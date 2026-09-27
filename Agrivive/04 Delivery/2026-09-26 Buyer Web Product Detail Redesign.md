# Buyer Web Product Detail Redesign

Date: 2026-09-26

## What changed

- **Created Seller Reviews Backend Service (`backend/src/modules/buyer/services/buyer.seller.reviews.ts`)**:
  - Implemented `readSellerReviews` aggregating average rating, total count, 5-star to 1-star breakdown counts, and a list of the 10 most recent verified buyer reviews with seller responses and buyer display names.
- **Added Public Seller Reviews Route (`backend/src/modules/buyer/index/buyer.order.review.ts`)**:
  - Registered `GET /sellers/:id/reviews` for open marketplace access to seller ratings and verified buyer feedback.
- **Created Seller Reviews Frontend Section (`web/src/features/marketplace/components/SellerReviewsSection.tsx`)**:
  - Displays stall ratings with average score, 5-star graphical bars, rating breakdown percentages, verified buyer reviews, and seller response notes.
  - Implemented a clear empty state (`Empty` component) when the seller has no completed pickup reviews yet.
- **Created Similar Produce Section (`web/src/features/marketplace/components/SimilarProduceSection.tsx`)**:
  - Fetches and displays up to 3 related produce listings from the same product category, filtering out the current listing.
- **Refactored Product Detail Component (`web/src/features/marketplace/components/ProductDetail.tsx`)**:
  - Reorganized the split layout: large single produce photo on the left; product category, title, pricing, availability badge, seller stall metadata, quantity input, cart/reservation actions, and pickup instructions on the right.
  - Composed `SellerReviewsSection` and `SimilarProduceSection` below the main product card.
- **Updated API Client & Types (`web/src/features/marketplace/`)**:
  - Defined `SellerReviewItem` and `SellerReviewsResponse` in `types.ts`.
  - Added `getSellerReviews` helper in `api/marketplace.ts`.

## Why

Adapt the buyer product detail page to a trust-first experience designed specifically for local produce shoppers. Transparent seller feedback, verified pickup badges, and related produce help buyers make confident reservations while strictly complying with the repository's 200-line source file limit.

## Affected paths

- `backend/src/modules/buyer/services/buyer.seller.reviews.ts`
- `backend/src/modules/buyer/index/buyer.order.review.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/api/marketplace.ts`
- `web/src/features/marketplace/components/SellerReviewsSection.tsx`
- `web/src/features/marketplace/components/SimilarProduceSection.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## Verification

- `bunx tsc --noEmit` in `backend/` passed with 0 errors.
- `bun build src/index.ts --outdir dist --target bun` in `backend/` bundled 1519 modules with 0 errors.
- `bun run typecheck` in `web/` passed with 0 errors.
- `bun run build` in `web/` generated all 11 static and dynamic routes with 0 errors.
- Line counts verified: all created and modified files are strictly <= 200 lines (`buyer.seller.reviews.ts`: 65, `buyer.order.review.ts`: 32, `SellerReviewsSection.tsx`: 147, `SimilarProduceSection.tsx`: 45, `ProductDetail.tsx`: 145).
