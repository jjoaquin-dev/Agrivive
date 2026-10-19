---
title: AHP-TOPSIS Visibility Functional Test Cases Delivery & Audit
date: 2026-10-18
type: delivery
status: verified-in-codebase
related_documents:
  - "[[05 AHP-TOPSIS Visibility Functional Test Cases]]"
  - "[[00 Audits and Discrepancies Index]]"
  - "[[02 Marketplace Visibility and AHP-TOPSIS Refinements]]"
  - "[[2026-10-11 AHP-TOPSIS Visibility Implementation Plan]]"
  - "[[2026-10-16 AHP-TOPSIS Marketing Boost Alignment]]"
---

# AHP-TOPSIS Visibility Functional Test Cases Delivery & Audit

## What changed

1. **Vault Test Checklist Integration**:
   - Created `Agrivive/06 Audits and Discrepancies/05 AHP-TOPSIS Visibility Functional Test Cases.md` capturing all 10 test scenarios (WSV-001 to WSV-010) requested for the AHP-TOPSIS Weighted Surplus Visibility system.
   - Updated `Agrivive/06 Audits and Discrepancies/00 Audits and Discrepancies Index.md` to index track 2 (AHP-TOPSIS Section 2.3.2.5).

2. **System Implementation Audit**:
   - Conducted an in-depth code audit of the Agrivive backend and mobile architectures to establish whether each test case (WSV-001 to WSV-010) is implemented.
   - **Result:** All 10 test cases are **100% implemented** in the active codebase:
     - **WSV-001 (Priority Boost $\ge 0.60$):** Implemented via `ahp-topsis/index.ts`, `visibility-ranking/index.ts`, and `marketplace.products.list.ts`.
     - **WSV-002 (Standard Exposure $0.40 - 0.59$):** Implemented via `getVisibilityTier(score)` and `scoreTier()`.
     - **WSV-003 (Basic/Hold $< 0.40$):** Implemented with linear 12-hour freshness decay curve and low-stock handling.
     - **WSV-004 (Cold-Start Neutral Baseline):** Implemented via `coalesce(avg(rating)::double precision / 5.0, 0.5)` in `marketplace.products.list.ts` and `loadEligibleVisibilityCandidates()`.
     - **WSV-005 (Surplus Recurrence Bonus):** Implemented via `marketplacePriorCyclesSql()` and `priorCycles` count of completed cycles for identical produce within 30 days.
     - **WSV-006 (Zero-Stock Sold Out Exclusion):** Implemented via database query condition `gt(sellers_product.productQty, "0")` and `availability: "sold_out"` badge serializer.
     - **WSV-007 (Deterministic Tie-Breaking):** Implemented with deterministic tie-breaker cascade: score descending $\to$ `publishedAt` descending $\to$ `id` alphanumeric.
     - **WSV-008 (Deterministic Cursor Pagination):** Implemented via base64url JSON cursor `{ evaluatedAt, score, publishedAt, id }` maintaining fixed-time evaluation across page scrolls.
     - **WSV-009 (Seller Boost Social Drafts):** Implemented in `seller.social-campaign.create.ts` and `social-promotion-content/index.ts` connecting Groq API (`openai/gpt-oss-20b`) for Facebook and Instagram.
     - **WSV-010 (Safe Zero-Downtime Rollback):** Implemented via environment flag `VISIBILITY_POLICY=visibility-v4` restoring baseline 3-variable weighted ranking instantly without database migration.

## Why

To record formal verification criteria for capstone defense and functional quality assurance, ensuring complete alignment between the Agrivive research paper (Section 2.3.2.5) and the production codebase.

## Affected paths

- `Agrivive/06 Audits and Discrepancies/05 AHP-TOPSIS Visibility Functional Test Cases.md`
- `Agrivive/06 Audits and Discrepancies/00 Audits and Discrepancies Index.md`
- `Agrivive/04 Delivery/2026-10-18 AHP-TOPSIS Visibility Functional Test Cases.md`

## Verification performed

- Verified mathematical formulation in `backend/src/utils/ahp-topsis/index.ts` matches vector-normalized TOPSIS and 4x4 AHP matrix ($CR = 0$).
- Verified cold-start neutral fallback logic in `backend/src/modules/marketplace/services/marketplace.products.list.ts`.
- Verified tie-breaking logic in `backend/src/utils/visibility-ranking/index.ts` and `backend/src/modules/marketplace/services/marketplace.products.visibility.ts`.
- Verified cursor encoding/decoding and deterministic SQL filtering in `backend/src/modules/marketplace/services/marketplace.products.list.ts`.
- Verified social copy generation in `backend/src/utils/social-promotion-content/index.ts`.
- All backend types checked with `bunx tsc --noEmit` (0 errors).
