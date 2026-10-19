---
title: Partial Pickup & Stock Auto-Restoration (D-05)
date: 2026-10-18
type: delivery
status: implemented
---

# Partial Pickup & Stock Auto-Restoration (D-05)

## What changed

1. **Backend Partial Pickup Reconciliation**:
   - Updated `backend/src/modules/seller/model/seller.scan-order.ts` to define `scanOrderItemAdjustment` and added optional `items` array to `scanOrderBody`.
   - Updated `backend/src/modules/seller/services/seller.scan-order.ts` to execute atomic handover reconciliation inside `db.transaction`:
     - Checks and enforces $0 \le \text{dispensedQuantity} \le \text{reservedQuantity}$.
     - Automatically recalculates item subtotal: $\text{dispensedQuantity} \times \text{unitPrice}$.
     - When uncollected portion exists ($\text{diff} = \text{reserved} - \text{dispensed} > 0$), atomically increments the seller's active product inventory: `sellers_product.productQty += diff`.
     - Updates `ordered_items` with final dispensed quantity and recalculated subtotal.
     - Recalculates order `totalAmount` to match the sum of dispensed subtotals.
     - Prevents zero-quantity completions (requiring the seller to use the standard order cancellation flow).
     - Transitions order to `completed` and returns the refreshed order state.

2. **Mobile API Client**:
   - Updated `mobile/src/features/orders/api/seller-orders.ts` with `ScanOrderItemAdjustment` and `ScanSellerOrderParams`.
   - Enhanced `scanSellerOrder` to accept both string QR payloads and structured adjustment payloads.

3. **Mobile Handover Sheet (`OrderHandoverSheet.tsx`)**:
   - Created `mobile/src/features/orders/components/OrderHandoverSheet.tsx` under 200 lines.
   - Built with Jakob's Law, Miller's Law (Chunking), and Fitts's Law ($\ge 48$px touch targets).
   - Allows stall sellers to adjust actual weighed quantities using plus/minus steppers or direct numeric entry.
   - Live recalculates item subtotals and overall order total.
   - Renders a stock restoration pill: *"X.XX kg will return to active stock"* for transparent inventory feedback.

4. **Mobile Scanner Screen (`orders/scan.tsx`)**:
   - Updated `mobile/app/(app)/orders/scan.tsx` to pause scanning upon QR code detection, parse the order reference, and fetch the order details via `fetchSellerOrder`.
   - Mounts `OrderHandoverSheet` so sellers can confirm or adjust dispensed quantities prior to order finalization.
   - On confirmation, calls `scanSellerOrder` with adjusted items and navigates smoothly to order details.

## Why

In agricultural and surplus markets, produce is inspected and weighed physically at pickup. Buyers frequently take slightly less than reserved (e.g. 7.5 kg instead of 10 kg). Without partial pickup reconciliation, sellers were forced to either overcharge the buyer or cancel the entire reservation. This enhancement provides seamless, atomic stock restoration and accurate order accounting while preserving inventory invariants.

## Affected paths

### Backend
- `backend/src/modules/seller/model/seller.scan-order.ts`
- `backend/src/modules/seller/services/seller.scan-order.ts`

### Mobile App
- `mobile/src/features/orders/api/seller-orders.ts`
- `mobile/src/features/orders/components/OrderHandoverSheet.tsx`
- `mobile/app/(app)/orders/scan.tsx`

### Obsidian Vault
- `Agrivive/05 Enhancements/03 Order Lifecycle and Smart Reservation Reconciliation.md`
- `Agrivive/04 Delivery/2026-10-18 Partial Pickup and Stock Auto-Restoration.md`

## Verification performed

1. **Backend Verification**:
   - `bunx tsc --noEmit` — passed with 0 errors.
   - `bun build src/index.ts --outdir dist --target bun` — passed, bundled 1695 modules into `dist/index.js`.
2. **Mobile Verification**:
   - `bun run typecheck` (`tsc --noEmit`) — passed with 0 errors.
3. **Line Count & Modularization Compliance**:
   - `backend/src/modules/seller/model/seller.scan-order.ts`: 18 lines ($\le 200$)
   - `backend/src/modules/seller/services/seller.scan-order.ts`: 138 lines ($\le 200$)
   - `mobile/src/features/orders/api/seller-orders.ts`: 59 lines ($\le 200$)
   - `mobile/src/features/orders/components/OrderHandoverSheet.tsx`: 182 lines ($\le 200$)
   - `mobile/app/(app)/orders/scan.tsx`: 139 lines ($\le 200$)
