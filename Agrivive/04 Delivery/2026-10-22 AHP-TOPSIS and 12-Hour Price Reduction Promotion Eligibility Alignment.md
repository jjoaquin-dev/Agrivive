---
title: AHP-TOPSIS and 12-Hour Price Reduction Promotion Eligibility Alignment
date: 2026-10-22
type: delivery
status: verified
related_documents:
  - "[[06 n8n Priority Promotion and Price Reduction Functional Test Cases]]"
  - "[[05 AHP-TOPSIS Visibility Functional Test Cases]]"
  - "[[2026-10-07 Priority Listing Promotions with n8n]]"
  - "[[2026-10-08 Seller Boost Visibility Social Publishing]]"
  - "[[2026-10-19 Promotional Posting Price Inclusion in n8n and Social Campaigns]]"
---

# AHP-TOPSIS and 12-Hour Price Reduction Promotion Eligibility Alignment

## What changed

1. **Promotion Eligibility Utility (`backend/src/utils/promotion-eligibility/index.ts`)**:
   - Added `priceReductionPeriodsApplied` selection from `sellers_product` to the target query.
   - Introduced `PromotionEligibilityOptions` with optional `stage?: "initial" | "followup"` parameter for `getPriorityPromotionEligibility`.
   - Updated eligibility evaluation logic:
     - Initial Boost: Evaluates AHP-TOPSIS placement score ($C^* \ge 0.60$).
     - Surplus / Price-Reduced Boost: When a listing is in `stage === "followup"` or has `priceReductionPeriodsApplied >= 1`, it is eligible for promotion provided it is active, marketable, and has surplus stock ($>0$).
     - Freshness decay ($C_1 \to 0$ after $\ge 12$ hours) no longer blocks surplus price-reduction posts.

2. **Seller Promotion Eligibility Background Worker (`backend/src/jobs/check-seller-promotion-eligibility.ts`)**:
   - Passed `{ stage: job.stage }` to `getPriorityPromotionEligibility` during pre-check and post-price reduction re-evaluation.
   - Fixed the deadlock where aging listings due for 12-hour follow-up price reduction were being marked `skipped` with `"Visibility is below Priority Boost"` before price reduction and n8n webhook dispatch could occur.

3. **n8n Integration Services (`backend/src/modules/integrations/services/`)**:
   - `integrations.promotion.context.ts`: Passed `{ stage: job.stage }` to `getPriorityPromotionEligibility` so n8n can retrieve product context with the new reduced price without throwing HTTP 409.
   - `integrations.promotion.draft.ts`: Passed `{ stage: job.stage }` so n8n can persist the AI-generated follow-up draft as `ready` without throwing HTTP 409. Synchronized the follow-up scheduler delay to 12 hours (`12 * 60 * 60 * 1000`) matching `PRICE_PERIOD_MS`.
   - `integrations.social-publish-dispatch.ts`, `integrations.social-publish-context.ts`, and `integrations.social-product-image.ts`: Now seamlessly recognize price-reduced listings (`priceReductionPeriodsApplied >= 1`) as eligible, preventing false failures during official channel publishing.

4. **Seller Social Publishing Services (`backend/src/modules/seller/services/`)**:
   - `seller.social-campaign.publish.ts`: When sellers approve and publish drafts for price-reduced items (already permitted up to `maxAllowedPosts = (product?.priceReductionPeriodsApplied ?? 0) + 1`), `getPriorityPromotionEligibility` now recognizes their eligibility and allows official channel publishing.
   - `seller.promotion.share.ts`: Passed `{ stage: job.stage }` so sellers can share follow-up promotions with the reduced price.
   - `seller.social-campaign.create.ts`: Cleaned up draft validation now that price-reduced products are legitimately eligible.

## Why

- **Elimination of Conflicting Gatekeeper Rules**:
  AHP-TOPSIS Freshness ($C_1$) has a 40% weight. At 12 hours, $C_1 = 0$, dropping the placement score below 0.60. However, the 12-hour price reduction exists specifically to clear aging surplus produce before spoilage. Blocking the reduced price post because of freshness created a circular paradox where produce could never be promoted at its discounted price.
- **Support for Multi-Stage Marketing Automation**:
  Enables n8n and mobile sellers to publish both:
  1. Fresh Harvest priority boost at listing creation ($T=0\text{h}$).
  2. Discounted Surplus boost after 12-hour scheduled price reduction ($T=12\text{h}$).

## Affected paths

- `backend/src/utils/promotion-eligibility/index.ts`
- `backend/src/jobs/check-seller-promotion-eligibility.ts`
- `backend/src/modules/integrations/services/integrations.promotion.context.ts`
- `backend/src/modules/integrations/services/integrations.promotion.draft.ts`
- `backend/src/modules/seller/services/seller.promotion.share.ts`
- `backend/src/modules/seller/services/seller.social-campaign.create.ts`
- `backend/dist/index.js`
- `backend/dist/worker.js`
- `Agrivive/04 Delivery/2026-10-22 AHP-TOPSIS and 12-Hour Price Reduction Promotion Eligibility Alignment.md`

## Verification performed

1. **TypeScript Type Checking**:
   - Executed `bunx tsc --noEmit` in `backend/` — passed with 0 errors.
2. **Build Verification**:
   - Executed `bun build src/index.ts --outdir dist --target bun` — passed (1,705 modules bundled).
   - Executed `bun build src/worker.ts --outdir dist --target bun` — passed (300 modules bundled).
3. **File Length Compliance**:
   - All source files remain well within the 200-line limit:
     - `backend/src/utils/promotion-eligibility/index.ts`: 113 lines
     - `backend/src/jobs/check-seller-promotion-eligibility.ts`: 153 lines
     - `backend/src/modules/integrations/services/integrations.promotion.context.ts`: 75 lines
     - `backend/src/modules/integrations/services/integrations.promotion.draft.ts`: 89 lines
     - `backend/src/modules/seller/services/seller.promotion.share.ts`: 61 lines
     - `backend/src/modules/seller/services/seller.social-campaign.create.ts`: 113 lines
