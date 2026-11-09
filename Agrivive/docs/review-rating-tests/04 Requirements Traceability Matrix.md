# Requirements Traceability Matrix

Implementation status is from reading the code (`00 Implementation Audit.md`). **No test has been run**, so no row is "Verified".

Source codes: **Capstone** = capstone PDF; **Alpha** = Seller Mobile App Alpha Test Reviewer PDF; **Code** = a rule that exists only in code or the vault; **Task** = the professor items as written in the task request (original feedback text not found in the repo).

| Req ID | Requirement | Source | Implementation status | Test Cases | Notes |
|---|---|---|---|---|---|
| R-01 | Buyers rate completed transactions and the seller, with written review | Capstone 2.2.1.16 | Implemented, unverified | ELG-01, 02, 08–16, 19; SUB-01–11, 14–19; DSP-01–05, 07; CALC-01–10 | |
| R-02 | Sellers respond to ratings and reviews (FR-08, 2.2.1.8) | Capstone | Implemented, unverified | RSP-01–06; DSP-06; EDT-11 | One reply per review |
| R-03 | A weighted statistical tool evaluates transaction ratings and reports (1.3.2.4) | Capstone | Partially implemented | CALC-14–17; SEP-04, 05, 08, 09 | Implemented as trust points, not a star formula |
| R-04 | A 1- or 2-star rating adds 1 trust point; only the last 90 days count | Alpha, Code (`policy.ts`) | Implemented, unverified | CALC-14–17; SEP-04, 05, 09; EDT-09, 10; GRP-21 | Counts product reviews too (C3) |
| R-05 | Seller reliability (average rating) is 20% of visibility; no ratings counts as middle | Alpha, Code | Implemented, unverified | CALC-11–13; SEP-06, 07 | Code uses 2.5; Alpha says 0.5 (C9) |
| R-06 | Only buyers with a completed order may review | Code, vault `Trust and Flagging` | Implemented, unverified | ELG-01–07, 12, 13, 17–19; GRP-17, 18 | One status check for all non-completed states |
| P-01 | Optional photo on a review | Task | **Missing** | SUB-12, 13; GRP-22 | No column, route or UI |
| P-02 | Products grouped by five; one button rates a whole group | Task | **Missing** | GRP-00–24 | Not in any document |
| P-03 | Three rating questions or categories | Task | **Missing; categories undefined** | GRP-06, 08, 09, 11, 20 | Do not invent names (Q-01) |
| P-04 | Product condition rating separate from seller service rating; neither penalizes the other | Task | **Conflicting** | SEP-01–10; CALC-12, 13; GRP-19 | Ranking and trust mix both (C3) |
| P-05 | Seller rating by Bayesian formula `R=(C·m+Σr)/(C+n)`, C = 5 | Task | **Missing; not approved** | BAY-01–10; CALC-08 | Code uses simple average (C1) |
| P-06 | Review editable within 15 days | Task | **Missing; not an approved rule** | EDT-01–13 | No edit route or column (C2) |
| P-07 | One review per completed order; duplicates prevented | Task | Implemented, unverified (seller review). Products are per item | ELG-08–11; GRP-14, 15 | Meaning of "one review" needs Q-07 |

## Coverage by area

| Task area | Case IDs | Count |
|---|---|---|
| Review eligibility | ELG-01–20 | 20 |
| Rating submission | SUB-01–19 | 19 |
| Review editing | EDT-01–13 | 13 |
| Seller reply | RSP-01–06 | 6 |
| Display | DSP-01–07 | 7 |
| Rating calculation | CALC-01–17 | 17 |
| Bayesian (blocked) | BAY-01–10 | 10 |
| Rating separation | SEP-01–10 | 10 |
| Grouped review | GRP-00–24 | 25 |
| **Total** | | **127** |

Cases that can run on the current build: ELG, SUB (except 12, 13), RSP, DSP, CALC-01–17, SEP-01–10, EDT-01 and EDT-02 (gap checks), GRP-00, SUB-12, SUB-13 (gap checks), BAY-10. All other EDT, BAY, GRP cases are blocked until the requirement is approved and built.
