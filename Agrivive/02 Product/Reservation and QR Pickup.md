---
title: Reservation and QR Pickup
type: workflow
status: proposed
source_pages: [4, 5, 7, 8, 9]
---

# Reservation and QR Pickup

## Intended flow

Buyer selects an available quantity → system confirms the reservation and moves that quantity from available to reserved → buyer receives a unique QR code with **24-hour validity** → seller scans it at self-pickup → system validates reservation and code state → seller confirms handover → quantity becomes sold and the transaction is recorded as completed.

## State transitions

| Event | Reservation | Quantity effect |
|---|---|---|
| Create | active | available decreases; reserved increases |
| Buyer cancels while eligible | cancelled | reserved decreases; available increases |
| 24-hour validity ends | expired | reserved decreases; available increases |
| Valid scan and confirmed handover | completed | reserved decreases; sold increases |
| Repeat or invalid scan | unchanged | no quantity change |

## Invariants

- Available, reserved, sold, and remaining quantities cannot become negative.
- A confirmed pickup cannot be confirmed a second time.
- Stock changes for reserve, cancellation, expiration, and handover are atomic.
- QR validation checks code, reservation identity, status, validity, and ownership before completion.
- A cancelled or expired reservation cannot later be completed.
- Payment occurs directly at pickup; the platform does not process or verify it.

## Design questions

The PDF does not fully settle multi-item reservation behavior, whether checkout can span sellers, exactly when the 24-hour timer begins, or how pickup exceptions are resolved. Decide these before finalizing APIs and screens. [[Open Decisions]]

[[Product Journeys]] · [[Acceptance and Evaluation]]

**Source:** PDF pp. 4–5, 7–9.
