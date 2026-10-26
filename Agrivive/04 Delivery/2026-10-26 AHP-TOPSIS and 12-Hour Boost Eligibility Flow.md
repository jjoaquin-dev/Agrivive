# AHP-TOPSIS and 12-Hour Boost Eligibility Flow Overhaul

**Date:** 2026-10-26  
**Type:** Feature / Bug Fix  
**Commit:** `190e311` (`fix boost eligibility for initial post and 12-hour price drop`)  
**Scope:** Backend (`backend/src/utils/promotion-eligibility/`, `backend/src/modules/seller/services/`), Mobile (`mobile/app/(app)/boost/`, `mobile/src/features/boost/`)

---

## 1. Context & Business Need
The user reported two critical blockers in visibility boost and promotional flows:
1. **"Visibility is below priority"**: Newly created products were blocked from their initial post because AHP-TOPSIS score was $< 0.60$ (especially for new accounts or single items where relative closeness defaults to $0.50$).
2. **"Listing is no longer eligible"**: When attempting to boost a product that underwent the 12-hour price reduction (`priceReductionPeriodsApplied >= 1`), the candidate filtering in `loadEligibleVisibilityCandidates` and lack of followup bypass in social campaign endpoints caused 409 errors.

The user specified the exact required business lifecycle:
- **Add product $\rightarrow$ Post $\rightarrow$ Display only 1 time** (add clear indicator / message).
- **12-Hour Rule**: `current price - discounted price` $\rightarrow$ notify user $\rightarrow$ boost again **only 1 time per price drop**.
- **Add indicators and proper messages** everywhere so the seller clearly understands their status.

---

## 2. Key Changes Made

### Backend
1. **`backend/src/utils/promotion-eligibility/index.ts`**:
   - Updated `getPriorityPromotionEligibility` to allow active, marketable listings to qualify for:
     - Their **1 initial boost/post** upon creation (`allowActiveListing: true` or `stage: "initial"`).
     - Every **12-hour price drop boost** (`isPriceReduced = true` whenever `priceReductionPeriodsApplied >= 1` or `stage: "followup"`).
   - Removed strict candidate ranking disqualification for seller's own active produce.
2. **`backend/src/modules/seller/services/seller.social-campaign.create.ts`**:
   - Passed `{ stage, allowActiveListing: true }` to `getPriorityPromotionEligibility`.
   - Returns clear user-facing messages when post limits are reached (e.g. `Initial post already sent (1 of 1 used). You can boost again when the 12-hour price reduction occurs.`).
3. **`backend/src/modules/seller/services/seller.social-campaign.publish.ts`**:
   - Validates eligibility with `{ stage, allowActiveListing: true }` so publishing never fails on aging produce.
4. **`backend/src/modules/seller/services/seller.visibility-boost.read.ts`**:
   - Enriched response with complete pricing facts (`currentPrice`, `basePrice`, `priceBefore`, `priceAfter`, `hasDiscount`) and eligibility facts (`canBoost`, `usedPosts`, `maxAllowedPosts`, `stage`, `headline`, `message`, `badge`).
5. **`backend/src/modules/seller/services/seller.visibility-boost.queue.ts`**:
   - Enforces 1 boost for initial listing (`${cycle.id}:initial`) and 1 boost per reduction period (`${cycle.id}:reduction:${period}`).
   - Handles existing boost prompts and retries cleanly.
6. **`backend/src/modules/seller/services/seller.promotion.share.ts`**:
   - Passed `allowActiveListing: true` so sharing promotions never fails with "no longer eligible".

### Mobile
1. **`mobile/src/features/boost/types.ts`**:
   - Updated `SellerProductBoostResponse` to include rich pricing and eligibility metadata.
2. **`mobile/src/features/boost/components/BoostCycleIndicator.tsx` (New component)**:
   - Visual indicator showing:
     - Stage pill (`Initial Post` or `12-Hour Drop #X`).
     - Status indicator (`Ready to Boost` vs `Used (1 of 1)`).
     - Price drop comparison (`₱[Old] → ₱[New] Discounted Price`).
     - Plain-English 5-year-old readable explanations.
3. **`mobile/app/(app)/boost/[productId].tsx`**:
   - Integrated `BoostCycleIndicator`.
   - Disabled duplicate boost actions when `canBoost` is false.
   - Kept file strictly under 200 lines (189 lines).

---

## 3. Verification Performed
- `cd backend && bunx tsc --noEmit`: 0 errors.
- `cd backend && bun build src/index.ts --outdir dist --target bun`: Bundled 1820 modules in 81ms.
- `cd mobile && bunx tsc --noEmit`: 0 errors.
- `cd mobile && npx -y expo-doctor`: 21/21 checks passed.
- Evaluated test cases via Bun script:
  - Product with 0 reductions and already published $\rightarrow$ `canBoost: false`, `Initial Post Already Sent`.
  - Product with 12-hour price reduction $\rightarrow$ `canBoost: true`, `12-Hour Price Drop Ready to Boost`, draft generated with discounted price.
