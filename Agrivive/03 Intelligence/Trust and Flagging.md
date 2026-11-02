---
title: Trust and Flagging
type: mechanism
status: implemented; policy validation pending
source_pages: [4, 7, 8, 22, 23]
---

# Trust and Flagging

## Purpose

Support accountable marketplace interactions through seller verification, completed-transaction ratings and reviews, evidence-backed reports, recorded behavior, and proportionate account actions. A user report is an allegation until reviewed or supported by recorded events.

## Implemented time rules

| Seller non-response period | System response |
|---|---|
| 12 hours | Reminder |
| 24 hours | Warning and buyer notice |
| 48 hours | Record non-responsive flag |
| Repeated qualifying incidents | Configured warning, temporary restriction, or blocked action after evaluation |

The 12/24/48-hour inquiry clock is implemented by the scheduled job. The PDF's separate three-week inactivity warning and one-month blocking statements are not treated as implemented rules because their scope and evidence definition are not specified.

## Weighted evaluation

`violation score for user = sum(weight for violation type × recorded occurrence/value)`

Configured thresholds can lead to no action, warning, temporary restriction, or blocking. Current defaults (`backend/src/utils/trust/policy.ts`, policy `monitoring-v3`): weights are 1 point for verified inquiry non-response, 1 for a 1–2-star rating, 2 for seller cancellation, 2 for misleading product information, 2 for inappropriate communication, and 3 for QR misuse (a serious violation that blocks at once). Only violations from the last 90 days count (`TRUST_SCORE_WINDOW_DAYS`).

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
- Admin views remain read-only. Admins can monitor aggregate values but cannot approve reports, restore accounts, or change account state.
- The web exposes Google registration/sign-in, email OTP recovery, buyer report/evidence submission, verified-purchase reviews, trust-aware restriction messages, and read-only action counts. The web does not add administrative mutation controls.
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
