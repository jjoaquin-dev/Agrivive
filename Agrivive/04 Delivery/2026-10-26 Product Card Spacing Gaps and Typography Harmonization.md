---
title: Product Card Spacing Gaps and Typography Harmonization
date: 2026-10-26
type: delivery
status: verified
related_documents:
  - "[[2026-10-26 Product Card Typography and Price Size Enhancement]]"
  - "[[2026-10-25 Marketplace Page Layout and Style Alignment]]"
---

# Product Card Spacing Gaps and Typography Harmonization

## What Changed

1. **Brand / Category Typography & Tracking**:
   - Updated product category & seller kicker to `12px` (`text-[12px]`), medium weight (`font-medium`), muted gray (`#6B7280`), with `+0.05em` tracking (`tracking-[0.05em]`).
   - Retained location pin accent (`#FEA938`) and dot separator (`#96B125`).

2. **Product Title Typography & Leading**:
   - Adjusted product title from oversized 24px bold to `18px` (`text-[18px]`), semi-bold (`font-semibold`), dark neutral (`#111827`), with line-height of `1.35` (`leading-[1.35]`) and multi-line wrapping support (`line-clamp-2`).

3. **Price & Secondary Info Formatting**:
   - Set current price font size to `20px` (`text-[20px]`), bold (`font-bold`), with `tabular-nums` alignment and preserved brand green (`#457D00`).
   - Styled secondary info (scaling unit `/ kilo`, original price discount strike-through, remaining inventory) to `13px`/`14px` regular (`text-[13px]`/`text-[14px] font-normal`), muted text (`#4B5563`), with tabular figures on numerical counts.

4. **Internal Auto-Layout Gaps & Hierarchy**:
   - Standardized image-to-content gap to `16px` (`mt-4`).
   - Applied micro-gap of `6px` (`mt-1.5`) between brand/category and product title, and `6px` (`gap-1.5`) between original and discounted prices.
   - Applied macro-gap of `16px` (`mt-4`) between title group and pricing group, and `14px` (`mt-3.5`) between price group and CTA action row.

5. **Outer Padding & CTA Button Dimensions**:
   - Upgraded card outer padding to `p-4 pb-4.5` (16px sides/top, 18px bottom), ensuring it never drops below 16px desktop padding.
   - Enhanced Add to Cart / CTA button padding to `py-2.5 px-6` (10px vertical, 24px horizontal) with a minimum height of `42px` for comfortable touch ergonomics.
   - Retained lime green CTA aesthetic (`#B4EB4A` / `#9DE038`), dark green text (`#14231A`), cart icon, and full quantity selector mechanics.

## UI/UX Standards Applied

- **Gestalt Principles (Law of Proximity & Common Region) *(Max Wertheimer, Kurt Koffka)***: Content grouped with clear micro-gaps (4–6px) and separated from unrelated blocks with macro-gaps (12–16px) creates instant visual rhythm and scannability.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Balanced title sizing (18px) and `tabular-nums` formatting keep card grids aligned cleanly, inspiring trust and visual harmony.
- **Miller's Law & Chunking *(George A. Miller)***: 4 discrete chunks (Kicker -> Title -> Price/Stock -> Action) ensure cognitive load remains minimal.
- **Fitts's Law *(Paul Fitts)***: 24px horizontal and 10px vertical CTA button padding creates an expansive, effortless target for purchase commitment.

## Affected Files & Verification

- Modified:
  - [`web/src/features/marketplace/components/ProductCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/ProductCard.tsx) (160 lines, <= 200 lines ceiling)
  - [`web/src/features/marketplace/components/ProductCardAction.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/ProductCardAction.tsx) (115 lines, <= 200 lines ceiling)
- Verification:
  - TypeScript typecheck passed: `cd web && bunx tsc --noEmit` (0 errors)
