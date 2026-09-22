---
title: Seller Product Duplicate Guard
type: implementation-status
status: implemented-locally
reviewed: 2026-09-20
---

# Seller Product Duplicate Guard

## What changed and why

The seller product creation route previously inserted every valid request, allowing the same seller to create repeated listings with the same product name and selling unit. The route now returns `409` when that seller already has a listing whose name matches after trimming surrounding spaces and ignoring case. Different sellers and different selling units remain independent. Product names are trimmed before insertion, and whitespace-only names fail validation. A transaction-scoped PostgreSQL advisory lock serializes creation attempts for the same seller, normalized name, and selling unit.

Read-only inspection before the change found three existing duplicate groups among nine products: Pechay/pile, Potatoes/sack, and Fresh Tomatoes/kilo. One Fresh Tomatoes listing is referenced by three ordered items. Existing product rows and order references were preserved; the new guard applies to future requests through this route. A database unique index would require an explicit cleanup decision for those existing rows.

## Affected paths

- `backend/src/modules/seller/model/addproduct.model.ts`
- `backend/src/modules/seller/services/addproduct.service.ts`
- `backend/src/modules/seller/index/seller.addproduct.ts`
- `Agrivive/04 Delivery/2026-09-20 Seller Product Duplicate Guard.md`

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed.
- Isolated schema checks rejected a whitespace-only name, accepted `Fresh Tomatoes`, and accepted a representative product creation body for the manual duplicate check.
- Manual `POST /seller/addproduct` checks for `201` on a new listing and `409` on a repeat are pending the project owner's result.
- No database migration, live API request, data cleanup, or commit was performed.
