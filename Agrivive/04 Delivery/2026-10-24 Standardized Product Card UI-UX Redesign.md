---
title: Standardized Product Card UI-UX Redesign
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-09-24 Buyer Web Marketplace MVP]]"
  - "[[2026-10-24 Popular Categories Card Redesign]]"
---

# Standardized Product Card UI-UX Redesign

## What Changed

1. **Seamless Image Fitting**:
   - Replaced contrasting grey background padding on the card image container with `bg-white` and `mix-blend-multiply` on produce photography.
   - Removed awkward borders and letterbox padding so produce images fit cleanly and edge-to-edge within the upper card boundary.

2. **Cart Icon Integration**:
   - Added the `ShoppingCart` icon (`size-3.5 stroke-[2.5]`) inside the `Add to Cart` CTA button in both [`HomeFeaturedProduceCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/HomeFeaturedProduceCard.tsx) and [`ProductCardAction.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/ProductCardAction.tsx).
   - Preserved the high-energy Lime-Green `#B8EB5E` button with dark botanical text `#14422B`.

3. **Status Dot Removal**:
   - Removed the distracting pulsing green dot from the stock display across product cards, leaving a clean, uncrowded stock label (e.g. `14 kilos left`, `8 piles left`, `5 sacks left`).

4. **Code Architecture & File Limits**:
   - Kept all source code files strictly below the 200-line ceiling:
     - `HomeFeaturedProduceCard.tsx`: 155 lines
     - `ProductCardAction.tsx`: 115 lines
     - `ProductCard.tsx`: 133 lines
     - `HomeFeaturedProduce.tsx`: 97 lines

## UI/UX Standards Applied

- **Figure-Ground Principle *(Wolfgang Köhler)***: Produce imagery blends seamlessly on pure white without artificial rectangular frames or jarring grey-gradient letterboxing.
- **Affordances and Signifiers *(Don Norman)***: The `ShoppingCart` icon instantly communicates the action of adding the item to the buyer's basket.
- **Don't Make Me Think *(Steve Krug)***: Eliminating the animated status dot removes unnecessary visual motion and cognitive distraction.
- **Fitts's Law *(Paul Fitts)*** & **Touch Target Principle *(Luke Wroblewski)***: Generous 40px tactile button with clear icons and press states.

## Affected Paths

- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`
- `web/src/features/marketplace/components/ProductCardAction.tsx`
- `Agrivive/04 Delivery/2026-10-24 Standardized Product Card UI-UX Redesign.md`

## Verification Performed

- `bunx tsc --noEmit --project web/tsconfig.json`: Verified 0 errors across updated product card components.
- `cd web; bun run build`: Next.js 15.5.0 static page generation succeeded with code 0 (20/20 routes).
- Line counts verified strictly under 200 lines for all files (`HomeFeaturedProduceCard.tsx`: 155 lines, `ProductCardAction.tsx`: 115 lines).
