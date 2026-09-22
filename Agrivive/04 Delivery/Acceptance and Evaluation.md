---
title: Acceptance and Evaluation
type: verification
status: proposed
source_pages: [5, 8, 9]
---

# Acceptance and Evaluation

## End-to-end checks

| Journey | Evidence of acceptance |
|---|---|
| Seller onboarding | Authorized seller can register, verify required contact, and access seller functions; buyer and stakeholder cannot change seller data. |
| Listing | Complete marketable-surplus listing appears with current price, quantity, unit, condition, photo, and pickup details; invalid data gets a clear correction message. |
| Search | Buyer can narrow active stock by relevant product, quantity, unit, price, seller type, and location. |
| Reservation | Two buyers cannot reserve more than available; reserved quantity moves exactly once; cancellation or expiry restores it exactly once. |
| Pickup | Active matching QR works within 24 hours; invalid, expired, cancelled, and reused codes cannot complete handover. |
| Visibility | Only eligible listings receive a score; the four normalized inputs and tier match the configured formula. |
| Promotion | Workflow uses current listing facts, respects seller price consent and minimum, and stops when stock is gone. |
| Insights | Sell-through counts completed pickups only; zero denominators are handled; recommendations use completed baskets only. |
| Advisories | Missing storage temperature produces no numerical Q10 estimate; outside-service outages leave stored marketplace data available. |
| Trust/privacy | Unsupported reports do not automatically penalize users; stakeholder views omit personal and sensitive records. |

## Quality targets in the proposal

Under normal conditions, primary pages, search, and QR validation should respond within 3 seconds; requested descriptive summaries within 5 seconds for beta-scale records. Web layout should work at 1366×768, seller mobile at 360 px width and on Android 10+, with current major browsers for web users.

## Beta evaluation

Use representative sellers, buyers, and stakeholders from the selected Davao City sites. Observe task completion and confusion points, not just feature availability. Capture functional errors, usability feedback, and network or device limitations, then feed changes into the next sprint. The selected beta sample limits any citywide claim.

**Source:** PDF pp. 5, 8–9.
