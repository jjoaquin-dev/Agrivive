# 2026-10-27 iOS Device Support and EAS Build Configuration

## Context & Objectives
Configure the mobile application, client API resolver, and EAS build pipeline to support iOS device deployment, Expo Go manual testing, and EAS cloud compilation for internal preview and production TestFlight/App Store distributions.

## Why
1. Apple strictly requires descriptive usage permission strings in `Info.plist` for native features (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSLocationWhenInUseUsageDescription`). Without these descriptions, iOS will crash upon permission request when scanning QR codes or uploading stall photos, and EAS/TestFlight will reject the build.
2. `mobile/eas.json` only contained Android build profiles. Adding iOS target settings to `preview` enables EAS to generate internal distribution `.ipa` builds for registered test devices.
3. In Expo Go when testing via cloud Tunnel mode (`exp.direct`), Metro host URI points to the cloud tunnel domain which does not forward port 3000. Prioritizing `EXPO_PUBLIC_API_URL` when configured with a non-localhost HTTPS URL ensures API calls route cleanly to `https://api.agrivive.tech`.

## What Changed
1. **iOS Permission Descriptions**:
   - [`mobile/app.json`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app.json): Added `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, and `NSLocationWhenInUseUsageDescription` inside `expo.ios.infoPlist`.
2. **EAS Build Configuration**:
   - [`mobile/eas.json`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/eas.json): Added `ios: { "simulator": false }` to the `preview` profile to enable internal device builds alongside Android APK generation.
3. **Mobile API Resolver for Tunnel & Production**:
   - [`mobile/src/api/client.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/api/client.ts): Updated `getApiBaseUrl()` to prioritize remote HTTPS `EXPO_PUBLIC_API_URL` and ignore `exp.direct` tunnel hosts for port 3000 mapping.

## Affected Files
- `mobile/app.json`
- `mobile/eas.json`
- `mobile/src/api/client.ts`

## Verification Performed
- `git diff` verified clean, exact configuration additions for iOS permissions, EAS profile targets, and tunnel URL resolver.
- Verified line count of `mobile/src/api/client.ts` is 132 lines ($\le 200$ lines).
- Preserved existing Android and web configurations.
