# Buyer Web Marketplace Redesign

Date: 2026-09-26

## What changed

- **Added ActiveFilters Component (`web/src/features/marketplace/components/ActiveFilters.tsx`)**:
  - Implemented interactive, removable filter chips displaying current search query, radius location, product category, scaling unit, vendor type, price range, and quantity filters.
  - Added a one-click "Clear all" button to reset all active filters simultaneously while preserving UX flow.
- **Enhanced ProductCard Component (`web/src/features/marketplace/components/ProductCard.tsx`)**:
  - Moved the "Available" badge out of the image overlay into the card content header alongside the seller type tag.
  - Made the product title and card image accessible links to `/marketplace/[id]`.
  - Standardized the visual hierarchy: Image -> Status & Vendor Tag -> Product Name & Stall -> Pricing & Remaining Stock -> Pickup Location & Distance.
  - Added restrained motion hover elevation (`hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none`).
- **Refactored Marketplace Browser Architecture**:
  - `MarketplaceHero.tsx`: Extracted a compact, focused search hero banner that keeps listings above the fold and frames "Davao City Pickup" as geographic context.
  - `MarketplaceProductGrid.tsx`: Extracted the listings grid, loading skeleton placeholders, error handling alert, empty state, and cursor-based "Load more" trigger.
  - `useMarketplaceBrowser.ts`: Encapsulated URL query synchronization, geolocation logic, debouncing, and pagination into a custom hook.
  - `MarketplaceBrowser.tsx`: Streamlined orchestrator component under 130 lines composing the hero, filter rail, active chips, and product grid.

## Why

Elevate the Buyer Marketplace to a trust-first, highly scannable browsing experience for local produce buyers in Davao City. Shortening the hero banner brings listings above the fold, while active filter chips provide immediate feedback on active criteria. Modularizing the components ensures every source file strictly complies with the repository's 200-line limit.

## Affected paths

- `web/src/features/marketplace/components/ActiveFilters.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`
- `web/src/features/marketplace/hooks/useMarketplaceBrowser.ts`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`

## Verification

- `bun run typecheck` in `web/` passed with 0 errors.
- `bun run build` in `web/` compiled all 11 static and dynamic pages with 0 errors.
- Line counts verified: all 6 created and updated files are strictly <= 200 lines (`ProductCard.tsx`: 51, `MarketplaceHero.tsx`: 45, `MarketplaceProductGrid.tsx`: 80, `ActiveFilters.tsx`: 120, `MarketplaceBrowser.tsx`: 129, `useMarketplaceBrowser.ts`: 195).
