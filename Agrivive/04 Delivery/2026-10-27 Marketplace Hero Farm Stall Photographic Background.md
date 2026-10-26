# 2026-10-27 Marketplace Hero Farm Stall Photographic Background

## Context & Objectives
Replace the 3D emoji vegetable sack illustration on the Marketplace Hero banner with an authentic photographic background showcasing a vibrant local farmers market produce stall.

## Why
- **Figure-Ground Principle & Visual Contrast (Gestalt Psychology)**: Replaces synthetic 3D assets with real agricultural photography, paired with a directional dark gradient overlay (`from-black/85 via-black/60 to-black/30`) to maintain WCAG AAA typographic contrast and readability.
- **Aesthetic-Usability Effect**: Authentic photography of fresh vegetables in wooden crates and woven baskets builds trust, warmth, and grounded credibility for a fresh surplus vegetable marketplace.

## What Changed
1. **Asset Deployment**:
   - `web/public/brand/marketplace-hero-farm-stall.jpg`: Deployed the high-resolution photo of fresh produce stalls (1024x690) with wooden crates and woven baskets.
2. **Component Updates**:
   - `web/src/features/marketplace/components/MarketplaceHero.tsx`:
     - Removed the 3D transparent cartoon vegetable illustration.
     - Set `/brand/marketplace-hero-farm-stall.jpg` with `fill` and `object-cover`.
     - Applied a directional readability gradient overlay.
     - Updated headline text to `text-white drop-shadow-xs`, subtitle to `text-white/90 drop-shadow-xs`, and category tag to warm golden `text-[#FCEC9A]`.

## Affected Files
- `web/public/brand/marketplace-hero-farm-stall.jpg`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`

## Verification Performed
- **Live Endpoint Test**: Verified `http://localhost:3001/brand/marketplace-hero-farm-stall.jpg` returns HTTP 200 OK.
- **Page Verification**: Verified `http://localhost:3001/marketplace` returns HTTP 200 OK.
- **TypeScript Typecheck**: Ran `npm run typecheck` (`tsc --noEmit`) in `web/` — 0 errors.
- **Line Count Limits**: Verified `web/src/features/marketplace/components/MarketplaceHero.tsx` is 42 lines ($\le 200$ lines).
