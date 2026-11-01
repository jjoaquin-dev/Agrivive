---
title: Marketplace Layout Grouped
type: delivery
date: 2026-11-01
status: complete
---

# Marketplace Layout Grouped

## What changed

- **Search:** one search, in the header (unchanged).
- **Categories:** the duplicate category grid below the hero is gone. On desktop the header category row is the one category row. On phones and tablets a single horizontal chip row shows the categories, since the header row is hidden there.
- **Filters:** price range, seller distance, and the old category list were grouped into one collapsible "Filters" bar with an active count and a Reset. On desktop it opens inline. Below 1024px it opens as a left drawer. The category list left the filters, since it lives in the category row.
- **Map:** the map no longer sits beside the results. A "List | Map" switch chooses what fills the full-width results area. Selecting a seller card switches to Map and scrolls to it.
- **Order:** hero, categories (phones), filters, then results.

## Affected files

- `web/src/features/marketplace/components/MarketplaceBrowser.tsx` (layout, view switch)
- `web/src/features/marketplace/components/MarketplaceCategories.tsx` (chip row for phones)
- `web/src/features/marketplace/components/MarketplaceFilterBar.tsx` (new)
- `web/src/features/marketplace/components/MarketplaceFilterControls.tsx` (new: price and distance)
- Deleted: `web/src/features/marketplace/components/MarketplaceFilterSidebar.tsx`

## Open questions

- The hero is still above the categories. It is a headline rather than a step, so it was kept. Remove it if you want the page to start straight at categories.

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/marketplace`: the desktop order is the hero, the filter bar, then the results, with the List | Map switch. The category row is hidden on desktop, as intended.
- Not checked: the phone drawer, the chip row on phones, and the map view.
