---
title: Seller Product Full CRUD
type: delivery
date: 2026-09-21
status: implemented; manual API checks pending
---

# Seller Product Full CRUD

## Why

Seller listings had create, list, update, restock, and deactivate operations, but no single-product read, REST delete, explicit restore, or audited stock correction. Restocking an archived listing also reactivated it unintentionally.

## What changed

- Added canonical `POST /seller/products`, owned product detail, archive through `DELETE`, explicit reactivation, and signed stock adjustments. Kept the existing create, deactivate, and restock URLs.
- Archive preserves product rows and order references. Restock changes stock without reactivating an archived listing. Restore requires available stock, valid price, and marketability, and begins a new listing cycle.
- Stock adjustments and restocks now use the same locked transaction and write a before/after ledger row. Product edits accept category changes, reject empty updates and prices beyond two decimal places, and preserve existing order snapshots.
- Existing normalized-name duplicate prevention still covers archived listings. Historical duplicate cleanup and a database unique index remain separate work.

## Affected paths

- `backend/src/modules/seller/index/`, `backend/src/modules/seller/model/`, and `backend/src/modules/seller/services/`
- `backend/src/db/schema.ts`, `backend/src/utils/order-amount/index.ts`
- `backend/drizzle/20260921005450_odd_mad_thinker/`
- `backend/SELLER_TRUST_MANUAL_TESTING.md`

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed.
- `bunx drizzle-kit check`: passed.
- `bunx drizzle-kit migrate`: applied the additive stock ledger migration to the configured local database.
- Isolated Elysia validation checks rejected empty PATCH bodies, attempts to patch `scalingType`, and product creation without category or selling unit. Valid price and category PATCH bodies passed.
- Anonymous route smoke checks reached the new URLs and were denied by validation or authentication; authenticated CRUD behavior remains for owner testing.
- Owner manual endpoint checks remain pending; use `backend/SELLER_TRUST_MANUAL_TESTING.md`.
