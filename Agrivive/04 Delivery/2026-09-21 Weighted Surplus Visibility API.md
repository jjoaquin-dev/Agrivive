---
title: Weighted Surplus Visibility API
type: delivery
date: 2026-09-21
status: implemented; manual API checks pending
---

# Weighted Surplus Visibility API

## Why

The seller score endpoint already calculated posting age, remaining quantity, inventory age, and recurrence. Recurrence only counted cycles for one product ID, so a seller's repeated listings of the same vegetable under another ID were missed.

## What changed

- Stored a normalized vegetable name on every new listing cycle. The key is the product name at publication, trimmed, collapsed to single spaces, and lowercased. Renaming a product leaves earlier cycle identities intact.
- Added a Drizzle migration for `listing_cycles.vegetable_key`. Existing cycles are backfilled from the linked product's current name, the only name available for older cycles.
- Updated `GET /seller/weightedvisibility` to count earlier seller-owned cycles with the same key in the last 30 days, including other product IDs. The endpoint returns the four factor inputs, prior cycle count, normalized key, evaluation time, and `visibility-v2`. It uses the unrounded score for tier thresholds.
- Retained eligibility checks and unscored reasons for unavailable or incomplete listings. This release exposes the seller score; it does not rank buyer listings or initiate promotions.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/drizzle/20260921011906_visibility_vegetable_key/`
- `backend/src/utils/vegetable-identity/index.ts`
- `backend/src/modules/seller/services/seller.product.create.ts`, `seller.product.reactivate.ts`, `seller.product.stock-change.ts`, `seller.product.update.ts`, `seller.weighted.surplus.visibility.ts`
- `backend/src/modules/seller/index/seller.weighted.surplus.visibility.ts`
- `backend/SELLER_TRUST_MANUAL_TESTING.md`

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed.
- `bunx drizzle-kit check`: passed.
- `bunx drizzle-kit migrate`: passed on the configured local PostgreSQL database; `vegetable_key` is present and non-nullable, migration journal ID 13.
- Authenticated Postman/OpenAPI checks remain for the owner, following `backend/SELLER_TRUST_MANUAL_TESTING.md`.

## Open decision

[[Open Decisions]] D-07 still requires stakeholder approval for the prototype weights, time references, tier thresholds, and normalized-name identity. Spelling variants and synonyms do not match in this release.
