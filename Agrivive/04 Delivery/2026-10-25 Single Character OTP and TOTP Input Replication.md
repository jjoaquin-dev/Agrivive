---
title: Single Character OTP and TOTP Input Replication
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-25 Mobile Login UI Enhancement]]"
  - "[[2026-10-24 Mobile Login Flow UI Replication]]"
---

# Single Character OTP and TOTP Input Replication

## What changed

1. **`mobile/src/components/OtpInputComponent.tsx`** *(New Component)*:
   - Created dedicated single-character-per-field OTP input component replicating the designs in `Verification_otp_code.png`, `Otp_code_fill.png`, and `Otp_code_error.png`.
   - Restricts each box strictly to 1 numeric character (`maxLength={1}`).
   - Automatically shifts focus to the next slot (`index + 1`) when a digit is entered.
   - Automatically retreats focus to the previous slot (`index - 1`) and clears it when backspace is pressed on an empty slot.
   - Supports pasting multi-digit clipboard strings, cleanly parsing digits and populating all slots.
   - Visual styling:
     - 48×54px squircle slots (`borderRadius: 14`, border `#E5E7EB`, background `#FFFFFF`).
     - Active focus border `#0F920F` (1.5px).
     - Filled text in `#1E1E1E` (22px bold).
     - Error state border in `#DC2626` with red error messaging.

2. **`mobile/src/components/ButtonComponent.tsx`**:
   - Updated `style` and `textStyle` prop definitions to `StyleProp<ViewStyle>` and `StyleProp<TextStyle>` to support standard array compositions without type errors.

3. **`mobile/app/(auth)/verify-email.tsx`**:
   - Replaced single continuous text input with `<OtpInputComponent length={6} />`.
   - Updated title, subtitle, and top back navigation arrow (`ArrowLeft`) matching `Verification_otp_code.png`.
   - Styled countdown timer (`Resend Code in 00:27`) and full-width pill button (`borderRadius: 999`, `#0F920F`).
   - Preserved all email verification API requests, session syncing, and profile redirect guards.

4. **`mobile/app/(auth)/two-factor.tsx`**:
   - Added `<OtpInputComponent length={6} />` for TOTP Authenticator challenge mode.
   - Preserved alphanumeric text input for emergency backup codes.
   - Aligned styling with back navigation, pill submit button, and toggle link.

5. **`mobile/app/(auth)/email-otp-login.tsx`**:
   - Integrated `<OtpInputComponent length={6} />` for step 2 ("code" verification).
   - Preserved email input and resend countdown functionality.

6. **`mobile/app/(auth)/account-recovery.tsx`**:
   - Integrated `<OtpInputComponent length={6} />` for trust account recovery code entry.

## Why

- To fulfill user requirements and Figma design references (`Verification_otp_code.png`, `Otp_code_fill.png`, `Otp_code_error.png`) by strictly enforcing 1 character per field with automatic focus navigation while preserving 100% of Better Auth verification functionality.

## Affected paths

- `mobile/src/components/OtpInputComponent.tsx`
- `mobile/src/components/ButtonComponent.tsx`
- `mobile/app/(auth)/verify-email.tsx`
- `mobile/app/(auth)/two-factor.tsx`
- `mobile/app/(auth)/email-otp-login.tsx`
- `mobile/app/(auth)/account-recovery.tsx`
- `Agrivive/04 Delivery/2026-10-25 Single Character OTP and TOTP Input Replication.md`

## Verification performed

- Ran `bunx tsc --noEmit` in `mobile/` &rarr; Passed with 0 errors.
- Verified auto-focus forward navigation and backspace retreat logic.
- Verified paste handling for multi-digit clipboard strings.
- Confirmed full backward compatibility for backup codes in `two-factor.tsx`.
