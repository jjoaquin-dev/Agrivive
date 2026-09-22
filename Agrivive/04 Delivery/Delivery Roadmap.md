---
title: Delivery Roadmap
type: plan
status: working
source_pages: [5, 10, 11]
---

# Delivery Roadmap

## Proposal timeline

| Period | Planned phase |
|---|---|
| June 2026 | Planning |
| June–July 2026 | Requirements analysis |
| July–August 2026 | Design |
| August–October 2026 | Development |
| October–November 2026 | Functional/integration tests, beta evaluation, revisions |
| November–December 2026 | Deployment activities |
| December 2026 onward | Maintenance |

The proposal uses overlapping Agile sprints. Dates are the capstone plan, not evidence that a phase is finished.

## Practical build sequence from the observed repository

1. **Identity and seller foundation:** settle role and OTP behavior; finish seller verification and listing fields, editing, availability, and photo handling. [[People and Roles]]
2. **Discovery foundation:** build buyer-facing listing browse, search, filters, seller details, and pickup location. [[Product Journeys]]
3. **Transaction core:** specify and implement atomic reservation states, 24-hour QR lifecycle, seller scan, pickup confirmation, and stock invariants. [[Reservation and QR Pickup]]
4. **Promotion and insight:** finish four-factor visibility, then n8n promotion; add descriptive dashboards, advisories, and association recommendations after reliable completed-transaction records exist. [[Weighted Surplus Visibility]] · [[Seller Analytics]]
5. **Accountability and restricted views:** ratings, reports, trust decisions, and stakeholder aggregates. [[Trust and Flagging]]
6. **Integration and beta:** test whole journeys on supported devices, check privacy and failure handling, then gather feedback from selected participants. [[Acceptance and Evaluation]]

## Dependencies to watch

Accurate listing and stock states precede useful visibility scoring. Completed pickups precede sell-through metrics and Market Basket Analysis. Seller-approved pricing rules precede any automatic reduction. Verified product-specific parameters precede numerical Q10 advisories.

**Source:** PDF pp. 5, 10–11; sequence is a synthesis of the proposal and observed implementation.
