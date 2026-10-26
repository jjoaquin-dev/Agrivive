---
title: Find a Seller Nearby Subtle Palette Gradient
date: 2026-10-25
type: delivery
status: completed
related_documents:
  - "[[2026-10-25 Marketplace UI-UX Sections, Gradients, Typography, and Filter Alignment]]"
---

# Find a Seller Nearby Subtle Palette Gradient

## Overview
Added an ultra-light, almost transparent background gradient to the "Find a seller nearby" section (`MarketplaceSellerSection.tsx`) based on the brand's 5-color palette, adhering to user specifications for a very subtle, nearly transparent wash.

## Color Palette Applied
- **Forest Green** (`#457D00`): 3.5% opacity bottom-right botanical grounding
- **Warm Olive** (`#C6C736`): 4%-5% opacity transitional wash
- **Fresh Lime** (`#96B125`): Subtly bridged in linear transitions
- **Tangerine Orange** (`#FEA938`): 4% opacity top-left warm illumination
- **Butter Cream** (`#FCEC9A`): 8% opacity luminous glow

## UI/UX & Psychological Principles
- **Figure-Ground Principle** (*Max Wertheimer, Kurt Koffka, Wolfgang Köhler*): The nearly transparent gradient wash across the section canvas separates the background from the crisp white foreground seller cards and map frame, making them stand out as clear interactive targets.
- **Aesthetic-Usability Effect** (*Masaaki Kurosu & Kaori Kashimura*): Warms the previously stark white card with agricultural palette accents without overwhelming the interface.
- **Don't Make Me Think & Error Prevention** (*Steve Krug, Caroline Jarrett & Gerry Gaffney*): High contrast (WCAG AAA) is preserved with 96% white luminance in the text areas.

## Affected Files
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`

## Verification Performed
- Ran TypeScript typecheck: `npm run typecheck --prefix web` (`tsc --noEmit`) - passed with exit code 0.
