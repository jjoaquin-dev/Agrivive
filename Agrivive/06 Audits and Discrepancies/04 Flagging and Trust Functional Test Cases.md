---
title: Flagging and Trust Mechanism Functional Test Cases
type: test-cases
status: verified
created: 2026-10-18
last_tested: 2026-10-18
related_documents:
  - "[[00 Audits and Discrepancies Index]]"
  - "[[01 Flagging and Trust Discrepancies]]"
  - "[[02 Flagging and Trust Scope Narrowed]]"
  - "[[03 Flagging and Trust Features Needing Enhancement]]"
  - "[[Trust and Flagging]]"
  - "[[2026-10-18 Full Flagging and Trust Mechanism Implementation]]"
---

# Flagging and Trust Mechanism Functional Test Cases

> **Execution Summary:** Functional automated end-to-end testing executed on 2026-10-18 against active PostgreSQL and Elysia services. **All 10 test cases PASSED (10/10).**

| Meta Header | Details |
| :--- | :--- |
| **Project / System** | Agrivive |
| **Tester** | Antigravity Functional Test Suite |
| **Test Date** | 2026-10-18 |
| **Environment** | [x] Local Dev &nbsp;&nbsp;&nbsp; [ ] Staging / VPS &nbsp;&nbsp;&nbsp; [ ] Production |
| **Test Runner** | `test_ftm_cases.ts` |
| **Overall Result** | **10 / 10 PASSED (100%)** |

---

## Master Test Matrix

| Test Case ID | Scenario                                                                                                                                                                                                    | Expected Result                                                                                                                                                                                                                                                                                          | Code Implementation Reference                                                  | Actual Result                                                                                                             | Pass / Fail | Remarks                                                                                    |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :---------: | :----------------------------------------------------------------------------------------- |
| **FTM-01**   | A seller has no confirmed violation records in the system, such as non-response, failed reservations, misleading product information, QR-code misuse, or inappropriate messages.                            | The system gives no warning, restriction, or account block.                                                                                                                                                                                                                                              | `policy.ts`, `evaluate-action.ts`                                              | Weighted Points: 0, Resolved Action: None                                                                                 |  **PASS**   | Clean account verified; resolves to null action without warnings or blocks.                |
| **FTM-02**   | A buyer reports a seller for misleading product information, but the listing details, messages, reservation records, QR records, and transaction history do not show any proof that the violation happened. | The system saves the report for review, but it does not give the user a warning, restriction, or account block unless there is enough system record or evidence to support the report.                                                                                                                   | `report.ts` (`classification: "allegation"`), `score.ts` (0 pts)               | Allegations: 1, Weighted Points: 0, Action: None                                                                          |  **PASS**   | Report saved as classification 'allegation'; contributes 0 points to violation score.      |
| **FTM-03**   | A seller receives a buyer’s message or inquiry but does not reply within 12 hours.                                                                                                                          | The system sends a reminder notification to the seller after 12 hours of no response. The seller is not yet given a warning and is not marked as non-responsive.                                                                                                                                         | `process-inquiries.ts`, `recordInquiryDeadlines()`                             | Notice Queued: `inquiry_12h_reminder`, Verified Events: 0                                                                 |  **PASS**   | 12h reminder notice dispatched; seller violation score untouched.                          |
| **FTM-04**   | A seller receives a buyer inquiry or reservation-related message but does not reply within 24 hours.                                                                                                        | The system sends a warning to the seller and notifies the buyer that the seller has not responded within 24 hours.                                                                                                                                                                                       | `process-inquiries.ts`, `inquiry_24h_warning` & notice                         | Seller Notice: `inquiry_24h_warning`, Buyer Notice: `inquiry_24h_buyer_notice`                                            |  **PASS**   | 24h dual notifications delivered to both buyer and seller.                                 |
| **FTM-05**   | A seller receives a buyer inquiry or reservation-related message but still does not reply within 48 hours.                                                                                                  | The system marks the seller as non-responsive and saves the non-response incident in the seller’s violation record.                                                                                                                                                                                      | `process-inquiries.ts`, `trust_events` (`inquiry_non_response`)                | Recorded Kind: `inquiry_non_response`, Classification: `verified`                                                         |  **PASS**   | 48h inquiry marked non-responsive and permanently logged in `trust_events`.                |
| **FTM-06**   | A seller has several confirmed non-response incidents recorded in the system.                                                                                                                               | The system adds the repeated non-response incidents to the seller’s weighted violation score. If the configured repeated-violation threshold is reached, the system applies a temporary restriction or suspension.                                                                                       | `score.ts` (weight 1), `evaluate-action.ts` ($\ge 5$ pts)                      | Action Type: `temporary_restriction`, Ends At: +168 hours                                                                 |  **PASS**   | 5 verified non-response incidents ($5 \times 1 = 5$ pts) triggered temporary restriction.  |
| **FTM-07**   | A seller does not log in, update listings, reply to buyers, or perform any activity in Agrivive for three weeks.                                                                                            | The system detects the three-week inactivity period and sends an inactivity warning to the seller.                                                                                                                                                                                                       | `check-user-inactivity.ts` (21-day check), `inactivity_3w_warning`             | Action: `warning`, Notice: `inactivity_3w_warning`, User `isActive`: `true`                                               |  **PASS**   | 3-week inactivity detected; `inactivity_3w_warning` notice queued; account remains active. |
| **FTM-08**   | A seller does not log in, update listings, reply to buyers, or perform any activity in Agrivive for one month.                                                                                              | The system detects one month of inactivity and blocks the seller’s account based on the configured inactivity rule.                                                                                                                                                                                      | `check-user-inactivity.ts` (30-day block), `user.isActive = false`             | `isActive`: `false`, Action: `blocked`, Notice: `inactivity_1m_blocked`                                                   |  **PASS**   | 30-day inactivity detected; account deactivated and blocked action recorded.               |
| **FTM-09**   | A buyer reserves vegetables but does not arrive for pickup or complete the reservation within the allowed reservation period.                                                                               | The system checks the reservation status, QR-code status, pickup status, and transaction record. If the recorded data matches the no-show rule, the system saves the incident as a confirmed reservation-related violation.                                                                              | `buyer.order.expire.ts` (`buyer_failed_reservation`, weight 2)                 | Event Kind: `buyer_failed_reservation`, Notice: `buyer_failed_reservation_warning`, Buyer Score: `2`                      |  **PASS**   | Reciprocal buyer accountability verified; buyer receives 2 penalty points and notice.      |
| **FTM-10**   | A user has several confirmed violations, such as repeated non-response, failed reservations, misleading product information, QR-code misuse, or inappropriate communication.                                | The system calculates the user’s weighted violation score using the saved violation type, assigned weight, and number of confirmed occurrences. It then compares the score with the configured thresholds and applies the proper action: no action, warning, temporary restriction, or account blocking. | `score.ts`, `evaluate-action.ts`, `access.ts` (Warn: 3, Restrict: 5, Block: 8) | Tiers: `[0pts=null, 3pts=warning, 5pts=temporary_restriction, 8pts=blocked]`, User Action: `blocked`, `isActive`: `false` |  **PASS**   | Weighted violation score and multi-tier penalty state machine fully operational.           |

