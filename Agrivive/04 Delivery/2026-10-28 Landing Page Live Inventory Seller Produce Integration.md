# 2026-10-28 Landing Page Live Inventory Seller Produce Integration

## Context & Objectives
Replace the static, hardcoded mock produce items on the landing page's "Freshly Rescued Today" (Live Inventory) section with actual products posted by active sellers from the marketplace. Connect the landing cards to real application state so buyers can save items to their wishlist and add them directly to their cart.

## Why
1. Previously, `HomeFeaturedProduce.tsx` defined four hardcoded mock products (`liveOfferings`): "Sun-Freckled Native Tomatoes", "Curved Highland Carrots", "Glossy Purple Eggplant", and "Native Green Ampalaya", with dummy image paths.
2. The cards on the landing page were purely decorative: clicking "Add to Cart" did not interact with `useCart()`, and clicking the heart icon did not persist to the user's buyer wishlist.
3. Actual produce posted by local sellers in Davao (such as Monggo, Karot, Sitaw, and Kalabasa from stalls like Jaras) was never visible on the landing page, preventing visitors from immediately discovering and reserving real surplus food.

## What Changed
1. **Dynamic Marketplace Fetch in `HomeFeaturedProduce`**:
   - [`web/src/features/home/components/HomeFeaturedProduce.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/HomeFeaturedProduce.tsx):
     - Converted to a dynamic client component that fetches the top 4 products from `listMarketplaceProducts(new URLSearchParams({ limit: "4" }))`.
     - Added skeleton loaders with pulse animations matching the exact card dimensions during loading.
     - Added an empty state fallback linking directly to `/marketplace` if no produce is currently listed.
2. **Real Product Integration in `HomeFeaturedProduceCard`**:
   - [`web/src/features/home/components/HomeFeaturedProduceCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/HomeFeaturedProduceCard.tsx):
     - Updated props to accept `product: MarketplaceProduct`.
     - Integrated `ProductImage` to display real S3 presigned images with unoptimized foreign host fallbacks and placeholder handling.
     - Computed real discount percentage badges (`${discountPct}% OFF`) when `basePrice > currentPrice`, or displayed "Fresh Surplus".
     - Connected wishlist toggle to `useBuyerWishlist()`.
     - Connected quantity selector and "Add to Cart" button to `useCart().addItem(product, qty)` and automatically opened the cart drawer (`setDrawerOpen(true)`).
     - Added sold-out handling disabling buttons when remaining quantity is 0.

## Affected Files
- `web/src/features/home/components/HomeFeaturedProduce.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`

## Verification Performed
- `cd web && bun run typecheck` -> Passed with 0 errors.
- `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` -> Passed with 0 errors (bundled 1,825 modules in 14.3s).
- Verified line counts:
  - `HomeFeaturedProduce.tsx`: 91 lines ($\le 200$)
  - `HomeFeaturedProduceCard.tsx`: 188 lines ($\le 200$)
- Verified API `/marketplace/products` responds with real seller inventory (Monggo, Karot, Sitaw, Kalabasa) from stall "Jaras".
