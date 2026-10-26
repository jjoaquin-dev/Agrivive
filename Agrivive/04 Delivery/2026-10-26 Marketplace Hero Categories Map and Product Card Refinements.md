---
title: Marketplace Hero Categories Map and Product Card Refinements
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-10-26 General Font Inter Standardization]]"
  - "[[2026-10-26 Product Card Typography and Price Size Enhancement]]"
  - "[[2026-10-26 Systemwide UI-UX Standards and Layout Harmonization]]"
---

# Marketplace Hero Categories Map and Product Card Refinements

## Overview
Implemented comprehensive UI/UX refinements across four key marketplace components based on user-provided visual references:
1. **Hero Banner Copy**: Aligned value proposition headlines and subheaders to emphasize savings, sustainability, and local vendor discovery.
2. **Category Grid**: Renamed the section to "Browse Surplus Vegetables", removed the redundant "View all" control, and enlarged category imagery.
3. **Seller Discovery & Interactive Map**: Enforced a strict 4px spacing system with 28px container padding, 24px panel-to-map gap, 352px sidebar width, 312px map height, 80px seller cards with 44×44px avatars, and restyled floating popup at 320px width.
4. **Product Card Architecture**: Standardized 280–300px card width with 16px internal padding, 24px border radius, 1px solid #EAEAEA border, 184px product media height, 28px discount badge, 40×40px favorite button, 22px bold price, 40px quantity selector and pill-shaped Add to Cart button.

## Changes Applied

### 1. Marketplace Hero Banner (`web/src/features/marketplace/components/MarketplaceHero.tsx`)
- Updated badge kicker: `Surplus Today, Value for Everyone`.
- Updated main headline: `Buy More, Waste Less.`.
- Updated supporting subtitle: `Discover surplus vegetables from local vendors at prices that work for you.`.

### 2. Category Navigation (`web/src/features/marketplace/components/MarketplaceCategories.tsx`)
- Updated section title to `Browse Surplus Vegetables`.
- Removed the `View all >` button.
- Enlarged and zoomed in category illustrations via `scale-115 group-hover:scale-125`.

### 3. Seller Discovery & Map (`web/src/features/marketplace/components/MarketplaceSellerSection.tsx`, `InteractiveSellerMap.tsx`, `SellerMapModal.tsx`, `seller-map-popup.ts`, `tokens.css`)
- Outer container padding set to `28px` (`lg:p-[28px]`).
- Layout gap set to `24px` (`gap-6`) with `352px` seller panel (`lg:grid-cols-[352px_1fr]`).
- Map height set to `312px` (`h-[312px]`) with `16px` border radius (`rounded-[16px]`).
- Leaflet map zoom controls inset by `12px` (`top: 12px; left: 12px`).
- Seller cards set to `80px` height (`h-[80px]`), `12px` padding, `10px` vertical gaps, `16px` border radius, and `44×44px` avatars.
- Floating Leaflet seller popup set to `320px` width, `16px` padding, `16px` border radius, `44×44px` avatar, `10px` header gap, `20px` spacing before location, `10px` before badge, `12px` before divider, and `40px` action buttons with `12px` border radius.
- Reset `.leaflet-popup-content p, .leaflet-popup-content h3` margins to `0` to prevent Leaflet's default `margin: 1.3em 0` from misaligning content.
- Scaled store name font size to `18px` bold (`text-lg font-bold text-[#457D00]`) and vertically centered the text block alongside the 44px avatar.
- Added explicit `14px` top whitespace between the supplier name line and the stall location address line (`style="margin-top: 14px !important;"`).
- **Dedicated Map Expand Modal (`SellerMapModal.tsx`)**: Removed the expand button from the left seller panel header and positioned it directly on the map in the top-right corner. Clicking "Expand" opens an expansive `max-w-5xl` modal with full interactive pan/zoom, seller clustering, popups, and Escape/backdrop dismissal.
- **Vertical Stretch & Map Alignment**: Aligned the embedded map vertically to span from the top of the `"Near you"` kicker down to the bottom border of the third vendor card using `lg:items-stretch` and `mapHeightClassName="h-full min-h-[350px] w-full"`.
- **Runtime Dev Server Resolution**: Diagnosed and resolved an HTTP 500 error on port 3001 caused by corrupted `.next` dev chunks after a concurrent production build, restoring 200 OK responses across the marketplace.

