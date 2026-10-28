# 2026-10-28 Seller Listing Events Migration and Production Sync

## Context & Objectives
Resolve recurring `DrizzleQueryError: column "event_type" does not exist` occurring during periodic 30-second notification auto-delivery intervals (`sendSellerListingNotices` & `deliverPushNotifications`) in the production environment. Synchronize the local `development` branch with `origin/main` to eliminate divergence.

## Why
1. In `origin/main`, commit `0b7eb20` added columns `event_type` and `metadata` to `seller_listing_events` alongside migration `backend/drizzle/20261028000500_seller_follow_updates`.
2. In production, later migration `20261028052448_tricky_scrambler` had already been recorded in `__drizzle_migrations`. Because Drizzle Kit tracks migrations sequentially by directory timestamp, the earlier-dated `20261028000500` migration was skipped during deployment, leaving table `seller_listing_events` without the new columns in PostgreSQL.
3. Local branch `development` had not merged `origin/main`, leaving 62 files and schema definitions out of sync.

## What Changed
1. **Repository Synchronization**:
   - Merged `origin/main` into `development` via fast-forward merge.
2. **Sequential Drizzle Migration**:
   - Created [`backend/drizzle/20261028205500_seller_listing_events_update/migration.sql`](file:///home/jarajoaquinjara/projects/Agrivive/backend/drizzle/20261028205500_seller_listing_events_update/migration.sql) with a timestamp newer than `20261028052448_tricky_scrambler`.
   - Adds columns `event_type` and `metadata` idempotently (`IF NOT EXISTS`), drops unique index on `product_id`, and adds index on `(product_id, event_type)`.
3. **Migration Package Script**:
   - Updated [`backend/package.json`](file:///home/jarajoaquinjara/projects/Agrivive/backend/package.json) to add `"db:migrate": "drizzle-kit migrate"`.
4. **Artifact Rebuild**:
   - Rebuilt [`backend/dist/index.js`](file:///home/jarajoaquinjara/projects/Agrivive/backend/dist/index.js) (5.14 MB) and [`backend/dist/worker.js`](file:///home/jarajoaquinjara/projects/Agrivive/backend/dist/worker.js) (1.1 MB).

## Affected Files
- `backend/drizzle/20261028205500_seller_listing_events_update/migration.sql`
- `backend/package.json`
- `backend/dist/index.js`
- `backend/dist/worker.js`

## Verification Performed
- Executed `bun run db:migrate` in `backend/` — applied migration `20261028205500_seller_listing_events_update` successfully (recorded ID 52).
- Executed `bun build src/index.ts --outdir dist --target bun` and `bun build src/worker.ts --outdir dist --target bun` — both bundled cleanly.
- Executed `bunx tsc --noEmit` in `backend/` — 0 errors.

## Commit Reference
- Commit: `cc8b2d8` — `add migration for seller listing events and sync main`

