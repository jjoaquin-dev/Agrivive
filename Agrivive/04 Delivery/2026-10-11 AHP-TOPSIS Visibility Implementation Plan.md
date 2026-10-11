---
title: AHP-TOPSIS Visibility Implementation Plan
type: implementation-plan
status: pilot-implemented
date: 2026-10-11
---

# AHP–TOPSIS Visibility Implementation Plan

## Status and scope

This note records the AHP–TOPSIS marketplace visibility implementation plan and the feature-flagged pilot now implemented in the application. The existing WVS policy remains the default; the AHP–TOPSIS policy is not yet approved as the production default.

This plan does **not** restore the retired MBA/Apriori transaction-association feature. The transaction-association experiment remains removed because Agrivive does not yet have enough verified historical in-platform purchase data to support defensible association rules. AHP–TOPSIS is a separate multi-criteria decision method for ranking marketplace listings.

The first simulation was created at:

`outputs/agrivive-ahp-topsis-simulation.xlsx`

## Literature-date rule

For the capstone's recent related literature, use sources published from **2021 through 2026 inclusive**. Since the current reference year is 2026, a source must be no more than five years old.

The 1981 TOPSIS and 1987 AHP papers remain in this note only as the original method references. They are foundational citations and must **not** be counted as recent related studies. The literature review should use the 2021–2026 sources listed below for current agricultural and decision-support applications.

The workbook uses six fictional listings and is labeled as sample data. It is a method demonstration, not evidence of real buyer behavior and not a production ranking.

## What changed

- Created a formula-driven AHP–TOPSIS simulation workbook.
- Documented the mathematical expressions used by the workbook.
- Documented the proposed backend, marketplace, and frontend rollout plan.
- Recorded the method references and the project's existing visibility references in one vault note.
- Kept the current custom Weighted Surplus Visibility implementation as the default and rollback path while the new method is reviewed.

## Implementation status (2026-10-11)

The approved pilot is implemented behind the backend environment flag `VISIBILITY_POLICY`:

- `visibility-v4` (default): preserves the current WVS marketplace ordering and thresholds.
- `visibility-ahptopsis-v1`: enables AHP-derived weights and TOPSIS ranking for `GET /marketplace/products` only.

The pilot implementation:

- derives the current code weights from the editable pairwise matrix in `backend/src/utils/ahp-topsis/index.ts`;
- normalizes freshness, stock availability, seller reliability, and recurrence as benefit criteria;
- ranks a bounded candidate pool of up to 500 eligible listings before applying the requested page size;
- uses seller average order-review rating divided by 5 as the pilot seller-reliability input, with a neutral `0.5` fallback when no seller review history exists;
- applies the pilot display tiers `priority >= 0.60`, `standard >= 0.40`, and `basic < 0.40`;
- returns `visibilityPolicyVersion` in marketplace-list items for support and comparison; and
- keeps product detail, seller visibility analytics, and promotion automation on the existing WVS path until the pilot is validated.

No database migration was required. No MBA/Apriori route, report, synthetic transaction fixture, or transaction-association UI was restored. No frontend source change was required because the current marketplace client already consumes the backend listing order and visibility fields; the new policy version is available for later support or UI work.

## Why this change is proposed

The current visibility score is a project-specific weighted rule. AHP–TOPSIS gives the capstone a recognizable and explainable multi-criteria decision process:

- AHP derives criterion weights from explicit pairwise judgments.
- AHP calculates a consistency ratio so the judgments can be challenged and revised.
- TOPSIS ranks listings by their distance from an ideal listing and an ideal-worst listing.
- The calculation is deterministic, auditable, and usable before a large historical dataset exists.

The method still requires Agrivive-specific decisions about the criteria, data quality, weights, score direction, and display thresholds. The references support the method; they do not prove that the sample weights or thresholds are correct for Agrivive.

The current `40/40/20` WVS weights must **not** be reused as AHP–TOPSIS weights. They remain only as the old baseline for comparison and rollback. AHP must derive a new weight vector from an approved pairwise-judgment matrix. The `40/30/20/10` vector shown in the simulation workbook is an illustrative output of a sample matrix; it is not a percentage distribution taken from a study and must not be defended as a validated Agrivive policy.

## Current baseline

The current Weighted Surplus Visibility implementation is:

\[
V = 0.40P + 0.40Q + 0.20R
\]

