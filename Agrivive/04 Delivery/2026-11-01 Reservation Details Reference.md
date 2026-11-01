---
title: Reservation Details Reference
type: delivery
date: 2026-11-01
---

# Reservation Details Reference

## What changed

Applied the Stitch "Reservations v1" frames (project `11184471743007910085`): Details (pending), Cancel sheet, list error and empty states. Only existing fields are used.

- Details: header "Reservation"; title "Reservation #3F9A1C2B" with badge; "Placed Nov 1, 2026, 8:05 AM"; green dot "Updated 8:42 AM"; amber pickup banner ("Pick up by 5:00 PM today", "The pickup code stops working after this time.") for waiting ones; Items with units; Buyer Questions; Reference card (Buyer #, Checkout #, cancel reason); ghost "Report a Problem".
- Sticky bottom bar for waiting ones: "Scan Pickup QR" and a red ghost "Cancel Reservation" below it.
- Cancel sheet (new `OrderCancelSheet.tsx`): handle, 44px close, "Reason" field, "At least 5 letters", red "Cancel Reservation" (off until 5 characters), ghost "Keep Reservation", 50% backdrop.
- List error: icon, "Could not load reservations", "Please check your internet connection and try again.", Try Again with refresh icon. Empty: calendar icon in grey circle.

Not yet applied from the same Stitch page: Report sheet, camera permission, scanning, wrong code, handover sheet (D1/D2), Pickup done (E, a proposed state).

## Files

- `mobile/app/(app)/orders/[id].tsx`, `mobile/app/(app)/_layout.tsx` (title)
- `mobile/app/(app)/(tabs)/orders.tsx`
- `mobile/src/features/orders/components/OrderCancelSheet.tsx` (new), `OrderItemsList.tsx`, `SellerOrderCommunication.tsx` (copy)
- `mobile/src/features/orders/orderFormat.ts`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. Cancel still calls the same API with the same 5-letter rule.
