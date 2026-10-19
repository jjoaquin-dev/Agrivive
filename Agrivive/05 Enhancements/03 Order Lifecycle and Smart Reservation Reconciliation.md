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

### 1. Partial Pickup & Quantity Reconciliation (D-05) [COMPLETED - 2026-10-18]
* **Problem:** If a buyer reserves 10 kg of cabbage but at the stall only takes 7 kg due to physical inspection, scanning previously completed the order in full or cancelled it entirely.
* **Enhancement Status:** Implemented & Verified (Delivery Note: [[2026-10-18 Partial Pickup and Stock Auto-Restoration]]).
  * Sellers can adjust the **actual dispensed quantity** per item directly in the mobile scanner handover sheet (`OrderHandoverSheet.tsx`).
  * Subtotals and order total are live recalculated in UI and atomically verified on backend in `seller.scan-order.ts`.
  * Difference (`diff = reserved - dispensed`) is atomically credited back into `sellers_product.productQty` within the completion transaction.
  * Preserves stock invariants: prevents negative numbers, enforces $0 \le \text{dispensed} \le \text{reserved}$, and disallows 0-item completion (requires cancellation flow).

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
