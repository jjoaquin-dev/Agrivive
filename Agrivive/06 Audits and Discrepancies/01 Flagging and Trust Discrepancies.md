---
title: Flagging and Trust Discrepancies
type: discrepancy-analysis
status: completed
created: 2026-10-16
references: ["Section 2.3.2.6", "Table 17", "Table 18", "Equation 3"]
---

# Flagging and Trust Mechanism — Paper vs. System Discrepancies

This document contrasts the theoretical descriptions in **Section 2.3.2.6 of the Agrivive Research Paper** with the actual implementation in `backend/src/utils/trust/` and related services.

---

## 1. General Account Inactivity Rules (3 Weeks / 1 Month)

### Stated in Research Paper
> *"The mechanism also applies predefined rules to other recorded behaviors. Inactivity for three weeks results in a warning, while one month of inactivity results in account blocking."* (Section 2.3.2.6, p. 23)

### Actual System Implementation
* **Zero Implementation in Codebase:** There is no cron job, background worker, or middleware tracking general account login dates or session timestamps to enforce a 3-week warning or a 30-day block.
* **Vault Confirmation:** In `[[Trust and Flagging]]`, this omission is formally acknowledged:
  > *"The PDF's separate three-week inactivity warning and one-month blocking statements are not treated as implemented rules because their scope and evidence definition are not specified."*
* **Impact:** Sellers and buyers can leave their accounts inactive indefinitely without receiving automated inactivity warnings or account blocking, provided they have no pending transactions with expiring timers.

---

## 2. Asymmetric Enforcement: Buyer vs. Seller Penalties

### Stated in Research Paper
> *"For example, when a buyer reserves vegetables and does not complete the agreed pickup, the reservation record, QR status, pickup status, and related transaction information are used as inputs for the rule evaluation. When the recorded conditions match a defined violation rule, the incident is included in the user's violation record."* (Section 2.3.2.6, p. 23)

### Actual System Implementation
* **Unilateral Seller Scoring:** The automated scoring routine `readTrustMonitoringScore` in `backend/src/utils/trust/score.ts` queries low ratings where `review.seller_id = subjectId`, and only processes verified seller cancellations and inquiry timeouts.
* **Buyer Reservation Expiry:** When a buyer fails to pick up an order, `expirePendingOrders` in `backend/src/modules/buyer/services/buyer.order.expire.ts` simply updates `orders.status = 'expired'` and calls `restoreOrderStock()`. 
* **Zero Buyer Violation Records:** The expired reservation does **not** generate a `trust_events` entry for the buyer, nor does it advance a buyer toward warning, restriction, or blocking.
* **Impact:** The paper claims reciprocal accountability (protecting sellers from frivolous buyer reservations), but the code solely penalizes sellers.

---

## 3. Operational State: Active Enforcement vs. Prototype Feature Flag

### Stated in Research Paper
* Section 2.3.2.6 discusses the system as an active, continuously running regulatory engine executing actions based on Table 18 thresholds.

### Actual System Implementation
* **Disabled by Default:** In `backend/src/utils/trust/policy.ts`:
  ```typescript
  export const trustActionPolicy = {
    enabled: process.env.TRUST_ACTIONS_ENABLED?.trim().toLowerCase() === "true",
    warningThreshold: configuredInteger("TRUST_WARNING_THRESHOLD", 3),
    restrictionThreshold: configuredInteger("TRUST_RESTRICTION_THRESHOLD", 5),
    blockedThreshold: configuredInteger("TRUST_BLOCK_THRESHOLD", 8),
    restrictionHours: configuredInteger("TRUST_RESTRICTION_HOURS", 168),
  } as const;
  ```
* **Guard in Action Evaluator:** In `backend/src/utils/trust/evaluate-action.ts`:
  ```typescript
  if (!trustActionPolicy.enabled) return null;
  ```
* **Impact:** Unless explicitly enabled via `TRUST_ACTIONS_ENABLED=true` in `.env`, the system records events in the database but will **never** trigger account warnings, restrictions, or blocks. The paper does not mention that automated enforcement is an optional prototype toggle.

---

## 4. Temporary Restriction Duration and Severity

### Stated in Research Paper (Table 17 & 18)
* Table 17 states: *"Repeated violations: Apply temporary restriction or suspension according to the configured rules."*
* Specific duration and operational impacts are unspecified in the paper text.

### Actual System Implementation
* **Explicit Hardcoded Duration:** The restriction lasts exactly **168 hours (7 full days)** by default (`restrictionHours: 168`).
* **Complete Marketplace Quarantine:** Under `requireNoActiveTrustRestriction` and `seller-access`:
  1. The seller cannot scan QR codes or update orders.
  2. The buyer cannot checkout.
  3. The seller's products are completely removed from public marketplace search and category browsing (`backend/src/modules/marketplace/services/marketplace.visibility.ts`).
* **Automated Expiry:** The background worker `expireTrustRestrictions()` in `backend/src/utils/trust/expire-restrictions.ts` unbans the account immediately once the 7 days elapse without human admin intervention.

---

## 5. Summary Discrepancy Matrix

| Dimension | Document Paper Description | System Implementation | Discrepancy Level |
| :--- | :--- | :--- | :--- |
| **3-Week Inactivity Warning** | Explicitly stated (p. 23) | Completely absent in code | **Critical Omission** |
| **30-Day Inactivity Blocking** | Explicitly stated (p. 23) | Completely absent in code | **Critical Omission** |
| **Buyer Abandonment Penalty** | Claimed as an operational example | Only restores inventory; zero buyer violation score | **High Divergence** |
| **Action Execution Toggle** | Implied as always-on enforcement | Guarded by `TRUST_ACTIONS_ENABLED` (false by default) | **Medium Divergence** |
| **Restriction Duration** | Unspecified ("configured rules") | Exactly 168 hours (7 days) with auto-expiry worker | **Clarification / Spec** |