---

## Per-Test Case Breakdown & Execution Logs

### FTM-01: Baseline Clean Account State
* **Scenario:** A seller has no confirmed violation records in the system, such as non-response, failed reservations, misleading product information, QR-code misuse, or inappropriate messages.
* **Expected Result:** The system gives no warning, restriction, or account block.
* **Pre-conditions:** Active seller account with 0 entries in `trust_events` or violation records.
* **Actual Result:** `readTrustMonitoringScore` returned `weightedPoints: 0`; `resolveTrustAction` returned `null`.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Clean account verified; resolves to null action without warnings or blocks.

---

### FTM-02: Unsubstantiated Report Protection
* **Scenario:** A buyer reports a seller for misleading product information, but the listing details, messages, reservation records, QR records, and transaction history do not show any proof that the violation happened.
* **Expected Result:** The system saves the report for review, but it does not give the user a warning, restriction, or account block unless there is enough system record or evidence to support the report.
* **Pre-conditions:** Buyer submits a report via `/buyer/reports` or mobile report sheet.
* **Actual Result:** Report inserted into `order_reports` and `trust_events` with `classification: "allegation"`. `readTrustMonitoringScore` returned `allegationFlags: 1`, `weightedPoints: 0`. No action applied.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** User-submitted reports are strictly treated as allegations (0 points) until backed by immutable transaction proof.

---

### FTM-03: 12-Hour Inquiry Non-Response Reminder
* **Scenario:** A seller receives a buyer’s message or inquiry but does not reply within 12 hours.
* **Expected Result:** The system sends a reminder notification to the seller after 12 hours of no response. The seller is not yet given a warning and is not marked as non-responsive.
* **Pre-conditions:** Incoming buyer conversation message exists with `repliedAt = null` and `createdAt` $> 12$ hours.
* **Actual Result:** `inquiry_12h_reminder` notice queued in `trust_notices`. 0 events inserted in `trust_events`. Score remained 0.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Gentle reminder notification dispatched; seller standing remains unaffected.

---

### FTM-04: 24-Hour Inquiry Escalation Warning
* **Scenario:** A seller receives a buyer inquiry or reservation-related message but does not reply within 24 hours.
* **Expected Result:** The system sends a warning to the seller and notifies the buyer that the seller has not responded within 24 hours.
* **Pre-conditions:** Unreplied message age exceeds 24 hours.
* **Actual Result:** Dual notices queued: `inquiry_24h_warning` dispatched to the seller and `inquiry_24h_buyer_notice` dispatched to the buyer.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** 24h escalation notices delivered to both parties in accordance with paper protocol.

