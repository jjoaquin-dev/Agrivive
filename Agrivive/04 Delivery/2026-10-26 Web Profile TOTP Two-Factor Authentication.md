# 2026-10-26 Web Profile TOTP Two-Factor Authentication

## Context & Objectives
Implement a complete Time-Based One-Time Password (TOTP) Two-Factor Authentication (2FA) experience in the web profile's **Security** tab, matching Agrivive's UI conventions, visual hierarchy, and design standards.

## Why
- **Miller's Law & Cognitive Chunking**: Separating two-factor authentication and account password management into two dedicated cards prevents cognitive overload and maintains clear functional boundaries (*Gestalt Law of Common Region*).
- **Goal-Gradient Effect (Clark L. Hull)**: Structuring enrollment as an inline progressive stepper (Password Confirm $\rightarrow$ QR Scan / Manual Secret Entry $\rightarrow$ Backup Codes) provides immediate momentum and transparent progress toward securing the account.
- **Fitts's Law & Affordances**: Generous 44px+ touch targets, instant one-click copy feedback for secret keys and recovery codes, and direct `.txt` file downloading make safeguarding security credentials effortless and forgiving (*Error Prevention Principle*).
- **Aesthetic-Usability Effect**: Forest Green `#1F4D3A` and Emerald accents, clean `rounded-[20px]` surfaces, subtle shadows, and crisp typography instill trust and security.

## What Changed
1. **`web/src/features/profile/components/ProfileTwoFactorCard.tsx`** (New):
   - Dedicated card coordinating 2FA state: `idle`, `wizard`, `backup-codes`, and `active`.
   - Handles OAuth edge case with friendly guidance when social login users have no password set yet.
   - Houses the status badge (`2FA Active` vs. `2FA Off`).
2. **`web/src/features/profile/components/ProfileTwoFactorSetupWizard.tsx`** (New):
   - Prompts for current password to authorize generating cryptographic TOTP secrets via `authClient.twoFactor.enable`.
3. **`web/src/features/profile/components/ProfileTwoFactorVerifyStep.tsx`** (New):
   - Renders QR code using `QRCodeSVG` (`qrcode.react`), copyable manual setup key, and 6-digit `OtpCodeInput`.
   - Activates 2FA on verification via `authClient.twoFactor.verifyTotp`.
4. **`web/src/features/profile/components/ProfileTwoFactorBackupCodes.tsx`** (New):
   - Displays 10 one-time recovery codes in a clean 2-column monospace grid.
   - Provides "Copy All Codes" to clipboard and "Download as .txt" (`agrivive-backup-codes.txt`) buttons.
5. **`web/src/features/profile/components/ProfileTwoFactorActiveView.tsx`** (New):
   - Displays active protection summary.
   - Provides options to generate fresh backup codes or disable 2FA with password confirmation.
6. **`web/src/features/profile/components/ProfileTwoFactorPasswordPrompt.tsx`** (New):
   - Reusable password prompt component for sensitive 2FA actions (deactivation and backup code regeneration).
7. **`web/src/features/profile/components/ProfileSecurityCard.tsx`** (Refactored):
   - Streamlined to focus exclusively on account password management (`ChangePasswordForm` / `SetPasswordForm`), eliminating redundant 2FA status badges.
8. **`web/src/features/profile/components/BuyerProfile.tsx`** (Refactored):
   - Stacks `ProfileTwoFactorCard` above `ProfileSecurityCard` with responsive spacing.
   - Synchronizes session state with `authClient.getSession()` and `router.refresh()` upon status changes.

## Affected Files
- `web/src/features/profile/components/ProfileTwoFactorCard.tsx`
- `web/src/features/profile/components/ProfileTwoFactorSetupWizard.tsx`
- `web/src/features/profile/components/ProfileTwoFactorVerifyStep.tsx`
- `web/src/features/profile/components/ProfileTwoFactorActiveView.tsx`
- `web/src/features/profile/components/ProfileTwoFactorPasswordPrompt.tsx`
- `web/src/features/profile/components/ProfileTwoFactorBackupCodes.tsx`
- `web/src/features/profile/components/ProfileSecurityCard.tsx`
- `web/src/features/profile/components/BuyerProfile.tsx`

## Verification Performed
- **TypeScript Typecheck**: Ran `npm run typecheck` (`tsc --noEmit`) in `web/` — passed with 0 errors.
- **Production Build**: Ran `npm run build` in `web/` — compiled successfully, with `/profile` prerendered cleanly.
- **Line Count Limits**: Verified all 8 files are strictly $\le 200$ lines (ranging between 61 and 157 lines).
- **Runtime Dev Server Cache Remediation**: Resolved `Cannot find module './341.js'` caused by dev server/build chunk cache collisions by flushing `.next` and restarting `next dev`. Verified `http://localhost:3001/profile` responds with HTTP `200 OK`.
