---
title: Product Card Typography and Price Size Enhancement
date: 2026-10-26
type: delivery
status: verified
related_documents:
  - "[[2026-10-25 Marketplace Page Layout and Style Alignment]]"
  - "[[2026-10-26 Search Header Category Dropdown Redesign]]"
---

# Product Card Typography and Price Size Enhancement

## What Changed

1. **Category Name Typography Refinement**:
   - Converted category name from all-caps green (`font-bold uppercase tracking-wider text-[#457D00] text-[11px]`) to crisp title-cased black text (`font-bold text-neutral-900 text-[11px]`).
   - Added a reusable `formatCategory` helper function ensuring consistent Title Case capitalization (e.g. `"Seed Vegetables"`, `"Leafy Greens"`), preventing all-caps or all-lowercase rendering.

2. **Price Prominence Enlargement**:
   - Increased current price font size from `text-xl font-extrabold` (20px) to `text-2xl font-black` (24px) in brand green (`#457D00`).
   - Enhanced scannability and contrast with surrounding elements (`/ sack`, strikethrough original price, stock remaining).

3. **Full Product Card Click-to-View-Listing**:
   - Updated `ProductCard.tsx` with an `onClick` handler and `cursor-pointer` to route to `/marketplace/${product.id}` when clicking anywhere on the card (image, whitespace, text, price), with event filtering preserving the seller modal trigger and quantity stepper buttons.
   - Updated `ConversationContextCard.tsx` in the messaging interface to make the entire "About this produce" card a clickable link to `/marketplace/${context.productId}`.
   - Updated `OrderItemsCard.tsx` on the reservation details page to link each ordered item row to `/marketplace/${item.productId}`.

## UI/UX Standards Applied

- **Von Restorff Effect (Isolation Effect) *(Hedwig von Restorff)***: Enlarging the price font to `text-2xl font-black` establishes immediate visual hierarchy so buyers immediately notice the price without scanning secondary metadata.
- **Miller's Law & Chunking *(George A. Miller)***: Shifting the category kicker to crisp black neutral (`text-neutral-900`) reduces cognitive noise and color competition with the primary green price and "Add to Cart" action button.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Title-cased category naming ("Seed Vegetables") feels polished and natural compared to loud all-caps strings.

## Affected Files & Verification

- Modified: [`web/src/features/marketplace/components/ProductCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/ProductCard.tsx) (142 lines, strictly under 200-line ceiling)
- Verification:
  - Frontend typecheck passed: `cd web && bunx --bun tsc --noEmit` (0 errors)
  - Backend typecheck and build passed: `cd backend && bunx --bun tsc --noEmit && bun build src/index.ts --outdir dist --target bun` (1,705 modules bundled)
