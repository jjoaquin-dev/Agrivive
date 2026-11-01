---
title: Mobile Extra Sign-In Screens Redesign in Google Stitch
date: 2026-11-02
status: completed
tags:
  - mobile
  - auth
  - stitch
  - ui-redesign
  - anti-slop
---

# Mobile Extra Sign-In Screens Redesign in Google Stitch

High-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`, device: Mobile 390×844) covering the complete suite of **Extra Sign-In Screens** for the Agrivive Seller App (Expo / React Native):
1. **Sign In With Email Code** (Step 1 & Step 2)
2. **Verify Your Email** (Signed-in first-time onboarding step)
3. **Sign-In Code (Two-Step)** (Authenticator mode & Backup code mode)
4. **Restore Blocked Account** (Step 1 request, Step 2 code, Peak-End success card)
5. **Make a Password** (Signed-in required setup step)
6. **Login Blocked Account Context Frame** (Direct recovery affordance)
7. **Reset Password (Proposed — Needs Backend)** (Complete 4-stage flow)

All screens strictly follow the Agrivive Mobile Design System tokens (`#0F920F` Fresh Harvest Green, `#DC2626` Error, `#16A34A` Success, `#C97850` Terracotta, Inter typography, 48px min touch targets, 48×54px OTP inputs) and plain words a five-year-old can follow.

---

## 1. Google Stitch Mockup Registry

| Frame | Screen Title | Stitch Screen ID / Resource | Description & State |
| :--- | :--- | :--- | :--- |
| **F1** | `Agrivive Seller App - Sign In With Email Code (Frame F1)` | `projects/11184471743007910085/screens/9d06c7b3248c45dd9c30f20c157daf21` | Step 1: Email entry with inline validation error (`nena.invalid@`), 48px Send Code CTA, 44px "Use my password instead" link. |
| **F2** | `Agrivive Seller App - Sign In With Email Code (Frame F2 Step 2)` | `projects/11184471743007910085/screens/16af842504b345d1879537c709926bc5` | Step 2: "Check Your Email", masked email (`n•••n@example.com · Change`), 6 OTP boxes (`4 8 1 _ _ _`), countdown (`0:24`), disabled Sign In CTA, bottom keyboard with QuickType "From Mail: 481-270" auto-fill bar. |
| **F3** | `Agrivive Seller App - Verify Your Email (F3)` | `projects/11184471743007910085/screens/5bddcae0df2e4bdba57ad67f1efcac9b` | First-time step (signed in): "Log out" top-right, Step 1 of 3 progress dots (`Email ●, Stall ○, Password ○`), 6 OTP boxes in red error border (`4 8 1 2 7 0`), inline error under boxes, countdown, solid green [Verify] CTA. |
| **F4** | `Agrivive Seller App - Sign-in Code Authenticator Mode (Frame F4)` | `projects/11184471743007910085/screens/eb871ef520b447b59345a3de62be0166` | Two-step authentication: 6 OTP boxes (`4 8 1 _ _ _`), "Codes change every 30 seconds." caption, disabled Sign In CTA, 44px link "Lost your phone? Use a backup code". |
| **F5** | `Agrivive Seller App - Sign-In Code (Frame F5 Backup Mode with Inline Error)` | `projects/11184471743007910085/screens/84117f10b9584cf699682b81dbc12716` | Backup mode: Single code field with placeholder `4k9t-2mxq`, typed value `4k9t-9999`, red error border, inline error "That backup code didn't work or was already used.", caption "Each backup code works only once.", [Sign In] CTA, 44px link "Use my authenticator app instead". |
| **F6** | `Agrivive Seller App - Restore Blocked Account (Frame F6 Step 1)` | `projects/11184471743007910085/screens/bb1dd80c4df54f4c8c274a5257d4d398` | Step 1: "Restore Your Account", subtitle for blocked/limited accounts, email field with `nena.dizon@example.com`, [Send Code] CTA, neutral notice box directly below button: "If this account is blocked or limited, a code is on its way." |
| **F7** | `Agrivive Seller App - Restore Account Success (Frame F7)` | `projects/11184471743007910085/screens/8b7f409c0d974af89a2a4bd4aaf00e22` | Peak-End celebration card: 72×72 green checkmark badge, "Your account is back." headline, "Sign in again to keep selling.", restoration summary card (`Active` status), single primary green [Sign In] CTA. |
| **F8** | `Agrivive Seller App - Make a Password (Frame F8)` | `projects/11184471743007910085/screens/c9686a81d539491c9aebb543cc279d4f` | Step 3 of 3 (signed in): "Log out" top-right, progress dots (`Email ✓, Stall ✓, Password ●`), New Password (`••••••••`) & Confirm Password (`••••••` error), inline error under confirm field, live checklist (8+ chars ✓, match ○), disabled [Save Password] CTA. |
| **F9** | `Agrivive Seller App - Login Blocked Account Error (Frame F9)` | `projects/11184471743007910085/screens/546c3d4d780d4068a616866d7f22d592` | Context frame: Mobile login showing prominent red error card "Your account is blocked. If you think this was a mistake..." with direct underlined link "Restore my account →" leading to F6. |
| **F10** | `Agrivive Seller App - Reset Password (Frame F10)` | `projects/11184471743007910085/screens/e0622db1307e4f099d9c62c6c49cbd90` | Proposed (needs backend): Terracotta badge "Proposed — needs backend", 4-step sequence (Email → Code → New Password → Success callout), verified email card, live checklist, [Save New Password] CTA, success callout preview. |

