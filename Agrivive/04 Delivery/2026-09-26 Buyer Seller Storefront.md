---
title: Buyer Seller Storefront
type: delivery
date: 2026-09-26
status: implemented; manual API and browser review pending
---

# Buyer Seller Storefront

## Why

Buyers need a public page where they can learn pickup details and browse a seller's current products.

## What changed

- Added a public seller profile read endpoint with shop name, seller type, address, and pickup instructions. Private phone details are not returned.
- Added a seller ID filter to the paginated marketplace products endpoint.
- Added `/sellers/[id]` with a restrained Agrivive storefront masthead, pickup details, available product grid, empty state, retry state, and load-more behavior.
- Linked seller names on product cards and product details to the seller storefront.
- Kept the storefront consistent with the buyer web palette, typography, page width, and responsive marketplace grid.

## Affected paths

- `backend/src/modules/marketplace/model/marketplace.products.ts`
- `backend/src/modules/marketplace/index/marketplace.products.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/src/modules/marketplace/services/marketplace.seller.get.ts`
- `web/app/sellers/[id]/page.tsx`
- `web/src/features/marketplace/api/marketplace.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/components/SellerStorefront.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## Verification

- `cd backend && bunx tsc --noEmit`: passed.
- `cd backend && bun build src/index.ts --outdir .verification-storefront-build --target bun`: passed. Temporary output was removed so existing `backend/dist` changes were preserved.
- `cd web && bun run typecheck`: passed.
- `git diff --check` reported no whitespace errors in tracked changes; Git noted LF-to-CRLF normalization. A trailing-whitespace scan of all affected files found none.
- Browser review and live API calls have not been performed.

## Manual API checks

Both routes are public and need no authentication headers.

### Seller details

- Method: `GET`
- Path: `/marketplace/sellers/{sellerId}`
- Expected response: `200` with `id`, `shopName`, `sellerType`, `detailAddress`, and `pickupInstructions`; unknown or unavailable sellers return `404`.

Example:

```http
GET /marketplace/sellers/seller-user-id
```

### Seller products

- Method: `GET`
- Path: `/marketplace/products?sellerId={sellerId}&limit=12`
- Expected response: `200` with `products` and `nextCursor`; each product follows the marketplace product response shape.

Example:

```http
GET /marketplace/products?sellerId=seller-user-id&limit=12
```
