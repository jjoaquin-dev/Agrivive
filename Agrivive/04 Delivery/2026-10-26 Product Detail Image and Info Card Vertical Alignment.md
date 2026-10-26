# 2026-10-26 Product Detail Image and Info Card Vertical Alignment

## Context & Objectives
In the marketplace product detail view (`/marketplace/[id]`), the left image card and the right product information card had misaligned top and bottom borders. On desktop viewports, the image card extended lower than the information card due to rigid height constraints and an `items-start` grid alignment. The objective was to ensure both cards align with identical top and bottom boundaries.

## Why
- An uneven bottom edge between the hero product image and the information card broke the visual balance and structure (*Law of Prägnanz & Gestalt Simplicity*).
- Symmetrical, equal-height card layouts enhance aesthetic trust and perceived quality in the marketplace listing (*Aesthetic-Usability Effect*).
- Anchoring the primary reservation CTAs (*"Add to cart"*, *"Buy now"*) to the bottom of the card while expanding the image frame provides an ergonomic, grounded layout (*Fitts's Law*).

## What Changed
1. **`web/src/features/marketplace/components/ProductDetail.tsx`**:
   - Replaced `items-start` with `items-stretch` on `<div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">`.
   - Updated the image card container to `flex h-full flex-col` so it matches the information card height.
   - Configured the inner image container with `flex-1 min-h-[380px] sm:min-h-[460px] lg:min-h-0` to fill all available vertical space evenly while maintaining clean responsive behavior on mobile/tablet viewports.
2. **`web/src/features/marketplace/components/ProductInfoCard.tsx`**:
   - Updated card container to `flex h-full flex-col justify-between`.
   - Grouped header and body details in an upper `space-y-5` block.
   - Anchored purchase controls (*Add to cart* / *Buy now*) and the pickup disclaimer in a bottom `space-y-3 pt-2` block so it grounds cleanly to the bottom border.

## Affected Files
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductInfoCard.tsx`

## Verification Performed
- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` — exited with code 0.
- Verified line limits: `ProductDetail.tsx` (161 lines) and `ProductInfoCard.tsx` (172 lines) are both $\le 200$ lines.
- Verified hot module reloading on the active Next.js development server at `http://localhost:3001`.
