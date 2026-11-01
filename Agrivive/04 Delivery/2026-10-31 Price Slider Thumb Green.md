---
title: Price Slider Thumb Green
type: delivery
date: 2026-10-31
status: complete
---

# Price Slider Thumb Green

## What changed

- The price range slider thumbs were orange (`#fea938`). They are now white with a 2px green ring (`#457d00`), so they stand out on the green track.
- The thumb colors were changed for both the WebKit and Firefox thumb styles, on both thumbs.

## Affected files

- `web/src/features/marketplace/components/MarketplacePriceSlider.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
