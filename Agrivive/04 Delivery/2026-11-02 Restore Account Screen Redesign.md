---
title: Restore Account Screen Redesign
type: delivery
date: 2026-11-02
status: done
---

# Restore Account Screen Redesign

## What changed

- `mobile/app/(auth)/account-recovery.tsx` was rebuilt on the shared sign-in parts (`AuthScreenShell`, `AuthResendTimer`, `AuthTextLink`, `maskEmail`), so it now looks like Reset Password and Sign In With Email Code.
  - Three steps: email ("Restore Your Account") → code ("Check Your Email", masked email + Change, 30-second "Send a new code") → success ("Your Account Is Back").
  - Errors show once, under the field or the code boxes. The top error and notice boxes are gone.
  - The code must be exactly 6 digits (it used to accept 4 while showing 6 boxes).
  - The email is pre-filled when opened from the App Start "Restore My Account" button.
  - When signed in: success → Continue (reloads the account, then goes through app start); the bottom link is "Log out instead". When signed out: success → Sign In; the bottom link is "Back to sign in".
  - Plain error lines: wrong or expired code → "That code didn't work. Check it or send a new one."; an account that isn't blocked → "This account isn't blocked, so there's nothing to restore. Sign in as usual."
  - Removed: "Admins do not restore accounts manually."
- `mobile/app/(auth)/_layout.tsx`: the native "Restore Account" header is hidden, so there's only one header.
- `mobile/src/features/trust/components/account-recovery.styles.ts` was deleted because nothing uses it any more.
- Backend: the 30-second account-status cache moved to `backend/src/utils/user-status-cache/index.ts`. `verifyTrustRecovery` (`backend/src/modules/trust/services/trust.recovery.ts`) now clears that user's cache entry after restoring. Before this, a restored seller still got "account paused" for up to 30 seconds.

## Why

The screen showed every error twice, accepted 4-digit codes, and left the seller on the email step after a restore with no Sign In button. It also had two headers. The cache meant "Continue" right after a restore could still say blocked.

UI/UX laws applied: Error Prevention & Inline Validation (Jarrett & Gaffney), Law of Proximity (Gestalt), Peak-End Rule (Kahneman & Fredrickson), Law of Similarity (Gestalt), Visibility of System Status (Jakob Nielsen).

## Verification

- `bunx tsc --noEmit` and both `bun build` commands (index, worker) passed in `backend/`. `backend/dist/index.js` was rebuilt.
- `bun run typecheck` passed in `mobile/`.
- Not done: no phone check, and no manual endpoint test.

## Manual test (owner)

1. Block a test seller (an active `blocked` or `temporary_restriction` trust action with `isActive` false).
2. Open the app. The App Start screen shows Restore My Account, and the email is filled in.
3. `POST /trust/recovery/request` `{ "email": "<seller email>" }` → `{ "success": true }`, and the email arrives.
4. `POST /trust/recovery/verify` `{ "email": "<seller email>", "otp": "<6 digits>" }` → `{ "success": true, "userId": "…", "restoredAt": "…" }`.
5. Tap Continue. Home should open straight away, not "account paused".

## Open

- Trust recovery and the new Reset Password both use Better Auth's `forget-password` code type, so a reset code can also restore a blocked account. Decide whether they should use separate code types.
