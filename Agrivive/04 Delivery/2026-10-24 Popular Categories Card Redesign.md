---
title: Popular Categories Card Redesign
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-09-24 Buyer Web Marketplace MVP]]"
  - "[[2026-10-24 Standardized Product Card UI-UX Redesign]]"
---

# Popular Categories Card Redesign

## What Changed

1. **Subtle Top-Half Gradient Architecture**:
   - Replaced full-card background coloring with a pure white card surface (`bg-white`).
   - Implemented an upper-half subtle gradient wash (`h-32 rounded-t-[24px] bg-gradient-to-b [color]/90 via-[color]/40 to-transparent`) that gently fades out by the middle of the card.
   - The lower half of the card remains crisp white, providing high contrast and clean presentation for the category names.

2. **Transparent Background Produce Photography**:
   - Removed opaque background artifacts from all 6 category produce images using neural alpha matting (`u2net` engine) to produce true transparent RGBA assets in `web/public/categories/*.png`.
   - Replaced `.jpg` references with transparent `.png` files, eliminating the rectangular white box artifact seen when opaque images sit on top of subtle gradients.
   - Preserved fine produce details (garlic skins, carrot leafy tops, radish tips, and lettuce edges) with zero transparency clipping.
   - Replaced `mix-blend-multiply` with standard rendering and `drop-shadow-sm` so colors remain vibrant and true-to-life on both the upper gradient and lower white card surfaces.
   - Retained fixed container dimensions (`w-28 h-28 sm:w-32 sm:h-32`) and gentle hover scaling (`group-hover:scale-108`).

3. **Subtle Color Washes Per Category**:
   - `Leafy Greens`: Soft Mint wash (`from-[#EAF7E1]/90 via-[#F4FBEF]/40 to-transparent`)
   - `Fruit Vegetables`: Soft Peach / Blush wash (`from-[#FEECE0]/90 via-[#FEF6F0]/40 to-transparent`)
   - `Root Vegetables`: Soft Honey Apricot wash (`from-[#FEF0D8]/90 via-[#FFF8EC]/40 to-transparent`)
   - `Pod Vegetables`: Soft Lime-Pistachio wash (`from-[#E7F8DC]/90 via-[#F3FCEF]/40 to-transparent`)
   - `Tuber Vegetables`: Soft Lavender / Lilac wash (`from-[#F2EBFE]/90 via-[#F9F5FF]/40 to-transparent`)
   - `Bulb Vegetables`: Soft Vanilla / Pearl Cream wash (`from-[#FEF4DC]/90 via-[#FFF9EC]/40 to-transparent`)

4. **Preserved Constraints**:
   - Kept all 6 canonical Agrivive category names intact (`Leafy Greens`, `Fruit Vegetables`, `Root Vegetables`, `Pod Vegetables`, `Tuber Vegetables`, `Bulb Vegetables`).
   - Maintained clean layout with zero quantity text.

## UI/UX Standards Applied

- **Figure-Ground Principle *(Wolfgang Köhler)***: Pure white lower surface ensures crisp readability for text, while the subtle upper gradient anchors the produce without visual distraction.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Subtle half-card gradient washes create an airy, premium digital grocery feel.
- **Gestalt Law of Common Region & Similarity *(Max Wertheimer & Kurt Koffka)***: Consistent `rounded-[24px]` geometry and uniform sizing.
- **Fitts's Law *(Paul Fitts)***: Large interactive card footprint (145px–172px width, 185px–200px height) enables comfortable thumb reach.

## Affected Paths

- `web/src/features/home/components/HomeCategories.tsx`
- `web/public/categories/leafy-greens.png`
- `web/public/categories/fruit-vegetables.png`
- `web/public/categories/root-vegetables.png`
- `web/public/categories/pod-vegetables.png`
- `web/public/categories/tuber-vegetables.png`
- `web/public/categories/bulb-vegetables.png`
- `Agrivive/04 Delivery/2026-10-24 Popular Categories Card Redesign.md`

## Verification Performed

- `bunx tsc --noEmit --project web/tsconfig.json`: Verified 0 errors across category and home feature components.
- `cd web; bun run build`: Next.js 15.5.0 static page generation succeeded with code 0 (20/20 routes).
- Line count check: `HomeCategories.tsx` verified at 108 lines (strictly below the 200-line ceiling).
