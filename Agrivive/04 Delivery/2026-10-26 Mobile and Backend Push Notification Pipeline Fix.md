# 2026-10-26 Mobile and Backend Push Notification Pipeline Fix

## Overview
Resolved the issue where mobile phones were not receiving notifications when alerts occurred in the application. Identified and resolved root causes across both the mobile client (Expo Go blocking local notifications, muted sound handler, low channel importance, lack of real-time event watcher) and the backend (missing order reservation push enqueuing, lack of automated in-process delivery loop).

## What Changed

### 1. Mobile Client
- **Universal Local Notification Setup (`mobile/src/features/notifications/push/NotificationRegistration.tsx`)**:
  - Removed execution environment check preventing Expo Go from setting up notifications. Local notifications (`setNotificationHandler`, `setNotificationChannelAsync`, `requestPermissionsAsync`, and response listener) are now active across all mobile environments.
  - Enabled notification audio by setting `shouldPlaySound: true`.
  - Configured Android notification channel `"default"` with `importance: AndroidImportance.HIGH`, custom vibration pattern, and alert lights to ensure heads-up banners appear on the phone.
  - Safely wrapped remote native FCM device token retrieval to execute in standalone APK/Dev builds while logging cleanly in Expo Go.
- **Real-Time Notification Watcher (`mobile/src/features/notifications/hooks/useNotificationWatcher.ts`)**:
  - Created an active watcher hook that polls every 15 seconds while the app is active.
  - Checks for newly arrived pending reservations, unread buyer chat messages, and visibility boost prompts.
  - Immediately schedules a high-priority phone alert with sound, vibration, and deep-link navigation to the specific order or conversation screen.
- **Manual Verification Action (`mobile/src/features/notifications/utils/testPhoneAlert.ts`, `mobile/app/(app)/notifications.tsx`)**:
  - Created `sendLocalTestNotification` helper.
  - Added "Test Phone Alert 🔔" to the three-dots action menu on the Notifications screen, allowing instant manual verification that the phone rings, vibrates, and displays banners.

### 2. Backend API
- **Order Reservation Push Enqueuing (`backend/src/modules/notifications/services/notifications.outbox.enqueue-order.ts`)**:
  - Created service to enqueue order reservation push jobs for sellers into `notification_outbox`.
- **Order Checkout Integration (`backend/src/modules/buyer/services/buyer.order.create.ts`, `backend/src/modules/buyer/services/buyer.checkout.create.ts`)**:
  - Integrated `enqueueOrderNotification` into direct order creation and cart checkout so sellers receive push notifications when orders are reserved.
- **Delivery Formatter (`backend/src/jobs/deliver-push-notifications.ts`)**:
  - Added order reservation detection to format notifications as `"New Reservation Received"` with the short code, summary, and order deep-link path.
- **In-Process Delivery Loop (`backend/src/index.ts`)**:
  - Added a 30-second interval running `deliverPushNotifications()` inside the API server so outbox notifications are delivered without depending on a separate worker terminal.

## Affected Files
- `mobile/src/features/notifications/push/NotificationRegistration.tsx`
- `mobile/src/features/notifications/hooks/useNotificationWatcher.ts`
- `mobile/src/features/notifications/utils/testPhoneAlert.ts`
- `mobile/app/(app)/notifications.tsx`
- `backend/src/modules/notifications/services/notifications.outbox.enqueue-order.ts`
- `backend/src/jobs/deliver-push-notifications.ts`
- `backend/src/modules/buyer/services/buyer.order.create.ts`
- `backend/src/modules/buyer/services/buyer.checkout.create.ts`
- `backend/src/index.ts`
- `backend/dist/index.js`

## Verification
- `mobile`: `bun run typecheck` passed with 0 errors.
- `backend`: `bunx tsc --noEmit` passed with 0 errors.
- `backend`: `bun build src/index.ts --outdir dist --target bun` completed successfully (5.1 MB).
- `web`: `bun run typecheck` passed with 0 errors.
- All files strictly adhere to the $\le 200$ lines limit.
