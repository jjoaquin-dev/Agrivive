# Google OAuth Password Setup Alignment

Date: 2026-10-16

## What changed

- Added a server-side credential status check that distinguishes a Google-linked account without a local password from an account that already has a password.
- Added authenticated password status and password setup routes.
- Used Better Auth's supported server-only `setPassword` operation; password hashes are never returned to clients or written manually by Agrivive code.
- Required Google-linked accounts without a local password to complete password setup before entering the completed web or mobile account experience.
- Added a web password setup page and a web Security form that switches between Set Password and Update Password.
- Added a mobile password setup screen and a Password card under Account Security.
- Kept the existing TOTP password confirmations separate from password creation and password updating.
- Renamed the mobile login action from `Forgot password?` to `Restore account` because its existing flow restores trust-restricted accounts through email OTP and does not reset a password.
- Documented the new routes and mobile behavior.

## Why

The implementation now follows the approved paper-aligned requirement: Google OAuth authenticates the identity, while Better Auth and the backend authoritatively manage the optional local credential. Existing email/password users continue using the current-password change flow. Email-code users are not forced into password setup unless they are also Google-linked without a credential password.

## Affected paths

### Backend

- `backend/src/modules/auth/index/auth.password.ts`
- `backend/src/modules/auth/model/auth.password.ts`
- `backend/src/modules/auth/services/auth.password-status.ts`
- `backend/src/modules/auth/services/auth.password-set.ts`
- `backend/src/index.ts`
- `backend/src/modules/seller/services/seller.setup.ts`
- `backend/API_ENDPOINTS.md`

### Web

- `web/app/layout.tsx`
- `web/app/password-setup/page.tsx`
- `web/src/features/auth/api/password.ts`
- `web/src/features/auth/components/PasswordSetupGuard.tsx`
- `web/src/features/auth/components/SetPasswordForm.tsx`
- `web/src/features/auth/components/ChangePasswordForm.tsx`
- `web/src/features/profile/components/ProfileSecurityCard.tsx`

### Mobile

- `mobile/app/index.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/profile/security.tsx`
- `mobile/app/(auth)/_layout.tsx`
- `mobile/app/(auth)/password-setup.tsx`
- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/email-otp-login.tsx`
- `mobile/app/(auth)/two-factor.tsx`
- `mobile/app/(auth)/verify-email.tsx`
- `mobile/src/api/auth.ts`
- `mobile/src/api/seller.ts`
- `mobile/src/features/auth/components/PasswordForm.tsx`
- `mobile/src/features/auth/components/PasswordSecurityCard.tsx`
- `mobile/README.md`

## Verification

- `backend`: `bunx tsc --noEmit` passed.
- `backend`: `bun build src/index.ts --outdir dist --target bun` passed.
- `mobile`: `bun run typecheck` passed.
- `web`: `bun run typecheck` passed.
- `web`: `bun run build` passed and generated `/password-setup`.
- `git diff --check` passed with only existing line-ending warnings.

## Manual verification still required

- Complete a new Google OAuth sign-in on web and mobile and confirm that password setup appears before the completed account experience.
- Confirm a Google-only account can set a password once and then use email/password login.
- Confirm existing email/password accounts still use Update Password and require the current password.
- Confirm mobile Profile → Account & Security exposes Set Password or Update Password as appropriate.
- Confirm TOTP enrollment and disable continue to use password confirmation only.
- Confirm mobile Restore account continues to restore trust-restricted accounts and does not claim to reset a password.
