---
title: Open Decisions
type: decision-log
status: open
---

# Open Decisions

This list separates genuine design choices and proposal inconsistencies from facts already decided. Record a decision, owner, date, and rationale before closing an item.

| ID | Decision to make | Why it matters |
|---|---|---|
| D-01 | Confirm any remaining public-guest behavior and stakeholder provisioning. | Admin monitoring remains aggregate and read-only; trust actions and OTP recovery are system-controlled. |
| D-02 | Define seller verification and OTP channel; reconcile with current email/password setup. | Access and onboarding requirements depend on it. |
| D-03 | Decide whether a reservation can contain multiple items or sellers. | Shapes order flow and QR scope. |
| D-04 | Define when the 24-hour timer starts and which cancellations remain eligible. | Needed for unambiguous stock restoration and buyer messages. |
| D-05 | Define partial pickup, no-show, and seller cancellation handling. | Quantity, analytics, and trust outcomes differ. |
| D-07 | Validate visibility thresholds, the 40/40/20 score weights, and normalized recurrence identity with stakeholders. | They are prototype settings, not standards. |
| D-10 | Define evidence retention and the user correction path for source-data trust records. | User correction remains available for eligible source events; unsupported reports remain allegations and do not change a user's weighted score or account state. Blocked-account restoration is system-controlled through email OTP; admins cannot restore accounts. |
| D-11 | Clarify the non-functional table's `FR-26` to `FR-30` labels and maintain one testable requirement register. | Avoids duplicate or ambiguous traceability. |
| D-12 | Verify hosting and external-service costs, privacy terms, and beta deployment configuration. | Proposal costs and service versions are planning assumptions. |

## Resolved decisions

### D-06 — Priority Boost promotion boundaries (2026-10-07)

**Owner:** Project owner (approved implementation plan).

**Decision:** Prepare copy only for Priority Boost listings. A seller reviews each draft and chooses whether to share with the native share sheet. No social account posting, buyer alert, automated price reduction, or promotional price override is included. n8n handles the copy workflow; the backend worker owns hourly checks and the six-hour follow-up eligibility check.

**Reason:** Keep listing facts and eligibility under backend control, and require seller consent before external sharing.

**Affected implementation:** `backend/src/jobs/`, `backend/src/modules/integrations/`, `backend/src/modules/seller/`, `mobile/src/features/notifications/`, and `n8n/workflows/agrivive-priority-promotion.json`.

**Follow-up:** Configure n8n credentials and an available Groq model during owner acceptance. D-07 remains open; the prototype weights and threshold are not stakeholder-validated.

### D-13 — Seller-approved publishing to Agrivive social pages (2026-10-08)

**Owner:** Project owner (approved implementation plan).

**Decision:** Sellers may preview, edit, and explicitly publish listing posts to Agrivive's Facebook Page, linked Instagram Professional account, and X account. TikTok and seller-owned account linking are excluded. Provider credentials stay in backend deployment settings. n8n coordinates the campaign but does not receive provider credentials or post directly. Retry only failed channels.

**Scope relationship:** This supersedes D-06's “no social account posting” boundary only for the separate seller-initiated official-page flow. D-06 remains unchanged for scheduled Priority Boost drafts: those are seller-reviewed native share-sheet content, with no automatic social posting, buyer alerts, or price changes.

**Reason:** Reduce seller setup friction while keeping channel credentials and current listing facts under Agrivive's control and requiring seller confirmation before publication.

**Affected implementation:** `backend/src/modules/integrations/`, `backend/src/modules/seller/`, `backend/src/utils/social-publishing/`, `mobile/src/features/boost/`, `n8n/workflows/agrivive-social-publishing.json`, and `backend/drizzle/20261007181343_official_social_pages/`.

**Follow-up:** Configure and verify Meta/X credentials, platform permissions, public HTTPS API, and n8n credentials; apply pending migrations to a test database in timestamp order; import/update the inactive n8n workflow; manually test each channel and failed-only retry. These owner checks remain unverified. D-07 remains open for stakeholder validation of visibility weights and thresholds.

---

## Decision record template

**ID / date / owner:**

**Decision:**

**Reason and evidence:**

**Affected notes or implementation:**

**Follow-up:**

**Source:** synthesis of PDF pp. 4–23 and repository inspection on 20 September 2026.
