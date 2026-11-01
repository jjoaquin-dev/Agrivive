---
title: Buyer Header Filters On All Pages
type: delivery
date: 2026-11-02
status: complete
---

# Buyer Header Filters On All Pages

## What changed

- The navbar search on every buyer page now shows the price and distance dropdowns beside the category, the same as on the marketplace. Before, they only rendered on `/marketplace`, so orders, messages, notifications, profile and other buyer pages showed the plain search.
- The same filters now also appear in the navbar's second row, below 1280px, and in the mobile menu.
- Choosing a price or distance on a non-marketplace page sends the buyer to `/marketplace` with that filter. The existing filter hook already does this.

## Affected files

- `web/src/components/BuyerHeaderSearch.tsx`
- `web/src/components/BuyerSiteHeaderNav.tsx`

## Not changed

- The public marketplace overview page (`/marketplace/overview`) still has the white header without the filters. It is a public page with its own layout, so it was left as it is.

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in the browser: the preview pane had no width at check time, so the header could not be measured. Check `/orders` and `/messages` at 1280px and wider.
