---
title: Marketplace Filter Sidebar Restyled
type: delivery
date: 2026-10-31
status: complete
---

# Marketplace Filter Sidebar Restyled

## What changed

- The filter panel uses the same card style as the settings cards: 20px radius, soft border, and the same shadow.
- The title is a heading in the Parkinsans heading font. Reset is a small pill button.
- Section labels are muted grey-green instead of bright green, so the green is kept for selected states only.
- Category rows, distance chips, and the map toggle use one selected style (light green fill and border) and one idle style, with 44px minimum height on the rows.
- Distance chips are pills, to match the other pill controls on the site.
- The map toggle sits in a soft panel.
- The "📍" emoji in the location note was removed. The UI rules say to use icons, not emoji.
- Behavior, props, and the price slider are unchanged.

## Affected files

- `web/src/features/marketplace/components/MarketplaceFilterSidebar.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
