---
title: Profile Flow Redesign
type: delivery
date: 2026-11-02
---

# Profile Flow Redesign

## What changed

The mobile Profile flow now follows the 14 Profile screens in the Stitch project "AGRIVIVE MOBILE UI". Layout, colors and spacing come from Stitch; fields and logic stay ours.

- **Profile** (`app/(app)/profile/index.tsx`): large "Profile" title with a back button, white hero card (photo, stall name, owner, Verified Seller or Not Verified Yet, "Selling on Agrivive since", outlined Edit Profile), Finish Setting Up checklist (only while setup is not done), Good Standing / Limited / Warning card, one Your Stall card (map, address, pickup note, phone, email), one grouped list with a red Log Out row. Photo sheet and log-out question are real sheets and dialogs now, not system alerts.
- **Edit Profile**: You and Your Stall sections, Change Photo button, sticky Save Changes bar, and a "Leave without saving?" question when there are unsaved changes (also on the phone back button).
- **Sign-in Safety** (`profile/security.tsx`): Password card and Sign-in Code card (On or Off). Turning it on is a 4-step flow: Password, Scan, Verify, Backup. Turning it off asks for the password inside the card.
- **Seller Setup** (`profile/setup.tsx`): "Set Up Your Stall", Step 2 of 3, Email / Stall / Password progress, sticky Save and Continue. The old label said Step 3 of 3, which did not match the real order.

## Differences from Stitch, on purpose

- Kept the editable full name (Stitch locks it); the backend lets sellers change it.
- Left out things we do not have: Stall QR, GCash payout settings, View Backup Codes, Save Draft, "How to find you", the +63 phone prefix, and the "Appeals open" text.
- Left out the "pin not moved" error: the pin always has the Davao City starting point, and adding that rule would change our validation.
- The Profile tab is not in the tab bar (the real bar is Home, Reservations, Listings, Messages, Boost; Profile opens from the picture on Home), so Profile keeps a back button.
- Removed fields that were made up or misleading: the "Profile Complete 85%" number, the Trust Score default of 100 (problem points are shown as 0 when clean, lower is better), the "Verified Since" date, and fake fallbacks (stall name, address, email, join date).
- The Password section no longer repeats at the bottom of Edit Profile; it is on Sign-in Safety.

## Files

New: `ConfirmDialogComponent`, `ProfileScreenHeader`, `ProfilePhotoSheet`, `ProfileEditPhotoRow`, `ProfileStandingCard`, `ProfileSetupChecklist`, `ProfileStallCard`, `SetupProgress`, `SignInCodeCard`, `TotpStepper`, `TotpVerifyCard`, `profileTokens.ts`, `useProfileAvatar`, `useSellerTwoFactor`.
Rewritten: `ProfileHeroCard`, `ProfileSettingsList`, `TotpScanQrCard`, `TotpBackupCodesCard`, `TotpConfirmPasswordCard`, `PasswordSecurityCard`, the four profile screens. "Update Password" is now "Change Password".
Deleted: `ProfileHeaderBar`, `ProfileVerificationCard`, `ProfileBusinessInfoCard`, `ProfileLocationCard`, `ProfileContactCard`, `TotpStatusCard`, `TotpDisableCard`.

## Verification

Mobile typecheck and the Android export passed. Not checked: a phone or emulator, the live backend, the sign-in code flow end to end. Manual test by the owner is still to be done.