where:

\[
P = \operatorname{clamp}\left(\frac{\text{evaluated time} - \text{published time}}{12\text{ hours}},0,1\right)
\]

\[
Q = \operatorname{clamp}\left(\frac{\text{current quantity}}{\text{original quantity}},0,1\right)
\]

\[
R = \operatorname{clamp}\left(\frac{\text{prior cycles}}{3},0,1\right)
\]

Current tiers are:

\[
V \ge 0.70 \Rightarrow \text{Priority}
\]

\[
0.40 \le V < 0.70 \Rightarrow \text{Standard}
\]

\[
V < 0.40 \Rightarrow \text{Basic}
\]

Important direction difference: the current `postingAge` term increases as a listing gets older. The AHP–TOPSIS simulation uses a `freshness` term that increases as a listing gets newer:

\[
F = 1-\operatorname{min}\left(1,\frac{\text{age in hours}}{12}\right)
\]

This is a product decision that must be approved before replacing the current score. It must not be changed silently during implementation.

## Proposed criteria and data contract

For listing (i), use four benefit criteria:

| Criterion | Symbol | Proposed value | Required source |
|---|---:|---|---|
| Freshness | (C_1) | (1-\min(1,\text{age}/12)) | `publishedAt`, evaluation time |
| Stock availability | (C_2) | `current quantity / original quantity` | current and original listing quantity |
| Seller reliability | (C_3) | normalized, approved seller reliability measure | reliability definition to be confirmed |
| Recurrence | (C_4) | (\min(1,\text{prior cycles}/3)) | standardized vegetable key, seller, prior cycle history |

Each score evaluation should carry:

- `evaluatedAt`;
- `policyVersion`;
- the raw inputs;
- the normalized criteria;
- the AHP weights used;
- the final TOPSIS score and tier;
- a reason when a listing cannot be scored.

Only eligible listings should be scored: active, marketable, available listings with valid quantities, seller visibility eligibility, and a valid publication time. Missing or invalid data should result in an explicit unscored response rather than an invented zero.

## Mathematical expressions used

### AHP pairwise matrix

Let (A=[a_{jk}]) be the pairwise comparison matrix for the four criteria. The simulation uses:

\[
A =
\begin{bmatrix}
1 & 1.333 & 2 & 4 \\
0.750 & 1 & 1.500 & 3 \\
0.500 & 0.667 & 1 & 2 \\
0.250 & 0.333 & 0.500 & 1
\end{bmatrix}
\]

The reciprocal condition is:

\[
a_{jk}=\frac{1}{a_{kj}}
\]

The matrix is an editable simulation input, not a claim that these are the final stakeholder judgments.

### AHP geometric mean

For criterion (j), with (m=4) criteria:

\[
g_j = \left(\prod_{k=1}^{m}a_{jk}\right)^{1/m}
\]

### AHP normalized weight

\[
w_j = \frac{g_j}{\sum_{r=1}^{m}g_r}
\]

The simulation workbook produces the following illustrative weights from its sample matrix:

\[
\mathbf{w} =
\begin{bmatrix}
0.40 \\
0.30 \\
0.20 \\
0.10
\end{bmatrix}
\]

These values are not final. Before implementation, collect pairwise judgments from the approved decision group and recalculate the weights. If no approved judgments are available yet, use equal weights as a neutral sensitivity baseline:

\[
\mathbf{w}_{\text{neutral}}=
\begin{bmatrix}
0.25 \\
0.25 \\
0.25 \\
0.25
\end{bmatrix}
\]

Equal weights are also an assumption, not a research finding. They should be labeled as a temporary baseline until the AHP judgment matrix is approved.

### AHP consistency

For each criterion:

\[
s_j = \sum_{k=1}^{m}a_{jk}w_k
\]

\[
\lambda_j = \frac{s_j}{w_j}
\]

\[
\lambda_{\max}=\frac{1}{m}\sum_{j=1}^{m}\lambda_j
\]

\[
CI=\frac{\lambda_{\max}-m}{m-1}
\]

For four criteria, the simulation uses (RI_4=0.90):

\[
CR=\frac{CI}{RI_4}
\]

The consistency decision is:

\[
CR<0.10 \Rightarrow \text{Acceptable consistency}
\]

The simulation produces (CR\approx0.000).

### Raw criteria

For listing (i):

