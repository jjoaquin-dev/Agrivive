---
title: Trust and Flagging
type: mechanism
status: proposed
source_pages: [4, 7, 8, 22, 23]
---

# Trust and Flagging

## Purpose

Support accountable marketplace interactions through seller verification, completed-transaction ratings and reviews, evidence-backed reports, recorded behavior, and proportionate account actions. A user report is an allegation until reviewed or supported by recorded events.

## Proposed time rules

| Seller non-response period | System response |
|---|---|
| 12 hours | Reminder |
| 24 hours | Warning and buyer notice |
| 48 hours | Record non-responsive flag |
| Repeated qualifying incidents | Possible restriction or suspension |

The PDF also mentions warnings after three weeks of general inactivity and blocking after a month; define how this relates to the shorter reservation-response clock before implementing it. [[Open Decisions]]

## Weighted evaluation

`violation score for user = sum(weight for violation type × recorded occurrence/value)`

Configured thresholds can lead to no action, warning, temporary restriction, or blocking. Weights and thresholds are prototype policy choices. Recorded reservations, QR state, pickup outcomes, communication timing, and review evidence may contribute, but an unsupported report does not automatically count as a confirmed violation.

## Fairness and privacy rules

- Tie transaction reviews to eligible completed interactions.
- Give users clear notice of a warning or restriction and a way to correct errors.
- Keep report evidence and private communication out of public and stakeholder views.
- Prevent duplicate events from inflating a weighted score.
- Record which policy version and evidence supported each action.

**Source:** PDF pp. 4, 7–8, 22–23.
