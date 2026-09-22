# Seller Communication and Notifications Backend

Date: 2026-09-22

## What changed

- Audited the seller backend before starting the Milestone 2 mobile screens.
- Confirmed that order inquiries, review responses, and trust history already have seller routes.
- Added an authenticated seller notification inbox backed by the existing `trust_notices` table.
- Added unread state, cursor pagination, unread filtering, mark-one-read, and mark-all-read operations.
- Generated the Drizzle migration and snapshot for the new read state.
- Kept mobile UI changes out of this step until the backend contract is available.
- Added the seller notification screen, Home unread badge, order communication section, and trust history screen.
- Restored Reservations as a bottom-tab destination per the approved seller workflow.
- Added a seller-wide inquiry inbox and restored Reservations as a bottom-tab destination.
- Added a `start:lan` Expo script for clearing Metro cache and starting over LAN.

## Why

The seller mobile notification screen needs a seller-owned list with stable pagination and read state. The existing trust notice queue only supported delivery attempts and email sending, so it could not provide an in-app notification experience.

## Existing backend used by the future UI

- `GET /seller/orders/:id/inquiries`
- `POST /seller/inquiries/:id/reply`
- `GET /seller/orders/:id/review`
- `POST /seller/orders/:id/review-response`
- `GET /seller/trust`
- `POST /seller/trust/events/:id/correction`

## New endpoints

- `GET /seller/notifications?limit=20&cursor=<notification-id>&unreadOnly=true`
- `POST /seller/notifications/:id/read`
- `POST /seller/notifications/read-all`

All endpoints require the signed-in seller to have an active, verified account and a complete seller profile.

## Affected files

- `backend/src/db/schema.ts`
- `backend/drizzle/20260922082048_seller_notification_read_state/migration.sql`
- `backend/src/modules/seller/index.ts`
- `backend/src/modules/seller/index/seller.notifications.ts`
- `backend/src/modules/seller/model/seller.notifications.ts`
- `backend/src/modules/seller/services/seller.notifications.list.ts`
- `backend/src/modules/seller/services/seller.notification.read.ts`
- `backend/src/modules/seller/services/seller.notifications.read-all.ts`
- `backend/drizzle/20260921103629_sour_winter_soldier/migration.sql`
- `backend/src/modules/seller/model/seller.inquiry.list.ts`
- `backend/src/modules/seller/services/seller.inquiry.list.ts`
- `mobile/src/features/notifications/types.ts`
- `mobile/src/features/notifications/api/seller-notifications.ts`
- `mobile/src/features/notifications/hooks/useSellerNotifications.ts`
- `mobile/app/(app)/notifications.tsx`
- `mobile/src/features/orders/api/seller-communication.ts`
- `mobile/src/features/orders/components/SellerOrderCommunication.tsx`
- `mobile/src/features/trust/types.ts`
- `mobile/src/features/trust/api/seller-trust.ts`
- `mobile/src/features/trust/hooks/useSellerTrust.ts`
- `mobile/app/(app)/trust.tsx`
- `mobile/src/features/messages/types.ts`
- `mobile/src/features/messages/api/seller-messages.ts`
- `mobile/src/features/messages/hooks/useSellerMessages.ts`
- `mobile/src/features/messages/components/MessageCard.tsx`
- `mobile/app/(app)/messages.tsx`
- `mobile/app/(app)/(tabs)/home.tsx`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/orders/[id].tsx`
- `mobile/app/(app)/profile/index.tsx`

## Scope note

This inbox currently exposes existing order and trust notices. Low-stock and other product alerts are not yet stored in `trust_notices` because that table requires an order ID. They need a separate notification record design if they are added to the same screen.

## Verification

- `bunx tsc --noEmit` passed from `backend/`.
- `bun build src/index.ts --outdir dist --target bun` passed from `backend/`.
- `bunx drizzle-kit generate --name seller_notification_read_state` passed from `backend/`.
- `bunx drizzle-kit migrate` passed; the database now contains `trust_notices.read_at`.
- Unauthenticated smoke checks returned `401` for `/seller/notifications` and `/seller/inquiries`, confirming both routes load without the previous database `500`.
- Authenticated smoke check with an existing active seller session returned `200` for `/seller/notifications`.
- `bun run typecheck` passed from `mobile/`.
- `bunx expo export --platform android --no-bytecode` passed from `mobile/`.
- `bun build src/index.ts --outdir dist --target bun` passed after the inbox changes.
- Final mobile typecheck and export also passed after the inquiry history display correction.
- `git diff --check` reported only existing line-ending warnings.
- Postman/OpenAPI testing is still pending for seller ownership, pagination, unread filtering, repeated reads, and read-all behavior. Device testing is still pending for notification navigation, inquiry/review replies, trust correction, and the four-tab layout.

## Commit

Not committed.
