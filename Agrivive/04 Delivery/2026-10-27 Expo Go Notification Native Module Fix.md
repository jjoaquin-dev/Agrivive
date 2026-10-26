# Expo Go Native Module & Push Notification Crash Fix

**Date:** 2026-10-27  
**Type:** Bug Fix / Runtime Resilience  
**Scope:** Mobile (`mobile/src/features/notifications/`)

---

## 1. Context & User Bug Report
The user reported the following runtime error when running the mobile app:
```text
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule'] 

Call Stack
  requireNativeModule (node_modules/expo-modules-core/src/requireNativeModule.ts:20:20)
  <global> (node_modules/expo-notifications/build/TopicSubscriptionModule.android.js:2:35)
  ...
 ERROR  [Error: Uncaught (in promise, id: 0) TypeError: undefined is not a function] 

Code: NotificationRegistration.tsx
  22 |       if (cancelled) return;
  23 |
> 24 |       Notifications.setNotificationHandler({
```

## 2. Root Cause
1. In modern Expo SDK versions (SDK 52+), Expo Go dropped remote push notification support and native module registration on Android (`ExpoTopicSubscriptionModule`). Expo explicitly directs developers to use custom **Development Builds** (`npx expo run:android`) for push notification capabilities.
2. In `NotificationRegistration.tsx`, dynamic imports of `expo-notifications` were called unconditionally on Android, throwing `Cannot find native module 'ExpoTopicSubscriptionModule'`, leaving `Notifications.setNotificationHandler` undefined, and crashing the app on startup.

## 3. Key Changes Made
1. **[`mobile/src/features/notifications/utils/notificationsModule.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/notifications/utils/notificationsModule.ts)** *(New File, 32 lines)*:
   - Added `isExpoGo()` detecting `ExecutionEnvironment.StoreClient` or `Constants.appOwnership === "expo"`.
   - Added `isPushNotificationSupported()` to prevent loading native notification modules when inside Expo Go or on Web.
   - Added safe loader `getNotificationsModule()` with defensive `try...catch` and module function validation.
2. **[`mobile/src/features/notifications/push/NotificationRegistration.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/notifications/push/NotificationRegistration.tsx)** *(97 lines)*:
   - Replaced raw `import("expo-notifications")` with `getNotificationsModule()`.
   - Guarded local notification handler setup with `try...catch`.
   - Logged informative message when Expo Go is detected instead of throwing red-screen errors.
3. **[`mobile/src/features/notifications/hooks/useNotificationWatcher.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/notifications/hooks/useNotificationWatcher.ts)** *(113 lines)*:
   - Replaced raw `import("expo-notifications")` with `getNotificationsModule()`.
   - Ensured background polling for new reservations, messages, and boost prompts continues silently in Expo Go, maintaining live in-app state.
4. **[`mobile/src/features/notifications/hooks/useUnreadReminder.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/notifications/hooks/useUnreadReminder.ts)** *(75 lines)*:
   - Standardized notification scheduling using `getNotificationsModule()`.
5. **[`mobile/src/features/notifications/utils/testPhoneAlert.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/notifications/utils/testPhoneAlert.ts)** *(47 lines)*:
   - Added clear alert explaining that phone alerts require a native Development Build (`npx expo run:android`) when tapped inside Expo Go.

---

## 4. Affected Files
- `mobile/src/features/notifications/utils/notificationsModule.ts`
- `mobile/src/features/notifications/push/NotificationRegistration.tsx`
- `mobile/src/features/notifications/hooks/useNotificationWatcher.ts`
- `mobile/src/features/notifications/hooks/useUnreadReminder.ts`
- `mobile/src/features/notifications/utils/testPhoneAlert.ts`

---

## 5. Verification Performed
- `cd mobile && bunx tsc --noEmit`: 0 errors.
- `cd mobile && npx -y expo-doctor`: 21/21 checks passed.
- `cd backend && bunx tsc --noEmit && bun build`: 0 errors.
- File length check: All modified and new files strictly adhere to the $\le 200$ line limit.