\[
x_{i1}=1-\min\left(1,\frac{\text{age}_i}{12}\right)
\]

\[
x_{i2}=\text{stock ratio}_i
\]

\[
x_{i3}=\text{seller reliability}_i
\]

\[
x_{i4}=\min\left(1,\frac{\text{prior cycles}_i}{3}\right)
\]

All four final criteria are benefit criteria, where a larger value is better.

### TOPSIS vector normalization

For listing (i) and criterion (k):

\[
r_{ik}=\frac{x_{ik}}{\sqrt{\sum_{i=1}^{n}x_{ik}^{2}}}
\]

### TOPSIS weighted normalized matrix

\[
v_{ik}=w_k r_{ik}
\]

### Ideal best and ideal worst

Because all criteria are benefits:

\[
A^+ = \left(\max_i v_{i1},\max_i v_{i2},\ldots,\max_i v_{im}\right)
\]

\[
A^- = \left(\min_i v_{i1},\min_i v_{i2},\ldots,\min_i v_{im}\right)
\]

### Distance to the ideal points

\[
D_i^+ = \sqrt{\sum_{k=1}^{m}(v_{ik}-v_k^+)^2}
\]

\[
D_i^- = \sqrt{\sum_{k=1}^{m}(v_{ik}-v_k^-)^2}
\]

### Final TOPSIS score

\[
C_i^*=\frac{D_i^-}{D_i^+ + D_i^-}
\]

Rank listings in descending order of (C_i^*):

\[
C_{(1)}^*\ge C_{(2)}^*\ge\cdots\ge C_{(n)}^*
\]

## Frontend display rule proposed by the simulation

The ranking score and the display policy are separate. AHP–TOPSIS produces (C_i^*); the application decides what to show.

\[
\operatorname{DisplayDecision}(C_i^*)=
\begin{cases}
\text{Display first}, & C_i^*\ge0.60 \\
\text{Display}, & 0.40\le C_i^*<0.60 \\
\text{Hold for review}, & C_i^*<0.40
\end{cases}
\]

The practical visibility gate is:

\[
\text{show listing if }C_i^*\ge0.40
\]

The `0.60` and `0.40` values are simulation thresholds only. They are not part of the original AHP or TOPSIS methods and must be validated with stakeholders and real listing outcomes.

## Proposed implementation sequence

### Phase 0 — Confirm the decision contract

- [x] Start AHP–TOPSIS as a pilot behind a feature flag; defer any replacement decision until comparison and validation.
- [ ] Decide whether Agrivive wants **freshness** or the current **posting-age promotion** behavior. These have opposite directions.
- [ ] Approve the four criteria and define seller reliability in a way that does not expose unsupported or unfair judgments.
- [ ] Keep the retired MBA/Apriori feature out of this work.

### Phase 1 — Add a pure calculation utility

Implemented path:

`backend/src/utils/ahp-topsis/index.ts`

The utility contains calculation functions and private helpers for:

- input validation and clamping;
- AHP geometric means and weights;
- AHP consistency ratio;
- TOPSIS normalization and ideal points;
- distances, final score, and tier decision;
- a versioned result object containing inputs and calculation details.

The utility should not read the database, know about HTTP, or contain frontend display code.

### Phase 2 — Build the marketplace calculation adapter

Implemented paths:

- `backend/src/modules/marketplace/services/marketplace.products.visibility.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/src/utils/visibility-score/index.ts`

The adapter is intentionally limited to the marketplace list during the pilot. The current WVS SQL path remains available for rollback and comparison.

The adapter should:

1. Load eligible listings and the required raw inputs.
2. Resolve the standardized vegetable key and prior-cycle count.
3. Resolve the approved seller reliability input.
4. Call the pure AHP–TOPSIS utility.
5. Return the score, rank inputs, tier, policy version, and unscored reason when needed.
6. Preserve deterministic ordering for equal scores using publication time and listing ID.
7. Preserve cursor pagination by carrying the evaluated time, score, publication time, and listing ID in the cursor.

During the pilot, the current `marketplaceVisibilityScoreSql` path should remain available so the two methods can be compared on the same listings.

### Phase 3 — Preserve seller and promotion contracts

Review and update only after the calculation contract is approved:

- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- `backend/src/jobs/check-seller-promotion-eligibility.ts`
- `backend/src/utils/promotion-eligibility/index.ts`
- `backend/src/modules/integrations/services/integrations.promotion.context.ts`

