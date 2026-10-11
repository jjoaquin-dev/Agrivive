---
title: Web Google OAuth and Trust Completion
type: delivery-record
status: implemented; external OAuth acceptance pending
date: 2026-10-12
---

# Web Google OAuth and Trust Completion

## What changed

- Added Better Auth Google OAuth configuration for the shared backend. A new Google identity can register as a buyer, while an existing linked identity can sign in.
- Added Google buttons to the web login and buyer registration screens.
- Added a web account recovery page that requests and verifies the existing email OTP recovery flow for blocked or restricted accounts.
- Added trust-aware access messages to web reservation, cart, order, and buyer order-list flows. The user is sent to email-code recovery when the backend reports an inactive or temporarily restricted account.
- Kept buyer order reports and evidence uploads as the flagging workflow. Reports are presented as allegation flags until supported by verified events and do not add weighted trust points by themselves.
- Expanded the read-only admin performance response and page with active warning, temporary-restriction, and blocked-action counts, policy status, and thresholds. Admins still have no restore, revoke, approval, or moderation controls.

## Why

The backend trust policy and recovery routes were already migrated and implemented, but the web did not expose Google sign-in, OTP restoration, or clear trust-action feedback. The admin view also described monitoring without showing the system-controlled actions that can exist when the feature flag is enabled.

The exact trust weights and thresholds remain prototype settings, not research-proven facts. The system keeps allegations separate from verified signals to avoid treating an unreviewed report as a penalty.

## Affected project paths

- `backend/src/modules/auth/index.ts`
- `backend/src/modules/admin/model/admin.performance.ts`
- `backend/src/modules/admin/services/admin.performance.ts`
- `backend/.env.example`
- `backend/API_ENDPOINTS.md`
- `backend/README.md`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/account-recovery/page.tsx`
- `web/app/admin/performance/page.tsx`
- `web/src/features/auth/components/AuthAlerts.tsx`
- `web/src/features/auth/components/GoogleSignInButton.tsx`
- `web/src/features/admin/api/performance.ts`
- `web/src/features/admin/components/TrustMonitoringCard.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/orders/components/OrderReportSuccess.tsx`
- `web/src/features/orders/hooks/useBuyerOrders.ts`
- `web/src/features/trust/api/recovery.ts`
- `web/src/features/trust/components/TrustAccessNotice.tsx`
- `web/src/lib/api.ts`

## Configuration and manual acceptance

1. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the backend `.env`.
2. Keep `BETTER_AUTH_URL=http://localhost:3000` locally and add `http://localhost:3000/api/auth/callback/google` to the Google Cloud OAuth client's authorized redirect URIs.
3. Start the backend and web apps.
4. From `/login`, select **Continue with Google** using an existing Google identity; confirm the user returns to the requested page with an Agrivive session.
5. From `/signup`, select **Continue with Google** using a new Google identity; confirm the account is created with the buyer role.
6. On `/account-recovery`, request an OTP for a blocked test account, verify it, and confirm the account returns to the sign-in screen with the restored notice.
7. File a buyer order report with evidence and confirm the success message says it is an allegation until verified.
8. Open `/admin/performance` with an admin session and confirm the page shows trust-action counts and remains read-only.

The external Google OAuth flow cannot be recorded as passed until valid Google credentials and redirect configuration are supplied. The local web build and backend build are the code-level verification for this change.

## Verification performed

- `web`: `bun run typecheck` passed.
- `web`: `bun run build` passed and generated `/account-recovery` and the updated auth/admin routes.
- `backend`: `bunx tsc --noEmit` passed.
- `backend`: `bun build src/index.ts --outdir dist --target bun` passed.
- `git diff --check` passed; Git reported only the repository's existing LF/CRLF normalization warnings.
- No database migration was added; the previously applied `trust_actions` migration is reused.

## References for the paper and implementation record

- Better Auth, **Google provider setup**, including the `/api/auth/callback/google` redirect path: [better-auth.com/docs/1.6/authentication/google](https://better-auth.com/docs/1.6/authentication/google)
- Better Auth, **OAuth sign-in and account linking**: [better-auth.com/docs/concepts/oauth](https://better-auth.com/docs/concepts/oauth)
- Better Auth, **Email OTP plugin and `forget-password` OTP type**: [better-auth.com/docs/plugins/email-otp](https://better-auth.com/docs/plugins/email-otp)
- Agrivive trust and flagging research references [54]–[58] remain documented in [[Trust and Flagging]] and [[Source and Reading Guide]].

## Scope boundary

The admin remains read-only. Restoration is performed only by the system after the user's email OTP is verified. Mobile Google OAuth UI is not included in this web pass; the shared backend provider is now ready for a later mobile deep-link implementation.
