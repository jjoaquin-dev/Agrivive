---
title: Seller Verification and Trust Backend
type: delivery
date: 2026-09-21
status: migrations and rollout applied; awaiting manual checks
---

# Seller Verification and Trust Backend

## Why

Seller access previously relied on a client-writable role field. The seller visibility route lacked a role guard, and the backend had no order-linked trust records or response clock. This change implements the warning-only phase of [[Trust and Flagging]] while keeping account restrictions disabled pending policy approval.

## What changed

- Better Auth now treats `role` and `isActive` as server-controlled fields, supports email OTP verification and confirmed TOTP, and blocks email-OTP sign-in so it cannot bypass TOTP.
- Verified sellers can manage their own profiles and listings. Listings record the inputs for the four-factor surplus visibility calculation. The seller visibility route is authenticated and seller-scoped.
- New reservations require the seller's verified email, confirmed TOTP, active role, and current profile. A one-time rollout snapshot allows existing unverified sellers to read and scan only previously pending orders for 24 hours.
- Seller cancellation restores stock atomically and records a verified event, warning, and buyer notice. Order-linked inquiries have idempotent 12/24/48-hour reminder, warning, and flag actions.
- Completed-order buyer reviews, private review text, aggregate public ratings, participant reports as allegation flags, automatic source-data corrections, and read-only admin aggregate metrics were added.
- Trust notices are stored before email delivery and retried through Resend. There is no automatic suspension or blocking route.

## Affected paths

- `backend/src/modules/auth/`, `backend/src/modules/buyer/`, `backend/src/modules/seller/`, and `backend/src/modules/admin/`
- `backend/src/db/schema.ts`, `backend/src/index.ts`, `backend/src/utils/`
- `backend/drizzle/20260920180234_clever_thunderball/`, `backend/drizzle/20260920180412_jazzy_franklin_richards/`, `backend/drizzle/20260920180509_simple_doctor_faustus/`
- `backend/scripts/start-seller-rollout.ts`, `backend/.env.example`, `backend/SELLER_TRUST_MANUAL_TESTING.md`, and `backend/README.md`

## Verification and rollout

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed.
- `bunx drizzle-kit check`: passed.
- On 2026-09-21, the live database journal was checked against the existing baseline, then the three trust migrations were applied with `bunx drizzle-kit migrate`. The journal now contains all three entries, and `order_inquiries`, `trust_events`, and `two_factor` exist.
- The API started without a trust job error and `GET /` returned `Hello Elysia` in a brief local check. `bun scripts/start-seller-rollout.ts` added one pending order to the seller scan grace snapshot; its grace deadline is `2026-09-21T18:44:55.723Z`. API checks remain for the owner to perform using `backend/SELLER_TRUST_MANUAL_TESTING.md`.

## Policy gate

Event weights, restriction thresholds, durations, and appeal outcomes remain open under [[Open Decisions]] D-10. The backend records evidence and warnings but does not impose restrictions automatically.