---

## 2. Element-to-Codebase Mapping Table

| Screen & Element | Target Code Action / Field | Existing Code File & Lines | Psychological UX Law & Principle |
| :--- | :--- | :--- | :--- |
| **Header (All Screens)** | Native header hidden; single 48px header with 44×44 Back or "Log out" link | `mobile/app/(auth)/_layout.tsx:24-58` | **Jakob's Law** & **Fitts's Law**: Single predictable back pattern; 44×44 touch target prevents mis-taps. |
| **F1 Email Input & Error** | Email validation; inline error below field; primary [Send Code] CTA | `mobile/app/(auth)/email-otp-login.tsx:38-67` | **Law of Proximity** (Gestalt) & **Error Prevention** (Jarrett & Gaffney): Error placed directly under input. |
| **F1 / F2 Password Link** | "Use my password instead" 44px text link | `mobile/app/(auth)/email-otp-login.tsx:146` | **Recognition Over Recall** (Nielsen & Molich): Accessible fallback for sellers with existing passwords. |
| **F2 Masked Email & Change** | Subtitle masked email with inline editable tap link | `mobile/app/(auth)/email-otp-login.tsx:59-62` | **Visibility of System Status** (Jakob Nielsen): Shows destination without disclosing full PII. |
| **F2 OTP Auto-Fill & Keypad** | `oneTimeCode` input parsing, QuickType chip, 6 boxes 48×54 | `mobile/src/components/OtpInputComponent.tsx:38-44` | **Tesler's Law (Conservation of Complexity)**: The app absorbs the friction of reading email codes. |
| **F3 "Log out" Navigation** | Replace Back arrow with "Log out" text link at top-right | `mobile/app/(auth)/verify-email.tsx:138-144` | **Error Prevention**: Sellers already authenticated must not accidentally drop to Login in unverified state. |
| **F3 / F8 Progress Indicator** | Step progress label and 3-stage dots derived from `setup.nextStep` | `mobile/app/(auth)/verify-email.tsx:119-144` & `password-setup.tsx:17-27` | **Goal-Gradient Effect** (Clark L. Hull): Multi-step registration accelerates motivation as steps finish. |
| **F3 Inline OTP Error** | Error message directly beneath 6 boxes turning red `#DC2626` | `mobile/src/components/OtpInputComponent.tsx:145-151` | **Law of Proximity**: Error resides adjacent to the faulty inputs; no distant top banner. |
| **F4 Authenticator Hints** | Hint copy referencing "Agrivive" and 30-second cadence | `mobile/app/(auth)/two-factor.tsx:128-137` | **Recognition Over Recall**: Tells seller what label to search for in Google Authenticator. |
| **F5 Backup Code Error** | Single text field with format placeholder `4k9t-2mxq` and inline error | `mobile/app/(auth)/two-factor.tsx:146-170` | **Postel's Law (Robustness Principle)**: Forgiving lowercase input parsing with single-use guarantee caption. |
| **F6 Neutral Notice Box** | Neutral feedback container under button: "If this account is blocked..." | `mobile/app/(auth)/account-recovery.tsx:38-39` & `backend/src/modules/trust/services/trust.recovery.ts:26-36` | **Visibility of System Status** & **Security Obfuscation**: Prevents account enumeration while keeping seller informed. |
| **F7 Success Card** | Celebratory badge (72×72), "Your account is back.", single [Sign In] CTA | `mobile/app/(auth)/account-recovery.tsx:55-64` | **Peak-End Rule** (Kahneman & Fredrickson) & **Von Restorff Effect**: High-contrast celebratory completion. |
| **F8 Live Password Checklist** | Dynamic 2-item checklist: 8+ characters, passwords match | `mobile/src/features/auth/components/PasswordForm.tsx:27-41` | **Doherty Threshold** & **Error Prevention**: Immediate tactile feedback before submission. |
| **F9 Login Blocked Error** | Red error card with direct underlined "Restore my account →" link | `mobile/app/(auth)/login.tsx:96-100` | **Don't Make Me Think** (Steve Krug): Contextual error routes seller directly to recovery without guessing. |
| **F10 Reset Password** | 4-step password reset flow (Email → Code → New Password → Sign In) | *New Endpoint Needed* (`backend/src/modules/auth/index.ts`) | **Jakob's Law**: Standard password reset decoupled from trust account recovery. |

---

## 3. Copy Changes (Old → New)

All user-facing copy uses short, familiar words a five-year-old can follow:

