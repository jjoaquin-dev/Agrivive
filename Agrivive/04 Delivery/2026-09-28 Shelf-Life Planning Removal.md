---
title: Shelf-Life Planning Removal
type: delivery
date: 2026-09-28
status: implemented; manual mobile and API checks pending
---

# Shelf-Life Planning Removal

## What changed

- Removed the Add Product storage and shelf-life planning section from the mobile seller form.
- Removed `inventory_age_days`, `storage_temperature_c`, and `storage_notes` from the active product schema, request models, services, marketplace responses, and web product detail.
- Removed the Q10 shelf-life utility and shelf-life output from seller advisories.
- Removed shelf-life types and screens from the mobile advisories flow.
- Removed inventory age from marketplace visibility scoring and normalized the remaining score weights to posting age 40%, remaining quantity 40%, and prior listing cycles 20%. The policy version is now `visibility-v4`.
- Added and applied `backend/drizzle/20260928100000_remove_shelf_life_fields/migration.sql`.

## Why

The storage and shelf-life planning inputs could not be used reliably. Keeping them in forms, APIs, scoring, and database records created unsupported data paths and misleading seller guidance.

## Affected paths

- `mobile/src/features/inventory/components/ProductForm.tsx`
- `mobile/src/features/inventory/types.ts`
- `mobile/src/features/inventory/validation.ts`
- `mobile/src/features/advisories/types.ts`
- `mobile/app/(app)/advisories.tsx`
- `mobile/src/features/analytics/api/seller-visibility.ts`
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
- `backend/src/db/schema.ts`
- `backend/src/modules/seller/model/seller.product.create.ts`
- `backend/src/modules/seller/model/seller.product.ts`
- `backend/src/modules/seller/services/seller.product.create.ts`
- `backend/src/modules/seller/services/seller.product.update.ts`
- `backend/src/modules/seller/model/seller.advisories.ts`
- `backend/src/modules/seller/services/seller.advisories.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/src/modules/marketplace/services/marketplace.product.get.ts`
- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- `backend/src/utils/visibility-score/index.ts`
- `backend/src/utils/shelf-life/index.ts` (removed)
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `backend/drizzle/20260928100000_remove_shelf_life_fields/migration.sql`

## Verification

- Active-code reference audit: no shelf-life, storage-temperature, storage-notes, inventory-age, or `SHELF_LIFE_REFERENCES` references remain in backend, mobile, or web source.
- `cd mobile && bun run typecheck`: passed.
- `cd backend && bunx tsc --noEmit`: passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun`: passed.
- `cd backend && bunx drizzle-kit check`: passed.
- `cd web && bunx tsc --noEmit`: passed.
- Database verification: all three columns are absent from `sellers_product`, and the removal migration is recorded as applied.
- Manual Expo and API endpoint verification remains pending; historical migration files and historical delivery notes were preserved as project history.
