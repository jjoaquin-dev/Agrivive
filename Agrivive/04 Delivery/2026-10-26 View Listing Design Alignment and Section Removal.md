# 2026-10-26 View Listing Design Alignment and Section Removal

## Context & Objectives
Align the View Listing page (`/marketplace/[id]`) with the refined visual design of Photo 2: warm canvas background, `rounded-[24px]` cards, `✓` stock availability pill, `#F9F8F1` pill button accents, and remove both the `Similar produce` section (Photo 3) and the redundant `Condition` specification block (Photo 4).

## Why
- Aligning cards to `rounded-[24px]`, warm cream canvas `#F8F6F1`, and subtle border tones `#E5E2DA` creates a cohesive and trustworthy listing atmosphere (*Aesthetic-Usability Effect*).
- Removing the extraneous `Similar produce` carousel and redundant `Condition` label eliminates clutter and reduces choice overload, keeping buyer attention locked on the primary reservation action (*Hick-Hyman Law*, *Cognitive Chunking*).
- Both the hero media container and the information card remain strictly equal in height with aligned top and bottom borders (*Law of Prägnanz & Common Region*).

## What Changed
1. **`web/src/features/marketplace/components/ProductDetail.tsx`**:
   - Set page background to `bg-agrivive-background` (`#F8F6F1`).
   - Upgraded image card styling to `rounded-[24px] border border-[#E5E2DA] bg-white p-3.5 shadow-xs` with inner frame `rounded-[18px] bg-[#FAFAF8]`.
   - Removed `SimilarProduceSection` import and its rendered component at the bottom of the page.
2. **`web/src/features/marketplace/components/ProductInfoCard.tsx`**:
   - Upgraded card container to `rounded-[24px] border border-[#E5E2DA] bg-white p-6 shadow-xs`.
   - Added checkmark icon (`✓`) to the stock availability badge (`✓ 98 kilo available`) matching Photo 2.
   - Removed the `Condition` block under `Seller type`.
   - Updated pickup details card to `rounded-2xl border border-[#EAECE0] bg-[#FAF9F5] p-4`.
   - Updated `Add to cart` button to `border border-[#D5DAC6] bg-[#F9F8F1] hover:bg-[#F3F2EA]`.

## Affected Files
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductInfoCard.tsx`

## Verification Performed
- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` — exited with code 0.
- Verified line limits: `ProductDetail.tsx` (159 lines) and `ProductInfoCard.tsx` (168 lines) are both strictly $\le 200$ lines.
- Verified live hot-reloading on `http://localhost:3001/marketplace/[id]`.
