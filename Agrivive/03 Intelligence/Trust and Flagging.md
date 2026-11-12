---
title: Trust and Flagging
type: mechanism
status: implemented (monitoring-v4 rules, AHP points since 2026-11-12); not tested by the owner
source_pages: [4, 7, 8, 22, 23]
---

# Trust and Flagging

## Purpose

Support accountable marketplace interactions through seller verification, completed-transaction ratings and reviews, evidence-backed reports, recorded behavior, and proportionate account actions. A user report is an allegation until reviewed or supported by recorded events.

## Implemented time rules

| Seller non-response period | System response |
|---|---|
| 12 open hours | Reminder |
| 24 open hours | Warning and buyer notice |
| 48 open hours | Record non-responsive flag |
| Repeated qualifying incidents | Configured warning, temporary restriction, or blocked action after evaluation |

The 12/24/48-hour inquiry clock is implemented by the scheduled job. The PDF's separate three-week inactivity warning and one-month blocking statements are not treated as implemented rules because their scope and evidence definition are not specified.

## Weighted evaluation

`violation score for user = sum(weight for violation type × recorded occurrence/value)`

Since 2026-11-12 the points come from **AHP** (Saaty, 1980), following the Trust Points and AHP Guide. Details and the full table: [[2026-11-12 Trust Points from AHP]].