### 4. Vegetable Product Card (`web/src/features/marketplace/components/ProductCard.tsx`, `ProductCardMedia.tsx`, `ProductCardAction.tsx`)
- **Card container & interactive border state**:
  - Unclicked/unselected: No border (`border-[1.5px] border-transparent`), lifted with a soft ambient shadow (`shadow-[0_8px_26px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]`).
  - Clicked/selected: Vibrant green border (`border-[1.5px] border-[#457D00]`) with green tinted shadow (`shadow-[0_8px_28px_rgba(69,125,0,0.14)]`).
  - Outer border radius: `28px` (`rounded-[28px]`).
- **Media container**: `196px` height, `20px` border radius (`rounded-[20px]`), full-bleed `object-cover` without gray padding border.
- **Badges & actions on image**: Warm peach discount pill (`bg-[#FEC878]` with bold white text), 40×40px circular white favorite button with dark outlined heart.
- **Typography & layout**:
  - Title: Prominent `24px` bold tracking-tight heading (`text-2xl font-bold text-[#14231A]`).
  - Pricing: `text-2xl font-bold text-[#457D00]` with `/ unit` label in normal font (`text-sm font-normal text-[#5C6460]`).
  - Stock remaining: `text-xs` with bold quantity and normal `left` text.
  - Divider: Subtle `border-b border-neutral-100` below pricing.
- **Purchase controls**: `40px` pill quantity selector (`w-[84px]`) and `40px` vibrant lime-green pill Add to Cart button (`bg-[#B4EB4A]`) with dark text and cart icon.

### 5. Marketplace Browser Header (`web/src/features/marketplace/components/MarketplaceBrowser.tsx`)
- Removed redundant "Recommended" sort dropdown button and cleaned up unused `ChevronDown` icon import.

### 6. Active Filter Chips (`web/src/features/marketplace/components/ActiveFilters.tsx`)
- Removed outer border, gray container background, and enclosing box padding, rendering clean inline filter chips with the green label and Clear all button.

## UI/UX & Psychological Principles
- **Miller's Law & Chunking** (*George A. Miller*): Structured 4px spacing hierarchy establishes clear visual sections from product presentation to purchase decision.
- **Fitts's Law** (*Paul Fitts*): 40px touch targets for quantity stepper, favorite toggle, and Add to Cart action maximize precision and ease of operation.
- **Figure-Ground Principle** (*Kurt Koffka*): Balanced border colors (`#EAEAEA`) and dividers (`#F0F0F0`) maintain foreground clarity without visual clutter.
- **Aesthetic-Usability Effect** (*Masaaki Kurosu & Kaori Kashimura*): Geometric proportions and refined whitespace directly elevate user confidence and conversion.

## Affected Files
- `web/src/features/marketplace/components/ActiveFilters.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplaceCategories.tsx`
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`
- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/src/features/marketplace/components/SellerMapModal.tsx`
- `web/src/features/marketplace/components/seller-map-popup.ts`
- `web/src/styles/tokens.css`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductCardMedia.tsx`
- `web/src/features/marketplace/components/ProductCardAction.tsx`

## Verification Performed
1. Verified all source files strictly adhere to the $\le 200$ line limit:
   - `ActiveFilters.tsx`: 105 lines
   - `MarketplaceHero.tsx`: 41 lines
   - `MarketplaceCategories.tsx`: 115 lines
   - `MarketplaceSellerSection.tsx`: 187 lines
   - `InteractiveSellerMap.tsx`: 199 lines
   - `SellerMapModal.tsx`: 88 lines
   - `seller-map-popup.ts`: 97 lines
   - `ProductCard.tsx`: 144 lines
   - `ProductCardMedia.tsx`: 106 lines
   - `ProductCardAction.tsx`: 115 lines
2. `cd web && bun run typecheck` passed with 0 errors.
3. `cd web && bun run build` passed with 0 errors across all 20 static and dynamic application routes.
