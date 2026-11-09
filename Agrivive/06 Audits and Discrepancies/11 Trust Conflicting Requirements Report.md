---
title: Trust Conflicting Requirements Report
type: conflict-report
status: draft - needs professor answers
created: 2026-11-08
---

# Conflicting Requirements and Professor Clarifications

Sources compared: the test brief, `backend/src/utils/trust/policy.ts` (`monitoring-v3`), the vault note `Trust and Flagging.md`, and the paper summary in memory (12 h / 24 h / 48 h timers, 3-week warning, 1-month block). Verified code wins over notes; where the brief and code disagree, the case is written to the brief and expected to fail until a decision is made.

## 1. Threshold table: brief vs code vs vault

| Points | Brief | Code (`policy.ts`) | Vault note | Match? |
|---|---|---|---|---|
| 0-1 | Good standing | No action | (not named) | Yes in effect |
| 2-3 | Notice | No action | not mentioned | **No** |
| 4-5 | Warning | Warning | Warning | Yes |
| 6-7 | 24-hour pause | **12-hour** pause | 12 hours | **No** |
| 8-9 | 3-day pause | **24-hour** pause | 24 hours | **No** |
| 10-11 | 3-day pause | 3-day (72 h) pause | 3 days | Partly (8-9 differs) |
| 12+ | Block | Block | Block | Yes |

All code thresholds can be overridden with env variables (`TRUST_WARNING_THRESHOLD`, `TRUST_TIER1/2/3_THRESHOLD`, `TRUST_BLOCK_THRESHOLD`), so a test run must record the env values used.

## 2. Other conflicts

| # | Topic | Statement A | Statement B | Effect on tests |
|---|---|---|---|---|
| C-01 | Two reports | Brief: two independent reports "trigger the required review process" | Code: two distinct reporters create a verified violation and add points at once; no review step | TC-D-002 passes only on points, not on "review" |
| C-02 | Admin role | Older brief: admin reviews and can overturn | Revision 2026-11-08: there is no Admin role; the system decides | TC-D-013, 020 are retired (see [[2026-11-08 Remove Admin Role from Trust]]) |
| C-03 | Dispute | Brief: 7-day window for any user | Code: seller-only, no deadline, two event kinds, decided automatically | TC-D-015 to 019 |
| C-04 | QR misuse | Brief and paper treat it as a violation type with points | Code gives it weight 3 but also treats it as serious, so one confirmed case blocks the account regardless of points | TC-S-060: expect block, not 3 points |
| C-05 | Buyer scales | Brief gives one points table | Code also runs a separate cancel counter for buyers (warn 5; pause 7/9/10) | TC-B-016 |
| C-06 | Separate records | Brief: buyer and seller records are separate | Code: one score per user across roles | TC-T-018 |
| C-07 | Confirmed order | Brief: seller cancels a "confirmed" order | System has no confirmed state; seller can cancel only a pending reservation | TC-S-027 |
| C-08 | Rolling 90 days | Brief: all points roll for 90 days | Code windows events and low ratings only; reports used to confirm violations are not windowed | TC-D-010 |
| C-09 | Inactivity | Paper: 3-week warning, 1-month block | Vault note says "not implemented"; code and the 2026-10-18 test note say implemented | Use code; fix note |
| C-10 | Priority Boost | Brief: eligibility tied to trust and fault rate | Code: rank and 6-hour lock; no trust gate except verified seller and pauses | TC-F-006 to 008 |

## 3. Questions for the professor

| ID | Question | Why it matters |
|---|---|---|
| Q-01 | When Away mode is on, does the 48-hour clock stop and resume, or restart on return? Is there a maximum away length? | Away mode is missing; the rule is not written anywhere |
| Q-02 | Should two reports add points immediately, or wait for a further system check? | C-01 |
| Q-03 | Does a late reply (after 48 h) remove the non-response point? | TC-S-007 |
| Q-04 | What is a "decline" (buyer refuses produce at pickup)? Which reasons are valid, how is a photo judged false or reused, and who is at fault? | Decline cases cannot be written without it |
| Q-05 | Is "confirmed order" the same as a pending reservation? | C-07 |
| Q-06 | Is a low rating 1-2 stars only, and is it counted per order or per review? Does "service rating" differ from "product rating"? | Code uses 1-2 stars, once per order |
| Q-07 | What makes a cancellation "late" (for example, within some hours of expiry)? | No rule exists |
| Q-08 | What counts as QR misuse (sharing a QR, scanning twice, scanning a wrong order)? Does one case block? | Detection is only by report today |
| Q-09 | Is a user with both roles one trust record or two? | C-06 |
| Q-10 | After a block is restored, or an event is overturned, should older points and active actions be cleared? | Possible re-block (TC-T-024) |
| Q-11 | Should two people reporting repeatedly count again after the first confirmed pair? Do old reports expire after 90 days? | TC-D-009, 010 |
| Q-12 | Define the seller fault rate: formula, minimum orders, what 10% and 15% each do, and what the Trusted Seller badge needs | Nothing about fault rate is documented |
| Q-13 | Confirm the threshold table: is the Notice tier required, and which pause lengths are final? | Section 1 |
| Q-14 | What is "reciprocal reporting" and what happens to the reporters? What penalty applies to abusive reports? | No rule exists |
| Q-15 | Retired: there is no Admin role. | C-02 |
| Q-16 | Who may dispute, which decisions, and does the 7 days start at the event or at the notice? | C-03 |
