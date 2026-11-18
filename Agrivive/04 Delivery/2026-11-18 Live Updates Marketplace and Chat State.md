---
title: Live Updates Marketplace and Chat State
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Builds on: [[2026-11-18 Live Updates Over WebSocket]]

## Why
The owner reported nothing was instant. Cause found: the dev database had none of the live-event triggers (checked: no `*_live_event` triggers present), so no events were ever sent. The migration was never applied. Also, the marketplace list and archive, unarchive were never wired.

## Done
- Migration `20261118120000_live_events` (not applied anywhere yet, so edited in place): new listings (`sellers_product` insert) and `conversation_participants` (archive, unarchive, block, read) now send events too.
- Hub: `watch-feed` / `unwatch-feed` commands; `marketplace.changed` goes to feed watchers on every product event; `conversation.updated` goes to the one user.
- Web: marketplace list (`useMarketplaceBrowser`), Top Deals row, and the buyer chat list reload at once (`useLiveEvent.ts`, 0.8 s settle). Seller app: `conversation.updated` refreshes the chat lists.

## Also (same day, after the owner still saw no change on localhost)
- The seller storefront (`/sellers/<id>`) and the Saved items page loaded once and never refreshed; both now reload quietly on `marketplace.changed` (`SellerStorefront.tsx`, `BuyerFavorites.tsx`).
- The API prints `[Live] Listening for database changes` when the listener is ready, so it is easy to check.
- Checked against the real dev database: 8 triggers present; a listener on the Supabase session pooler (port 5432) receives notifications; listener, hub and `/ws/live` together delivered `marketplace.changed` to a feed watcher.

## Checks
Triggers run in PGlite (in-memory Postgres) with stand-in tables: all events fire, a no-op update sends nothing, a rolled-back change sends nothing, and the file runs twice without error. `/ws/live` tested with real WebSocket clients (watch, feed, bad input, closed socket). Backend, web and mobile typecheck pass, `next build` passes. Not tested against a real Postgres LISTEN or on a phone.

## Owner must do
1. Apply `backend/drizzle/20261118120000_live_events/migration.sql` to every database (dev Supabase and production RDS). Check: `select tgname from pg_trigger where tgname like '%live_event' and not tgisinternal;` must list 8 rows, plus `sellers_product_live_insert`.
2. Deploy API then web (`dist` is rebuilt). Build a new APK for the seller side.
