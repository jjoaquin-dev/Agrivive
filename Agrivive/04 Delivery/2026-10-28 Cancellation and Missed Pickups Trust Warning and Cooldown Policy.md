# Cancellation & Missed Pickups Trust Warning & Cooldown Policy

- **Date**: 2026-10-28
- **Scope**: Buyer Trust System, Cart Drawer (`CartDrawer.tsx`), All Orders Page (`BuyerOrders.tsx`), Cancellation Service (`buyer.order.cancel.ts`), and Profile Read Service (`buyer.profile.read.ts`)
- **Author**: Antigravity Assistant & Project Owner

---

## 1. Context & Objective
The user requested clarification on whether missed/expired pickup explanations show in the cart, and asked to apply a tiered warning and cooldown lock system to buyer cancellations:
- **5 canceled orders**: Warning message explanation in All Orders page & Cart (no lock, user can still reserve).
- **7 canceled orders**: 12 hours cooldown lock & message explanation in All Orders page & Cart.
- **9 canceled orders**: 24 hours cooldown lock & message explanation in All Orders page & Cart.
- **10+ canceled orders**: 3 days (72 hours) cooldown lock & message explanation in All Orders page & Cart.

---

## 2. Changes Summary

### A. Backend Services & Utilities
1. **Cancellation Trust Policy (`cancellation-policy.ts`)**:
   - `resolveCancellationCooldownHours(count)`:
     - $\ge 10$: 72 hours (3 days)
     - $\ge 9$: 24 hours
     - $\ge 7$: 12 hours
     - $\ge 5$: 0 hours (warning only)
   - `resolveCancellationWarning(count)`:
     - Generates the explanation message warning users about the 12-hour pause at 7 cancellations.
   - `resolveCancellationRestrictionMessage(count, endsAt)`:
     - Generates the pause notice message with remaining time.
2. **Cancellation Service (`buyer.order.cancel.ts`)**:
   - When a buyer cancels an order, records the event and counts total buyer cancellations.
   - If count $\ge 7$, creates a `temporary_restriction` in `trust_actions` with the computed cooldown duration (`endsAt`), locking future checkouts during the cooldown.
   - If count $\ge 5$ and $< 7$, creates a `warning` in `trust_actions`.
3. **Buyer Profile Read (`buyer.profile.read.ts`)**:
   - Evaluates active restrictions (`temporary_restriction`) from both missed pickups and cancellations.
   - Evaluates active warnings from both missed pickups (4 points) and cancellations (5–6 orders).
   - Returns `trustRestriction`, `trustWarning`, `cancellationsCount`, and `missedPickupsPoints`.

### B. Frontend Components
1. **All Orders Page (`BuyerOrders.tsx` & `BuyerTrustBanner.tsx`)**:
   - Created `BuyerTrustBanner.tsx` to keep `BuyerOrders.tsx` strictly under 200 lines (196 lines).
   - Proactively checks and displays the active cooldown restriction or warning notice at the top of the All Orders page.
   - Refreshes trust status after cancelling an order.
2. **Cart Drawer (`CartDrawer.tsx`)**:
   - Updated warning title to distinguish between "Cancellation warning" and "Missed pickup warning".
   - Displays cooldown pause explanation and locks the "Reserve cart for pickup" button during active restrictions.

---

## 3. Affected Files
- `backend/src/utils/trust/cancellation-policy.ts`
- `backend/src/modules/buyer/services/buyer.order.cancel.ts`
- `backend/src/modules/buyer/services/buyer.profile.read.ts`
- `web/src/features/profile/api/profile.ts`
- `web/src/features/orders/components/BuyerTrustBanner.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`

---

## 4. Verification Performed
1. `cd backend && bunx tsc --noEmit`: 0 errors.
2. `cd backend && bun build src/index.ts --outdir dist --target bun`: Success.
3. `cd web && bunx tsc --noEmit`: 0 errors.
4. Tested `getBuyerProfile` with live buyer having 6 cancellations: verified it correctly returns the cancellation warning banner without locking.
