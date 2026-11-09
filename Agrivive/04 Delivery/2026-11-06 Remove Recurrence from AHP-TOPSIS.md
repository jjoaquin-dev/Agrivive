---
title: Remove Recurrence from AHP-TOPSIS
type: delivery
date: 2026-11-06
---

# Remove Recurrence from AHP-TOPSIS (2026-11-06)

## What changed

The "recurrence" criterion (earlier listings of the same vegetable by the same seller, capped at 3) is no longer part of the AHP-TOPSIS ranking. The ranking now uses three criteria: freshness, stock availability, seller reliability.

## Why

- No research supports counting past listings, or capping them at 3, as a ranking criterion.
- It could be inflated for free. Archiving and reactivating a product adds a new `listing_cycles` row each time, so three archive-and-reactivate rounds gave the maximum score.
- Stock availability already measures how much of the listing is left, and seller reliability already measures quality.

## Method

- 3×3 pairwise matrix keeps the old ratios 4 : 3 : 2. Weights are freshness 4/9 (44%), stock 3/9 (33%), seller 2/9 (22%). The matrix is fully consistent.
- Random index changed from 0.9 (n = 4) to 0.58 (n = 3) for the consistency ratio.
- `visibility-ahptopsis-v1` stays as the policy name. Tier cut-offs (0.60 / 0.40) are unchanged, but scores will shift, so check them against sample data.

## Affected files

- `backend/src/utils/ahp-topsis/index.ts` (matrix, criteria, weights)
- `backend/src/utils/visibility-ranking/load.ts` (cycles query removed)
- `backend/src/utils/visibility-score/index.ts` (`marketplacePriorCyclesSql` removed)
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`, `marketplace.products.visibility.ts`
- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts` (`/seller/weightedvisibility` no longer returns `criteria.recurrence`, `inputs.recurrence`, `inputs.priorCycles`)
- Tests: `utils/ahp-topsis/ahp-topsis.test.ts` (WSV-005 removed), `marketplace.products.visibility.test.ts`
- `mobile/src/features/marketing/api/seller-visibility.ts`, `components/VisibilityFactorsGrid.tsx` ("Sells often" row removed; weights shown as 44 / 33 / 22)
- `backend/dist/index.js` rebuilt

## Not changed

- The older baseline score in `visibility-score/index.ts` and `marketplace.product.get.ts` (40 / 40 / 20 with repeat supply) still uses prior listings. It is only used when the baseline policy is chosen.
- The `listing_cycles` table is kept. It still decides the current cycle, freshness and original stock.
- Older notes in this folder and `docs/WSV-AHP-TOPSIS-*` still describe four criteria; they are history.
- Scratch files `backend/src/ahp-test.ts` and `topsis-test.ts` were not touched.

## Verification

- `bunx tsc --noEmit` (backend): clean except the existing error in the scratch `ahp-test.ts`.
- `bun test` for AHP-TOPSIS and WSV-008 paging: 22 pass.
- `bun run typecheck` (mobile): clean.
- `bun build` for `src/index.ts` and `src/worker.ts`: success.
- Manual endpoint testing: not done; the owner has not reported a result.
