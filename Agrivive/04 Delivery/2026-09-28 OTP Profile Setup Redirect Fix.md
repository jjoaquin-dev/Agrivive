---
title: OTP Profile Setup Redirect Fix
type: delivery
date: 2026-09-28
status: implemented; manual Expo verification pending
---

# OTP Profile Setup Redirect Fix

## What changed

- Enabled Better Auth to create a signed-in session immediately after a new user successfully verifies their email OTP.
- Updated the mobile OTP verification screen to require a valid seller setup response before routing.
- Routed accounts with an incomplete profile to profile onboarding instead of the inventory tab.
- Removed the unsafe fallback that sent a newly verified account to product screens when setup loading returned no data.
- Added a root-router guard so an authenticated account without setup state is sent to profile onboarding.

## Why

New accounts could finish OTP verification without a usable session, then fall through to the inventory screen. Inventory requests were therefore sent without authorization and displayed “Could not load products”. The account must complete profile onboarding before product screens are available.

## Affected paths

- `backend/src/modules/auth/index.ts`
- `mobile/app/(auth)/verify-email.tsx`
- `mobile/app/index.tsx`

## Verification performed

- `mobile`: `bun run typecheck` — passed.
- `backend`: `bunx tsc --noEmit` — passed.
- `backend`: `bun build src/index.ts --outdir dist --target bun` — passed.
- Manual Expo device verification remains pending: create a fresh account, enter its OTP, and confirm that profile onboarding opens before the home screen.
