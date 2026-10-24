---
title: Allow Repeat Product Listings for Produce Batches
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-09-20 Seller Product Duplicate Guard]]"
  - "[[02 Product/Feature Map]]"
  - "[[05 Enhancements/04 Seller Operations and Multi-Channel Promotion]]"
---

# Allow Repeat Product Listings for Produce Batches

## What changed

1. **`backend/src/modules/seller/services/seller.product.create.ts`**:
   - Removed the duplicate product check and advisory lock that previously rejected repeated listings with the same vegetable name and selling unit.
   - Sellers can now list multiple distinct batches of the same vegetable (e.g. separate harvest cycles, varying conditions, or restocks) without receiving a `409 Conflict`.
   - Each listing continues to receive its own distinct UUID `id`, `listing_cycles` entry, and timestamped lifecycle.

2. **`backend/src/modules/seller/index/seller.product.create.ts`**:
   - Cleaned up the `/products` and `/addproduct` HTTP handlers to remove the 409 duplicate response branch, returning `201 Created` with the newly created product.

3. **`backend/src/modules/seller/services/seller.product.update.ts`**:
   - Removed the duplicate name guard on product updates, allowing sellers to rename or modify listings without conflicting with existing batches of the same vegetable.

4. **`mobile/src/features/inventory/components/ProductForm.tsx`**:
   - Simplified the error handler on create and update submissions to present clean general error notifications rather than assuming a 409 duplicate name conflict.

## Why

In agricultural and surplus market realities, vegetable sellers regularly harvest, acquire, or restock new batches of the same produce (e.g., "Kamatis", "Pechay", "Talong") across different days or selling units. Restricting sellers to a unique product name per unit blocked them from managing separate batches or relisting seasonal harvests.

## Affected paths

- `backend/src/modules/seller/services/seller.product.create.ts`
- `backend/src/modules/seller/index/seller.product.create.ts`
- `backend/src/modules/seller/services/seller.product.update.ts`
- `mobile/src/features/inventory/components/ProductForm.tsx`
- `Agrivive/04 Delivery/2026-10-25 Allow Repeat Product Listings for Produce Batches.md`

## Verification performed

1. **Mobile verification**:
   - Ran `bunx tsc --noEmit --project mobile/tsconfig.json` → Passed with 0 errors.
2. **Backend verification**:
   - Ran `bun install --frozen-lockfile` in `backend/` → Successfully synced all dependencies.
   - Ran `bunx tsc --noEmit` in `backend/` → Passed with 0 errors.
   - Ran `bun build src/index.ts --outdir dist --target bun` in `backend/` → Bundled 1704 modules successfully into `dist/index.js`.
3. **File length audit**:
   - All modified files remain strictly under 200 lines:
     - `seller.product.create.ts`: 76 lines
     - `index/seller.product.create.ts`: 32 lines
     - `seller.product.update.ts`: 92 lines
     - `ProductForm.tsx`: 130 lines
