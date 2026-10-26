# Synchronous Cart State and Reservation Cleanup

**Date:** 2026-10-26  
**Context:** Cart Reservation Flow (`/cart`, `/orders`, `/marketplace/[id]`)

## What Changed

1. **Synchronous LocalStorage Cart Management**:
   - Resolved the issue where items persisted in the cart drawer after clicking **"Reserve cart for pickup"**.
   - In `web/src/features/cart/CartProvider.tsx`, added a synchronous `writeCart(items: CartItem[])` persistence helper that immediately writes or deletes `agrivive:buyer-cart:v1` in `window.localStorage`.
   - Updated `clear()` to immediately invoke `writeCart([])` and `setItems([])`, eliminating asynchronous React state transition delays and race conditions during `router.push('/orders?checkout=...')`.
   - Updated `addItem()`, `refreshItem()`, `updateQuantity()`, and `removeItem()` to synchronously synchronize `localStorage` on every change.

2. **Guaranteed Post-Checkout Cart Purge**:
   - In `web/src/features/orders/components/BuyerOrders.tsx`, introduced an effect listening to `checkoutId` from URL query parameters (`/orders?checkout=...`) that triggers `clearCart()`, guaranteeing that any lingering items from that checkout session are completely purged upon viewing the order confirmation.

3. **"Buy Now" Direct Reservation Cart Cleanup**:
   - In `web/src/features/marketplace/components/ProductDetail.tsx`, updated `handleBuyNow()` to call `removeItem(product.id)` upon successful direct order creation. If a buyer previously added the item to their cart before clicking "Buy now", the item is cleanly removed from the cart.

## Affected File Paths

- `web/src/features/cart/CartProvider.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## UI/UX Standards & Psychological Laws Applied

- **Jakob's Law** *(Jakob Nielsen)*: In standard e-commerce flows (e.g. Amazon, Shopee), completing checkout or reservation immediately empties the cart. Users never expect already-reserved produce to remain in the cart drawer.
- **Doherty Threshold** *(Walter J. Doherty & Ahrvid J. Thadhani)*: Synchronously flushing cart storage and state in $<400$ms ensures zero lag, preventing stale ghost items from appearing across page navigations.
- **Visibility of System Status** *(Jakob Nielsen)*: The cart icon badge and cart drawer accurately reflect items awaiting reservation.

## Verification Performed

- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` (passed with 0 errors).
- Ran `bunx tsc --noEmit` in `backend/` (passed with 0 errors).
- Checked source file line constraints: all files strictly adhere to the $\le 200$ line threshold (`CartProvider.tsx`: 138 lines, `BuyerOrders.tsx`: 160 lines, `ProductDetail.tsx`: 160 lines).
