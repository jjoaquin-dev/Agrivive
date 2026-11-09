---
title: Trust Requirements Traceability Matrix
type: traceability
status: draft - no case executed
created: 2026-11-08
---

# Requirements-to-Test-Case Traceability Matrix

Source of requirement IDs and status: [[08 Trust System Test Case Document]] section 1. Case details are in the same document. Every case is Not Tested.

| Req ID | Requirement | Implementation | Test cases | Open question |
|---|---|---|---|---|
| R-S01 | 12-hour reminder | Implemented | TC-S-001, 002, 008, 009 | |
| R-S02 | 24-hour warning | Implemented | TC-S-003, 008, 009 | |
| R-S03 | 48-hour flag, +1 point | Implemented | TC-S-004 to 012 | Q-03 |
| R-S04 | Away mode pauses timer | Missing | TC-S-013, 014 | Q-01 |
| R-S05 | Seller cancel, +2 | Implemented | TC-S-020 to 027 | Q-05 |
| R-S06 | Misleading information | Partial | TC-S-030 to 033 | Q-02 |
| R-S07 | Low rating | Implemented | TC-S-034 to 038 | Q-06 |
| R-S08 | Inappropriate conduct | Partial | TC-S-040, 041, TC-B-030 | Q-02 |
| R-S09 | Seller-fault decline | Missing | TC-S-050 | Q-04 |
| R-S10 | QR misuse | Partial | TC-S-060 to 063 | Q-08 |
| R-B01 | Reservation expires | Implemented | TC-B-001, 002 | |
| R-B02 | Pickup failure | Implemented | TC-B-003, 004 | |
| R-B03 | Late cancellation | Partial | TC-B-010 to 017 | Q-07 |
| R-B04 | Invalid decline reason | Missing | TC-B-020 | Q-04 |
| R-B05 | False or reused decline photo | Missing | TC-B-021, 022 | Q-04 |
| R-B06 | Buyer conduct | Partial | TC-B-030, 032 | Q-02 |
| R-B07 | Buyer QR misuse | Partial | TC-B-031 | Q-08 |
| R-T01 | Point assignment | Implemented | TC-T-001, 025, TC-S-020, TC-B-001 | |
| R-T02 | Separate buyer and seller records | Partial | TC-T-018, 019 | Q-09 |
| R-T03 | 90-day rolling points | Implemented | TC-T-020, 021, TC-S-037, TC-B-017 | Q-11 |
| R-T04 | Point expiry | Implemented | TC-T-022 | |
| R-T05 | Notice threshold | Missing | TC-T-002, 003, 004 | Q-13 |
| R-T06 | Warning threshold | Implemented | TC-T-005, 006 | |
| R-T07 | Temporary pause tiers | Implemented, durations differ | TC-T-007 to 012, 016, 017, TC-F-012 | Q-13 |
| R-T08 | Block at 12+ | Implemented | TC-T-013 to 015, 026, 027 | |
| R-T09 | Recalculation after expiry | Partial | TC-T-022 to 024 | Q-10 |
| R-D01 | One report adds no points | Implemented | TC-D-001, 004, 006, 007, 008, TC-S-031 | |
| R-D02 | Two independent reports | Partial | TC-D-002, 003, 005, TC-S-030, 040 | Q-02 |
| R-D03 | Repeated reports from same people | Partial | TC-D-009, 010, TC-S-032, 033 | Q-11 |
| R-D04 | Reciprocal reporting | Missing | TC-D-011 | Q-14 |
| R-D05 | Invalid or abusive reports | Missing | TC-D-012 | Q-14 |
| R-D06 | Admin review (retired: system decides) | Retired | TC-D-013, 014 | Q-15 |
| R-D07 | 7-day dispute | Missing | TC-D-015 to 019 | Q-16 |
| R-D08 | Admin overturn (retired: system decides) | Retired | TC-D-020 | Q-15 |
| R-D09 | Recalculate after overturn | Partial | TC-D-021, 022 | Q-10 |
| R-F01 | Minimum orders | Missing | TC-F-001, 002 | Q-12 |
| R-F02 | Fault-rate calculation | Missing | TC-F-003 | Q-12 |
| R-F03 | 10% and 15% scenarios | Missing | TC-F-004, 005 | Q-12 |
| R-F04 | Priority Boost eligibility | Partial, changed | TC-F-006, 007, 008, 011 | Q-12 |
| R-F05 | Trusted Seller badge | Missing | TC-F-009, 010 | Q-12 |
| R-X01 | Inactivity 21 / 30 days | Implemented | TC-X-001 to 004 | |
| R-X02 | Recovery by email OTP | Implemented | TC-T-026, 027 | |

Coverage check: every requirement has at least one case; every case in the test document maps to one requirement above. Question IDs refer to [[11 Trust Conflicting Requirements Report]] section 3.
