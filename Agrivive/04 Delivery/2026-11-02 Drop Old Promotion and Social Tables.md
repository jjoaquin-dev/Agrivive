# 2026-11-02 Drop Old Promotion and Social Tables

Follows the backend and database scan in the same day's chat and [[2026-10-31 Remove Old Social Publishing]], which kept these tables until the owner approved a drop.

## What changed
- Removed `seller_promotion_jobs`, `seller_social_campaigns` and `seller_social_campaign_posts` from `backend/src/db/schema.ts`, with their five enums (`seller_promotion_stage`, `seller_promotion_status`, `social_platform`, `social_campaign_status`, `social_campaign_post_status`). Nothing else used them.
- New migration `backend/drizzle/20261102130000_drop_old_promotion_and_social_tables/migration.sql` (hand-written, like the two before it, because the newest snapshot is older). It drops the three tables, then the five types, all with `IF EXISTS`.
- Rebuilt `backend/dist/index.js` and `dist/worker.js`.

## Why it is safe
No code reads or writes these tables. The only foreign keys point out to `user`, `sellers_product` and `listing_cycles`; the only table pointing in was `seller_social_campaign_posts`, which goes with its campaign. The web and mobile apps only use the API, so they are not affected. The Boost flow uses `seller_visibility_boosts`.

## Owner steps
1. Make sure the server runs the current backend build before migrating (an older build still used `seller_promotion_jobs`).
2. Optional backup of old rows: `pg_dump -t seller_promotion_jobs -t seller_social_campaigns -t seller_social_campaign_posts`.
3. Run `bunx drizzle-kit migrate` from `backend/` yourself. The app never applies migrations.
4. Deactivate or delete the n8n workflow from `n8n/workflows/agrivive-tiktok-status-polling.json` in your n8n: it still calls `/integrations/social-campaigns/...`, which no longer exists.

## Verification
`bunx tsc --noEmit`, `bunx drizzle-kit check` and both `bun build` runs passed. The migration has not been run.
