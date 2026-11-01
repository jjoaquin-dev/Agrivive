---
title: Peso Price Drop and Final Price Alert
type: delivery
date: 2026-11-01
status: code complete, manual testing pending
---

# Peso Price Drop and Final Price Alert

## What changed and why

Owner request: sellers enter the price drop as pesos (for example ₱1.25 every 6 hours), see the final price the drops stop at, and the "Alert me when amount reaches" field is removed; the seller is alerted when the price reaches the final price instead.

Backend:
- New column `sellers_product.price_reduction_amount` (numeric 10,2, default 0), migration `backend/drizzle/20261101160000_price_reduction_amount`. It converts existing listings: amount = current price × old percent ÷ 100 (at least ₱0.01). `price_reduction_percent` stays in the table, unused, for rollback.
- Create/update body field `priceReductionAmount` replaces `priceReductionPercent` (`model/seller.product.ts`, `model/seller.product.create.ts`, `services/seller.product.create.ts`, `services/seller.product.update.ts`).
- `utils/price-reduction/index.ts`: drop must be 0 or more, two decimals, and smaller than the selling price; a drop above 0 needs a final price (`minimumPrice`).
- `seller.product.price-reduction.followup.ts`: each 6-hour round subtracts the peso amount, never below the final price. When it lands on the final price it creates a `final_price_reached` notice ("Final Price Reached": "<product> is now at your final price of ₱X. It will not drop any lower.", sound, Stock and Price topic).
- `integrations.visibility-boost.reduce-price.ts`: `discountPercent` is now the real percent of that round's cut, so the n8n flash-sale caption prompt still works unchanged.
- Rearm, schedule, notify-started and the seller boost read use the amount; the boost read returns `product.priceReductionAmount`.

Mobile:
- Add/Edit form: section "Price drop (optional)", fields "Drop by (₱) every 6 hours" (e.g. 1.25) and "Final price (₱)" with hint; new `PriceDropPreview.tsx` shows "₱60.00 → ₱58.75 → ₱57.50 → …", "Final price: ₱5.00", and how many drops and days until it gets there.
- Removed "Alert me when amount reaches" from the form; create no longer sends it and edit no longer clears an existing value. Older listings that already have a threshold still show "Running low"; new listings will not.
- Peso wording on the listing card pill, product details ("Final price:"), Boost intro sheet, Preview Boost price-drop card and Boost Started.
- `final_price_reached` uses the check icon in the notifications list.

Docs: `backend/API_ENDPOINTS.md` (field, example body, migration, notice).

## Verification

- Backend `bunx tsc --noEmit`, `bun build` (index and worker), `bunx drizzle-kit check`: passed.
- Mobile `bun run typecheck`: passed.
- Not run: migrations, worker, device, n8n.

## Owner manual tests

1. Apply `20261101150000_fb_post_caption` and `20261101160000_price_reduction_amount`.
2. `POST /seller/products` with `{ ..., "productPrice": 60, "priceReductionAmount": 1.25, "minimumPrice": 5 }` → 201; the product returns `priceReductionAmount: "1.25"`.
3. Same with `"priceReductionAmount": 60` → 400 "Price drop must be at least 0.01 and lower than the selling price…"; with `1.25` and no `minimumPrice` → 400 "A final price is required…".
4. Boost the product and let one 6-hour round run: price goes 60.00 → 58.75.
5. Product at ₱6.00 with drop ₱1.25 and final ₱5.00: the next round sets ₱5.00 and a "Final Price Reached" notification appears; no further rounds.
6. App: the form preview updates while typing; the alert field is gone.
