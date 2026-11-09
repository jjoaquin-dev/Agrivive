# Requirements Traceability Matrix

Sources: **PROF** = professor's requirement list (as given in the QA request; the professor's original document was not in the repo, so wording is unverified). **DOC** = `Agrivive/02 Product/Reservation and QR Pickup.md`. **CODE** = behavior found in code with no written requirement.

Implementation status comes from the audit in `01-…`. Test status is `Not Tested` everywhere.

| Req ID | Requirement | Source | Implementation | Test cases | Test status |
|---|---|---|---|---|---|
| DOC-01 | Reserve a quantity; available decreases | DOC | Implemented | TC-RSV-01, 02, 05; TC-ORD-01 | Not Tested |
| DOC-02 | Buyer cancels while eligible; stock returns | DOC | Implemented (no cutoff) | TC-ORD-08, 09, 10, 13 | Not Tested |
| DOC-03 | Quantities never negative; insufficient stock rejected | DOC | Partial (no DB CHECK) | TC-RSV-03, 04; TC-INV-03, 04 | Not Tested |
| DOC-04 | Multi-item / multi-seller behavior | DOC (open question D-03) | Implemented (split per seller) | TC-RSV-16, 17, 18 | Not Tested |
| DOC-05 | 24-hour validity ends → expired, stock returns | DOC | Implemented (worker, ≤60 s lag) | TC-ORD-15, 16; TC-NSH-01 | Not Tested |
| DOC-06 | QR validates code, order, status, validity, ownership; repeat scan does nothing | DOC | Implemented | TC-QR-01 to 11, 14 to 21 | Not Tested |
| DOC-07 | Atomic stock changes for reserve, cancel, expire, handover | DOC | Implemented in transactions; scan race unverified | TC-INV-05, 09 to 13, 15 | Not Tested |
| DOC-08 | Payment at pickup, platform does not process it | DOC | Implemented (no payment code found) | TC-ORD-01 (copy check) | Not Tested |
| PROF-RSV | Concurrent buyers, last stock | PROF | Implemented (conditional update) | TC-RSV-04; TC-INV-04 | Not Tested |
| PROF-DUP | Prevent duplicate reservations | PROF | Partial (idempotency only) | TC-RSV-05, 06, 07 | Not Tested |
| PROF-DATE | Buyer selects pickup date; only permitted dates | PROF | **Missing** | TC-PKP-01, 02, 10 | Not Tested |
| PROF-TIME | Buyer selects pickup time | PROF | **Missing** | TC-PKP-03 | Not Tested |
| PROF-HRS | Seller opening hours | PROF | **Missing** | TC-PKP-04 | Not Tested |
| PROF-CLOSED | Seller closed days | PROF | **Missing** | TC-PKP-05 | Not Tested |
| PROF-LAST30 | Last 30 minutes before closing | PROF | **Missing** | TC-PKP-06 | Not Tested |
| PROF-LIMIT | Seller pickup limits | PROF | **Missing** | TC-PKP-07 | Not Tested |
| PROF-AWAY | Seller Away mode | PROF | **Missing** | TC-PKP-08, 09 | Not Tested |
| PROF-ACC | Buyer account restrictions block reservation | PROF | Implemented | TC-RSV-13, 14, 15; TC-ORD-17 | Not Tested |
| PROF-CONF | Seller confirmation | PROF | **Missing** | TC-ORD-02 | Not Tested |
| PROF-REJ | Seller rejection | PROF | Partial (seller cancel) | TC-ORD-03, 04, 14; TC-NSH-08 | Not Tested |
| PROF-PREP | Preparing status | PROF | **Missing** | TC-ORD-05 | Not Tested |
| PROF-READY | Ready for pickup status | PROF | Partial (label only) | TC-ORD-06 | Not Tested |
| PROF-COMP | Completed order | PROF | Implemented | TC-ORD-07; TC-QR-02, 03 | Not Tested |
| PROF-CANC | Cancellation before and after confirmation | PROF | Partial (one rule: any time while pending) | TC-ORD-08, 11, 12 | Not Tested |
| PROF-CUT | Cancellation cutoff (2 h / 3 h examples) | PROF | **Missing** | TC-ORD-12 | Not Tested |
| PROF-LATE | Late cancellation penalties | PROF | Missing (counter counts all buyer cancels equally) | TC-ORD-12, 17 | Not Tested |
| PROF-EXP | Expired order | PROF | Implemented | TC-ORD-15, 16 | Not Tested |
| PROF-PROG | Correct order progress display | PROF | Partial | TC-ORD-06, 18 | Not Tested |
| PROF-QR-SLOT | QR valid only in selected slot + grace | PROF (new) | **Missing** (code uses 24 h) | TC-QR-12, 13 | Not Tested |
| PROF-QR-GRACE | QR grace period | PROF | **Missing** | TC-QR-13 | Not Tested |
| PROF-NSH | Seller marks no-show only when permitted | PROF | **Missing** (auto at expiry only) | TC-NSH-01, 02, 03 | Not Tested |
| PROF-TRUST | Buyer gets documented trust points for no-show | PROF | Implemented (2 points) | TC-NSH-01, 06 | Not Tested |
| PROF-EXC | Seller excuses no-show; no wrong penalty | PROF | **Missing** | TC-NSH-04, 05 | Not Tested |
| PROF-DECL | Declined / returned products and stock | PROF | Partial (partial pickup restores; no decline flow) | TC-QR-18, 20; TC-NSH-07; TC-INV-06 to 08 | Not Tested |
| PROF-ENV-1 | Scan on three phones | PROF | n/a (field test) | QR checklist section 1 | Not Tested |
| PROF-ENV-2 | Two lighting conditions | PROF | n/a | QR checklist section 2 | Not Tested |
| PROF-ENV-3 | Record scan times | PROF | n/a | QR checklist section 3 | Not Tested |
| PROF-ENV-4 | QR size and readability on large screen/projector | PROF | n/a | QR checklist section 4 | Not Tested |
| PROF-FRESH | Pickup-by date vs freshness claims | PROF | Missing (no pickup-by field; only generic copy) | none yet, see Q-13 | Not Tested |
| CODE-01 | Idempotency-Key required, 1–128 chars | CODE | Implemented | TC-RSV-08 | Not Tested |
| CODE-02 | Replay returns same order; different payload → 409 | CODE | Implemented | TC-RSV-05, 06 | Not Tested |
| CODE-05 | Product must be active, marketable, priced | CODE | Implemented | TC-RSV-10, 11 | Not Tested |
| CODE-06 | Seller cannot reserve own product | CODE | Implemented | TC-RSV-12 | Not Tested |
| CODE-08 | Seller cancel needs a reason of 5+ chars; 2 trust points | CODE | Implemented | TC-ORD-03, 04 | Not Tested |
| CODE-10 | Buyer cancel counter and pauses (5/7/9/10) | CODE | Implemented | TC-ORD-17 | Not Tested |
| CODE-12 | `seller_scan_grace` (not a QR grace) | CODE | Implemented | TC-QR-17 | Not Tested |

## Coverage summary

- Test cases: reservation 18, pickup scheduling 10, order management 18, QR 21, no-show 8, inventory 15 = **90**. The QR checklist (file 04) is separate.
- Rows marked **Missing** in the Implementation column have no running feature. Their tests are blocked until the feature exists and the rule is answered (file 05).
- Blocked (⛔) cases: TC-PKP-01 to 10, TC-ORD-02, 05, 11, 12, TC-QR-12, 13, TC-NSH-02 to 05, 07 (21 total).
- Not run yet: all 90.
