---
title: Mobile Splash Screen, App Icon, and App Name Alignment
date: 2026-10-20
type: delivery
status: verified
related_documents:
  - "[[2026-10-20 Aging Produce Stock Guard, Instagram Permalink Fix, and Visibility Guide Priority Ordering]]"
  - "[[2026-10-13 Mobile EAS Release Configuration]]"
---

# Mobile Splash Screen, App Icon, and App Name Alignment

## What changed

1. **App Title / Name Alignment**:
   - In `mobile/app.json`, updated `"name": "Agrivive Seller"` to `"name": "Agrivive"`, aligning the mobile app's operating system label with the universal product name.

2. **Splash Screen Configuration & Asset Integration**:
   - In `mobile/app.json`, added explicit `"splash"` configuration:
     - `image`: `./assets/splash-icon.png`
     - `resizeMode`: `"contain"`
     - `backgroundColor`: `"#F8F6F1"` (Agrivive Warm Cream background token).
   - Configured the `expo-splash-screen` plugin options with matching image (`imageWidth: 240`) and Warm Cream background (`#F8F6F1`), ensuring a smooth transition without flicker into root views rendered by `mobile/app/_layout.tsx`.

3. **High-Resolution Brand Asset Generation**:
   - Replaced all default Expo placeholders in `mobile/assets/` using the official Agrivive identity:
     - `mobile/assets/icon.png`: 1024×1024 app icon featuring the Agrivive leaf sprout mark centered on a solid Warm Cream (`#F8F6F1`) canvas with safe zone margins for iOS squircle and Android masking.
     - `mobile/assets/splash-icon.png`: 1024×1024 high-resolution splash image featuring the vertical Agrivive brand logo (centered green sprout mark + "Agrivive" brand typography) on transparent background.
     - `mobile/assets/android-icon-foreground.png`: 512×512 adaptive icon foreground containing the Agrivive sprout mark centered strictly within the Android 66% safe zone diameter.
     - `mobile/assets/android-icon-background.png`: 512×512 solid `#F8F6F1` background.
     - `mobile/assets/android-icon-monochrome.png`: 432×432 monochrome silhouette for Android 13+ Material You themed icons.
     - `mobile/assets/favicon.png`: 48×48 web favicon featuring the Agrivive sprout mark.
   - Updated `android.adaptiveIcon.backgroundColor` in `mobile/app.json` from Expo blue (`#E6F4FE`) to `#F8F6F1`.

## Why

- The mobile app previously inherited Expo default templates which displayed the Expo logo during boot and used "Agrivive Seller" as the title.
- Sellers and users expect a consistent brand experience with the Agrivive leaf sprout icon as their launcher app icon, the official logo on the launch splash screen, and a clean "Agrivive" title under the icon.

## Affected Files

- `mobile/app.json`
- `mobile/assets/icon.png`
- `mobile/assets/splash-icon.png`
- `mobile/assets/android-icon-foreground.png`
- `mobile/assets/android-icon-background.png`
- `mobile/assets/android-icon-monochrome.png`
- `mobile/assets/favicon.png`

## Verification Performed

- Verified image dimensions, aspect ratios, and pixel channels using `System.Drawing` inspection:
  - `icon.png`: 1024×1024 (solid `#F8F6F1` background, 640px centered sprout).
  - `splash-icon.png`: 1024×1024 (transparent background, 720px centered full logo).
  - `android-icon-foreground.png`: 512×512 (transparent, 280px centered safe zone).
  - `android-icon-background.png`: 512×512 (solid `#F8F6F1`).
  - `android-icon-monochrome.png`: 432×432.
  - `favicon.png`: 48×48.
- Verified TypeScript compilation: `bun run typecheck` in `mobile/` passed with exit code 0 and zero errors.
- Verified line count of `mobile/app.json` (65 lines $\le$ 200 lines).
