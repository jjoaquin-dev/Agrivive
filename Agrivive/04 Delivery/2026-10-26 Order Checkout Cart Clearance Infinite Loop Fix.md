# Order Checkout Cart Clearance Infinite Loop Fix

**Date:** 2026-10-26  
**Status:** Completed  
**Type:** Bug Fix  

---

## 1. Context & Root Cause
When a user completed a checkout and was redirected to `/orders?checkout=[id]`, a runtime error occurred:
`Maximum update depth exceeded. This can happen when a component calls setState inside useEffect...`

**Root Cause:**
1. In `BuyerOrders.tsx`, `useEffect` watched `[checkoutId, clearCart]`.
2. When `checkoutId` was present, it invoked `clearCart()`.
3. In `CartProvider.tsx`, `clear()` executed `setItems([])`, which updated the cart state.
4. Because `useMemo` in `CartProvider` depended on `[items]`, every state update caused a new `value` object to be constructed with a new `clear` function reference.
5. `BuyerOrders` received the new `clearCart` reference, causing its `useEffect` to trigger again and infinitely cycle through cart state updates.

---

## 2. Changes Implemented

### A. Ref Guard in `BuyerOrders.tsx`
- Added `clearedCheckoutRef` (`useRef<string | null>(null)`).
- `useEffect` checks `if (checkoutId && clearedCheckoutRef.current !== checkoutId)` before calling `clearCart()`, guaranteeing that cart clearance executes exactly once per checkout completion event and preventing cascading re-runs.

### B. Idempotent `clear()` in `CartProvider.tsx`
- Updated `setItems` inside `clear()` to use a functional guard:
  `setItems((current) => (current.length === 0 ? current : []));`
- If the cart is already empty, returning the same `current` state reference causes React to bail out of state emission, preventing any re-render cycles.

---

## 3. Affected Files
- [`web/src/features/orders/components/BuyerOrders.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/orders/components/BuyerOrders.tsx)
- [`web/src/features/cart/CartProvider.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/CartProvider.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** Both files remain well within the 200-line ceiling (`BuyerOrders.tsx`: 165 lines; `CartProvider.tsx`: 138 lines).
