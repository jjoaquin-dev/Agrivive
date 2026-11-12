---
title: Trust Points from AHP
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Mechanism: [[Trust and Flagging]]

## Why
The panel said the trust points were own picks with no source. Following the Trust Points and AHP Guide, the points now come from AHP (Saaty, 1980): judges compare two violations at a time and the math turns the answers into weights, with a consistency check.

## What changed
- `backend/src/utils/trust/ahp-points.ts` (new): AHP weights (column sums, normalise, row average), lambda max, CI, CR with Saaty RI (n = 1 to 10), geometric-mean merge of judges, and the guide's group method: final weight = group weight x weight inside the group, points = round(weight / smallest weight), at least 1. Any CR over 0.10 throws, so the server will not start on inconsistent judgments.
- `backend/src/utils/trust/ahp-judgments.ts` (new): the four group matrices (pickup 8, listing 2, chat 3, review 2) and the group matrix. **Sample data**: cells the guide covers use its values (Samples 2, 3, 4 and QR misuse vs seller cancel = 3); the rest are sample answers.
- `policy.ts`: `trustPolicyWeights` now comes from AHP. `TRUST_WEIGHT_SOURCE=fixed` restores the old points. Level cut-offs are fractions of the total points (2/25, 4/25, 6/25, 8/25, 12/25 of the total, the old ladder's shape). Env thresholds still override, so leave them unset. `trustPolicyVersion` stays `monitoring-v4` because action keys use it.
- Hard-coded points removed: missed pickup (`utils/pickup/no-show.ts`) and chat spam / personal data (`chat-rules.ts`) now read the policy. Every user message with a point count (`notice-text.ts`, `self-order.ts`, `pickup.decline.finalize.ts`) shows the live number.
- `backend/.env.example`: `TRUST_WEIGHT_SOURCE=ahp`; threshold lines commented out.

## Result with the sample judgments
Group weights: pickup 0.466, listing 0.277, chat 0.096, review 0.161 (CR 0.011). Inside-group CR: pickup 0.021, chat 0.033, listing and review 0 (2 items).

| Violation | Points (old) |
|---|---|
| Misleading product info | 20 (2) |
| QR misuse | 13 (3) |
| Order from own account | 13 (3) |
| Fake reports | 11 (1) |
| Inquiry non-response | 7 (1) |
| Seller cancels order | 6 (2) |
| Inappropriate communication | 6 (2) |
| Low rating | 5 (1) |
| Missed pickup | 4 (2) |
| Seller-fault decline | 4 (2) |
| False decline photo | 3 (2) |
| Personal data in chat | 2 (1) |
| Invalid decline | 2 (1) |
| Late cancel | 1 (1) |
| Chat spam | 1 (1) |

Total 98. Ladder: notice 8, warning 16, pause 24 hours 24, pause 3 days 31, block 47.

**Known effect of the guide's group method:** a group with few violations gives its whole group weight to them, so misleading info (listing, 2 items) and fake reports (review, 2 items) score higher than a missed pickup. Real judges' group answers decide this.

## Verification
`bunx tsc --noEmit` clean; `bun test` 268 pass, 0 fail. New `ahp-points.test.ts` reproduces all five guide samples (weights, lambda max, CR, the 3.873 and 7.937 geometric means). Flow tests now read the live points and cut-offs instead of fixed numbers. Backend `dist` rebuilt.

## Still to do
Real judges fill the matrices and `source` becomes "judges". Old events keep the points they were stored with (up to 90 days). Check the VPS `.env` has no `TRUST_*_THRESHOLD` values. Paper: replace Table 1 and 2 points with the AHP method, matrices and CR.

## References for the trust points
Full entries are in [[References]] (A and B). Checked 2026-11-12 against the DOI search records; check each against the publisher page before the final paper.
- **AHP method, pair comparisons, weights, consistency ratio:** Dodevska et al. (2023), *Mathematics* 11(3), 604, https://doi.org/10.3390/math11030604 (verified). Hsiao et al. (2025), *Systems* 13(5), 328, https://doi.org/10.3390/systems13050328 (verified; authors match). Both fall inside the 2022 to 2026 rule.
- **Weighted trust points, sources of the structure:** Kokkodis, Lappas and Kane (2022); Chu and Chen (2022); OECD (2022); WIPO ACE/16/11 (2023).
- **Not citable in the paper under the 2022 to 2026 rule:** Saaty (1980), the book the guide names, and Saaty's random index table (0.58, 0.90, 1.12). Say in the paper that the 1 to 9 scale and the CR 0.10 limit follow Saaty's method as used by the 2023 and 2025 papers above. Do not write that a study gave any point value.
- **Honest wording (guide, "Honest limits"):** the references support the method. The point values come from the judges, so the paper must record who judged and each CR. The matrices are still sample data.

## Paper update (Google Doc "JARA-AGRIVIVE", Section 2.3.2.4), 2026-11-12
All changes are highlighted yellow. Table 1 points, Table 2 bands, the score list under Equation 1, the Fake-report check, Table 4 (Ana) and Table 5 (Mang Ben, now S = 42, Pause 3 days), the 12 / 24 / 48 open-hours wording, and the test row are updated. A new subsection "4. Weights from AHP" explains the method with [64], [65]. Reference [69] (OECD) added. Intro citations [1] to [3] and [8] pointed at unrelated entries and now cite [54], [55], [56] and [58]; three sentences that cited [4] to [7] had no matching source and were replaced or shortened.
Checked and corrected: OECD is Digital Economy Paper No. 329 (not 334); WIPO/ACE/16/11 has a different title and its "86%" claim is unverified, so WIPO is not cited. Fixed afterwards (pink): Table 17 now lists `is_active` instead of a `violation_count` Three-Strike field, and Table 28 uses the real columns (`subject_id`, `reason`, `details`, system-set `status`) with no administrator decision. Still open: Table 28 omits `resolution` and `resolved_at`; the AHP values stay sample data until real judges answer.

