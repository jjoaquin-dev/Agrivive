---
title: Seller 12-Hour Price Reduction
type: delivery
date: 2026-09-22
status: implemented
---

# Seller 12-Hour Price Reduction

## What changed

Sellers can optionally reduce an active listing price by a chosen percentage every 12 hours. The reduction compounds from the current price and stops at the seller's minimum price. A percentage of `0` keeps the listing at one price.

The backend applies overdue reductions when a seller product is read or when a buyer creates a reservation. There is no scheduler or n8n dependency. Order items continue to store the price used when the reservation was created.

## Affected files

- `backend/src/db/schema.ts`
- `backend/drizzle/20260922170000_seller_price_reduction/migration.sql`
- `backend/src/modules/seller/model/seller.product.create.ts`
- `backend/src/modules/seller/model/seller.product.ts`
- `backend/src/modules/seller/services/seller.product.price-reduction.ts`
- `backend/src/modules/seller/services/seller.product.create.ts`
- `backend/src/modules/seller/services/seller.product.update.ts`
- `backend/src/modules/seller/services/seller.product.list.ts`
- `backend/src/modules/seller/services/seller.product.get.ts`
- `backend/src/modules/seller/services/seller.product.stock-change.ts`
- `backend/src/modules/seller/services/seller.product.reactivate.ts`
- `backend/src/modules/buyer/services/buyer.order.reserve.ts`
- `backend/src/utils/price-reduction/index.ts`
- `mobile/src/features/inventory/types.ts`
- `mobile/src/features/inventory/validation.ts`
- `mobile/src/features/inventory/components/ProductForm.tsx`
- `mobile/src/features/inventory/components/ProductCard.tsx`
- `mobile/app/(app)/inventory/[id]/index.tsx`

## Data and safety rules

- Existing listings remain unchanged and are disabled until the seller sets a reduction percentage.
- The price schedule starts with the current listing cycle and resets when the base price or pricing rule changes, or when stock is added after reaching zero.
- Price updates lock the product row and use integer cents to avoid duplicate reductions and floating-point errors.
- Minimum price and reduction percentage are validated on the server and mobile form.
- No API keys, tokens, or other sensitive values were added to this note.

## Verification

- Price reduction migration applied successfully.
- Confirmed `base_price`, `minimum_price`, `price_reduction_percent`, `price_reduction_periods_applied`, and `price_schedule_started_at` exist in `sellers_product`.
- `backend bunx tsc --noEmit` passed.
- `backend bun build src/index.ts --outdir dist --target bun` passed.
- `mobile bun run typecheck` passed.
- `mobile bunx expo export --platform android --no-bytecode` passed.
- A rollback database check confirmed a 10% rule changes ₱100.00 to ₱81.00 after two periods and a repeated read does not deduct again.
- Authenticated Postman/OpenAPI boundary checks for 12-hour timing, floor, concurrent reads, and order-price snapshots remain for manual verification.

## Price comparison UI follow-up (2026-09-26)

- Seller inventory cards and product details now show the base price struck through beside the current price when a reduction has occurred.
- Buyer marketplace cards and listing details use the same display. The marketplace list and detail responses now include `basePrice` for this comparison.
- Added reusable price display components at `mobile/src/features/inventory/components/PriceCompare.tsx` and `web/src/features/marketplace/components/MarketplacePrice.tsx`.
- Updated the seller inventory UI, buyer marketplace UI, and marketplace response services.
- Verification: backend, web, and mobile TypeScript checks passed; backend Bun build passed. No browser or device visual review was performed.
