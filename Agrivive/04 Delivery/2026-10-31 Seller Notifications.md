---
title: Seller Notifications
type: delivery
date: 2026-10-31
status: code complete, manual testing pending
---

# Seller Notifications (2026-10-31)

## What changed

Every seller event is now a stored row with real read state and server-written wording. The server is the only source of phone alerts, and alerts follow a frequency policy so more events do not flood the seller.

- New tables `seller_notifications` and `seller_notification_settings`, new push type `seller_alert`. Migration `backend/drizzle/20261031120000_seller_notifications/migration.sql` was written by hand (no snapshot, like the other recent hand-written ones). **Not applied.**
- One map holds the wording, level and topic of every kind: `backend/src/utils/seller-notifications/messages.ts`. `createSellerNotification` stores the row and queues the alert.
- `GET /seller/notifications` now merges stored alerts with trust notices and returns title, body and category. New `GET` and `PATCH /seller/notification-settings`.
- The mobile app no longer polls for alerts (`useNotificationWatcher` was deleted). It has two Android channels, `orders` (rings) and `updates` (quiet), and a Phone Alerts sheet with four switches.

## Triggers

| Kind | Set off by | Phone alert |
|---|---|---|
| new_reservation | order or checkout create | Sound |
| reservation_ending | job, about 1 hour left (`jobs/send-reservation-ending-notices.ts`) | Sound |
| buyer_cancelled | buyer cancels | Sound |
| reservation_ended | order expires | Quiet |
| running_low, sold_out | stock reserve crosses the low-stock line or zero | Quiet |
| price_lowered | automatic price drop | Quiet |
| boost_posted, boost_failed | social campaign finishes fully published or fully failed | Quiet |
| pickup_done, listing_live | QR scan, product create | List only |
| Trust kinds | `queueTrustNotice` (seller recipients only) | Sound for limited, blocked and buyer-waiting; quiet for warnings; list only for corrected and inactivity |

## How often

The list always shows everything. Phone alerts of one kind inside a 60 second window (`PUSH_SELLER_ALERT_WINDOW_SECONDS`) become one alert. Quiet kinds share one "N Updates" alert. Switches: Stock and Price, Boost, Account, Night Mode (9 PM to 6 AM Asia/Manila, off by default; reservations, "ends soon" and account limits keep their sound).

## Research behind the frequency policy (2022 to 2025 only)

- Li, Haines, Flores Ruiz De Eguino, Hong, Nichols. *Alert Now or Never*. ACM TOCHI 29(5), 2022. doi:10.1145/3478868. 35 users: 56% wanted immediate, 26% silent, 6.3% delayed.
- Dekker, Baumgartner, Sumter, Ohme. *Beyond the Buzz*. Media Psychology 28(1), 2024. doi:10.1080/15213269.2024.2334025. 205 people; turning alerts off added fear of missing out.
- Lin, Su, Chen, Lee, Wang, Chang. *Pinning, Sorting, and Categorizing Notifications*. PACM IMWUT 8(3), 2024. doi:10.1145/3678579.
- Chang et al. *Not Merely Deemed as Distraction*. CHI 2023. doi:10.1145/3544548.3581146.
- Android Developers, *Notification runtime permission* (Android 13, 2022).

## Files

Backend: `src/db/schema.ts`, `src/utils/seller-notifications/` (new), `src/utils/trust/index.ts`, `src/jobs/{send-reservation-ending-notices,apply-seller-price-reductions,deliver-push-notifications,run-scheduled}.ts`, `src/utils/push-notifications/index.ts`, `src/modules/buyer/services/buyer.order.{expire,cancel,reserve}.ts`, `src/modules/seller/services/seller.{scan-order,product.create,notifications.*,notification.read,notification-settings.*}.ts`, `src/modules/seller/index/seller.notification-settings.ts`, `src/modules/integrations/services/integrations.social-publish-{dispatch,context,notify}.ts`, `src/modules/notifications/services/notifications.outbox.enqueue-{order,conversation}.ts`, `API_ENDPOINTS.md`, `README.md`.

Mobile: `src/features/notifications/` (types, hooks `useUnifiedNotifications` and `useSellerNotifications`, `utils/sellerNoticeMapper.ts` new, `utils/unifiedNotificationMappers.ts`, `components/NotificationSettingsSheet.tsx` new, `NotificationHeaderBar.tsx`, `push/NotificationRegistration.tsx`, `api/seller-notification-settings.ts` new), `app/(app)/notifications.tsx`.

## Verification

Backend `bunx tsc --noEmit`, `bunx drizzle-kit check`, both `bun build` commands. Mobile `bun run typecheck`. Not run against a database or a device. Owner still has to: apply the migration, test the endpoints in OpenAPI, and walk each trigger on a development build (push needs one, not Expo Go).

## Known limits

- Partial Boost results (some channels failed) create no notice; the campaign screen shows them.
- Stock alerts use a random dedupe key per crossing, so each crossing alerts once.
- The first reservation alert now waits up to 60 seconds to be combined with others.
- `SellerNotificationCard.tsx` was already unused and is left as is.
- Weather and holiday advisories, `low_rating`, `user_report`, produce review and seller approval are not notifications yet (no source events).
