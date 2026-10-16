---
title: Flagging and Trust Scope Narrowed
type: scope-analysis
status: completed
created: 2026-10-16
references: ["Section 2.3.2.6", "Equation 3", "Table 18"]
---

# Flagging and Trust Mechanism — Narrowed Implementation Scope

This document details areas where the broad theoretical concepts presented in **Section 2.3.2.6 of the Research Paper** were intentionally narrowed down during production implementation to maintain platform stability, prevent abuse, and satisfy legal/procedural fairness.

---

## 1. Automated Violation Types: From General Matrix to 3 Verified Signals

### Paper's Broad Formulation
The paper describes evaluating a wide range of user behaviors:
> *"The mechanism applies configured rules and a weighted statistical tool to recorded user activity, including inactivity, non-responsiveness, failed reservations, misleading product information, QR-code misuse, inappropriate communication, and other defined violations."* (Section 2.3.2.6, p. 22)

### Production Narrowing (`monitoring-v3`)
In `backend/src/utils/trust/policy.ts`, the automated scoring formula ($VS_u = \sum w_i v_{u,i}$) strictly defines weights for only **three deterministic, system-provable signals**:

```typescript
export const trustPolicyWeights = {
  inquiry_non_response: 1, // Timed out beyond 48 hours without seller reply
  seller_cancellation: 2,  // Pending buyer order explicitly cancelled by seller
  low_rating: 1,            // Completed order given 1 or 2 stars by verified buyer
} as const;
```

### Engineering Rationale
* **Why Misleading Information was Narrowed:** Algorithmic detection of misleading photos or inaccurate descriptions requires computer vision and domain-specific produce standards that are not viable on a mobile server without high error rates.
* **Why QR-Code Misuse was Narrowed:** In Agrivive, QR codes are cryptographic payloads validated via `verifyOrderQr()` in `backend/src/utils/order-qr/`. Invalid QR scans throw immediate `400` errors rather than accumulating violation points, preventing unintentional network retry blunders from penalizing farmers.
* **Why Inappropriate Communication was Narrowed:** NLP sentiment moderation without human arbitration leads to severe false positives in informal dialects (e.g., Tagalog/Cebuano agricultural slang).

---

## 2. Treatment of User-Submitted Reports: Strict Allegation Isolation

### Paper's Ambiguous Description
> *"In Agrivive, buyers can submit ratings, reviews, feedback, and transaction-related reports, which are stored in the database for automated evaluation... The resulting score is compared with predefined thresholds to determine the corresponding flagging or account action."* (Section 2.3.2.6, p. 22)

### Production Narrowing ([`report.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/trust/report.ts#L23-L25) & [`score.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/trust/score.ts#L37-L44))
The database schema and scoring logic enforce a hard division:
* When a user files an order report via `/orders/:id/report`, it is inserted with:
  ```typescript
  classification: "allegation"
  ```
* In `readTrustMonitoringScore`, the points calculation specifically filters by classification:
  ```typescript
  const verified = rows.filter((row) => row.classification === "verified");
  const allegations = rows.filter((row) => row.classification === "allegation");
  // Only verified items contribute to points:
  const verifiedEventPoints = components.reduce((total, item) => total + item.points, 0);
  ```
* **Score Impact:** Unsupported user reports contribute **0 points** to the weighted violation score.

### Engineering Rationale
* Prevents **coordinated buyer attacks** or competitor sabotage where fake reports could trigger automated seller suspensions.
* Satisfies Postel's Law and Error Prevention standards: Allegations remain auditable signals without prematurely impacting a seller's livelihood.

---

## 3. Seller Responsiveness Operationalized via Order Inquiries

### Paper's Conceptual Description
* The paper refers to general "seller responsiveness" and time-sensitive vegetable deterioration.

### Production Narrowing ([`process-inquiries.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/trust/process-inquiries.ts))
Rather than monitoring arbitrary in-app presence or general socket activity, responsiveness is measured strictly through the structured **Order Inquiry Lifecycle**:
1. An open inquiry exists in `order_inquiries` where `repliedAt IS NULL`.
2. The timer triggers only across 12-hour, 24-hour, and 48-hour increments.
3. Once the seller replies (`repliedAt` is populated), the clock stops and no violation can occur.

---

## 4. Administrative Control: Read-Only Observability

### Paper's Implication
* The paper outlines system actions (warnings, restrictions, blocks) without detailing administrative intervention boundaries.

### Production Narrowing
* **Strictly Read-Only Admin:** The administrative routes in `backend/src/modules/admin/` only permit viewing trust aggregates and monitoring logs.
* **No Manual Punitive Actions:** Admins cannot manually issue strikes, ban users arbitrarily, or alter violation points.
* **Why:** Removing discretionary admin overrides eliminates corruption risks and guarantees that all penalties strictly adhere to auditable, deterministic system rules.

---

## 5. Scope Narrowing Impact Table

| Capability Stated in Paper | Narrowed Production Scope | Motivation & Architectural Guardrail |
| :--- | :--- | :--- |
| **All-encompassing violation types** | 3 deterministic signals: `inquiry_non_response`, `seller_cancellation`, `low_rating` | Protects sellers against flawed NLP or CV heuristics; limits scoring to auditable DB state. |
| **Direct report evaluation** | Reports recorded as `allegation` (0 points); verified events require transactional proof | Prevents malicious review-bombing and false accusation penalties. |
| **General seller responsiveness** | Formal `order_inquiries` state machine | Anchors responsiveness to concrete buyer transactions rather than app idle time. |
| **System-wide account authority** | Read-only administrative endpoints | Eliminates bias and administrative tampering; upholds deterministic transparency. |
