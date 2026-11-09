---
title: One Review Per Order
type: delivery
date: 2026-11-08
---

# One Review Per Order (2026-11-08)

## What changed

A buyer now leaves **one review per completed order, on one screen**: stars for the produce, stars for the seller (pickup, communication, accuracy), one optional comment, one optional photo. The buyer can change it for **15 days** after posting.

- The seller's trust rating is the **average of the service stars** across orders. Product stars never reach seller trust points, the seller rating, or the visibility ranking. A product that was in poor shape cannot lower the seller, and a late seller cannot lower the product.
- Service stars of 1 or 2 add one trust point per order (the existing `low_rating` rule, now fed only by service stars).
- A multi-item order has one product rating for the whole order. It counts once for each product in the order on that product's page.
- Reviews are still one per order (`order_reviews.order_id` is unique); a second post returns 409. Cancelled, expired and pending orders return 409.

## Why

This follows the supervising professor's direction (one review for service and product, plus a seller rating for trust) and the Shopee-style rule of keeping product and seller scores apart. Surplus produce is often imperfect, so product stars are kept out of seller trust.

## Rules and numbers

- Edit window: 15 days from posting (`reviewEditDays` in `utils/review-format`). This is the reference marketplace's figure, not a result from the paper. Change the constant if the professor decides otherwise.
- Photo: JPG, PNG or WebP, up to 5 MB, content checked, stored privately, shown through a one-hour signed link.
- Averages are simple averages. No Bayesian formula was added.
- Old reviews keep working: their `rating` is the service stars and they have no product stars.

## Affected files

- Database: `backend/src/db/schema.ts` (`order_reviews.product_rating`, `photo_key`, `updated_at`), `backend/drizzle/20261108130000_one_review_per_order/migration.sql`.
- Backend services and routes: `buyer.order.review.{create,edit,photo}.ts`, `index/buyer.order.review.ts`, `model/buyer.order.review.ts`, `utils/review-format`, `utils/review-photo`, `utils/product-rating`, `utils/trust/{score,read-review}.ts`, `utils/visibility-ranking/load.ts`, `marketplace.product.reviews.list.ts`, `marketplace.products.{list,deals}.ts`, `seller.reviews.list.ts`, `utils/s3/private-download.ts`.
- Removed: per-item review routes and services (`buyer.order.product-review.*`, `buyer.product.review-eligibility`, `seller.product-review*`, `seller.product-reviews.list`). The `product_reviews` table is kept for old data and is no longer read.
- Web: `OrderReviews.tsx`, `OrderReviewForm.tsx`, `ProductReviewsSection.tsx`, `orders/api/orders.ts`, `marketplace/api/marketplace.ts`, `marketplace/types.ts` (deleted `ProductReviewForm.tsx`).
- Mobile (seller): `reviews.tsx`, `ReviewCard.tsx`, `review-card.styles.ts`, `useSellerReviews.ts`, `seller-reviews.ts`, `types.ts` (deleted `ReviewKindTabs.tsx`).
- Docs: `backend/API_ENDPOINTS.md`.

## Verification

- `bun test` in `backend/`: 95 pass, 0 fail (new `buyer.order.review.test.ts` and `buyer.order.review.route.test.ts`). They run against an in-memory Postgres (PGlite, a dev dependency) with a fake S3, never the real database. The route test uses the real routes and the real sign-in guard with a fake session lookup.
- `bunx tsc --noEmit` in `backend/`: only the two existing errors in `src/ahp-test.ts` and `src/topsis-test.ts` remain (unchanged files).
- `bun build` for the API and worker; `bun run typecheck` and `bun run build` in `web/`; `bun run typecheck` in `mobile/`: all passed. `expo export` was not run (no `node` on this machine).
- Not done: manual run in the browser or on a phone, and the real-S3 photo upload.

## Before release

1. Apply the migration to the real database (explicit release step; it only adds three nullable columns).
2. Rebuild the API and worker (`backend/dist` is tracked) and the web app.
3. Rebuild the seller APK for the new Reviews screen.
4. Earlier audit and test sheets are in `Agrivive/docs/review-rating-tests/`. They describe the **old** per-item behaviour and are kept as the record of that audit.
