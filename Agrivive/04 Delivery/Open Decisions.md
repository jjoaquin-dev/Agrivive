---
title: Open Decisions
type: decision-log
status: open
---

# Open Decisions

This list separates genuine design choices and proposal inconsistencies from facts already decided. Record a decision, owner, date, and rationale before closing an item.

| ID | Decision to make | Why it matters |
|---|---|---|
| D-01 | Define administrator and public-guest roles and exact permissions. | Narrative and prototype mention them, but formal user requirements list seller, buyer, stakeholder. |
| D-02 | Define seller verification and OTP channel; reconcile with current email/password setup. | Access and onboarding requirements depend on it. |
| D-03 | Decide whether a reservation can contain multiple items or sellers. | Shapes order flow, QR scope, and Market Basket Analysis baskets. |
| D-04 | Define when the 24-hour timer starts and which cancellations remain eligible. | Needed for unambiguous stock restoration and buyer messages. |
| D-05 | Define partial pickup, no-show, and seller cancellation handling. | Quantity, analytics, and trust outcomes differ. |
| D-06 | Specify approved promotional channels, price-reduction consent, and whether generated copy needs review. | n8n behavior must respect platform and seller controls. |
| D-07 | Validate visibility thresholds, the 3-day inventory reference, and normalized recurrence identity with stakeholders. | They are prototype settings, not standards. |
| D-08 | Obtain commodity-specific Q10 parameters and actual storage-temperature capture method before showing numeric estimates. | Outdoor temperature cannot stand in for storage temperature. |
| D-09 | Choose minimum transaction volume and thresholds for related-product rules. | Sparse beta data can make associations misleading. |
| D-10 | Define report review, appeal, evidence retention, and the relationship between 12/24/48-hour response rules and multi-week inactivity rules. | Prevents unsupported penalties and inconsistent policy. |
| D-11 | Clarify the non-functional table's `FR-26` to `FR-30` labels and maintain one testable requirement register. | Avoids duplicate or ambiguous traceability. |
| D-12 | Verify hosting and external-service costs, privacy terms, and beta deployment configuration. | Proposal costs and service versions are planning assumptions. |

## Decision record template

**ID / date / owner:**

**Decision:**

**Reason and evidence:**

**Affected notes or implementation:**

**Follow-up:**

**Source:** synthesis of PDF pp. 4–23 and repository inspection on 20 September 2026.