---

### FTM-05: 48-Hour Non-Responsive Violation Record
* **Scenario:** A seller receives a buyer inquiry or reservation-related message but still does not reply within 48 hours.
* **Expected Result:** The system marks the seller as non-responsive and saves the non-response incident in the seller’s violation record.
* **Pre-conditions:** Unreplied message age exceeds 48 hours.
* **Actual Result:** Verified `inquiry_non_response` event permanently recorded into `trust_events` with `classification: "verified"`.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Inquiry non-response confirmed and committed to trust ledger.

---

### FTM-06: Repeated Non-Response Threshold Enforcement
* **Scenario:** A seller has several confirmed non-response incidents recorded in the system.
* **Expected Result:** The system adds the repeated non-response incidents to the seller’s weighted violation score. If the configured repeated-violation threshold is reached, the system applies a temporary restriction or suspension.
* **Pre-conditions:** Multiple recorded non-response events in `trust_events`.
* **Actual Result:** 5 verified non-response incidents evaluated ($5 \times 1 = 5$ points). Threshold $\ge 5$ met; `trust_actions` record created with `actionType: "temporary_restriction"` and `endsAt` set to 168 hours (7 days) in the future.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Automated temporary restriction applied; `requireActiveUser` blocks restricted seller operations until restriction expiry.

---

### FTM-07: Three-Week Inactivity Warning
* **Scenario:** A seller does not log in, update listings, reply to buyers, or perform any activity in Agrivive for three weeks.
* **Expected Result:** The system detects the three-week inactivity period and sends an inactivity warning to the seller.
* **Pre-conditions:** Account timestamp for last activity exceeds 21 days (`lastActiveAt` set to 22 days ago).
* **Actual Result:** `checkUserInactivity()` worker detected 22-day inactivity; created `trust_actions` entry with `actionType: "warning"` and queued `inactivity_3w_warning` notice. `user.isActive` remained `true`.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Inactivity detected cleanly; warning issued without punitive account disruption.

---

### FTM-08: One-Month Inactivity Account Block
* **Scenario:** A seller does not log in, update listings, reply to buyers, or perform any activity in Agrivive for one month.
* **Expected Result:** The system detects one month of inactivity and blocks the seller’s account based on the configured inactivity rule.
* **Pre-conditions:** Account timestamp for last activity exceeds 30 days (`lastActiveAt` set to 32 days ago).
* **Actual Result:** `checkUserInactivity()` worker detected 32-day inactivity; flipped `user.isActive = false`, created `trust_actions` entry with `actionType: "blocked"`, and queued `inactivity_1m_blocked` notice.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Account blocked due to prolonged inactivity; requires email OTP recovery to restore access.

---

### FTM-09: Buyer Reservation No-Show Violation
* **Scenario:** A buyer reserves vegetables but does not arrive for pickup or complete the reservation within the allowed reservation period.
* **Expected Result:** The system checks the reservation status, QR-code status, pickup status, and transaction record. If the recorded data matches the no-show rule, the system saves the incident as a confirmed reservation-related violation.
* **Pre-conditions:** Reservation expires with status `'expired'` and no pickup QR scan recorded.
* **Actual Result:** `expirePendingOrders()` set status to `expired`, restored produce stock to inventory, inserted `buyer_failed_reservation` into `trust_events` with `classification: "verified"`, and queued `buyer_failed_reservation_warning` to the buyer. Buyer score evaluated to 2 points.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Reciprocal accountability verified; buyers receive 2 penalty points per uncollected order expiration.

---

### FTM-10: Multi-Violation Weighted Score & Tiered Action
* **Scenario:** A user has several confirmed violations, such as repeated non-response, failed reservations, misleading product information, QR-code misuse, or inappropriate communication.
* **Expected Result:** The system calculates the user’s weighted violation score using the saved violation type, assigned weight, and number of confirmed occurrences. It then compares the score with the configured thresholds and applies the proper action: no action, warning, temporary restriction, or account blocking.
* **Pre-conditions:** User accumulates multiple violations across threshold boundaries.
* **Actual Result:** Tiered mappings evaluated:
  - 0–2 points: `null` (No action)
  - 3–4 points: `"warning"`
  - 5–7 points: `"temporary_restriction"` (168h temporary hold)
  - $\ge 8$ points: `"blocked"` (`user.isActive = false`)
  User with 4 failed reservations ($4 \times 2 = 8$ points) evaluated to `actionType: "blocked"`; `user.isActive` flipped to `false`.
* **Outcome:** [x] Pass &nbsp;&nbsp;&nbsp; [ ] Fail
* **Remarks:** Weighted scoring engine and tiered enforcement state machine verified end-to-end.
