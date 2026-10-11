---
title: Expo Go Notification Compatibility
type: delivery-record
status: implemented; device push acceptance pending development build
date: 2026-10-12
---

# Expo Go Notification Compatibility

## What changed

- Removed the top-level `expo-notifications` import from `mobile/src/features/notifications/push/NotificationRegistration.tsx`.
- Added Expo execution-environment detection through `expo-constants`.
- Expo Go now skips notification handler, listener, permission, and remote-token registration so the rest of the seller app can load.
- Development builds still dynamically load `expo-notifications` and retain the Android Firebase native-token registration flow.
- `mobile/app/_layout.tsx` was not changed because it already has a valid default export. Its warning was a secondary effect of the notification module failing while the root route was loading.

## Why

Expo SDK 53 and later do not provide Android remote push-notification functionality in Expo Go. The previous top-level import caused the root layout module to fail before Expo Router could register it, which produced the misleading missing-default-export and `ErrorBoundary` errors.

## Affected path

- `mobile/src/features/notifications/push/NotificationRegistration.tsx`

## Verification

- `mobile`: `bun run typecheck` passed.
- `git diff --check` completed without whitespace errors; Git only reported existing line-ending normalization warnings in the dirty worktree.
- Expo Go manual retest is pending.
- Push-token testing requires a development build; ordinary app navigation can be retested in Expo Go.

## References

- [Expo Notifications](https://docs.expo.dev/versions/v56.0.0/sdk/notifications/)
- [Expo Constants execution environment](https://docs.expo.dev/versions/v54.0.0/sdk/constants/)
- [Expo development builds](https://docs.expo.dev/tutorial/eas/configure-development-build/)
