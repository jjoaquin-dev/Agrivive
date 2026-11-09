---
title: Trust System Test Case Document
type: test-plan
status: draft - no case executed
created: 2026-11-08
audited_code: backend/src/utils/trust/*, backend/src/modules/{buyer,seller,trust,admin}, backend/src/jobs/*
policy_version: monitoring-v3
---

# Trust and Flagging System: Test Case Document

Related: [[09 Trust Traceability Matrix]], [[10 Trust Missing Functionality Report]], [[11 Trust Conflicting Requirements Report]], [[12 Trust Evidence Checklist]], [[04 Flagging and Trust Functional Test Cases]] (earlier FTM-01..10 record; not reused as proof).

**Execution rule:** every case is `Not Tested`. Nothing below has been run. Status may change only after someone executes the steps and attaches evidence. Cases for features that do not exist are marked `Not Tested (feature missing)`. Their expected result is what the brief requires, so they will fail until built or until the professor drops the rule.

## 1. Audit of the existing implementation (Task 1)

Status key: **Implemented** = code does it end to end. **Partial** = code does part, or does it differently from the brief. **Missing** = no code or table found. **Unverified** = code reads as correct but depends on runtime behavior I did not execute.

| ID | Requirement | Status | Evidence in code |
|---|---|---|---|
| R-S01 | Seller non-response: 12-hour reminder | Implemented | `utils/trust/response-deadlines.ts`, `process-inquiries.ts`, `process-chats.ts`; worker runs every 60 s (`jobs/run-scheduled.ts`) |
| R-S02 | 24-hour warning (also notifies the buyer) | Implemented | same files; notice kinds `inquiry_24h_warning`, `inquiry_24h_buyer_notice` |
| R-S03 | 48-hour flag, +1 point | Implemented | `inquiry_non_response` weight 1, `policy.ts` |
| R-S04 | Away mode pauses the response timer | **Missing** | No away/vacation field in `db/schema.ts`; timers skip only sellers with `user.isActive = false` |
| R-S05 | Seller cancels an order, +2 points | Implemented (pending orders only) | `seller.order.cancel.ts`; order states are only `pending, completed, cancelled, expired`, so there is no "confirmed" state |
| R-S06 | Misleading product information | Partial | Report reason `listing_inaccurate`; +2 only after 2 different reporters (`confirm-report.ts`) |
| R-S07 | Low rating | Implemented | 1-2 stars on a completed order = +1, counted once per order (`score.ts`) |
| R-S08 | Inappropriate conduct | Partial | Report reason `conduct`; +2 after 2 different reporters |
| R-S09 | Seller-fault product decline | **Missing** | No decline flow, status or reason in backend, mobile or web |
| R-S10 | QR misuse | Partial | Report reason `qr_misuse`; after 2 reporters it is a "serious" violation that blocks at once. No automatic misuse detection in `seller.scan-order.ts` |
| R-B01 | Reservation expires, buyer penalized | Implemented | `buyer.order.expire.ts`: `buyer_failed_reservation`, +2 |
| R-B02 | Buyer fails to pick up | Implemented (same path as R-B01) | Expiry after 24 h is the only no-pickup state |
| R-B03 | Late cancellation | Partial | Every buyer cancel counts equally; no "late" notion. Counter warns at 5, pauses at 7/9/10 (`cancellation-policy.ts`) |
| R-B04 | Invalid decline reason | **Missing** | No buyer decline flow |
| R-B05 | False or reused decline photo | **Missing** | No decline photo, hashing or reuse check (evidence upload exists only for reports) |
| R-B06 | Buyer inappropriate conduct | Partial | Same report path as R-S08 |
| R-B07 | Buyer QR misuse | Partial | Same report path as R-S10 |
| R-T01 | Correct point assignment | Implemented | Weights: non-response 1, seller cancel 2, low rating 1, buyer failed reservation 2, misleading 2, conduct 2, QR misuse 3 |
| R-T02 | Separate buyer and seller trust records | Partial | One record per user (`trust_events.subject_id`); no per-role split. A user holding both roles shares one score |
| R-T03 | 90-day rolling points | Implemented for events and low ratings | `TRUST_SCORE_WINDOW_DAYS=90`. Reports are not windowed (see EDGE cases) |
| R-T04 | Points expire | Implemented | Old events drop out of `readTrustMonitoringScore` |
| R-T05 | Notice threshold (2-3 points) | **Missing** | `resolveTrustAction` returns null below 4 |
| R-T06 | Warning (4-5) | Implemented | `warningThreshold=4` |
| R-T07 | Temporary pause tiers | Implemented, but durations differ from the brief | 6-7 = 12 h, 8-9 = 24 h, 10-11 = 72 h |
| R-T08 | Block at 12+ | Implemented | `blockedThreshold=12`; one serious violation blocks too |
| R-T09 | Recalculation after expiry | Partial / Unverified | Score recomputes on read. Existing warning rows are not revoked when points fade; a block lasts until the recovery flow |
| R-D01 | One report adds no points | Implemented | Report stored as `allegation`, weight 0 |
| R-D02 | Two independent reports trigger review | Partial | Two distinct reporters create a verified violation and points automatically. There is no review step |
| R-D03 | Repeated reports from same people | Partial | `countDistinct(reporter)` per subject and reason, so the same person across orders counts once |
| R-D04 | Reciprocal reporting | **Missing** | No detection |
| R-D05 | Invalid or abusive reports | **Missing** | No penalty or dismissal path |
| R-D06 | Admin reviews a reported incident | **Retired** | No Admin role; the system decides from stored records |
| R-D07 | Dispute within 7 days | **Missing** | Seller correction (`seller.trust.correct.ts`) has no deadline and covers only `seller_cancellation` and `inquiry_non_response` |
| R-D08 | Admin overturns a decision | **Retired** | No Admin role; an upheld dispute invalidates the event and recalculates |
| R-D09 | Recalculate after overturn | Partial | Works for seller correction (sets `invalidated_at`); the system overturns by dispute rule |
| R-F01 | Fault-rate minimum orders | **Missing** | No code, table or note |
| R-F02 | Seller fault-rate calculation | **Missing** | same |
| R-F03 | 10% / 15% fault-rate behavior | **Missing** | same |
| R-F04 | Priority Boost eligibility | Partial / changed | Eligibility is now AHP-TOPSIS rank plus 6-hour lock (`00-LATEST.md`); the only trust input is the average rating as "seller reliability". No fault rate and no point gate |
| R-F05 | Trusted Seller badge | **Missing** | No badge field, query or UI |
| R-X01 | Inactivity: 3 weeks warning, 1 month block (paper) | Implemented | `jobs/check-user-inactivity.ts` (21 / 30 days). The vault note `Trust and Flagging.md` still says it is not implemented |
| R-X02 | Blocked or paused account recovery by email OTP | Implemented | `modules/trust/services/trust.recovery.ts` |

## 2. Test setup notes

- Accounts: seller `QA-S1`, `QA-S2`; buyers `QA-B1..QA-B4`; no Admin account is needed. A DB with `TRUST_ACTIONS_ENABLED` unset (default on), `TRUST_SCORE_WINDOW_DAYS=90`.
- The worker (`bun run worker:dev`) must run for timer, expiry and notice cases. It ticks every 60 s, so allow 2 minutes after changing a timestamp.
- Time travel is done by editing timestamps in a **test database only**, for example `update order_inquiries set created_at = now() - interval '12 hours 5 minutes' where id = '<id>'`. Never on production.
- Points check: `GET /admin/performance` (`trustMonitoring.weightedPoints`) or `select kind, classification, invalidated_at, created_at from trust_events where subject_id = '<id>'`.
- Action check: `select action_type, weighted_points, ends_at, revoked_at from trust_actions where subject_id = '<id>'`.
- Type tags: **[P]** positive, **[N]** negative, **[B]** boundary, **[E]** edge.
- Default Status = Not Tested; Actual Result = blank.

## 3. Seller behavior

### 3.1 Non-response timer and away mode

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-S-001 | R-S01 | [P] Reminder at 12 h on an order question | QA-S1 active; QA-B1 has a pending order with QA-S1; worker running | 1 Buyer sends an order question. 2 Set `order_inquiries.created_at` to 12 h 5 min ago. 3 Wait 2 min | Question: "Is the pickup stall open?" | `trust_notices` row `inquiry_12h_reminder` for QA-S1; `deadline_stage` = 1; no trust event; points 0 | | Not Tested | E1 notice row, E2 score JSON |
| TC-S-002 | R-S01 | [B] 11 h 59 min: nothing yet | As above | Set created_at to 11 h 59 min ago, wait 2 min | | No notice, stage 0 | | Not Tested | E1 |
| TC-S-003 | R-S02 | [P] Warning at 24 h, buyer is told | TC-S-001 done | Set created_at to 24 h 5 min ago, wait 2 min | | Notices `inquiry_24h_warning` (seller) and `inquiry_24h_buyer_notice` (buyer); stage 2; points still 0 | | Not Tested | E1 both notices, E3 buyer screen |
| TC-S-004 | R-S03 | [B] 47 h 59 min: not flagged | TC-S-003 done | Set created_at to 47 h 59 min ago | | No `inquiry_non_response` event | | Not Tested | E1 |
| TC-S-005 | R-S03 | [P] Flag at 48 h adds 1 point | TC-S-003 done; QA-S1 has 0 points | Set created_at to 48 h 5 min ago, wait 2 min | | Event `inquiry_non_response` verified; weightedPoints = 1; no action (below 4) | | Not Tested | E1, E2 |
| TC-S-006 | R-S03 | [N] Seller replies at 23 h | Question 23 h old | Seller answers; run worker | | `replied_at` set; no 24 h or 48 h notice or event created afterward | | Not Tested | E1 |
| TC-S-007 | R-S03 | [E] Reply after the flag, then correction request | TC-S-005 done | Seller answers at 50 h; `POST /seller/trust/events/:id/correct` | reason "I was offline" | Outcome `confirmed` (still late); points stay 1; second request returns 409 | | Not Tested | E1, E4 response |
| TC-S-008 | R-S01..03 | [P] Same timers on a product question | Product question exists | Repeat TC-S-001, 003, 005 with `product_inquiries` | | Same notices and 1 point; `order_id` null | | Not Tested | E1 |
| TC-S-009 | R-S01..03 | [P] Same timers on a direct chat | Open chat; buyer message sets `awaiting_reply_since`; no open question from same buyer | Set `awaiting_reply_since` to 48 h 5 min ago | | Event key `inquiry-unanswered:chat-<id>-<ms>`; 1 point | | Not Tested | E1 |
| TC-S-010 | R-S03 | [E] Chat plus open question from same buyer | Buyer has an unanswered question and an unanswered chat | Age both to 48 h | | Only one event (chat skipped by `notExists` rule) | | Not Tested | E1 |
| TC-S-011 | R-S03 | [E] Seller account already inactive | QA-S1 `is_active=false` | Age a question to 48 h | | No notice and no event for QA-S1 | | Not Tested | E1 |
| TC-S-012 | R-S03 | [E] Seller under a pause still gets timed | QA-S1 has an active `temporary_restriction` (still `is_active=true`) | Age a question to 48 h | | **Observe and record.** Code does not exclude paused sellers; confirm with professor if intended | | Not Tested | E1, note |
| TC-S-013 | R-S04 | [P] Away mode pauses the timer | Away mode must exist | Turn Away on, age a question to 48 h | | No notice or event while away; timer resumes or restarts on return (rule to be set) | | Not Tested (feature missing) | E1 |
| TC-S-014 | R-S04 | [N] Away mode cannot be used to hide an already-flagged question | Away mode must exist | Flag at 48 h, then turn Away on | | Existing event remains | | Not Tested (feature missing) | E1 |

### 3.2 Cancellation, listing, rating, conduct, decline, QR

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-S-020 | R-S05 | [P] Seller cancels a pending reservation | Pending order, QA-S1 verified | `POST /seller/orders/:id/cancel` with reason | reason "Out of stock" | Order `cancelled`, `cancelled_by=seller`; stock restored; event `seller_cancellation` verified; points 2; notices to seller and buyer | | Not Tested | E1, E2, E5 order row |
| TC-S-021 | R-S05 | [N] Reason shorter than 5 characters | Pending order | Cancel with reason "no" | | 400 "Cancellation reason is required"; order unchanged; 0 points | | Not Tested | E4 |
| TC-S-022 | R-S05 | [N] Cancel an expired reservation | Order past `expires_at` | Cancel | | 410 "Order has expired"; no event | | Not Tested | E4 |
| TC-S-023 | R-S05 | [N] Cancel a completed order | Completed order | Cancel | | 409 "Order is no longer pending"; no event | | Not Tested | E4 |
| TC-S-024 | R-S05 | [N] Cancel another seller's order | Order of QA-S2 | QA-S1 cancels | | 403 | | Not Tested | E4 |
| TC-S-025 | R-S05 | [E] Cancel retried twice | TC-S-020 done | Repeat cancel | | Second call 409; still 2 points (event key `seller-cancel:<orderId>`) | | Not Tested | E2 |
| TC-S-026 | R-S05 | [P] Seller correction on a valid cancellation | TC-S-020 done | Correct event | | Outcome `confirmed`; points stay 2 | | Not Tested | E4 |
| TC-S-027 | R-S05 | [B] Seller "confirmed order" wording | None | Look for any confirmed state before cancel | | Only `pending` is cancellable. Record result as input for professor question Q-05 | | Not Tested | note |
| TC-S-030 | R-S06 | [P] Two buyers report misleading info | QA-B1 and QA-B2 each have an order with QA-S1; QA-S1 at 0 points | Each posts a report reason `listing_inaccurate`, details 5+ chars | | After B1: points 0, allegation only. After B2: event `misleading_product_info` verified, points 2 | | Not Tested | E1, E2, E4 |
| TC-S-031 | R-S06 | [B] One report only | As above | Only B1 reports | | Points 0; `allegationFlags` = 1 | | Not Tested | E2 |
| TC-S-032 | R-S06 | [E] Same buyer reports on two orders | QA-B1 has two orders with QA-S1 | B1 reports both | | Still 0 points (1 distinct reporter) | | Not Tested | E2 |
| TC-S-033 | R-S06 | [B] Four distinct reporters | QA-B1..B4 | All four report `listing_inaccurate` | | 2 verified events, 4 points (floor(4/2) = 2) | | Not Tested | E2 |
| TC-S-034 | R-S07 | [P] 2-star review | Completed order | Buyer rates 2 | rating 2 | `low_rating` component 1 point | | Not Tested | E2 |
| TC-S-035 | R-S07 | [B] 3-star review | Completed order | Buyer rates 3 | | 0 points | | Not Tested | E2 |
| TC-S-036 | R-S07 | [E] Order review and product review on same order, both low | Completed order | Post both | | Counted once (union of order ids) = 1 point | | Not Tested | E2 |
| TC-S-037 | R-S07 | [B] Low review older than 90 days | Review `created_at` 91 days ago | Read score | | Not counted | | Not Tested | E2 |
| TC-S-038 | R-S07 | [N] Rating on a non-completed order | Order cancelled | Try to review | | Review rejected, or not counted | | Not Tested | E4 |
| TC-S-040 | R-S08 | [P] Two buyers report conduct | As TC-S-030, reason `conduct` | Two reports | | Event `inappropriate_communication`, 2 points | | Not Tested | E2 |
| TC-S-041 | R-S08 | [N] Reason `other` or `pickup_problem` twice | Two reporters | Both use `other` | | Allegations only; 0 points | | Not Tested | E2 |
| TC-S-050 | R-S09 | [P] Seller-fault decline | Decline flow must exist | Buyer declines a product at pickup; reason = seller fault | | Seller gains points per rule | | Not Tested (feature missing) | n/a |
| TC-S-060 | R-S10 | [P] Two reports for QR misuse | Two reporters | Reason `qr_misuse` | | Event verified; `seriousViolations` 1; action `blocked`; `user.is_active=false` | | Not Tested | E1, E2, E6 |
| TC-S-061 | R-S10 | [N] Tampered QR payload | Pending order | `POST /seller/scan-order` with edited payload | | 400 "Invalid order QR payload"; no trust event (record that no point is added) | | Not Tested | E4 |
| TC-S-062 | R-S10 | [N] Scan a QR for another seller's order | Order of QA-S2 | QA-S1 scans | | 403; no trust event | | Not Tested | E4 |
| TC-S-063 | R-S10 | [E] Scan an already completed QR | Completed order | Scan again | | 409 | | Not Tested | E4 |

## 4. Buyer behavior

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-B-001 | R-B01 | [P] Reservation expires | Pending order; worker running | Set `orders.expires_at` to the past | | Status `expired`; stock restored; event `buyer_failed_reservation` (+2); notice `buyer_failed_reservation_warning`; seller gets `reservation_ended` | | Not Tested | E1, E2, E5 |
| TC-B-002 | R-B01 | [E] Worker runs twice | TC-B-001 done | Run worker again | | No second event (key `buyer-expired:<id>`) | | Not Tested | E2 |
| TC-B-003 | R-B02 | [P] Pickup completed in time | Pending order | Seller scans | | Completed; no trust event | | Not Tested | E2 |
| TC-B-004 | R-B02 | [B] Scan at the expiry second | Order expires in 1 min | Scan before and after expiry | | Before = completed; after = 410 | | Not Tested | E4 |
| TC-B-010 | R-B03 | [P] Buyer cancels once | Pending order | `POST /buyer/orders/:id/cancel` | | Cancelled, `cancelled_by=buyer`; no points, no action | | Not Tested | E5 |
| TC-B-011 | R-B03 | [B] 4th cancel in 90 days | 3 earlier cancels | Cancel | | No warning | | Not Tested | E2 |
| TC-B-012 | R-B03 | [B] 5th cancel | 4 earlier cancels | Cancel | | Warning notice; `trust_actions` warning, weightedPoints 5 | | Not Tested | E1, E3 |
| TC-B-013 | R-B03 | [B] 7th cancel | 6 earlier | Cancel | | 12-hour pause; new reservations rejected with 403 message | | Not Tested | E1, E4 |
| TC-B-014 | R-B03 | [B] 9th and 10th cancel | 8, then 9 earlier | Cancel | | 24 h at 9; 3 days at 10 | | Not Tested | E1 |
| TC-B-015 | R-B03 | [E] Cancel 1 minute after reserving vs 1 minute before expiry | Two orders | Cancel each | | Both count the same. Record that "late cancellation" has no separate rule (Q-07) | | Not Tested | note |
| TC-B-016 | R-B03 | [E] Cancel counter and points table together | Buyer with 3 expiries (6 pts) and 5 cancels | Observe | | Two independent mechanisms act; record which restriction the buyer sees | | Not Tested | E1, E4 |
| TC-B-017 | R-B03 | [B] Cancels older than 90 days | 5 cancels, the oldest 91 days ago | Cancel once more | | Counter = 5 inside window (the old one is dropped) | | Not Tested | E2 |
| TC-B-020 | R-B04 | [N] Invalid decline reason | Decline flow must exist | Submit unlisted reason | | Rejected | | Not Tested (feature missing) | n/a |
| TC-B-021 | R-B05 | [N] False decline photo | Decline flow must exist | Upload unrelated photo | | Flagged or rejected | | Not Tested (feature missing) | n/a |
| TC-B-022 | R-B05 | [N] Reused decline photo | Decline flow must exist | Upload the same file on a second order | | Duplicate detected | | Not Tested (feature missing) | n/a |
| TC-B-030 | R-B06 | [P] Two sellers report buyer conduct | QA-S1 and QA-S2 each have an order with QA-B1 | `POST /seller/orders/:id/report` reason `conduct` | | Event `inappropriate_communication` on QA-B1; 2 points | | Not Tested | E2 |
| TC-B-031 | R-B07 | [P] Two sellers report buyer QR misuse | As above | Reason `qr_misuse` | | QA-B1 blocked | | Not Tested | E1, E6 |
| TC-B-032 | R-B06 | [N] Buyer reports a seller on an order that is not theirs | Order of another buyer | `POST /buyer/orders/:id/report` | | 404 | | Not Tested | E4 |

## 5. Trust point management

Use a fresh seller account per row where possible. Add points with the 1-point and 2-point triggers above, or insert verified events into the **test** database.

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-T-001 | R-T01 | [P] Clean account | New seller | Read score | | 0 points; no action | | Not Tested | E2 |
| TC-T-002 | R-T05 | [B] 1 point | Fresh | One non-response | | No notice, no action (Good standing) | | Not Tested | E2 |
| TC-T-003 | R-T05 | [B] 2 points | Fresh | One seller cancellation | | **Brief: Notice. Code: nothing.** Record the difference | | Not Tested | E2, E3 |
| TC-T-004 | R-T05 | [B] 3 points | Fresh | Cancellation + non-response | | **Brief: Notice. Code: nothing** | | Not Tested | E2 |
| TC-T-005 | R-T06 | [B] 4 points | Fresh | 2 cancellations | | Action `warning`, no `ends_at`; warning notice; account still usable | | Not Tested | E1, E3 |
| TC-T-006 | R-T06 | [B] 5 points | 4 pts + 1 | Add non-response | | Still warning; no duplicate action row for same source | | Not Tested | E1 |
| TC-T-007 | R-T07 | [B] 6 points | 5 pts + 1 | Add non-response | | `temporary_restriction`, **12 h** in code (brief says 24 h) | | Not Tested | E1, E4 |
| TC-T-008 | R-T07 | [B] 7 points | 6 pts + 1 | Add event | | Still 12 h tier | | Not Tested | E1 |
| TC-T-009 | R-T07 | [B] 8 points | Fresh, 4 cancellations | Check action | | 24 h pause in code (brief: 3 days for 8-11) | | Not Tested | E1 |
| TC-T-010 | R-T07 | [B] 9 points | 8 + 1 | Add event | | 24 h tier | | Not Tested | E1 |
| TC-T-011 | R-T07 | [B] 10 points | 9 + 1 | Add event | | 72 h pause | | Not Tested | E1 |
| TC-T-012 | R-T07 | [B] 11 points | 10 + 1 | Add event | | 72 h pause | | Not Tested | E1 |
| TC-T-013 | R-T08 | [B] 12 points | 11 + 1 | Add event | | `blocked`; `user.is_active=false`; blocked notice; sign-in shows "restore" message | | Not Tested | E1, E4, E6 |
| TC-T-014 | R-T08 | [B] 13 points | 12 + 1 | Add event | | No second block row while one is open | | Not Tested | E1 |
| TC-T-015 | R-T08 | [N] Actions switched off | `TRUST_ACTIONS_ENABLED=false` | Reach 12 points | | Events recorded, no action, account stays active | | Not Tested | E1 |
| TC-T-016 | R-T07 | [P] Paused user cannot act | TC-T-007 done | Seller or buyer attempts a transaction | | 403 with remaining time | | Not Tested | E4 |
| TC-T-017 | R-T07 | [P] Pause ends by itself | TC-T-007 done | Set `ends_at` to the past, wait for worker | | `revoked_at` set, reason "Temporary restriction expired"; notice `trust_action_expired`; account usable | | Not Tested | E1, E4 |
| TC-T-018 | R-T02 | [E] User with buyer and seller roles | One account with both roles; 2 seller points and 2 buyer points | Read score | | One combined score of 4 in code (**brief: separate records**) | | Not Tested | E2, note |
| TC-T-019 | R-T02 | [N] Buyer-side points do not hit another user | Two accounts | Add buyer event to QA-B1 | | QA-S1 score unchanged | | Not Tested | E2 |
| TC-T-020 | R-T03 | [B] Event at day 89 | Event `created_at` 89 days ago | Read score | | Counts | | Not Tested | E2 |
| TC-T-021 | R-T03 | [B] Event at day 91 | `created_at` 91 days ago | Read score | | Does not count | | Not Tested | E2 |
| TC-T-022 | R-T04 | [P] Points fade and score drops | 6 points, then move 2 events to 91 days ago | Read score | | Score falls to 2-3 (no action tier in code) | | Not Tested | E2 |
| TC-T-023 | R-T09 | [E] Warning row after points fade | TC-T-022 done | Look at `trust_actions` | | Warning row remains (not auto-revoked). Record | | Not Tested | E1 |
| TC-T-024 | R-T09 | [E] Restored after block, score still 12+ | Blocked seller restores via OTP; points unchanged | Add one new 1-point event | | **Observe:** a new block is created again because score is still over 12. Record and ask Q-10 | | Not Tested | E1, E2 |
| TC-T-025 | R-T01 | [E] Duplicate event key | Same cancel or expiry processed twice | Repeat | | One event (unique `event_key`) | | Not Tested | E2 |
| TC-T-026 | R-T08 | [P] Recovery by email OTP | Blocked account | `POST` recovery request, then verify with 6-digit code | | Block revoked, `is_active=true`; wrong code returns 400 "invalid or expired" | | Not Tested | E1, E4 |
| TC-T-027 | R-T08 | [N] Recovery for an account with no action | Clean account | Request recovery | | Returns success without sending a code (no account hints) | | Not Tested | E4 |

## 6. Inactivity (paper rule, implemented)

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-X-001 | R-X01 | [B] 21 days inactive | `last_active_at` 21 days + 1 min ago | Run worker | | Warning action and notice `inactivity_21d`; account still active | | Not Tested | E1 |
| TC-X-002 | R-X01 | [B] 20 days 23 h | `last_active_at` just inside | Run worker | | Nothing | | Not Tested | E1 |
| TC-X-003 | R-X01 | [B] 30 days inactive | 30 days + 1 min | Run worker | | `blocked`, `is_active=false`, notice `inactivity_1m_blocked` | | Not Tested | E1 |
| TC-X-004 | R-X01 | [N] Stakeholder inactive 40 days | Staff account | Run worker | | Not touched | | Not Tested | E1 |

## 7. Reporting and disputes

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-D-001 | R-D01 | [P] One report adds no points | QA-B1 order with QA-S1 | Report `listing_inaccurate` | details "Weight was short by 1 kg" | `user_report` allegation; points 0 | | Not Tested | E2 |
| TC-D-002 | R-D02 | [P] Two independent reports | QA-B2 also has an order | Second report | | Verified event, points +2; action only if threshold crossed | | Not Tested | E2 |
| TC-D-003 | R-D02 | [N] Details under 5 characters | Order exists | Report with "bad" | | 400 "Report details are required" | | Not Tested | E4 |
| TC-D-004 | R-D01 | [N] Same reporter, same order twice | Report exists | Report again | | 409 "You already reported this order" | | Not Tested | E4 |
| TC-D-005 | R-D02 | [N] Reporter does not own the order | Other order id | Report | | 404 | | Not Tested | E4 |
| TC-D-006 | R-D01 | [E] Reporter is paused or blocked | Reporter under pause | Report | | Rejected by active-user check | | Not Tested | E4 |
| TC-D-007 | R-D01 | [P] Upload report evidence (JPEG) | Report exists | Upload under 5 MB | sample.jpg | Stored privately, metadata row created | | Not Tested | E7 |
| TC-D-008 | R-D01 | [N] Evidence wrong type, over 5 MB, or fake header | Report exists | Upload `.exe` renamed to `.jpg`; 6 MB PDF | | 400 each; nothing stored | | Not Tested | E4 |
| TC-D-009 | R-D03 | [E] Same two people report repeatedly across many orders | B1 and B2 each report QA-S1 on three orders | Count events | | One verified event only (distinct reporters = 2) | | Not Tested | E2 |
| TC-D-010 | R-D03 | [E] Old reports still count toward new group | Two reports from 120 days ago; one new report from a third person | Check | | Distinct reporters = 3, so 1 event now. Reports are not windowed. Record | | Not Tested | E2 |
| TC-D-011 | R-D04 | [N] Reciprocal reporting (A reports B, B reports A on same order) | Both on one order | Both report | | System should flag as reciprocal | | Not Tested (feature missing) | n/a |
| TC-D-012 | R-D05 | [N] Abusive or invalid report is dismissed and reporter penalized | Retired: no Admin flow | | | Not applicable | | Not Tested (feature missing) | n/a |
| TC-D-013 | R-D06 | [P] Admin opens a reported incident (retired) | No Admin role | | | Details and evidence visible | | Not Tested (feature missing) | n/a |
| TC-D-014 | R-D06 | [N] Metrics route is read-only today (retired from the trust plan) | Stakeholder or owner token | `GET /admin/performance` | | Returns counts only; no report text or evidence | | Not Tested | E4 |
| TC-D-015 | R-D07 | [P] Dispute on day 6 | Verified event exists | Submit dispute | | Accepted | | Not Tested (feature missing) | n/a |
| TC-D-016 | R-D07 | [B] Dispute on day 7 and day 8 | Verified event | Submit | | Day 7 accepted, day 8 rejected | | Not Tested (feature missing) | n/a |
| TC-D-017 | R-D07 | [P] Seller correction of non-response today | Event `inquiry_non_response` 10 days old | `POST /seller/trust/events/:id/correct` | | Works today (no deadline). Record | | Not Tested | E4 |
| TC-D-018 | R-D07 | [N] Correct a confirmed-report event | Event `misleading_product_info` | Correct | | 400 "cannot be corrected automatically" | | Not Tested | E4 |
| TC-D-019 | R-D07 | [N] Buyer disputes an event | Buyer event exists | Any route | | No route exists | | Not Tested (feature missing) | n/a |
| TC-D-020 | R-D08 | [P] Admin overturns (retired) | No Admin role | | | Event invalidated | | Not Tested (feature missing) | n/a |
| TC-D-021 | R-D09 | [P] Points recalculated after invalidation | Correction outcome `invalidated` (needs a seller-cancel event where the order is not seller-cancelled, so build in test DB) | Correct | | `invalidated_at` set; notice `trust_event_corrected`; score drops by event weight | | Not Tested | E1, E2 |
| TC-D-022 | R-D09 | [E] Action still active after points drop | Block or pause exists and event invalidated | Read actions | | **Observe:** action is not revoked by correction. Record, ask Q-10 | | Not Tested | E1 |

## 8. Seller fault rate, Priority Boost, Trusted Seller

No fault-rate rule exists in the paper, vault or code. The numbers below come from your brief. The formula is **not defined** (Q-12), so expected results are stated as a rule to be confirmed.

| ID | Requirement | Scenario | Preconditions | Steps | Test Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-F-001 | R-F01 | [B] Seller below the minimum orders | Minimum N to be set | Seller with N-1 orders, 1 faulted | | Fault rate not computed or not shown | | Not Tested (feature missing) | n/a |
| TC-F-002 | R-F01 | [B] Seller at the minimum | N orders | | | Fault rate computed | | Not Tested (feature missing) | n/a |
| TC-F-003 | R-F02 | [P] Rate calculation | Faulted orders / counted orders (formula TBD) | 20 orders, 2 faulted | | 10% | | Not Tested (feature missing) | n/a |
| TC-F-004 | R-F03 | [B] 9.9% / 10.0% / 10.1% | Same | 99/1000, 100/1000, 101/1000 | | Threshold changes exactly at 10% (exact side TBD) | | Not Tested (feature missing) | n/a |
| TC-F-005 | R-F03 | [B] 14.9% / 15.0% / 15.1% | Same | | | Second threshold changes at 15% (effect TBD) | | Not Tested (feature missing) | n/a |
| TC-F-006 | R-F04 | [P] Priority Boost with no violations | Seller with a high-ranking listing | Run worker, `AUTO_BOOST_ENABLED=true` | | Boost allowed by rank and 6 h lock only | | Not Tested | E1 |
| TC-F-007 | R-F04 | [N] Priority Boost for a paused or blocked seller | Seller under pause | Request boost | | Rejected (`requireVerifiedSeller`) or hidden; record exact behavior | | Not Tested | E4 |
| TC-F-008 | R-F04 | [N] Boost for a seller with 10%+ fault rate | Fault rate must exist | | | Blocked per rule | | Not Tested (feature missing) | n/a |
| TC-F-009 | R-F05 | [P] Trusted Seller badge shown | Badge rule must exist | | | Badge in seller profile and storefront | | Not Tested (feature missing) | n/a |
| TC-F-010 | R-F05 | [N] Badge removed after a warning or a pause | Badge exists | | | Badge hidden | | Not Tested (feature missing) | n/a |
| TC-F-011 | R-F04 | [E] Seller reliability uses the average rating | 3 reviews: 5, 4, 1 | Read ranking input | | Average 3.33 feeds the "sellerReliability" criterion | | Not Tested | E2 |
| TC-F-012 | R-T07 | [E] Paused seller hidden from the buyer marketplace (vault says so) | Seller on 12 h pause | Open buyer marketplace | | Listings hidden. Unverified in code review | | Not Tested | E3 |

## 9. Summary counts

| Group | Cases | Feature missing |
|---|---|---|
| Seller | 38 | 3 |
| Buyer | 18 | 3 |
| Trust points | 27 | 0 |
| Inactivity | 4 | 0 |
| Reporting and disputes | 22 | 7 |
| Fault rate and badge | 12 | 8 |
| **Total** | **121** | **21** |

Passed: 0. Failed: 0. Not Tested: 121.
