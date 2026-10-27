# 2026-10-27 Android APK Cleartext Traffic and Network Security Policy Fix

## Context & Objectives
Resolve the Android APK release/preview build network exception:
`fetch failed: java.net.UnknownServiceException: CLEARTEXT communication to 192.168.254.128 not permitted by network security policy`.

## Why
- Starting with Android 9 (API level 28), the Android OS blocks unencrypted HTTP (`http://...`) network traffic by default unless explicitly permitted in the application's network security configuration or Android manifest (`android:usesCleartextTraffic="true"`).
- In standalone APK preview builds, the app does not run under the Expo Go debug shell, requiring explicit cleartext authorization and build-time backend URL injection.

## What Changed
1. **Cleartext Traffic Configuration**:
   - [`mobile/app.json`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app.json): Added `"usesCleartextTraffic": true` under `expo-build-properties.android`. This automatically injects `android:usesCleartextTraffic="true"` into `AndroidManifest.xml` during EAS Build.
2. **EAS Build Environment URL**:
   - [`mobile/eas.json`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/eas.json): Configured `env.EXPO_PUBLIC_API_URL: "http://192.168.254.128:3000"` in the `preview` profile so standalone APKs automatically target the local backend on LAN.
3. **Local Environment Fallback**:
   - `mobile/.env`: Created local `.env` specifying `EXPO_PUBLIC_API_URL=http://192.168.254.128:3000` (verified gitignored).

## Affected Files
- `mobile/app.json`
- `mobile/eas.json`
- `mobile/.env`

## Verification Performed
1. `cd mobile && bunx tsc --noEmit` -> Passed with 0 errors.
2. Verified `mobile/.env` is ignored by Git (`git check-ignore mobile/.env` returned 0).
3. Verified `expo-build-properties` plugin schema accepts `usesCleartextTraffic`.
