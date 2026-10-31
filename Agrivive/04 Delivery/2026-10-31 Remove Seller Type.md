---
title: Remove Seller Type
type: delivery
date: 2026-10-31
status: code complete, production migration not applied
---

# Remove Seller Type (2026-10-31)

## What changed

`seller_type` (supplier, supplier vendor, retail vendor) was removed from the database, backend, mobile and web, per the owner's decision. The dev database had already lost the column before the code was updated, which is why `/seller/notifications` returned a 500: every seller route reads the seller profile, and that query still selected `seller_type`.

A mistake during this session: the missing column was first treated as drift and re-created on the dev database. It was then dropped again to match the intended state. No data was lost in either direction (all 11 profiles had the default value).

- **Database:** new hand-written migration `backend/drizzle/20261031130000_remove_seller_type/migration.sql` drops the column and the `seller_type` type (both `IF EXISTS`). The old September migration is left untouched as history. Applied to the dev database. **Not applied to production.**
- **Backend:** removed from `db/schema.ts`, the profile create and update model and services, the marketplace products list, product get, seller get and seller map services and models, and the buyer wishlist. The `sellerType` filter on the marketplace endpoints no longer exists.
- **Mobile:** profile hero shows the shop name only, and the Classification row and its footer note are gone. The "Request Trust & Classification Review" button is now "Request Trust Review".
- **Web:** removed the Seller type filter (the filter grid now has five columns), its active-filter chip, the seller type line on the product page, the order seller card, the map popup, and the storefront header badge.

## Production order matters

1. Apply `20261031120000_seller_notifications` (additive) before deploying the new API.
2. Deploy the new API, web and mobile build.
3. Apply `20261031130000_remove_seller_type` after the deploy. If it runs first, the old API still selects the column and every seller route fails.

`drizzle-kit migrate` applies all pending migrations at once, so run the first migration's SQL on its own before the deploy (it is safe to run twice), then run `migrate` after. Back up the database first.

## Verification

Backend `bunx tsc --noEmit`, `bunx drizzle-kit check`, both `bun build` commands. Mobile `bun run typecheck`. Web `bun run typecheck` and `bun run build`. Notifications list and settings re-run against the dev database for five verified sellers. Not checked in a browser or on a device.
