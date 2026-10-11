# Notification Delivery and Scalability

Date: 2026-10-11

## What changed

Implemented the notification delivery foundation for the paper-aligned seller-follow and buyer-seller conversation requirements.

- Seller listing notifications remain scoped to active followers of the specific seller.
- Buyer-seller message notifications are scoped to the other participant in the conversation.
- Message notifications are aggregated into a configurable time window so a seller does not receive one push alert per message.
- Notification jobs are stored in a database outbox and delivered by the scheduled worker.
- Device registration is authenticated and supports Android, iOS, and web records in the database.
- Firebase Cloud Messaging is an optional server-side provider; local development continues to work with in-app notifications when push credentials are absent.
- Invalid push tokens are disabled after provider rejection.
- Push payloads contain identifiers and counts rather than private message text.

## Why

The paper requires seller-specific listing notification recipients. A global notification broadcast would not satisfy that requirement and would create unnecessary delivery load.

The outbox and worker separate message/listing writes from external push delivery. This allows the API to save the authoritative record quickly while the worker batches, retries, deduplicates, and aggregates push delivery.

## Recipient rules

| Event | Recipient |
| --- | --- |
| Newly announced seller listing | Active buyers following that seller when the event was created |
| Buyer message | The seller participating in that conversation |
| Seller reply | The buyer participating in that conversation |
| Order notification | The buyer and seller attached to that order |
| Trust notification | The affected account |

Followers do not receive private conversation messages merely because they follow a seller.

## Delivery policy

- Seller message jobs use `PUSH_MESSAGE_WINDOW_SECONDS`, defaulting to 60 seconds.
- A recipient, notification type, and time bucket share one deduplication key.
- The provider worker processes up to 500 device tokens per provider batch.
- Failed provider calls use exponential retry and stop after `PUSH_MAX_ATTEMPTS`.
- Invalid device tokens are disabled.
- No push credentials are stored in source code or the vault.

The 60-second aggregation window and retry values are configurable operational settings, not academic thresholds. The paper-aligned threshold is the recipient filter: the seller ID and follower relationship determine who qualifies.

## Affected files

### Backend

- `backend/src/db/schema.ts`
- `backend/drizzle/20261011180000_notification_delivery/migration.sql`
- `backend/src/index.ts`
- `backend/src/modules/notifications/index.ts`
- `backend/src/modules/notifications/index/notifications.devices.ts`
- `backend/src/modules/notifications/model/notifications.devices.ts`
- `backend/src/modules/notifications/services/notifications.device.register.ts`
- `backend/src/modules/notifications/services/notifications.device.remove.ts`
- `backend/src/modules/notifications/services/notifications.error.ts`
- `backend/src/modules/notifications/services/notifications.outbox.enqueue-conversation.ts`
- `backend/src/modules/notifications/services/notifications.outbox.enqueue-listing.ts`
- `backend/src/modules/conversations/services/conversation.message.create.ts`
- `backend/src/jobs/send-seller-listing-notices.ts`
- `backend/src/jobs/deliver-push-notifications.ts`
- `backend/src/jobs/run-scheduled.ts`
- `backend/src/utils/push-notifications/index.ts`
- `backend/package.json`
- `backend/bun.lock`
- `backend/.env.example`

### Mobile

- `mobile/app.json`
- `mobile/app/_layout.tsx`
- `mobile/package.json`
- `mobile/bun.lock`
- `mobile/src/features/notifications/api/notification-devices.ts`
- `mobile/src/features/notifications/push/NotificationRegistration.tsx`

## API for manual testing

### Register a device

```http
POST /notifications/devices
Authorization: Bearer <session-token>
Content-Type: application/json
```

```json
{
  "platform": "android",
  "pushToken": "provider-device-token",
  "notificationsEnabled": true
}
```

Expected response: `201` with the registered device ID and enabled state.

### Disable a device

```http
DELETE /notifications/devices/<device-id>
Authorization: Bearer <session-token>
```

Expected response: `200` with `{ "disabled": true }`.

## Verification

- Backend `bunx tsc --noEmit`: passed.
- Backend `bun build src/index.ts --outdir dist --target bun`: passed.
- Mobile `bunx tsc --noEmit`: passed.
- `bunx drizzle-kit migrate`: passed after retrying with the approved database connection; the configured Supabase database accepted the migration set.
- Manual follower and push-provider acceptance tests remain pending until FCM credentials and test accounts/devices are available.

## References

- [Seller Follows and Quality Completion](2026-10-06%20Seller%20Follows%20and%20Quality%20Completion.md)
- [Firebase topic messaging](https://firebase.google.com/docs/cloud-messaging/topic-messaging)
- [Firebase collapsible messages](https://firebase.google.com/docs/cloud-messaging/customize-messages/collapsible-message-types)
- [Firebase Admin SDK message sending](https://firebase.google.com/docs/cloud-messaging/send/admin-sdk)
- [Firebase token management](https://firebase.google.com/docs/cloud-messaging/manage-tokens)
- [Apple APNs notification requests](https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns)
- [Amazon SNS with Amazon SQS](https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html)
