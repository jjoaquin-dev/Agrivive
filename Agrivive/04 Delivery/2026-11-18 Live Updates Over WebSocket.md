---
title: Live Updates Over WebSocket
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## Why
Only chat was live. Reservation status, new reservations, stock and price, and notices waited for a 10 to 30 second poll or a push.

## Design
- Database triggers (migration `20261118120000_live_events`) call `pg_notify('agrivive_live')` on: any insert or update of `orders`; `sellers_product` stock, price, active or marketable change; new `seller_notifications`, `trust_notices`, `buyer_listing_notices`; new `conversation_messages`. The message is sent only when the transaction commits, and it covers changes made by the worker as well as the API.
- The API keeps one connection listening (`utils/live-events/listener.ts`, reconnects with a growing wait) and passes each message to the hub (`utils/live-events/index.ts`): user channels and product channels.
- `GET /ws/live` (`modules/notifications/index/notifications.live.ts`): sign-in optional; a visitor can watch up to 20 products. Events carry ids only, so access is still checked by the REST routes.
- Fixed a socket leak: Elysia makes a new wrapper for each socket event, so the chat socket (`/ws/conversations`) never removed closed sockets. Both sockets now key on `ws.raw`.

## Web
- `src/lib/liveEvents.ts`: one shared socket per tab (reconnects 1 s to 30 s, closes in a hidden tab, stays 5 s between pages, reopens once a minute if a signed-in page got a visitor socket).
- `src/lib/usePolling.ts`: new `live` option. A matching event reloads at once; while the socket is open the poll is only a 60 s fallback; a reconnect or a drop reloads once.
- Wired: reservation page (`OrderDetail`), My Orders (`useBuyerOrders`), notices (`useBuyerNotifications`), product page stock and price (`ProductDetail`). The listings feed stays on its 30 s poll on purpose.

## Seller app
- `src/features/notifications/live/`: socket (cookie and bearer, like chat), open only while signed in and on screen. Each event is sent through `emitPushReceived`, so every screen that refreshes on a push now refreshes at once: order → `seller_alert` with the order id; notice → `seller_alert` (+ `seller_message` for chat or question kinds); message → `seller_message`; product → new `seller_stock`. After a reconnect all lists reload once.
- Mounted in `app/(app)/_layout.tsx`. Open reservation polling (`useLiveSellerOrder`) drops to 60 s while live. Listings (`useInventory`, also the Home stock cards) reload on `seller_stock` while on screen, unless the seller loaded more than 20.

## Checks
Backend, web and mobile typecheck pass; `next build` passes; hub tested with fake sockets (each user gets only their events, visitors only watched products, closed sockets get nothing). Not tested end to end against a database or on a phone.

## Owner must do
Apply the migration (`bunx drizzle-kit migrate`), deploy API then web, build a new APK. The listener needs a session-mode connection (port 5432); the Supabase session pooler's 15-connection limit now includes one more connection from the API.
