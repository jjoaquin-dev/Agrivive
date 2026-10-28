# 2026-10-28 Buyer Favorites Dropdown and Tooltip Integration

## Overview
Added a **"Favorites"** menu entry with a heart icon to the buyer's account dropdown, added interactive floating tooltips to the circular heart button on product cards, and created the dedicated `/favorites` page with a clean `#fdfdfd` canvas background to display all saved products.

## Changes Made
1. **`web/src/components/BuyerAccountMenu.tsx`**:
   - Added the "Favorites" item with a `Heart` icon and tooltip, linked to `/favorites`.
   - Compacted helper logic to maintain a clean file size of 195 lines (within the 200-line requirement).
2. **`web/src/features/marketplace/components/ProductCardMedia.tsx`**:
   - Added a floating micro-pill tooltip above the circular heart button.
   - Dynamically displays "Add to favorites" or "Remove from favorites" with smooth opacity transitions on hover/focus.
   - Maintained file length at 116 lines.
3. **`backend/src/modules/buyer/services/buyer.wishlist.list.ts`**:
   - Enhanced `listBuyerWishlist` to join saved product IDs with active marketplace items and seller profiles.
   - Returns both `productIds` and detailed `products: MarketplaceProduct[]`.
4. **`web/src/features/wishlist/types.ts`**:
   - Added optional `products?: MarketplaceProduct[]` to `BuyerWishlistResponse`.
5. **`web/src/features/wishlist/components/BuyerFavorites.tsx`**:
   - Dedicated favorites component rendering saved products in the responsive 4-column product grid using `ProductCard`.
   - Updated page canvas background to `bg-[#fdfdfd]`.
   - Includes item count indicator and an empty state inviting buyers to explore the marketplace.
6. **`web/app/favorites/page.tsx`**:
   - Route page component for `/favorites` with `BuyerSiteHeader`, `Suspense`, and `bg-[#fdfdfd]` fallback.

## UI/UX Principles Applied
- **Recognition Over Recall (Jakob Nielsen & Rolf Molich)**: Buyers can quickly scan and access all their saved produce from the user menu without remembering specific item names or search terms.
- **Affordances and Signifiers (Don Norman)**: Heart icon combined with instant micro-pill tooltips clearly communicates how to save and unsave items.
- **Figure-Ground Principle (Gestalt)**: Crisp `#ffffff` product cards float cleanly against the subtle `#fdfdfd` background canvas.

## Affected Files
- `backend/src/modules/buyer/services/buyer.wishlist.list.ts`
- `web/src/features/wishlist/types.ts`
- `web/src/features/marketplace/components/ProductCardMedia.tsx`
- `web/src/components/BuyerAccountMenu.tsx`
- `web/src/features/wishlist/components/BuyerFavorites.tsx`
- `web/app/favorites/page.tsx`

## Verification Performed
- Ran `cd backend; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Ran `cd backend; bun build src/index.ts --outdir dist --target bun` -> Succeeded in 393ms.
- Ran `cd web; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Confirmed all file line counts remain $\le 200$ lines.
