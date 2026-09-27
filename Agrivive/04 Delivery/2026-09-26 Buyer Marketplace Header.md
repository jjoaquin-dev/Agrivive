# Buyer Marketplace Header

Date: 2026-09-26

## What changed

- Redesigned the shared buyer header as a two-row grocery storefront header inspired by the provided reference.
- Added a category and search form wired to the marketplace's existing `productType` and `search` query parameters.
- Added category navigation from the product types already supported by the marketplace.
- Enlarged the profile icon and moved Profile & Settings and Sign Out into an accessible profile menu that closes on outside click or Escape.
- Kept the header cart button with its current item count; it opens the existing cart drawer. Removed the floating lower-right cart button.
- Kept mobile navigation expandable and included search, categories, orders, and account actions.
- Moved unit, seller, price, quantity, and pickup filters from the sidebar into a wrapping toolbar above the listings.
- Removed the "Use my location" filter and browser geolocation flow. Existing location-filtered URLs still show a removable active filter.
- Simplified product cards to the product image, seller profile link, seller name, stall name, product name, price, product rating, Buy Now and Add to Cart icon buttons, and location. Removed availability, seller-type, and quantity-left details.
- Added the seller account display name to marketplace list and detail API responses so it can appear separately from the stall name.
- Widened the shared page container from 1200px to `max-w-7xl` and used it for both buyer header rows so header and body margins align. Updated marketplace loading skeletons to match the new layout.

## Why

Give buyers the compact grocery navigation shown in the reference, keep marketplace filters close to the listings, make profile and cart controls easy to reach, and align the wider page content with the header.

## Affected paths

- `web/src/components/BuyerSiteHeader.tsx`, `web/src/components/MarketplaceHeaderSearch.tsx`, `web/src/components/PageContainer.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`, `web/src/features/marketplace/components/MarketplaceFilters.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`, `web/src/features/marketplace/types.ts`, `web/src/features/marketplace/hooks/useMarketplaceBrowser.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`, `backend/src/modules/marketplace/services/marketplace.product.get.ts`
- `web/app/marketplace/loading.tsx`, `web/app/marketplace/[id]/loading.tsx`

## Verification

- `bunx tsc --noEmit` - passed.
- `bun run build` - passed.
- Backend `bunx tsc --noEmit` - passed.
- Backend `bun build src/index.ts --target bun` to a temporary output file - passed.
- Updated source files remain under the 200-line repository limit.
