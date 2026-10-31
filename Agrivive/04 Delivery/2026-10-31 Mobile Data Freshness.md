---
title: Mobile Data Freshness
type: delivery
date: 2026-10-31
status: code complete, device testing pending
---

# Mobile Data Freshness (2026-10-31)

## Decision

One rule for the seller app:
- **WebSocket** only for the open chat.
- **Short polling** only while waiting for something to finish (a pending order, a Boost post in progress).
- **Push** signals that something changed.
- **Everything else** fetches on screen focus, on app foreground, and when a matching push arrives.

No new WebSockets: the server keeps chat subscriptions in one process's memory (`backend/src/modules/conversations/services/conversation.realtime.ts`), and sockets go quiet in the background anyway. If the API ever runs as two instances, move that fan-out to Postgres `LISTEN/NOTIFY` first.

## What changed (mobile only)

- New `src/features/notifications/push/pushEvents.ts` (in-app push signal) and `src/hooks/useRefreshOnSignal.ts` (refresh on app foreground or a matching push; repeats within 1 s become one fetch).
- `NotificationRegistration.tsx` now passes pushes received while the app is open to that signal (`addNotificationReceivedListener`, checked against the SDK 58 docs).
- List hooks refresh on the signal while their screen is focused, without flashing the full loader: `useSellerNotifications`, `useSellerOrders`, `useSellerConversations`, `useSellerMessages`, `useUnifiedNotifications`.
- Tab badge (`app/(app)/(tabs)/_layout.tsx`): the 30 s timer is gone. It refreshes on open, on tab focus, on foreground, and on message pushes.
- Order detail: the pending-order poll moved to `src/features/orders/hooks/useLiveSellerOrder.ts` (the screen was over 200 lines) and now also refreshes right away when a push names the order.
- Chat: new `src/features/conversations/hooks/useConversationSocket.ts`. It reconnects at 1 s, then 2 s, up to 30 s, closes in the background, and reloads history after a reconnect so missed messages show. `openConversationSocket` now takes `{ onMessage, onConnected, onClose, onError }`. The error text is now "Live messages paused. Reconnecting…".
- Boost posting (`app/(app)/boost/[productId].tsx`): the 4 s poll skips requests while the app is in the background.
- Deleted the unused `useUnreadReminder.ts`. It would have sent a local alert every 60 s.

## Verification

`bun run typecheck` and the Android export (`expo export --platform android`, run with bun because node is not installed in this environment) both pass. Not tested on a device. Owner to check on a development build: list updates after a push, no requests while backgrounded, chat reconnect after an API restart, order detail update on buyer cancel, Boost poll pause.
