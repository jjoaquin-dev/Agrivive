---
title: Current Implementation
type: implementation-status
status: observed
reviewed: 2026-10-12
---

# Current Implementation

This note records the local repository as inspected on **20 September 2026**. It is a snapshot, not a statement that the proposed system has been completed.

## Present in the repository

- `backend/`: Bun and TypeScript Elysia application listening on port 3000. OpenAPI is mounted.
- `backend/src/modules/auth/`: Better Auth with email/password, Google OAuth, bearer plugin, email OTP, session lookup, and user role and active flags.
- `backend/src/modules/seller/`: authenticated routes to add a seller profile and a product, with request models and insert services. Their current role setting permits seller **and buyer**.
- A new weighted-visibility route and service are present locally. The service currently returns products with a calculated `postingAge` field; it does **not** yet implement the four-factor weighted score or Basic/Standard/Priority tiers in [[Weighted Surplus Visibility]].
- `backend/src/db/`: PostgreSQL/Drizzle connection and schema code. This vault intentionally does not document tables or fields.
- `.github/workflows/backend-ci.yml`: frozen dependency install, TypeScript check, and Bun build.
- `mobile/`: React Native Expo application (Expo SDK 57, Expo Router, TypeScript) implementing 3-step seller onboarding, Better Auth registration and email OTP, stall profile setup with interactive Davao City map pin, server-derived Verified account badge, and optional TOTP 2FA security.
- `web/`: Next.js buyer marketplace, authentication, account recovery, reservations, reviews, order reports/evidence, notifications, and read-only admin trust monitoring.
- `analytics/`: a local Python virtual environment and sample data files were observed, but no tracked analytics application.
- The seller product flow now uses an approved vegetable catalog with Filipino wet-market names, English names, search aliases, and nine reference categories. The catalog excludes fungi and mushrooms. See [[2026-10-11 Vegetable Catalog and Naming]].

## Important gaps against the proposal

- Google OAuth external acceptance still requires Google Cloud credentials and redirect configuration.
- No mobile listing screens, reservation management screens, QR scanner screens, or notification inbox yet (scheduled for subsequent mobile delivery).
- Email OTP verification and blocked-account recovery are implemented; external email delivery and manual recovery acceptance remain environment-dependent.
- No complete listing lifecycle, search/filtering, messaging, location view, reservation/QR pickup, n8n workflow, dashboards, Q10 advisories, or trust processing observed.
- The current product input covers a catalog-selected name, derived category, image URL, price, quantity, selling unit, condition, availability, and low-stock settings; storage, inventory age, pickup details, and recent-photo handling remain separate scope considerations.

## Local working-tree context

The backend had uncommitted edits and new files when inspected, including the visibility route/service and order-related schema work. Treat this note as an observation of the working tree; check the repository again before making implementation decisions.

[[Feature Map]] · [[Delivery Roadmap]] · [[Open Decisions]]

**Source:** local repository inspection on 20 September 2026; proposal comparison from PDF pp. 4–9, 12–23.