Seller analytics and promotion workflows should receive a versioned score and a stable tier. Automated promotion must not be triggered solely by synthetic data or by an unvalidated AHP–TOPSIS threshold.

### Phase 4 — Update API and frontend consumers

The marketplace response should expose only the fields the client needs:

- `visibilityScore`, if the score is intentionally shown;
- `visibilityTier`;
- `evaluatedAt`;
- an optional `policyVersion` for support and audit.

The public buyer UI should normally use the ordering and tier behavior without showing internal seller-reliability judgments. Seller-facing analytics may show a breakdown only after the reliability definition and privacy wording are approved.

Before changing UI files, locate the active marketplace list and seller analytics consumers with a repository search for the response fields. The current repository's calculation consumers include `backend/src/modules/marketplace/services/marketplace.products.list.ts` and `backend/src/modules/marketplace/services/marketplace.product.get.ts`; current frontend files should be confirmed against the live working tree before implementation.

### Phase 5 — Pilot and validation

- [ ] Run AHP consistency checks on every approved weight set.
- [ ] Compare current WVS and AHP–TOPSIS rankings on the same active listings.
- [ ] Check score sensitivity when one criterion changes while the others stay fixed.
- [ ] Check ties, missing seller reliability, zero original quantity, future publication time, sold-out listings, and expired listings.
- [ ] Validate cursor pagination across score changes and repeated requests.
- [ ] Use real observed listing outcomes for threshold review; do not use the retired synthetic MBA baskets as buyer evidence.
- [ ] Manually test the API through Elysia OpenAPI or Postman.
- [ ] Run `cd backend && bunx tsc --noEmit`.
- [ ] Run `cd backend && bun build src/index.ts --outdir dist --target bun`.
- [ ] Record the owner's manual endpoint and frontend test result before calling the change verified.

## Acceptance criteria

- The selected policy is explicitly versioned and can be compared with the current visibility policy.
- AHP weights sum to 1.000 within a documented tolerance.
- The AHP consistency ratio is below 0.10 for the approved matrix.
- Every scored listing has valid raw inputs, normalized criteria, a score from 0 to 1, and a deterministic tier.
- Invalid listings are excluded or returned with a clear unscored reason.
- TOPSIS ordering is stable for equal scores.
- The API and frontend do not display synthetic sample values as real marketplace evidence.
- No MBA/Apriori route, report, synthetic transaction fixture, or transaction-association UI is reintroduced.
- Existing WVS behavior remains available until the owner approves replacement after comparison.

## References

### Foundational method references — not counted as recent related studies