| Context / Screen | Old Codebase Copy | New Stitch Redesign Copy | Plain Language Reason |
| :--- | :--- | :--- | :--- |
| **Screen A Title** | `"Sign In With Code"` / `"Sign In With Email Code"` | `"Sign In With Email Code"` | Consistent, unambiguous screen title matching navigation triggers. |
| **Screen A / B Subtitle** | `"Verification Code"` | `"Check Your Email"` (A) / `"Verify Your Email"` (B) | Clear, direct action verb instead of passive technical jargon. |
| **Screen A / B Hint** | `"Enter The 6-Digit Code We Sent To"` | `"We sent a code to"` | Short, conversational, five-year-old readable. |
| **Resend Countdown** | `"Resend Code in 00:30"` | `"Send a new code in 0:30"` | Active words (`"Send a new code"`) instead of technical `"Resend"`. |
| **Screen C Title** | `"Security Verification"` | `"Enter Your Sign-in Code"` | Specific and immediately self-evident without abstract jargon. |
| **Screen C App Hint** | `"Authenticator App (TOTP)"` | `"authenticator app (like Google Authenticator)"` | Plain words with concrete mental models. |
| **Screen C Fallback** | `"Cannot access authenticator? Use a backup code"` | `"Lost your phone? Use a backup code"` | Identifies the real-world human problem directly. |
| **Screen C Backup Title** | `"Backup Recovery"` | `"Use a Backup Code"` | Action-oriented title. |
| **Screen D Title** | `"Restore your account"` | `"Restore Your Account"` | Standardized Title Case. |
| **Screen D Subtitle** | `"Admins do not restore accounts manually."` | *Removed entirely* | Negative bureaucratic copy removed; replaced with helpful proof instructions. |
| **Screen E Title** | `"Set your Agrivive password"` | `"Make a Password"` | Simple, friendly verb (`"Make"`) familiar to all farmers and vendors. |
| **Screen E Subtitle** | `"Your Google account is connected…"` | `"So you can also sign in with your email and password."` (Google note only if Google account) | Accurate conditionality; non-Google accounts aren't misled. |
| **Password Fallback** | `"Sign in with password instead"` | `"Use my password instead"` | Conversational first-person phrasing. |

---

## 4. Behavior Changes (Code Implementation Requirements)

When code implementation begins, the following tasks must be carried out:
1. **Hide Native Stack Headers**:
   - In `mobile/app/(auth)/_layout.tsx`, set `headerShown: false` on `email-otp-login`, `verify-email`, `two-factor`, and `account-recovery` to prevent duplicate headers.
2. **Decouple "Forgot Password" from Account Recovery**:
   - In `mobile/app/(auth)/login.tsx:157`, stop routing `"Forgot password?"` to `account-recovery`.
   - Re-route `"Forgot password?"` to the proposed Reset Password flow once built.
   - On blocked account login failures (`isActive: false` or trust action blocked), render the dedicated error card with `"Restore my account"` linking to `/(auth)/account-recovery`.
3. **Relocate Errors Under Inputs (Proximity Rule)**:
   - Remove detached top error boxes in `email-otp-login.tsx`, `two-factor.tsx`, and `account-recovery.tsx`.
   - Place all validation messages directly below the OTP boxes or the affected input fields.
4. **OTP Input Component Enhancements**:
   - In `OtpInputComponent.tsx`, add `textContentType="oneTimeCode"` and `autoComplete="one-time-code"` for iOS/Android keyboard auto-fill.
   - Replace hardcoded `#1E1E1E` box colors with token-derived `#111827` and `#E5E7EB`.
   - Update `account-recovery.tsx` to strictly require 6 digits (`cleanOtp.length === 6`).
5. **Signed-in First-Time Screen Navigation**:
   - On `verify-email.tsx` and `password-setup.tsx`, replace the back button with a top-right `"Log out"` action that terminates the session, preventing corrupted onboarding state.
   - Integrate dynamic 3-dot step indicators derived from `setup.nextStep`.
6. **Backend Decoupling (Reset Password vs. Trust Recovery)**:
   - In `backend/src/modules/auth/index.ts`, enable Better Auth's `resetPassword` OTP route so password resets do not share the `"forget-password"` type with trust account restoration.
   - Keep trust recovery restricted exclusively to blocked/limited accounts in `backend/src/modules/trust/services/trust.recovery.ts`.

---

## 5. Verification & Codebase Integrity

- **Better Auth Code Lifetime**: Verified in `backend/src/modules/auth/index.ts` and `backend/src/utils/email/index.ts`. No explicit duration override is provided in code, so copy strictly adheres to `"Codes expire soon."` without guessing minutes.
- **Mobile TypeScript Verification**:
  ```bash
  cd mobile && bunx tsc --noEmit
  ```
  Result: Passed with `0` type errors.
- **Stitch Design System Alignment**:
  All 10 frames generated under active project `projects/11184471743007910085` using the verified `Lush Agro-Commerce` design system (`assets/f47dfb9bbc764f6b9ea16ff85a7b3e78`).
