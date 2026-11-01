---
title: Marketplace Search White and Category Reveal
type: delivery
date: 2026-11-01
status: complete
---

# Marketplace Search White and Category Reveal

## What changed

- The search pill in the marketplace header is white (`border-white bg-white`) on the green header, matching the landing page search. Other pages keep the light grey pill.
- The marketplace category section fades up on scroll, using the existing `useRevealOnScroll` hook. The heading and the category grid reveal once, with the same small settle motion the landing page uses. The product grid is not animated, because it is data-driven.
- A layout suggestion for the cluttered marketplace was given in chat only. Nothing was implemented for it.

## Affected files

- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/marketplace/components/MarketplaceCategories.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/marketplace`: the search pill is white on the green header.
- Not checked: the scroll reveal in the browser, and desktop widths.
