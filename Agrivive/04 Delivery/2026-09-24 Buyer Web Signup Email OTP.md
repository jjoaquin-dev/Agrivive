---
title: Buyer Web Signup Email OTP
type: implementation-status
status: implemented
date: 2026-09-24
---

# Buyer Web Signup Email OTP

## What changed

- Enabled Better Auth's required email verification for email/password signup.
- Kept the Email OTP plugin as the verification sender and the web verification page as the OTP verifier.

## Why

The Email OTP plugin overrides Better Auth's default verification sender, but email/password signup was not configured to require verification. As a result, web signup could complete without invoking the OTP sender.

## Affected paths

- `backend/src/modules/auth/index.ts`

## Delivery configuration

The backend currently checks Mailtrap before Resend. Local OTPs therefore appear in the configured Mailtrap sandbox inbox. Real recipient delivery requires a valid Resend sender and API key, or a deliberate provider-order change.

## Verification

- Backend TypeScript check: passed with `bunx tsc --noEmit`.
- Backend Bun build: passed with `bun build src/index.ts --outdir dist --target bun`.
- Web TypeScript check: passed with `bun run typecheck`.
