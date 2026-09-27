---
title: Buyer Product Reviews Frontend
type: delivery
date: 2026-09-26
status: implemented; manual checks pending
---

# Buyer Product Reviews Frontend

## Why

Buyers needed a way to rate sellers and products after a completed pickup, and product pages needed to show the ratings and comments those buyers leave.

## What changed

- Added seller and per-product rating/comment forms to completed buyer order details.
- Added a signed-in buyer review status endpoint for an order item so an already-posted review stays visible after a refresh (`GET /buyer/orders/:id/items/:itemId/review`).
- Added a product detail ratings section with average, star breakdown, and up to ten recent comments, plus loading, empty, error, and retry states.
- Added a product detail review form for signed-in buyers with a completed pickup; guests see a sign-in link, and other buyers see how to become eligible.
- Added a product eligibility request that displays an existing review for each completed purchase and refreshes the public rating summary after posting.
- Updated marketplace cards to show each product's average rating and review count, or `No ratings yet` when there are no reviews.
- Replaced the product card's fixed no-review placeholder with a link to the product ratings section.
- Corrected the seller reviews request path and added a retry state when seller reviews cannot load.

## Affected paths

- `web/src/components/RatingStars.tsx`
- `web/src/features/marketplace/api/marketplace.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductReviewsSection.tsx`
- `web/src/features/marketplace/components/ProductReviewForm.tsx`
- `web/src/features/marketplace/components/SellerReviewsSection.tsx`
- `web/src/features/orders/api/orders.ts`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/orders/components/OrderReviews.tsx`
- `backend/src/modules/buyer/index/buyer.order.review.ts`
- `backend/src/modules/buyer/model/buyer.order.review.ts`
- `backend/src/modules/buyer/services/buyer.product.review-eligibility.ts`
- `backend/src/modules/buyer/services/buyer.order.product-review.read.ts`

## Verification

- `cd web && bun run typecheck`: passed after adding the product page form.
- `cd web && bun run typecheck`: passed after adding rating summaries to product cards.
- `cd backend && bunx tsc --noEmit`: passed after adding the buyer eligibility endpoint.
- Backend bundle passed with output directed to a temporary file to preserve the existing `backend/dist/index.js` workspace changes.
- `cd web && bun run build`: blocked by Windows `spawn EPERM` while Next.js started its build worker.
- Product review API returned 200 with an empty summary after the migration was applied; unauthenticated review status returned 401 as expected.
- Browser interaction and authenticated review submission checks remain pending. The Next.js build should be retried in an environment that can start the build worker.
