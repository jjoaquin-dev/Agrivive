# 2026-10-28 Google OAuth Account Chooser Prompt

## Overview
Configured Google OAuth in Better Auth with `prompt: "select_account consent"` and added session clearing on the client before social login. 

Previously, clicking "Continue with Google":
1. Left any existing active session in place, which caused `/login` to automatically bounce the user to `/marketplace`.
2. Omitted the `consent` parameter, which allowed Google to silently auto-select an already authorized single account in Chrome/Edge without prompting the user.

## Changes Made
1. **`backend/src/modules/auth/index.ts`**:
   - Updated `socialProviders.google` prompt from `"select_account"` to `"select_account consent"`.
   - Google now strictly requires explicit account selection and confirmation even if only one account is currently active in the user's browser.
   - Kept file length at 97 lines (under the 200-line limit).

2. **`web/src/features/auth/components/GoogleSignInButton.tsx`**:
   - Added `await authClient.signOut().catch(() => {})` before initiating social login to clear any stale session so the user starts fresh.
   - Explicitly assigned `window.location.href = response.data.url` to guarantee immediate navigation to Google's consent dialog.
   - Kept file length at 68 lines (under the 200-line limit).

## UI/UX Principles Applied
- **Jakob's Law (Jakob Nielsen)**: Matches standard web OAuth expectations where clicking "Continue with Google" always opens Google's account picker.
- **Don't Make Me Think (Steve Krug)**: Explicit account choice avoids confusion over which profile is being logged in.
- **Error Prevention (Caroline Jarrett & Gerry Gaffney)**: Prevents accidental sign-ins to the wrong account when switching profiles.

## Affected Files
- `backend/src/modules/auth/index.ts`
- `web/src/features/auth/components/GoogleSignInButton.tsx`

## Verification Performed
- Ran `cd backend; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Ran `cd web; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Tested `POST /api/auth/sign-in/social` -> Returned Google OAuth URL with `&prompt=select_account+consent&`.
- Confirmed backend daemon running at `http://localhost:3000`.
