# 2026-10-26 Android POST_NOTIFICATIONS Permission and Push Registration Logging

## Summary
Resolved the root causes preventing Android push notifications from functioning on modern devices. Added the required `android.permission.POST_NOTIFICATIONS` permission to `mobile/app.json` and enhanced device registration logging in `mobile/src/features/notifications/push/NotificationRegistration.tsx`.

## Root Cause Analysis
1. **Device Table Empty**: Production DB check revealed 0 registered devices in `notification_devices`. The worker process was executing outbox jobs but encountering `"No enabled notification devices"`.
2. **Missing Android 13+ Runtime Permission**: On Android 13, 14, and 15 (API 33+), push notifications require the explicit `android.permission.POST_NOTIFICATIONS` manifest permission. Without it in `mobile/app.json`, the permission request fails or is blocked by the OS before an FCM token can be obtained.
3. **Expo Go Incompatibility**: Remote FCM push notifications are not supported in Expo Go (since SDK 49). Testing requires an installable standalone APK.

## What Changed
- **`mobile/app.json`**: Added `"android.permission.POST_NOTIFICATIONS"` to the Android permissions array.
- **`mobile/src/features/notifications/push/NotificationRegistration.tsx`**: Added descriptive logging for Expo Go detection, permission denial, device token acquisition, and database registration response.

## Affected Files
- `mobile/app.json`
- `mobile/src/features/notifications/push/NotificationRegistration.tsx`

## Verification Performed
- Ran `cd mobile && npx -y expo-doctor`: **21/21 checks passed. No issues detected!**
- Ran `bunx tsc --noEmit` across `backend/`, `mobile/`, and `web/`: **0 errors**.
- Verified all edited files are $\le 200$ lines.
