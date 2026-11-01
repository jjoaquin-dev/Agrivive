---
title: Marketplace Filters Map Four Columns
type: delivery
date: 2026-11-01
status: complete
---

# Marketplace Filters Map Four Columns

## What changed

- The filter card is always visible, with no collapse. The "Filters" pill and the active count are on its top-left, and Reset is on its right. Price range and seller distance show below it, two columns on desktop and stacked on phones.
- The map and seller cards are back on the page, directly below the filter card. The List | Map switch and the phone drawer are removed.
- Product cards show four per row on wide screens (`xl`). They are two per row on small screens and three per row on medium screens.
- Order: hero, categories (phones only), filter card, map and seller cards, then the product grid.

## Affected files

- `web/src/features/marketplace/components/MarketplaceFilterBar.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/marketplace`: the filter card and the map section are on the page, and the List | Map switch is gone.
- Not checked: the four-column grid at a wide viewport, and the phone layout.
