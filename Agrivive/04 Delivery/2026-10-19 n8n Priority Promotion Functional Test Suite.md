---
title: n8n Priority Promotion Functional Test Suite (N8N-001 to N8N-010)
date: 2026-10-19
type: delivery
status: verified
related_documents:
  - "[[06 n8n Priority Promotion and Price Reduction Functional Test Cases]]"
  - "[[00 Audits and Discrepancies Index]]"
  - "[[2026-10-07 Priority Listing Promotions with n8n]]"
  - "[[2026-10-16 AHP-TOPSIS Marketing Boost Alignment]]"
---

# n8n Priority Promotion Functional Test Suite (N8N-001 to N8N-010)

## What changed

1. **Created Comprehensive n8n Functional Test Document**:
   - Created `Agrivive/06 Audits and Discrepancies/06 n8n Priority Promotion and Price Reduction Functional Test Cases.md` documenting test cases **N8N-001 through N8N-010**.
   - Aligned threshold specifications with the research paper and codebase: corrected threshold from $0.70$ to **$C_i^* \ge 0.60$** per `visibility-ahptopsis-v1`.
   - Corrected architectural role definitions: clarified that ElysiaJS checks eligibility and dispatches the webhook, while n8n coordinates Groq API calls (`openai/gpt-oss-20b`) and calls back to save drafts.
   - Fixed mathematical calculation typo: corrected discount formula display from `₱900` to `₱90.00`.
   - Documented detailed implementation mechanics, integer cents price reduction arithmetic, minimum price floor clamping, service token bearer authorization, and stateless 6-hour follow-up scheduling.

2. **Updated Audits & Discrepancies Index**:
   - Updated `Agrivive/06 Audits and Discrepancies/00 Audits and Discrepancies Index.md` to include Track 3 for n8n priority promotions and cross-link all related delivery notes.

## Why

To provide a formalized, auditable testing suite for the external n8n automation and ElysiaJS backend integration, ensuring evaluation committees and engineers have an exact verification reference matching the working codebase.

## Affected paths

- `Agrivive/06 Audits and Discrepancies/06 n8n Priority Promotion and Price Reduction Functional Test Cases.md`
- `Agrivive/06 Audits and Discrepancies/00 Audits and Discrepancies Index.md`
- `Agrivive/04 Delivery/2026-10-19 n8n Priority Promotion Functional Test Suite.md`

## Verification performed

1. **Vault Structure & Markdown Syntax**:
   - All links resolve using standard Obsidian `[[...]]` wikilinks.
   - Frontmatter tags and tables verified for clean formatting.
2. **Codebase Cross-Verification**:
   - `backend/src/utils/promotion-eligibility/index.ts` verified for `0.60` threshold.
   - `backend/src/modules/seller/services/seller.product.price-reduction.followup.ts` verified for floor clamping and integer cents arithmetic.
   - `n8n/workflows/agrivive-priority-promotion.json` verified for 80/280 character limit validations and Groq configuration.
