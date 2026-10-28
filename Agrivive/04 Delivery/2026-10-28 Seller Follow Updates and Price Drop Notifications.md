# 2026-10-28 Seller Follow Updates and Price Drop Notifications

## Context & Objectives
When a buyer follows a seller, the buyer should receive real-time notifications about that seller's updates—specifically when produce prices are lowered (price drops), when new produce is listed/published, and when out-of-stock items are restocked.

Previously:
- `seller_listing_events` had a unique index on `product_id`, restricting it strictly to a single one-time event per product.
- Listing notices were only dispatched if a separate background worker script was actively executed.
- Price drops, restocks, and subsequent produce updates were not tracked or dispatched to followers.
- The web notifications UI only had styles and types for `"seller_new_listing"` and order cancellations.

## Why
- **Recognition Over Recall (*Jakob Nielsen & Rolf Molich*)**: The notification cards explicitly show both the lowered price and the prior price (e.g. `₱35.00 (was ₱50.00)`), freeing buyers from needing to remember older market prices.
- **Von Restorff Effect (Isolation Effect) (*Hedwig von Restorff*)**: Highlighting price reductions with a dedicated `Price Drop` badge and tag icon makes savings immediately distinct within the buyer's feed.
- **Doherty Threshold (*Walter J. Doherty & Ahrvid J. Thadhani*)**: Notice generation triggers immediately when sellers save pricing or stock changes, delivering instantaneous updates to followers.
- **Miller's Law & Chunking (*George A. Miller*)**: Followed seller updates are structured inside the "Produce Drops" tab of the Notifications Hub alongside general and reservation alerts.

## What Changed
1. **Database Schema & Migration**:
   - Added `event_type` (`"new_listing"`, `"price_drop"`, `"restock"`) and `metadata` (`oldPrice`, `newPrice`, `stock`) to `seller_listing_events`.
   - Dropped the `product_id` unique index restriction and replaced it with a composite index on `(product_id, event_type)`.
   - Added PostgreSQL keep-alive and per-client error handlers in `backend/src/db/index.ts` to resist idle connection resets.
   - Added migration `20261028000500_seller_follow_updates/migration.sql`.

2. **Event Queueing & Dispatching**:
   - Upgraded `backend/src/utils/seller-listing-event/index.ts` with `queueSellerListingEvent(tx, productId, eventType, metadata)`.
   - In `seller.product.update.ts`, automatically detected lowered prices (`newPrice < oldPrice`) and queued `price_drop` events.
   - In `seller.product.price-reduction.followup.ts`, queued `price_drop` events on automatic promotion discount applications.
   - In `seller.product.stock-change.ts`, queued `restock` events when previous stock was `0` and new stock is $> 0$.
   - Integrated immediate notice dispatching (`sendSellerListingNotices().catch(...)`) on seller mutations, as well as recurring 30s background dispatching in `backend/src/index.ts`.
   - Updated `deliver-push-notifications.ts` to format push messages for price drops, restocks, and produce drops.

3. **Buyer Notice API**:
   - `buyer.notices.list.ts` and `buyer.notice.read.ts` now return `kind: "seller_price_drop" | "seller_restock" | "seller_new_listing"`, including `price` and `previousPrice`.

4. **Web Frontend (Notifications Hub & Header Dropdown)**:
   - Added `seller_price_drop` and `seller_restock` to `web/src/features/notifications/types.ts`.
   - Updated `useBuyerNotifications.ts` to filter all seller updates into the `Produce Drops` tab.
   - Updated `NotificationCardComponent.tsx` and `NotificationItemComponent.tsx` with dedicated tags, prices, and direct links to produce listings.

## Affected Files
- `backend/src/db/schema.ts`
- `backend/src/db/index.ts`
- `backend/drizzle/20261028000500_seller_follow_updates/migration.sql`
- `backend/src/utils/seller-listing-event/index.ts`
- `backend/src/jobs/deliver-push-notifications.ts`
- `backend/src/jobs/send-seller-listing-notices.ts`
- `backend/src/modules/seller/services/seller.product.update.ts`
- `backend/src/modules/seller/services/seller.product.price-reduction.followup.ts`
- `backend/src/modules/seller/services/seller.product.stock-change.ts`
- `backend/src/modules/seller/services/seller.product.create.ts`
- `backend/src/modules/notifications/services/notifications.outbox.enqueue-listing.ts`
- `backend/src/modules/buyer/services/buyer.notices.list.ts`
- `backend/src/modules/buyer/services/buyer.notice.read.ts`
- `backend/src/index.ts`
- `web/src/features/notifications/types.ts`
- `web/src/features/notifications/hooks/useBuyerNotifications.ts`
- `web/src/features/notifications/components/NotificationCardComponent.tsx`
- `web/src/features/notifications/components/NotificationItemComponent.tsx`

## Verification Performed
- **Database Migration**: Executed successfully on Supabase PostgreSQL.
- **Backend TypeScript Check**: Ran `cd backend; bunx tsc --noEmit` $\rightarrow$ 0 errors.
- **Backend Production Build**: Ran `cd backend; bun build src/index.ts --outdir dist --target bun` $\rightarrow$ Built 1822 modules successfully.
- **Web TypeScript Check**: Ran `cd web; bunx tsc --noEmit` $\rightarrow$ 0 errors.
- **File Length Limits**: Verified all 14 modified/created source files remain $\le 200$ lines.
- **Backend Health Check**: `http://localhost:3000/health/ready` responded `{"status": "ready"}`.
