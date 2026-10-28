# 2026-10-27 All Orders In-Place Cancellation Modal

## Context & Objectives
In the all orders page (`/orders`), clicking the "Cancel Order" button previously navigated the buyer to the order details page (`/orders/[id]#cancel`). The requirement was to display a confirmation modal directly on the orders list page and cancel the reservation immediately in-place upon confirmation, eliminating unnecessary page navigation.

## Why
- **Don't Make Me Think & Zero Friction (Steve Krug)**: Buyers managing reservations expect immediate, in-place actions. Navigating away to a details page just to cancel adds cognitive load and slows down the reservation management workflow.
- **Fitts's Law & Error Prevention (Caroline Jarrett & Gerry Gaffney)**: Destructive actions like order cancellation must be confirmed via a focused confirmation modal to prevent accidental cancellations, while keeping the user in their current browsing context.
- **Doherty Threshold (Walter J. Doherty & Ahrvid J. Thadhani)**: Cancelling in-place and updating the local order state, status badges, and tab counts optimistically in <400ms delivers an instant, responsive experience.

## What Changed
1. **`useBuyerOrders.ts`**:
   - Added `updateOrder(updated: BuyerOrder)` callback to update order data in both memory cache and React state immediately without requiring a full network refetch.
   - Kept file size at 79 lines (well under 200-line ceiling).

2. **`OrderCard.tsx`**:
   - Replaced `<Link href={`/orders/${order.id}#cancel`}>` with an interactive `<button>` invoking `onCancel(order)`.
   - Kept file size at 149 lines (well under 200-line ceiling).

3. **`BuyerOrders.tsx`**:
   - Integrated `ConfirmationModalComponent` with `variant="destructive"`, warning that reserved produce will return to store inventory.
   - Handled `handleConfirmCancel` with asynchronous loading feedback and inline error recovery.
   - Added a dismissible green alert banner confirming successful cancellation with the order ID.
   - Streamlined imports and formatting to keep the file at 197 lines (strictly <= 200 lines).

## Affected Files
- `web/src/features/orders/hooks/useBuyerOrders.ts`
- `web/src/features/orders/components/OrderCard.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`

## Verification Performed
- **TypeScript Type Check**: Ran `bunx tsc --noEmit` on `web/` with 0 errors.
- **File Constraints**: Verified all files adhere strictly to the <= 200 lines limit:
  - `useBuyerOrders.ts`: 79 lines
  - `OrderCard.tsx`: 149 lines
  - `BuyerOrders.tsx`: 197 lines
- **In-Place Cancellation Flow**: Verified clicking "Cancel Order" on any pending order opens the confirmation modal, confirms cancellation, updates status to cancelled, updates tab counts, and keeps the buyer on the `/orders` page.
