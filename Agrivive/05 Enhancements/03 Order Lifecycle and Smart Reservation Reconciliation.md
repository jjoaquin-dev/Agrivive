---
title: Order Lifecycle and Smart Reservation Reconciliation
type: enhancement-specification
status: proposed
created: 2026-10-16
related_decisions: [D-04, D-05]
related_modules:
  - backend/src/modules/seller/services/seller.scan-order.ts
  - backend/src/modules/buyer/services/buyer.order.expire.ts
  - backend/src/utils/order-stock.ts
---

# Order Lifecycle and Smart Reservation Reconciliation

## Context & Purpose

Surplus produce marketplace transactions require strict inventory control to prevent overselling, stock hoarding, and uncollected waste. This note addresses necessary enhancements in order lifecycle transitions and inventory restoration.

---

## Key Enhancement Areas

### 1. Partial Pickup & Quantity Reconciliation (D-05)
* **Problem:** If a buyer reserves 10 kg of cabbage but at the stall only takes 7 kg due to physical inspection, current scanning completes the order in full or cancels it entirely.
* **Enhancement:**
  * Allow sellers during QR scanning in `seller.scan-order.ts` to enter an **actual dispensed quantity**.
  * Automatically recalculate the subtotal and restore the remaining 3 kg directly back into the seller's active surplus inventory.
  * Update analytics to attribute only the 7 kg to $Q_{\text{sold}}$ and 3 kg to returned stock.

### 2. Proactive 24-Hour Expiration Notifications (D-04)
* **Problem:** Buyers frequently miss the 24-hour pickup window, resulting in abrupt order cancellation and expired stock sitting unlisted.
* **Enhancement:**
  * Implement automated scheduled alerts at 6 hours and 2 hours prior to expiration.
  * Add a one-time "Request 2-Hour Extension" button for buyers subject to seller approval.

### 3. Offline-Resilient Digital Pickup Pass
* **Problem:** Signal inside rural agricultural public markets (bagsakan centres) can be unreliable.
* **Enhancement:**
  * Cache the buyer's Digital Pickup Pass with a cryptographically signed offline QR payload (HMAC-SHA256).
  * Allow seller scanning to verify pass validity offline and queue transaction sync until connectivity returns.
