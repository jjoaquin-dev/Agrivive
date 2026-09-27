---
title: Buyer Marketplace Storefront Redesign
type: delivery
date: 2026-09-26
status: implemented
---

# Buyer Marketplace Storefront Redesign

## Why

The buyer marketplace interface was updated to provide a bright, clean grocery storefront feel while remaining tailored to Agrivive's Davao City public market surplus mission (Bankerohan, Agdao, Toril, Mintal).

Specific goals addressed:
- Reshaping the marketplace hero into a grocery storefront banner with prominent search and location context.
- Providing immediate category-browsing rhythm with a compact "Browse by type" chip row for all 6 supported vegetable types.
- Streamlining filter sidebar density so listings remain the primary visual focus.
- Enhancing product cards with an honest star-review placeholder ("No reviews yet") and horizontal icon-only Buy Now (`ShoppingBag`) and Add to Cart (`ShoppingCart`) actions connected to `useCart`.
- Unifying previous and discounted prices on a single baseline row with one trailing `/{unit}` label.

## What changed

1. **Grocery Storefront Hero (`MarketplaceHero.tsx`)**:
   - Replaced solid dark block with a bright white retail card featuring Agrivive green accents and a Davao City Public Market pickup pill.
   - Integrated a prominent search input with inline search icon and clear submit button.

2. **Compact "Browse by Type" Category Row (`MarketplaceBrowser.tsx`)**:
   - Added horizontal scrollable pill navigation for "All Produce" and the 6 supported types: *Leafy Greens, Root and Tuber Vegetables, Bulb and Stem Vegetables, Flower Vegetables, Fruit Vegetables, Seeds and Legumes*.
   - Selecting a pill filters the grid dynamically; clicking again or choosing "All Produce" clears the category filter.

3. **Streamlined Filter Sidebar (`MarketplaceFilters.tsx`)**:
   - Reduced padding and form density, creating a tighter, more compact filter panel that sits neatly beside the product grid without dominating the layout.

4. **Product Card with Actions & Review State (`ProductCard.tsx`)**:
   - Added a transparent 5-star silhouette row with "No reviews yet" text, avoiding invented reviews while laying the ground for future review integrations.
   - Added icon-only **Add to Cart** (`ShoppingCart`) and **Buy Now** (`ShoppingBag`) buttons with accessible labels, tied directly into `useCart()` with stopPropagation guards.

5. **Unified Price Layout (`MarketplacePrice.tsx`)**:
   - Grouped original price (strikethrough `<del>`), arrow, and current price on a single baseline row with one trailing `/{unit}` tag.

## Affected paths

- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplacePrice.tsx`
- `web/src/features/marketplace/components/MarketplaceFilters.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`

## Verification performed

1. **TypeScript Type Check**:
   ```bash
   cd web && bun run typecheck
   ```
   *Result:* Passed with 0 errors (`$ tsc --noEmit`).

2. **Next.js Production Build**:
   ```bash
   cd web && bun run build
   ```
   *Result:* Passed with 0 errors. All 11 static and dynamic routes compiled, optimized, and bundled successfully (`/marketplace` at 7.07 kB).
