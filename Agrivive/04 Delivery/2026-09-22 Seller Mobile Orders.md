---
title: Seller Mobile Orders
type: delivery
date: 2026-09-22
status: implemented; manual device and endpoint checks pending
---

# Seller Mobile Orders

## What changed and why

Implemented the seller order workflow for direct orders and the seller side of future batch orders. Sellers can now filter order history, open order details, scan a buyer QR code to confirm handover, and cancel an eligible pending order from the mobile app.

Each seller order remains separate. A future batch checkout can contain one order per seller, and each seller will scan its own order QR code.

## Backend changes

- Added `status=pending|completed|cancelled|expired` filtering to `GET /seller/orders`.
- Kept seller ownership, active-account, verification, expiry, and pending-state checks in the existing services.
- The existing scan transaction still changes only a valid pending seller order to `completed`.

## Mobile changes

- Added the Orders tab with status filters, cursor pagination, refresh, and retry states.
- Added order detail with items, totals, expiry, cancellation, and scan actions.
- Added the QR scanner using `expo-camera`.
- Added API and feature files under `mobile/src/features/orders/`.

## Affected paths

- `backend/src/modules/seller/model/seller.order.list.ts`
- `backend/src/modules/seller/model/seller.scan-order.ts`
- `backend/src/modules/seller/index/seller.scan-order.ts`
- `backend/src/modules/seller/services/seller.order.list.ts`
- `backend/src/utils/order-types/index.ts`
- `backend/src/utils/order-read/index.ts`
- `mobile/package.json`
- `mobile/bun.lock`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/app/(app)/(tabs)/orders.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/orders/[id].tsx`
- `mobile/app/(app)/orders/scan.tsx`
- `mobile/src/features/orders/`

## Verification

- `cd backend && bunx tsc --noEmit`: passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun`: passed.
- `cd mobile && bun run typecheck`: passed.
- `cd mobile && bunx expo export --platform android --no-bytecode`: passed.
- Manual endpoint and physical-device checks remain pending, including valid QR completion, invalid QR, expired QR, wrong-seller QR, repeated scan, and seller cancellation.
