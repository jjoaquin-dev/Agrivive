# 2026-10-25 Security TOTP Card Hierarchy Fix and Modularization

## Overview
Resolved card ordering issue on the Account Security screen (`mobile/app/(app)/profile/security.tsx`) where the TOTP Confirm Password card was erroneously rendering below the Password card (`PasswordSecurityCard`). Reordered the layout so the TOTP confirm password card and all 2FA enrollment/management step cards render directly below the Authenticator App (TOTP) card and above the Password card.

## Key Changes
1. **Layout Hierarchy Correction**:
   - `TotpStatusCard`: Displays the "Authenticator App (TOTP)" 2FA status and Enable/Disable trigger.
   - `TotpConfirmPasswordCard` (when `step === "enable-password"`): Prompts for account password to initialize 2FA enrollment. Now positioned directly below the Authenticator App card and above the Password card.
   - `TotpScanQrCard` (when `step === "scan-qr"`): Renders QR code, manual key, and 6-digit confirmation code.
   - `TotpBackupCodesCard` (when `step === "backup-codes"`): Displays one-time emergency backup recovery codes with copy utility.
   - `TotpDisableCard` (when `showDisableModal === true`): Confirms password before disabling 2FA.
   - `PasswordSecurityCard`: Positioned at the bottom of the screen for account password management.
2. **Modularization & File Limit Compliance**:
   - Decomposed legacy 625-line `security.tsx` into focused subcomponents under `mobile/src/features/profile/components/`:
     - `TotpStatusCard.tsx` (69 lines)
     - `TotpConfirmPasswordCard.tsx` (65 lines)
     - `TotpScanQrCard.tsx` (87 lines)
     - `TotpBackupCodesCard.tsx` (62 lines)
     - `TotpDisableCard.tsx` (66 lines)
     - `security.tsx` (197 lines)
   - Every file strictly complies with the $\le 200$ lines limit.

## Affected Files
- `mobile/src/features/profile/components/TotpStatusCard.tsx`
- `mobile/src/features/profile/components/TotpConfirmPasswordCard.tsx`
- `mobile/src/features/profile/components/TotpScanQrCard.tsx`
- `mobile/src/features/profile/components/TotpBackupCodesCard.tsx`
- `mobile/src/features/profile/components/TotpDisableCard.tsx`
- `mobile/app/(app)/profile/security.tsx`

## Verification
- `mobile/`: `bunx tsc --noEmit` executed with 0 errors.
- `backend/`: `bunx tsc --noEmit` and `bun build src/index.ts --outdir dist --target bun` executed with 0 errors.
- Verified line lengths: all files are $\le 200$ lines.
