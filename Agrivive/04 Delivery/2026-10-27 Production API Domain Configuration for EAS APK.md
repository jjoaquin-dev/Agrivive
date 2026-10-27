# 2026-10-27 Production API Domain Configuration for EAS APK

## Context & Objectives
Configure the mobile application and EAS build pipeline to target the production HTTPS backend (`https://api.agrivive.tech`) instead of local network development IPs, ensuring external users downloading the standalone APK have worldwide connectivity.

## Why
- Local IP addresses (`192.168.x.x`) are private subnets that only resolve within a specific local Wi-Fi router. A standalone APK built with local IPs fails with connection timeouts when installed by external users, testers, or devices on cellular data (4G/5G).
- Targeting the official HTTPS domain (`https://api.agrivive.tech`) provides seamless global connectivity, complies with Android's default HTTPS Network Security Policy, and prevents conflicts when distributing the APK.

## What Changed
1. **EAS Build Configuration**:
   - [`mobile/eas.json`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/eas.json): Configured `EXPO_PUBLIC_API_URL: "https://api.agrivive.tech"` under both `preview` (APK) and `production` (AAB) profiles.
2. **Mobile API Client Fallback**:
   - [`mobile/src/api/client.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/api/client.ts): Set `"https://api.agrivive.tech"` as the default production fallback for standalone builds, while preserving dynamic Metro host IP detection inside Expo Go.
3. **Environment Files**:
   - `mobile/.env`: Updated to `EXPO_PUBLIC_API_URL=https://api.agrivive.tech` (verified gitignored).
   - `backend/.env`: Updated `BETTER_AUTH_URL=https://api.agrivive.tech` and added `https://api.agrivive.tech` to `MOBILE_TRUSTED_ORIGINS`.

## Affected Files
- `mobile/eas.json`
- `mobile/src/api/client.ts`
- `mobile/.env`
- `backend/.env`

## Verification Performed
1. `cd mobile && bunx tsc --noEmit` -> Passed with 0 errors.
2. `cd backend && bunx tsc --noEmit` -> Passed with 0 errors.
3. `cd backend && bun build src/index.ts --outdir dist --target bun` -> Bundled 1,819 modules in 140ms.
4. Line count check: `mobile/src/api/client.ts` is 127 lines (strictly $\le 200$ lines).
