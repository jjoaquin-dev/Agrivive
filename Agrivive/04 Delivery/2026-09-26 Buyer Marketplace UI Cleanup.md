---
title: Buyer Marketplace UI Cleanup
type: delivery
date: 2026-09-26
status: implemented; visual review pending
---

# Buyer Marketplace UI Cleanup

## Why

Marketplace card actions felt cramped, category and reset controls were repeated, and product and seller rating summaries had separate copies of the same layout.

## What changed

- Kept cart actions labeled and at least 44px tall; the compact-card update below uses one full-width primary action.
- Kept the category chips as the marketplace category picker and removed the repeated product type select from the filter panel.
- Kept one clear-all action beside active filters and removed extra clear controls from the filter panel and empty state.
- Gave the mobile and desktop filter fields unique IDs and enlarged filter and search targets.
- Shared seller type labels and the rating summary layout across marketplace cards, filters, product reviews, seller reviews, and product details.
- Removed repeated marketplace intro copy and a static sort badge that had no sort control.
- Changed the listing count text to say how many listings are shown on the current page.

## Affected paths

- `web/src/features/marketplace/components/ActiveFilters.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceFilters.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductReviewsSection.tsx`
- `web/src/features/marketplace/components/ReviewSummaryCard.tsx`
- `web/src/features/marketplace/components/SellerReviewsSection.tsx`
- `web/src/features/marketplace/hooks/useMarketplaceBrowser.ts`
- `web/src/features/marketplace/marketplace-labels.ts`

## Verification

- `cd web && bun run typecheck`: passed.
- `git diff --check`: passed for tracked marketplace changes.
- Source files remain at or under the 200-line limit.
- Tried `cd web && bun run dev`; Next.js could not start because Windows returned `spawn EPERM`. A browser screenshot review could not be completed in this environment.

## Typography and compact product cards

### What changed

- Reduced the shared Tailwind text scale. Body copy is 15px, secondary copy is 13px, and heading sizes are smaller while 12px labels and existing 44px button targets remain readable and easy to tap.
- Shortened marketplace cards by reducing image height and spacing, showing one full-width `Add to cart` action, and hiding the rating row when a product has no reviews.
- Kept rating details linked on cards that have reviews.

### Affected paths

- `web/tailwind.config.ts`
- `web/src/styles/tokens.css`
- `web/src/features/marketplace/components/ProductCard.tsx`

### Verification

- `git diff --no-index --check` printed no whitespace errors for these edits (Git noted LF-to-CRLF normalization). The frontend type check and browser review were not run for this update.
