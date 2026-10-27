# 2026-10-27 iOS Device Support, Expo SDK 58 Upgrade, and EAS Build Configuration

## Context & Objectives
Configure the mobile application, client API resolver, and EAS build pipeline to support iOS device deployment, Expo Go manual testing, and EAS cloud compilation for internal preview and production TestFlight/App Store distributions. Upgrade the mobile application from Expo SDK 57 to Expo SDK 58 to ensure full compatibility with the latest Expo Go iOS release (58.0.5).

## Why
1. Apple strictly requires descriptive usage permission strings in `Info.plist` for native features (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSLocationWhenInUseUsageDescription`). Without these descriptions, iOS will crash upon permission request when scanning QR codes or uploading stall photos, and EAS/TestFlight will reject the build.
2. `mobile/eas.json` only contained Android build profiles. Adding iOS target settings to `preview` enables EAS to generate internal distribution `.ipa` builds for registered test devices.
3. In Expo Go when testing via cloud Tunnel mode (`exp.direct`), Metro host URI points to the cloud tunnel domain which does not forward port 3000. Prioritizing `EXPO_PUBLIC_API_URL` when configured with a non-localhost HTTPS URL ensures API calls route cleanly to `https://api.agrivive.tech`.
4. The user's iPhone has Expo Go version 58.0.5 (`exposdk:58.0.0`), which cannot execute SDK 57 bundles. Upgrading to SDK 58 aligns the project dependencies with the installed runtime client.

## What Changed
1. **iOS Permission Descriptions**:
   - [`mobile/app.json`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app.json): Added `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, and `NSLocationWhenInUseUsageDescription` inside `expo.ios.infoPlist`.
2. **EAS Build Configuration**:
   - [`mobile/eas.json`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/eas.json): Added `ios: { "simulator": false }` to the `preview` profile to enable internal device builds alongside Android APK generation.
3. **Mobile API Resolver for Tunnel & Production**:
   - [`mobile/src/api/client.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/api/client.ts): Updated `getApiBaseUrl()` to prioritize remote HTTPS `EXPO_PUBLIC_API_URL` and ignore `exp.direct` tunnel hosts for port 3000 mapping.
4. **Expo SDK 58 Upgrade**:
   - [`mobile/package.json`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/package.json): Upgraded `expo` to `~58.0.19`, `react` to `19.3.0`, `react-native` to `0.88.0`, and all matching Expo native modules to SDK 58 (`expo-camera`, `expo-location`, `expo-router`, etc.).
5. **Mobile CI & Type System Fixes for Expo SDK 58 / React 19**:
   - [`mobile/bun.lock`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/bun.lock): Synchronized lockfile to prevent `bun install --frozen-lockfile` CI failure.
   - [`mobile/app/(app)/(tabs)/messages.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/(app)/(tabs)/messages.tsx), [`mobile/app/(app)/activity.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/(app)/activity.tsx), [`mobile/app/(app)/boosts.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/(app)/boosts.tsx): Replaced `: null` with `: undefined` for `ListFooterComponent` and `ListEmptyComponent` to adhere to React 19 / RN 0.88 prop types.
   - [`mobile/app/(app)/profile/setup.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/(app)/profile/setup.tsx): Updated `scrollViewRef` to `React.ElementRef<typeof ScrollView>` for correct `.scrollTo()` instance access.
   - [`mobile/src/components/OtpInputComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/components/OtpInputComponent.tsx): Updated event handler to `TextInputKeyPressEvent` and `inputRefs` to `React.ElementRef<typeof TextInput>`.
   - [`mobile/src/components/map-picker/MapPickerMap.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/components/map-picker/MapPickerMap.tsx): Wrapped `WebView` in `LeafletWebView` with explicit prop typing to prevent `react-native-webview` 14.0.1 `P = undefined` props collapsing to `never`.

## Affected Files
- `mobile/app.json`
- `mobile/eas.json`
- `mobile/src/api/client.ts`
- `mobile/package.json`
- `mobile/bun.lock`
- `mobile/app/(app)/(tabs)/messages.tsx`
- `mobile/app/(app)/activity.tsx`
- `mobile/app/(app)/boosts.tsx`
- `mobile/app/(app)/profile/setup.tsx`
- `mobile/src/components/OtpInputComponent.tsx`
- `mobile/src/components/map-picker/MapPickerMap.tsx`

## Verification Performed
- `git diff` verified clean, exact configuration additions for iOS permissions, EAS profile targets, and tunnel URL resolver.
- Verified line count of `mobile/src/api/client.ts` is 132 lines ($\le 200$ lines).
- Executed `bun install` in `mobile/` to resolve and link SDK 58 dependencies.
- Executed `bun install --frozen-lockfile` in `mobile/` — verified 0 errors.
- Executed `bun run typecheck` (`tsc --noEmit`) in `mobile/` — passed with 0 errors.
- Executed `node ./node_modules/expo/bin/cli export --platform android` in `mobile/` — Android bundle exported successfully.

## Commit Reference
- Commit: `bf028cba`
- Message: `fix mobile CI lockfile and React 19 type errors`
