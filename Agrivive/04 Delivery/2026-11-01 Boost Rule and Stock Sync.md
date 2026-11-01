---
title: Boost Rule and Stock Sync
type: delivery
date: 2026-11-01
---

# Boost Rule and Stock Sync

## What changed

- **Boost needs Priority Boost (paper).** Only listings with an AHP-TOPSIS score of 0.60 or higher can start a boost. `POST /seller/products/:id/boost` returns 409 with a plain message for any other tier. `GET /seller/products/:id/boost` returns `canBoost: false` with headline "Priority Boost Needed" or "Not Ranked Yet". A boost already started for the current cycle (for example a failed one) can still be retried. Owner chose this strict rule over showing the tier only.
- **Official tier names in the seller app.** The Boost list badge says Priority Boost, Standard Exposure and Basic/Hold (before: Top spot, Middle, Lower).
- **Original stock stays in sync.** "Add More" on a running listing now raises the current cycle's original stock too (`seller.product.stock-change.cycle.ts`). Migration `20261101190000_sync_cycle_original_qty` repairs older listings by copying the larger product value to the latest cycle only. Applied to the dev database on 2026-11-01 (Mangga's cycle 20 became 25; older cycles untouched). Not yet applied on the VPS.
- Boost ranking reads the product's original stock (see [[2026-11-01 Boost Amount Left Matches Feed]]).

## Files

`backend/src/utils/visibility-ranking/boost-gate.ts`, `boost-gate.decision.ts` (+ test), `seller.visibility-boost.queue.ts`, `seller.visibility-boost.read.ts`, `seller.product.stock-change.ts`, `seller.product.stock-change.cycle.ts`, `backend/drizzle/20261101190000_sync_cycle_original_qty/migration.sql`, `backend/API_ENDPOINTS.md`, `mobile/src/features/marketing/components/VisibilityBreakdownCard.tsx`.

## Verification

- `bun test` 33 passed, backend and mobile typecheck clean, API and worker build, `drizzle-kit check` clean.
- Dev database, read-only: 3 of 25 products can boost, Mangga is blocked with "This listing is Basic/Hold right now".
- Migration and the Add More helper ran inside a rolled-back transaction: Mangga cycle 20 became 25 by the migration and 30 after a 5 add; nothing saved.
- Mobile badge text not checked on a device. The longer tier names may crowd the product name.

## Effect to expect

Boost is relative: with AHP-TOPSIS live only a few listings are Priority Boost at a time (a lone listing scores 0.50), so most sellers will see "Priority Boost Needed".

## Deploy

Rebuild and recreate the API. Run the migration when ready: `sudo docker compose run --rm api bunx drizzle-kit migrate` (applies every pending migration).