- The 15 violations sit in four groups (pickup, listing, chat, review). Judges fill one pair matrix per group plus one for the groups (`backend/src/utils/trust/ahp-judgments.ts`); several judges merge by geometric mean.
- Each matrix must have CR 0.10 or less, or the server refuses to start. Final weight = group weight x weight inside the group; points = round(weight / smallest weight), at least 1 (`ahp-points.ts`).
- Level cut-offs are fractions of the total points: 2/25, 4/25, 6/25, 8/25 and 12/25 (the old ladder's shape).
- **The judge matrices are still sample data.** Replace them with real answers before citing numbers in the paper. `TRUST_WEIGHT_SOURCE=fixed` rolls back to the old own-pick points.
Only violations from the last 90 days count (`TRUST_SCORE_WINDOW_DAYS`).

| Points | System action |
|---|---|
| 4–5 | Warning |
| 6–7 | Paused 12 hours |
| 8–9 | Paused 24 hours |
| 10–11 | Paused 3 days |
| 12 or more, or one serious violation | Blocked |

These values are configurable prototype policy settings, not research-proven facts. Actions run unless `TRUST_ACTIONS_ENABLED=false`.

Recorded reservations, QR state, pickup outcomes, communication timing, and review evidence may contribute in future policy revisions, but an unsupported report remains an allegation and contributes zero weighted points.

## System behavior

- Verified events and completed-order rating signals are evaluated by the `monitoring-v3` policy when actions are enabled.
- A warning is recorded and notified; a temporary restriction blocks seller and buyer transactional actions and removes the seller from public marketplace visibility until expiry; a blocked action sets the account inactive.
- Temporary restrictions expire automatically through the scheduled job. A blocked account is restored only through the public recovery flow after the user verifies the existing email OTP mechanism. The recovery is audited in `trust_actions`.
- Agrivive has two user roles in the trust mechanism: buyer and seller. No person reviews, approves, rejects or changes a report, dispute, decline, trust point or penalty. The system applies the written rules and sends a notice with the result. The older read-only `/admin/performance` metrics route is outside the trust mechanism and changes nothing.
- The web exposes Google registration/sign-in, email OTP recovery, buyer report/evidence submission, verified-purchase reviews, trust-aware restriction messages, and read-only action counts. The web adds no controls that let a person change a trust decision.
- Correction requests, report evidence, and notices remain separate from public marketplace data. Invalidated source events no longer contribute to the monitoring score.

## Buyer rules (system-only, not in the paper)

The paper focuses on sellers, but the system also holds buyers accountable. Purpose: reservations hold a seller's stock for 24 hours, so a buyer who never comes, or keeps cancelling, ties up produce that could have sold and may spoil. Steps are gentle first (warning, then a short pause, then a block for serious or very repeated cases). Only recorded events count; a report alone does not.

| Buyer behavior | System action |
|---|---|
| Cancels reservations (`cancellation-policy.ts`) | Warning at 5; paused 12 hours at 7, 24 hours at 9, 3 days at 10 (last 90 days) |
| Reservation expires unpicked (`buyer.order.expire.ts`) | `buyer_failed_reservation` event, 2 points, warning notice, then the shared points table above |
| Inactive 3 weeks / 1 month | Warning email / account deactivated |

A paused buyer cannot reserve (`requireNoActiveTrustRestriction`) and sees how long is left.

## Fairness and privacy rules

- Tie transaction reviews to eligible completed interactions.
- Give users clear notice of a warning or restriction and a way to correct errors.
- Keep report evidence and private communication out of public and stakeholder views.
- Prevent duplicate events from inflating a weighted score.
- Record which policy version and evidence supported each action.

## Paper-ready wording with corrected citation mapping

Trust and flagging is informed by research on reputation effects in peer-to-peer markets [54], risks of fake or manipulated reviews [55], purchase verification [56], and weighted trust evaluation [57]. For vegetable marketplaces, postharvest research supports treating produce as time-sensitive and requiring careful handling [58]. In Agrivive, verified transaction events, completed-order reviews, and evidence-backed records are separated from allegations. The exact weights, thresholds, inquiry timers, and account-action rules are prototype policy settings selected for system evaluation; they are not claimed as values established by the cited studies. Admin monitoring is read-only, temporary restrictions expire automatically, and blocked-account recovery requires email OTP verification.

The correction is: reputation systems → [54]; fake or manipulated reviews → [55]; purchase verification → [56]; weighted trust evaluation → [57]; vegetable postharvest/time sensitivity → [58]. The original capstone PDF is retained as the supplied source; this note is the corrected paper-ready interpretation.

## References from the capstone bibliography

- **[54]** Jiao et al., *Reputation effects in peer-to-peer online markets: A meta-analysis*. [University record](https://research-portal.uu.nl/en/publications/reputation-effects-in-peer-to-peer-online-markets-a-meta-analysis/)
- **[55]** He et al., research on fake/manipulated online reviews. [INFORMS publication record](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2022.1353?journalCode=mksc)
- **[56]** Kokkodis et al., research on purchase verification and online-market trust. [Wiley publication record](https://onlinelibrary.wiley.com/doi/abs/10.1111/poms.13731)
- **[57]** Chu and Chen, weighted trust evaluation research. [Inderscience publication record](https://www.inderscience.com/info/e_inarticle.php?artid=132356)
- **[58]** Jiang et al., vegetable postharvest quality/time-sensitivity research. [Agronomy / MDPI article](https://www.mdpi.com/2073-4395/9/11/724)

**Source pages:** PDF pp. 4, 7–8, 22–23, 29–30; repository implementation as of 12 October 2026.

## Update 2026-11-08 (monitoring-v4)

The older tables in this note are replaced by the Flagging and Trust Mechanism PDF. Bands: 0-1 good standing, 2-3 notice, 4-5 warning, 6-7 pause 24 hours, 8-11 pause 3 days, 12+ block. A seller's pause or block also needs 10+ orders and a fault rate of 10%+. Weights: non-response 1, seller cancels a confirmed order 2, low rating 1 (reason written, or 2nd in 30 days), wrong listing 2, conduct 2, seller-fault decline 2, QR misuse 3 and block, missed pickup 2 (the first is 0), late cancellation 1, invalid decline 1, false photo 2. The buyer cancel counter was removed. Away mode, excuse, 7-day dispute, pickup decline, fault rate and Trusted Seller are built. Inactivity (21 and 30 days) is in `jobs/check-user-inactivity.ts`. See [[2026-11-08 Reservation QR Pickup and PDF Trust Mechanism]].

## System decisions (no Admin) — 2026-11-08

See [[2026-11-08 Remove Admin Role from Trust]]. Every decision below is made by the system from stored records and the existing rules. Nothing is invented where no rule exists; those cases are listed as limits.

| Case | System rule |
|---|---|
| One report | An allegation, 0 points. |
| Two different reporters, same reason | Confirmed; the event is recorded and points apply. A pair that already confirmed twice in 90 days cannot confirm a third time alone: the report waits at 0 points for a third independent reporter. Reciprocal reports on the same order are ignored. |
| Dispute of a counted event (7 days) | Answered at once by checking the stored record against the rule that made the event. Upheld: the event stops counting and the score and level are recalculated. Rejected: the record still fits the rule. Unresolved: no stored record can settle it, so the event stays. |
| Decline at pickup | Reason not allowed: buyer +1. Photo already used on another decline (hash match): buyer +2. Otherwise the seller answers in 24 hours; accepted, silent or disputed all end as seller fault (+2), because the system follows the allowed-reason table. |
| Excuse for a missed pickup | Confirmed or rejected by the order's seller within the 24-hour and once-per-30-days limits. |
| Blocked account | Restored only through the existing email-code recovery. |
| Fault rate 15% or more | Shown as "High fault rate": Priority Boost and Trusted Seller are off. No person is asked to review it. |

Limits that need a written system rule:
- The system cannot judge what a photo shows, so a seller's dispute photo is stored with the record but cannot change a decline.
- Events from confirmed reports cannot be settled by a dispute, because no stored record proves or disproves the allegation.
- A seller who never answers an excuse leaves it pending; no timeout rule exists.
- There is no appeal path for a blocked account other than recovery.

References dated 2022 to 2026 that can replace the older ones: [[Trust and Flagging References 2022-2026]].

## Flagging Rules Without Admin 2 — 2026-11-09

The rule set in `Flagging Rules Without Admin 2.pdf` is now the live table. Delivery note: [[2026-11-09 Flagging Rules Without Admin]].

| Rule | Points or result |
|---|---|
| Missed pickup (reservation ended) | Buyer +2 every time. No free first miss. |
| Decline at pickup, seller accepts or stays silent 24 h | Seller +2 |
| Decline at pickup, seller disputes | Nobody gets points. Order closes as declined at pickup. Produce not restocked. |
| 3 reports by one buyer in 14 days, none confirmed | Reporter +1 for each group of 3 |
| Review bomb: 5+ ratings of 1 or 2 stars from accounts under 7 days old, one seller, 24 h | Ratings ignored. Buyers 0 points and a notice. |
| Order from own account | +3 and block at once |
| More than 5 orders in 7 days, one buyer to one seller | 0 points. Extra orders leave seller counts and rankings. |
| Same chat message 5+ times in 10 min | No sending for 10 min. 2nd time in 90 days +1 |
| Phone or email in chat | Message hidden. 3rd time in 90 days +1 |

Settings the PDF calls starting numbers (5 ratings, 24 h, 7 days, 5 orders in 7 days, 3 reports, 14 days) are constants in `utils/trust/review-bomb.ts`, `order-flood.ts`, `fake-reports.ts` and `chat-rules.ts`. Where the PDF says "2nd time" or "3rd time", the same step repeats on every 2nd or 3rd event after that.
