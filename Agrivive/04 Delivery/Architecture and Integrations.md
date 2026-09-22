---
title: Architecture and Integrations
type: architecture
status: proposed
source_pages: [5, 7, 8, 10, 11, 26]
---

# Architecture and Integrations

## Planned application shape

Seller mobile app (React Native) and buyer/admin/stakeholder web app (Next.js) → ElysiaJS APIs and business rules → PostgreSQL for marketplace records. Better Auth handles identity and sessions. Hosting is proposed on a Hostinger VPS with Docker.

This is the **proposal architecture**. See [[Current Implementation]] for what exists in the repository.

## Service responsibilities

| Component | Intended responsibility |
|---|---|
| ElysiaJS | Listing, reservation, quantity, QR validation, trust rules, analytics calculations, and protected APIs |
| Better Auth | Registration, authentication, sessions, role-based access; OTP is proposed but not in the current backend |
| n8n | Scheduled marketing workflow, promotional content preparation, and configured alerts |
| Python/Pandas | Offline/analytical Market Basket Analysis on completed transaction data |
| LangGraph + Groq | Readable summaries from validated descriptive metrics; promotional copy generation |
| OpenStreetMap + React Leaflet | Seller and pickup location display; external navigation link |
| Open-Meteo | Outdoor weather context for advisories |
| Nager.Date | Philippine holiday context for advisories |
| Amazon S3 | Proposed image storage |

## Boundary rules

- Backend values are authoritative for price, quantity, reservation state, and calculated metrics.
- Automation and text-generation services must retrieve current facts before creating content.
- Outdoor weather is not a substitute for measured or seller-recorded storage temperature. [[Contextual Advisories]]
- Stakeholder access exposes aggregate, non-personal information only. [[People and Roles]]
- If weather or holiday APIs fail, stored marketplace functions should remain usable.

## Deployment considerations

The proposal specifies an internet-connected beta environment, supported Android 10+ seller devices, and current major browsers for web users. It also calls for HTTPS, documented configuration, modular services, and graceful network failure messages. Service versions in the PDF are planning references; verify actual versions during implementation rather than treating them as installed.

**Source:** PDF pp. 5, 7–8, 10–11, 26.
