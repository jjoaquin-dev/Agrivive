# 2026-10-27 Mobile Google Sign-In Deep Link and OAuth URL Fix

## Context & Objectives
Resolve the mobile Google Sign-In error ("We could not start Google sign-in. Please try again.") encountered on Android devices during social authentication.

## Why
- **Deep Link Navigation & robust parsing (Postel's Law)**: Passing relative path `"/"` to `@better-auth/expo` caused `WebBrowser.openAuthSessionAsync` on Android to reject with an invalid redirect URI because mobile platforms require a concrete scheme (`agrivive://` or `exp://`).
- **Network Resolution on Physical Devices**: Hardcoding `BETTER_AUTH_URL=http://localhost:3000` prevented mobile browsers on physical devices from resolving OAuth callbacks back to the host machine over Wi-Fi.

## What Changed
1. **Mobile Social Sign-In Client**:
   - [`mobile/src/features/auth/components/GoogleSignInButton.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/auth/components/GoogleSignInButton.tsx):
     - Integrated `expo-linking` to generate dynamic app redirect URLs via `Linking.createURL("/")`. Resolves to `agrivive:///` in standalone builds and `exp://.../--/` in Expo Go.
     - Enhanced error handling to log details and report actionable connectivity guidance to users.
2. **Backend Configuration**:
   - [`backend/.env`](file:///home/jarajoaquinjara/projects/Agrivive/backend/.env):
     - Updated `BETTER_AUTH_URL=http://192.168.254.128:3000` to match the active host machine IP address.
     - Updated `MOBILE_TRUSTED_ORIGINS` to permit origins matching the active LAN IP (`192.168.254.128`).

## Affected Files
- `mobile/src/features/auth/components/GoogleSignInButton.tsx`
- `backend/.env`

## Verification Performed
1. `cd mobile && bunx tsc --noEmit` -> Passed with 0 errors.
2. `cd backend && bunx tsc --noEmit` -> Passed with 0 errors.
3. `cd backend && bun build src/index.ts --outdir dist --target bun` -> Bundled 1,819 modules successfully.
4. Line count check: `GoogleSignInButton.tsx` is 190 lines (strictly $\le 200$ lines).
