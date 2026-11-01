---
title: Reservations List Reference
type: delivery
date: 2026-11-01
---

# Reservations List Reference

## What changed

The Reservations tab now follows the supplied reference (waiting list, all-filter list with pagination, loading skeleton). Only existing fields are used.

- Header: "Reservations", "See who is coming and check their pickup code."; scan button label "Scan pickup QR".
- Filters: one scrolling row, 40px chips; "Done" is now "Picked up".
- Card: "Reservation #3F9A1C2B", "Placed Nov 1, 8:05 AM", item with units (kg, sack/sacks, pile/piles) and "+ N more", divider, total as ₱1,250.00, and "Pick up by 5:00 PM today" for waiting ones. Soft card shadow.
- Status badge: tinted fill and border; "Completed" is now "Picked up". The badge is shared, so Reservation details shows the same.
- Pagination: "Showing 1–10 of 23", larger page-size and Previous/Next targets. Shared, so Notifications and Listings pick it up too.
- Loading: three card skeletons instead of a spinner. Empty: "No one is waiting" / "New reservations show up here." Error box uses the error tint.

Not changed: the Stitch "Agrivive / Skip" top bar and "Sample data" caption in the images (mockup only).

## Files

- `mobile/app/(app)/(tabs)/orders.tsx`
- `mobile/src/features/orders/components/OrderCard.tsx`, `OrderStatusBadge.tsx`
- `mobile/src/features/orders/orderFormat.ts` (new)
- `mobile/src/components/PaginationControl.tsx`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. The reservation details screen still says "Order" in places and was not restyled.
