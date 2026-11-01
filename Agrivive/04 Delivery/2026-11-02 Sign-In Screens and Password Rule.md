# 2026-11-02 Sign-In Screens and Password Rule

## What changed
Mobile auth screens now follow the Stitch frames; fields and sign-in logic stay ours. Frames already done earlier were not touched: Edit Profile F5/F6, Sign-in Safety F8, Setup Step 2 F7 (see [[2026-11-02 Profile Flow Redesign]]) and Weather & Holidays F6 to F8 (see [[2026-11-02 Weather and Holidays Screen Redesign]]).

- **Email code sign-in** (`app/(auth)/email-otp-login.tsx`, F1/F2): "Sign In With Email Code", inline email error, then "Check Your Email" with masked address, Change, six wide boxes, "Send a new code in 0:24", Sign In, "Use my password instead".
- **Sign-in code** (`two-factor.tsx`, F4/F5): "Enter Your Sign-in Code" with "Codes change every 30 seconds", and "Use a Backup Code" with inline error and "Each backup code works only once."
- **Verify Your Email** (`verify-email.tsx`, F3): Step 1 of 3 bar, Log out, masked address with Change, wide boxes, timer, Verify, "Can't find the email?" card. Log out and Change ask first.
- **App start** (`app/index.tsx`, F1 to F7): one loading screen (logo, spinner, caption after 1.5s, Try Again after 10s) and one problem screen for No Internet, Server Problem, Account Paused, Account Blocked, each with Try Again or Restore My Account, Log Out (with question) and masked "Signed in as". Restore opens account recovery with the email filled in.
- **Password rule, same as web**: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character, with the strength bar and checklist from `web/.../PasswordChecklist.tsx`. Used on Register, Set Password and Change Password. Sign-in still only checks the password is not empty.

## Real data only
Left out of the frames: "Sample data", the "From Mail" keyboard chip, the "Davao Agrarian Merchant verification" box, the "v1.4.2" line. The "Back in 11 hours" pill is read from the server's own sentence ("Please come back in ..."), and the problem type comes from the real HTTP status (0 or 408 offline, 403 paused or blocked, anything else server).

## Files
- New: `features/auth/passwordRules.ts`, `maskEmail.ts`, `components/PasswordChecklist`, `AuthScreenShell`, `AuthTextLink`, `AuthResendTimer`, `AuthStepBar`; `features/app-start/` (`AppLoadingScreen`, `AppProblemScreen`, `classifyStartProblem`).
- Changed: the three auth screens, `app/index.tsx`, `register.tsx`, `PasswordForm.tsx`, `account-recovery.tsx` (email prefill), `AuthContext.tsx` (adds `setupErrorStatus`), `InputComponent` (error icon), `OtpInputComponent` (`fill` option).
- No backend change. The backend still only requires 8 characters; the stronger rule is checked in the apps, like on web.

## Verification
Mobile typecheck and Android export pass. Not checked on a phone, so the layout, the 10 second retry, and the live paused/blocked messages still need the owner's test.
