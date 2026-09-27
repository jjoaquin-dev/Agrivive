# Buyer Web Orders Redesign

Date: 2026-09-26

## What changed

- **Enhanced OrderCard Component (`web/src/features/orders/components/OrderCard.tsx`)**:
  - Implemented prioritized visual treatment for "Pending pickup" reservations with subtle green border emphasis (`border-primary/40 bg-card shadow-sm hover:border-primary`) distinguishing active reservations from completed, cancelled, or expired history.
  - Made the total amount (`text-base font-bold`) and reserved date prominent and easy to scan at a glance.
  - Replaced the raw pickup code with a clean, reassuring status indicator badge (`Pickup code ready`) when active.
  - Dynamically adjusted card footer action: "View pickup details" with right arrow for pending pickup reservations, and "View reservation" for settled reservations.
- **Redesigned OrderDetail Component (`web/src/features/orders/components/OrderDetail.tsx`)**:
  - Mobile-first QR code placement: Moved the pickup QR card (`OrderQr`) directly below the reservation summary on mobile screens (`lg:hidden`), eliminating the need for buyers at the vendor stall to scroll past product items and seller instructions.
  - Desktop layout preservation: Kept the pickup QR code sticky in the right-hand side panel (`aside.hidden.lg:block`).
  - Safe, plain-language cancellation flow: Replaced immediate cancellation with an inline confirmation card with clear, plain words ("If you cancel, your reserved produce will go back to the store so someone else can buy it. You cannot undo this.") and two distinct options: "Yes, cancel reservation" and "Keep reservation".
  - Retained all existing background polling (15s interval for pending orders), seller details, and reservation item breakdown while keeping the entire component strictly under 200 lines (194 lines).

## Why

Orders are a trust and follow-through screen. Buyers picking up produce at physical market stalls in Davao need instant clarity on pending orders, rapid access to their pickup QR code on mobile devices without scrolling, and protection against accidental cancellation.

## Affected paths

- `web/src/features/orders/components/OrderCard.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`

## Verification

- `bun run build` in `web/` passed with 0 errors, successfully compiling all 11 static and dynamic routes including `/orders` and `/orders/[id]`.
- `bun run typecheck` (`tsc --noEmit`) in `web/` passed with 0 errors.
- Line counts verified: all affected files are strictly <= 200 lines (`OrderCard.tsx`: 56 lines, `OrderDetail.tsx`: 194 lines).
