---
title: Requirement Verification Record
type: verification
date: 2026-10-06
status: preliminary; owner acceptance pending
---

# Requirement Verification Record — 2026-10-06

This is a **code-evidence register, not a functional-test pass sheet**. The vault's [[Feature Map]] groups the proposal's FR-01–FR-23, but the original proposal table is not present in the current workspace. Therefore the group descriptions below are traceability cues, not invented verbatim requirement text. An endpoint or screen existing is not proof that its scenario passed. The owner must reconcile this against the signed proposal and enter observed pass/fail results.

| ID | Vault capability group | Repository evidence / limit | Current acceptance |
|---|---|---|---|
| FR-01 | Identity/access | Better Auth under `backend/src/modules/auth/`; buyer web auth. | Code present; manual role/OTP cases pending. |
| FR-02 | Identity/access | Session and role guards. | Code present; manual isolation pending. |
| FR-03 | Listings/discovery | Seller product services, public marketplace listing/filter. | Code present; manual listing lifecycle pending. |
| FR-04 | Communication | Buyer/seller inquiry routes, replies, notice inbox. | Code present; conversation and notice delivery pending. |
| FR-05 | Promotion/visibility | Seller visibility API and shareable listing content; no automated campaign. | Partial; owner scope review pending. |
| FR-06 | Reservation/pickup | Buyer order/checkout and stock transactions. | Code present; concurrent-reservation acceptance pending. |
| FR-07 | Analytics/advice | Seller descriptive analytics; association-based *real* recommendation evidence deferred with FR-19. | Partial; real-data claim not passed. |
| FR-08 | Feedback/trust | Reviews/reports endpoints. | Code present; manual review/report cases pending. |
| FR-09 | Identity/access | Buyer/seller role handling. | Code present; seller-as-buyer cases pending. |
| FR-10 | Listings/discovery | Product inventory state and filters. | Code present; manual acceptance pending. |
| FR-11 | Communication | First-publication follow notices plus existing transaction notices. | Code present; migrated-DB acceptance pending. |
| FR-12 | Reservation/pickup | Expiry worker and stock restoration. | Code present; timing/idempotency cases pending. |
| FR-13 | Reservation/pickup | QR scan and completion services. | Code present; reuse/invalid-code cases pending. |
| FR-14 | Location | Seller coordinates, map/filter, external directions. | Code present; permissions/device checks pending. |
| FR-15 | Feedback/trust | Buyer ratings/reviews and seller response. | Code present; manual acceptance pending. |
| FR-16 | Stakeholder view | Aggregate stakeholder API. | Code present; privacy review pending. |
| FR-17 | Listings/discovery | Weighted visibility tiers and buyer ranking. | Code present; stakeholder weight validation pending. |
| FR-18 | Automated promotion | n8n campaigns explicitly excluded from this batch. | Deferred; not passed. |
| FR-19 | Real-data MBA | Synthetic demo exists; completed-order live dataset threshold not established. | Deferred; not passed. |
| FR-20 | Reservation/pickup | Order status/QR handover and transactional updates. | Code present; end-to-end owner test pending. |
| FR-21 | Analytics/advice | Descriptive seller metrics and local summary. | Code present; 20-sample timing and data accuracy pending. |
| FR-22 | Analytics/advice | Weather/holiday advisory endpoints. | Code present; external-outage behavior pending. |
| FR-23 | Feedback/trust | `monitoring-v2` verified-event/rating points; unverified reports zero; no account action or text sentiment. | Partial by deliberate policy; not passed. |

The proposal's non-functional table is not reproduced in this workspace. [[Feature Map]] identifies speed, security/privacy, integrity, usability/resilience, and the mislabeled FR-26–FR-30 block. **None of the 30 non-functional requirements is marked passed here.** The owner must attach the exact NFR wording and identifiers before a defensible per-item pass/fail claim. In particular, the real-data-only recommendation item called FR-27 and trust/account-action language called FR-28 in prior planning remain deferred/partial respectively; their numbering needs reconciliation with the original table.

| Quality evidence area | What was checked | Status |
|---|---|---|
| Static correctness | Backend/web/mobile types; API/worker builds; Drizzle check; web build; Android export. | Passed on 2026-10-06. |
| Runtime availability | Local `/health`, `/health/ready`, `/openapi/json`; follow/read routes visible in OpenAPI; anonymous follow returned 401. | Route/auth smoke passed; authenticated behavior unverified. |
| 3-second primary-page/search/QR target | 20 normal-condition measurements per journey and slowest sample. | Not measured. |
| 5-second seller-summary target | 20 normal-condition measurements and slowest sample. | Not measured. |
| Screen/device support | 1366×768 web, 360px seller mobile, Android 10+, Chrome/Edge/Firefox/Safari. | Not tested. |
| Security/privacy | Buyer recipient isolation, self-follow, session expiry, HTTPS, stakeholder personal-data exclusion. | Code guards inspected; owner/API/security acceptance pending. |
| Data integrity | Migration, first-publication uniqueness, worker retry, stock/QR concurrency. | Migration generated and checked, not applied/tested. |
| Resilience | Offline/reconnect, advisory/email/storage outages, stale-display retry. | UI code present; failure-injection acceptance pending. |
| Beta availability | Hosting uptime and external-service costs. | Production deployment excluded; unverified. |

For the full manual checklist and request examples, see [[2026-10-06 Seller Follows and Quality Completion]]. Record observed outcomes with tester, environment, date, and evidence before changing any row to Pass or Fail.
