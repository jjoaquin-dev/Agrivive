---
title: AHP-TOPSIS Marketing Boost Alignment
date: 2026-10-16
type: delivery
status: implemented-awaiting-paper-sample-reconciliation
---

# AHP-TOPSIS Marketing Boost Alignment

## What changed

- Replaced Priority Boost promotion eligibility's `visibility-v4` weighted score with the paper-aligned `visibility-ahptopsis-v1` policy.
- Added a shared ranking wrapper with the Figure 5 tiers: Priority Boost at `Ci* >= 0.60`, Standard Exposure from `0.40` to below `0.60`, and Basic/Hold below `0.40`.
- Evaluated TOPSIS across all currently eligible active surplus listings, with publication time and listing ID as deterministic tie-breakers.
- Kept the existing four-criterion AHP matrix and formulas: Freshness, Stock Availability, Seller Reliability, and Historical Surplus Recurrence.
- Stored policy version, score, tier, rank, evaluation time, and completion time on promotion jobs.
- Added the six-hour follow-up backend price reduction toward the seller's minimum price before the refreshed follow-up context is sent to n8n.
- Updated n8n's Groq prompt so initial copy remains neutral and follow-up copy may use only backend-provided current price, quantity, and availability.
- Updated backend/API and Marketing Boost documentation to describe the paper-aligned responsibilities and threshold.

## Why

The paper assigns visibility priority through AHP–TOPSIS. The previous promotion worker used the older `visibility-v4` weighted score, which did not include seller reliability, used an inverted age signal, and required `0.70`. This change makes ElysiaJS and PostgreSQL authoritative for the paper's criteria, ranking, eligibility, price calculation, and job history while n8n and Groq remain responsible for workflow coordination and wording only.

## Affected paths

- `backend/src/utils/visibility-ranking/index.ts`
- `backend/src/utils/visibility-ranking/load.ts`
- `backend/src/utils/promotion-eligibility/index.ts`
- `backend/src/utils/ahp-topsis/index.ts`
- `backend/src/modules/marketplace/services/marketplace.products.visibility.ts`
- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- `backend/src/modules/seller/services/seller.product.price-reduction.followup.ts`
- `backend/src/jobs/check-seller-promotion-eligibility.ts`
- `backend/src/modules/integrations/services/integrations.promotion.context.ts`
- `backend/src/modules/integrations/services/integrations.promotion.draft.ts`
- `backend/src/db/schema.ts`
- `backend/drizzle/20261016120000_ahptopsis_promotion_history/migration.sql`
- `n8n/workflows/agrivive-priority-promotion.json`
- `backend/README.md`
- `backend/API_ENDPOINTS.md`
- `Agrivive/03 Intelligence/Marketing Boost.md`
- `Agrivive/04 Delivery/2026-10-07 Priority Listing Promotions with n8n.md`

## Verification performed

- `bunx tsc --noEmit` — passed.
- `bun build src/index.ts --outdir dist --target bun` — passed.
- `bun build src/worker.ts --outdir dist --target bun` — passed.
- Priority and social n8n workflow exports — parsed successfully as JSON.
- AHP weights — approximately `0.40/0.30/0.20/0.10`; consistency ratio `0`.
- Freshness boundary — `1.0` at publication and `0.0` at 12 hours.
- Tier boundary — `0.60` is Priority Boost and `0.5999` is Standard Exposure.

## Paper sample reconciliation required

The written Figure 5 equations describe standard vector-normalized TOPSIS. Applying those equations to the supplied A/B/C criterion values produces approximately `A=.842`, `B=.595`, and `C=.395`. The sample table states `A=.853`, `B=.402`, and `C=.372` while listing the same equations and criteria. The implementation follows the equations and does not insert an undocumented correction. The paper's sample calculation should be reconciled before the owner records the Figure 5 sample values as a final acceptance test.

No database migration has been applied, no n8n workflow has been activated, and no owner-run API or live social-channel acceptance is recorded as complete.
