---
title: Buyer Product Reviews Backend
type: delivery
date: 2026-09-26
status: implemented; migration applied
---

# Buyer Product Reviews Backend

## Why

Buyers could already rate and comment on sellers after completed orders, but there was no product-level review storage or API. This adds product ratings and comments tied to completed order items.

## What changed

- Added `product_reviews`, with one review allowed for each purchased order item.
- Added a buyer endpoint to rate and comment on a product from a completed order they own.
- Added `GET /buyer/products/:id/review-eligibility` so the product page can find the signed-in buyer's completed purchases and show an existing review or a form.
- Added a public product review endpoint with average rating, count, star breakdown, and the latest ten comments. Reviewer names use the same first-name and last-initial format as seller reviews.
- Added average ratings and review counts to marketplace product listings so cards can show a summary without making one request per card.
- Kept the existing seller rating and comment flow unchanged.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/drizzle/20260926125111_product_reviews/migration.sql`
- `backend/drizzle/20260926125111_product_reviews/snapshot.json`
- `backend/src/modules/buyer/index/buyer.order.review.ts`
- `backend/src/modules/buyer/model/buyer.order.review.ts`
- `backend/src/modules/buyer/services/buyer.order.product-review.create.ts`
- `backend/src/modules/buyer/services/buyer.product.review-eligibility.ts`
- `backend/src/modules/marketplace/index/marketplace.products.ts`
- `backend/src/modules/marketplace/services/marketplace.product.reviews.list.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/dist/index.js` (updated by the backend build)

## Verification

- `bunx tsc --noEmit` passed from `backend/`.
- `bun build src/index.ts --outfile "$env:TEMP\\agrivive-review-backend-build.js" --target bun` passed after adding the eligibility route.
- `bunx tsc --noEmit` passed again after adding the eligibility route.
- `bunx tsc --noEmit` passed after adding marketplace card rating summaries.
- `bun build src/index.ts --outfile "$env:TEMP\\agrivive-marketplace-rating-build.js" --target bun` passed.
- No database migration was needed for this endpoint.
- Drizzle generated the migration; its SQL was narrowed to the product review table and its index and foreign keys so unrelated existing schema changes are not repeated.
- Applied with `bunx drizzle-kit migrate` to the configured database.
- `GET /marketplace/products/:id/reviews` returned 200 with an empty summary for a product with no reviews.
- `GET /buyer/orders/:id/items/:itemId/review` returned 401 without a signed-in buyer, as expected.
- Authenticated review submission checks remain for the owner.

## API examples

`POST /buyer/orders/:id/items/:itemId/review` requires a signed-in buyer and a completed order owned by that buyer:

```json
{
  "rating": 5,
  "review": "Fresh and in great condition."
}
```

`GET /marketplace/products/:id/reviews` is public and returns the rating summary and up to ten recent reviews.
