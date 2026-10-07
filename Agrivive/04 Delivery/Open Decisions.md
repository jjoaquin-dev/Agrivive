---
title: Open Decisions
type: decision-log
status: open
---

# Open Decisions

This list separates genuine design choices and proposal inconsistencies from facts already decided. Record a decision, owner, date, and rationale before closing an item.

| ID | Decision to make | Why it matters |
|---|---|---|
| D-01 | Confirm any remaining public-guest behavior and stakeholder provisioning. | Admin monitoring is aggregate and read-only; no admin report decisions or account actions are part of the workflow. |
| D-02 | Define seller verification and OTP channel; reconcile with current email/password setup. | Access and onboarding requirements depend on it. |
| D-03 | Decide whether a reservation can contain multiple items or sellers. | Shapes order flow, QR scope, and Market Basket Analysis baskets. |
| D-04 | Define when the 24-hour timer starts and which cancellations remain eligible. | Needed for unambiguous stock restoration and buyer messages. |
| D-05 | Define partial pickup, no-show, and seller cancellation handling. | Quantity, analytics, and trust outcomes differ. |
| D-07 | Validate visibility thresholds, the 40/40/20 score weights, and normalized recurrence identity with stakeholders. | They are prototype settings, not standards. |
| D-09 | Choose minimum transaction volume and thresholds for related-product rules. | Sparse beta data can make associations misleading. |
| D-10 | Define evidence retention and the user correction path for source-data trust records. | Admins monitor aggregate signals only; unsupported reports remain allegations and do not change a user's weighted score or account state. |
| D-11 | Clarify the non-functional table's `FR-26` to `FR-30` labels and maintain one testable requirement register. | Avoids duplicate or ambiguous traceability. |
| D-12 | Verify hosting and external-service costs, privacy terms, and beta deployment configuration. | Proposal costs and service versions are planning assumptions. |

## Resolved decisions

### D-06 — Priority Boost promotion boundaries (2026-10-07)

**Owner:** Project owner (approved implementation plan).

**Decision:** Prepare copy only for Priority Boost listings. A seller reviews each draft and chooses whether to share with the native share sheet. No social account posting, buyer alert, automated price reduction, or promotional price override is included. n8n handles the copy workflow; the backend worker owns hourly checks and the six-hour follow-up eligibility check.

**Reason:** Keep listing facts and eligibility under backend control, and require seller consent before external sharing.

**Affected implementation:** `backend/src/jobs/`, `backend/src/modules/integrations/`, `backend/src/modules/seller/`, `mobile/src/features/notifications/`, and `n8n/workflows/agrivive-priority-promotion.json`.

**Follow-up:** Configure n8n credentials and an available Groq model during owner acceptance. D-07 remains open; the prototype weights and threshold are not stakeholder-validated.

---

## Decision record template

**ID / date / owner:**

**Decision:**

**Reason and evidence:**

**Affected notes or implementation:**

**Follow-up:**

**Source:** synthesis of PDF pp. 4–23 and repository inspection on 20 September 2026.
