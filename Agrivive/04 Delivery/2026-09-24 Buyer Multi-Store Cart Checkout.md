# Buyer Multi-Store Cart Checkout

Date: 2026-09-24

## What changed

- Added `POST /buyer/checkouts` for atomic multi-product buyer checkout.
- The checkout groups cart items by seller and creates one seller order per store under one checkout.
- Existing direct Buy Now orders remain unchanged.
- Added a versioned local-storage cart for guest and signed-in buyers.
- Added Cart navigation, product-detail Add to cart, grouped store sections, quantity controls, removal, subtotals, grand total, and checkout recovery states.
- Checkout conflicts refresh current product prices and available quantities before retrying.
- Added an orders success banner after cart checkout and documented the multi-store interaction rules.

## Why

Buyers need to reserve several products from different stores in one flow while preserving seller-specific pickup and QR scanning. The backend transaction ensures that a failed item does not leave partial reservations.

## Affected paths

- `backend/src/modules/buyer/model/buyer.checkout.create.ts`
- `backend/src/modules/buyer/index/buyer.checkout.create.ts`
- `backend/src/modules/buyer/services/buyer.checkout.create.ts`
- `backend/src/modules/buyer/index.ts`
- `web/src/features/cart/`
- `web/app/cart/page.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/orders/components/OrderCard.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/app/layout.tsx`
- `web/app/orders/page.tsx`
- `.agents/design/web-design/DESIGN.md`

## Verification

- `cd backend && bunx tsc --noEmit` — passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` — passed.
- `cd web && bun run typecheck` — passed.
- `cd web && bun run build` — passed.
- `POST http://localhost:3000/buyer/checkouts` without a session — returned `401`, confirming the new route is registered and protected.

## Manual testing pending

- Guest cart persistence through refresh and authentication.
- Multi-store checkout creates one order per seller.
- Seller-specific QR scanning for each generated order.
- Idempotent retry and atomic stock-conflict rollback.

