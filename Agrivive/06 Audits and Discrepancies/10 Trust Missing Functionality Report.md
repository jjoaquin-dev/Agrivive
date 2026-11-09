---
title: Trust Missing Functionality Report
type: gap-report
status: draft
created: 2026-11-08
---

# Missing and Partial Functionality Report

Basis: code read of `backend/src/utils/trust/`, `modules/{buyer,seller,trust,admin}`, `jobs/`, `db/schema.ts`, and a keyword search of `backend/src`, `mobile/` and `web/` for away mode, decline, dispute, fault rate, trusted seller and appeal. No hits for any of them. Nothing was executed. Test references are in [[08 Trust System Test Case Document]].

## A. Missing (no code, table or screen found)

| # | Feature | Where the brief expects it | What exists instead | Tests blocked |
|---|---|---|---|---|
| 1 | Away mode pausing the 12/24/48 h timer | Seller behavior | Timers skip only sellers with `user.isActive = false` | TC-S-013, 014 |
| 2 | Seller-fault product decline | Seller behavior | Order states are only pending, completed, cancelled, expired | TC-S-050 |
| 3 | Buyer decline reason validation | Buyer behavior | none | TC-B-020 |
| 4 | Decline photo check: false or reused | Buyer behavior | Evidence upload exists for reports only (type, 5 MB, header check); no hash or reuse check | TC-B-021, 022 |
| 5 | Notice tier at 2-3 points | Trust points | Score under 4 returns no action | TC-T-003, 004 |
| 6 | Reciprocal report detection | Reporting | none | TC-D-011 |
| 7 | Invalid or abusive report handling | Reporting | A report cannot be dismissed or penalized | TC-D-012 |
| 8 | Admin review of one incident | Retired | No Admin role; the system decides disputes from stored records | TC-D-013 |
| 9 | Admin overturn of a decision | Retired | No Admin role; the system recalculates when a dispute is upheld | TC-D-020 |
| 10 | 7-day dispute window | Disputes | Seller correction has no deadline | TC-D-015, 016 |
| 11 | Buyer dispute | Disputes | Only sellers can request a correction | TC-D-019 |
| 12 | Seller fault rate (calculation, minimum orders, 10% and 15% rules) | Fault rate | none | TC-F-001 to 005, 008 |
| 13 | Trusted Seller badge | Fault rate | none | TC-F-009, 010 |

## B. Partial, or different from the brief

| # | Feature | Gap | Tests |
|---|---|---|---|
| 1 | Misleading info, conduct, QR misuse | Only reachable through user reports; need 2 different reporters; no staff check before points apply | TC-S-030 to 041, 060 |
| 2 | QR misuse detection | No automatic detection; scanning errors (400, 403, 409) record nothing | TC-S-061 to 063 |
| 3 | Late cancellation | No notion of "late"; every buyer cancel counts the same | TC-B-015 |
| 4 | Separate buyer and seller records | One score per user; a user with both roles has one combined score | TC-T-018 |
| 5 | Pause durations | 6-7 = 12 h, 8-9 = 24 h, 10-11 = 72 h; brief says 6-7 = 24 h and 8-11 = 3 days | TC-T-007 to 012 |
| 6 | Report rolling window | Reports are not limited to 90 days when counting reporters | TC-D-010 |
| 7 | Correction coverage | Only `seller_cancellation` and `inquiry_non_response` can be corrected; buyer events and confirmed-report events cannot | TC-D-017, 018 |
| 8 | Priority Boost eligibility | Now rank plus 6 h lock; trust enters only through average rating | TC-F-006 to 008, 011 |
| 9 | "Seller cancels a confirmed order" | No confirmed state; only pending orders can be cancelled by the seller | TC-S-027 |

## C. Possible defects to watch while testing (unverified)

| # | Concern | Why | Test |
|---|---|---|---|
| 1 | Re-block after restore | Restoring a blocked account does not clear points; a later event with score 12+ may block again at once | TC-T-024 |
| 2 | Actions outlive points | A warning or block is not revoked when points fade or an event is corrected | TC-T-023, TC-D-022 |
| 3 | Paused sellers still timed | The non-response timer checks `is_active`, not an active pause | TC-S-012 |
| 4 | Two scales for buyers | Cancel counter (5/7/9/10) and points table (4/6/8/10/12) run side by side | TC-B-016 |

## D. Stale documentation

- `Agrivive/03 Intelligence/Trust and Flagging.md` says the 3-week and 1-month inactivity rules are not implemented; `jobs/check-user-inactivity.ts` implements them, and `06 .../01` records them as resolved.
- `06 Audits and Discrepancies/04 Flagging and Trust Functional Test Cases.md` records 10/10 passed on 2026-10-18, before policy `monitoring-v3` changes (90-day window, report confirmation, QR block). Treat as history, not current proof.
