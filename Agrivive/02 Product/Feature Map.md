---
title: Feature Map
type: requirements
status: proposed
source_pages: [8, 9]
---

# Feature Map

The PDF's functional requirements are grouped here by workflow. IDs retain the proposal's numbering so implementation and tests can refer back to them.

| Capability | Requirement IDs | Main behavior |
|---|---|---|
| Identity and access | FR-01, FR-02, FR-09 | Registration, OTP verification, secure logout, role checks, seller acting as buyer |
| Listings and discovery | FR-03, FR-10, FR-17 | Structured listings, inventory states, search and filtering, visibility level |
| Communication | FR-04, FR-11 | Buyer-seller messaging and transaction/listing notifications |
| Promotion | FR-05, FR-18 | Seller visibility view, shareable content, n8n marketing actions |
| Reservations and pickup | FR-06, FR-12, FR-13, FR-20 | Reserve/cancel, 24-hour QR, expiration, validation, handover, stock updates |
| Location | FR-14 | Seller pin, distance, pickup instructions, external navigation |
| Analytics and advice | FR-07, FR-19, FR-21, FR-22 | Descriptive trends, association recommendations, weather and holiday advice |
| Feedback and trust | FR-08, FR-15, FR-23 | Ratings, reviews, reports, rule-based flagging |
| Stakeholder view | FR-16 | Aggregate marketplace information without personal data |

## Cross-cutting quality targets

- **Speed:** primary pages, search results, and QR validation within 3 seconds; descriptive summary within 5 seconds under stated normal or beta conditions.
- **Security and privacy:** authentication, OTP, role enforcement, secure password hashing, HTTPS, aggregate-only stakeholder views.
- **Integrity:** no negative stock, consistent state across reserve/cancel/expire/confirm, no duplicate QR confirmation, complete database transactions for quantity changes.
- **Usability and resilience:** task-focused navigation, clear errors, responsive interfaces, connection/retry messages, graceful behavior when nonessential external services fail.

The non-functional table labels its last five items `FR-26` through `FR-30` despite appearing under non-functional requirements. Treat the text as quality requirements and resolve numbering in [[Open Decisions]].

**Source:** PDF pp. 8–9.
