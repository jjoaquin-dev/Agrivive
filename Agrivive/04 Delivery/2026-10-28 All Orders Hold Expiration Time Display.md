# 2026-10-28 All Orders Hold Expiration Time Display

## Context & Objectives
On the All Orders page (`/orders`), order cards previously displayed only the date for pending hold expirations (e.g., `Hold expires Oct 28, 2026`). The requirement was to display the exact expiration time along with the date (e.g., `Hold expires Oct 28, 2026, 4:30 PM`) so buyers know the precise cutoff time for picking up their reserved produce.

## Why
- **Visibility of System Status (*Jakob Nielsen*)**: Informing the buyer of the exact hour and minute the hold expires gives them complete visibility into their reservation window, eliminating ambiguity.
- **Error Prevention (*Caroline Jarrett & Gerry Gaffney*)**: Displaying the exact expiration time prevents buyers from assuming a reservation lasts until midnight or the end of the market day, preventing missed pickups and unexpected inventory release.

## What Changed
1. **`web/src/features/orders/components/OrderCard.tsx`**:
   - Added `formatExpiration(iso: string)` helper formatting both the localized date and time in 12-hour format (`Oct 28, 2026, 4:30 PM`).
   - Updated the pending status label to `Hold expires ${formatExpiration(order.expiresAt)}`.
   - File length: 164 lines (strictly $\le 200$ lines).

## Affected Files
- `web/src/features/orders/components/OrderCard.tsx`

## Verification Performed
- **TypeScript Check**: `cd web; bunx tsc --noEmit` passed with 0 errors.
- **File Length Limit**: Verified `OrderCard.tsx` is 164 lines (well below the 200-line ceiling).
