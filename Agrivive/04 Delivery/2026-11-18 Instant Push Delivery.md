---
title: Instant Push Delivery
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Builds on: [[2026-11-18 Live Updates Marketplace and Chat State]]

## Why
Phone notifications took 15 to 20 seconds or more. Two delays stacked: (1) alerts were merged in a 60 second window (seller alerts: until the end of the clock minute; chat messages: 60 s after sending), set by `PUSH_SELLER_ALERT_WINDOW_SECONDS` and `PUSH_MESSAGE_WINDOW_SECONDS`; (2) pushes were only sent by a 30 second timer in the API and a 60 second one in the worker.

## Done
- Merge windows now default to 2 s (minimum 1 s), in `seller-notifications/enqueue.ts` and `notifications.outbox.enqueue-conversation.ts`. Bursts still become one push; the first alert is no longer held back. `.env.example` files updated; the root `.env` value was changed from 60 to 2.
- Migration `20261118120000_live_events` gained a trigger on `notification_outbox` (insert) that sends the due time. The API listener passes it to `jobs/nudge-push-delivery.ts`, which runs `deliverPushNotifications` at that moment (the earliest due alert wins; claiming already uses `skip locked`, so it is safe next to the 30 s and 60 s checks, which stay as the safety net). Alerts queued by the worker are heard too, because the API holds the listener.
- Push priority was already `high` for Android.

## Checks
`nudge-push-delivery` tested with a mocked delivery (not before due, earlier alert wins, already-due alert goes at once). The trigger tested in PGlite. Backend typecheck passes; `dist` rebuilt. Not measured on a phone.

## Owner must do
Re-run the migration file on the dev and production databases (safe to repeat) so the outbox trigger exists; set `PUSH_MESSAGE_WINDOW_SECONDS=2` (and optionally `PUSH_SELLER_ALERT_WINDOW_SECONDS=2`) in the VPS `.env`; deploy the API; restart. The seller app also needs the new APK for the live socket.