1. Saaty, R. W. (1987). *The analytic hierarchy process—what it is and how it is used*. Mathematical Modelling, 9(3–5), 161–176. DOI: [10.1016/0270-0255(87)90473-8](https://doi.org/10.1016/0270-0255(87)90473-8). Used for the AHP pairwise-judgment model, ratio-scale weighting, and consistency discussion. This is a foundational method source and is not used as a recent related study.
2. Hwang, C.-L., & Yoon, K. (1981). *Multiple Attribute Decision Making: Methods and Applications: A State-of-the-Art Survey*. Lecture Notes in Economics and Mathematical Systems, vol. 186. Springer. DOI: [10.1007/978-3-642-48318-9](https://doi.org/10.1007/978-3-642-48318-9). Used for the TOPSIS multi-criteria ranking procedure, normalization, ideal solutions, distances, and relative closeness score.

### Recent related literature — 2021–2026 cutoff

1. Ustaoglu, E., Sisman, S., & Aydinoglu, A. C. (2021). *Determining agricultural suitable land in peri-urban geography using GIS and Multi Criteria Decision Analysis (MCDA) techniques*. Ecological Modelling, 455, 109610. DOI: [10.1016/j.ecolmodel.2021.109610](https://doi.org/10.1016/j.ecolmodel.2021.109610). Recent agricultural application combining AHP-based weighting with TOPSIS ranking for agricultural development suitability.
2. Krisnawijaya, N. N. K., Tekinerdogan, B., Catal, C., & van der Tol, R. (2023). *Multi-Criteria decision analysis approach for selecting feasible data analytics platforms for precision farming*. Computers and Electronics in Agriculture, 209, 107869. DOI: [10.1016/j.compag.2023.107869](https://doi.org/10.1016/j.compag.2023.107869). Recent AHP–TOPSIS decision-support application in smart farming and precision agriculture.
3. Biswas, T., et al. (2024). *Evaluation of management practices in rice-wheat cropping system using multicriteria decision-making methods in conservation agriculture*. Scientific Reports. DOI: [10.1038/s41598-024-58022-w](https://doi.org/10.1038/s41598-024-58022-w). Recent agricultural application that explicitly uses AHP for criterion weights and TOPSIS for ranking management alternatives.
4. Duarte, A. D. (2024). *Revisão sistemática do método TOPSIS e suas aplicações na agricultura* [Systematic review of the TOPSIS method and its applications in agriculture]. Revista Produção Online, 24(2), 5245. DOI: [10.14488/1676-1901.v24i2.5245](https://doi.org/10.14488/1676-1901.v24i2.5245). Recent review for positioning TOPSIS applications in agricultural decision-making.

### Agrivive project references

4. *CAPSTONE 2 FILES - BARTIQUIEN, JARA, MARUNDAN.pdf*, 34 pages, local source: `C:\Users\Arianne Bartiquien\Downloads\CAPSTONE 2 FILES - BARTIQUIEN, JARA, MARUNDAN.pdf`. Relevant pages: 12–14 for the proposed weighted surplus visibility framework; 16–19 for the retired transaction-association proposal.
5. [[Weighted Surplus Visibility]]. Current project baseline and prototype WVS weights, inputs, and tiers.
6. [[Current Implementation]]. Repository observation and current implementation boundaries.
7. [[2026-10-10 Recommendation Scope Cleanup]]. Record that MBA/Apriori was removed from the active system because verified historical transaction data is insufficient.
8. [[2026-10-11 Vegetable Catalog and Naming]]. Agrivive's controlled vegetable naming and standardized identity layer.
9. Alliance of Bioversity International and CIAT, [Types of vegetables: Full list, categories, and classification guide](https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide). Used as a classification reference for the controlled vegetable catalog, not as a source of ranking weights.
10. `outputs/agrivive-ahp-topsis-simulation.xlsx`. Formula-driven sample workbook containing the editable AHP matrix, TOPSIS calculation detail, and sample ranking output.

## Affected paths

### Existing baseline paths reviewed

- `backend/src/utils/visibility-score/index.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/src/modules/marketplace/services/marketplace.product.get.ts`
- `backend/src/modules/marketplace/services/marketplace.visibility.ts`
- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- `backend/src/jobs/check-seller-promotion-eligibility.ts`
- `backend/src/utils/promotion-eligibility/index.ts`
- `backend/src/modules/integrations/services/integrations.promotion.context.ts`

### Implemented and planned paths

- `backend/src/utils/ahp-topsis/index.ts`
- `backend/src/modules/marketplace/services/marketplace.products.visibility.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/src/utils/visibility-score/index.ts`
- `backend/.env.example`
- `backend/API_ENDPOINTS.md`

The following remain planned follow-up paths and were deliberately not changed by this pilot:

- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- The active marketplace and seller analytics frontend consumers, to be confirmed before code edits.

### Documentation and artifact paths

- `Agrivive/04 Delivery/2026-10-11 AHP-TOPSIS Visibility Implementation Plan.md`
- `outputs/agrivive-ahp-topsis-simulation.xlsx`

## Verification performed for this note

- Reviewed the current WVS calculator and marketplace SQL score path.
- Confirmed the MBA/Apriori scope cleanup note and preserved its removal boundary.
- Built and visually reviewed the three-sheet AHP–TOPSIS sample workbook.
- Recalculated the workbook and confirmed the AHP consistency status is acceptable.
- Reopened the exported workbook successfully.
- Scanned the workbook inspection output and found no `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` formula errors.
- Ran `cd backend && bunx tsc --noEmit` successfully after implementation.
- Ran `cd backend && bun build src/index.ts --outdir dist --target bun` successfully after implementation.
- Ran a direct AHP/TOPSIS smoke test: the approved sample matrix produced weights approximately `0.40/0.30/0.20/0.10`, consistency ratio `0`, and a deterministic ranking.
- Ran `git diff --check`; no whitespace errors were reported. Existing line-ending warnings and unrelated working-tree changes remain outside this implementation note.
- No database migration was needed, and the retired MBA/Apriori boundary remains intact.

