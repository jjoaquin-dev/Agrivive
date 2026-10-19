---
title: Product Archive Guard, Visibility Guide Fix, and Dual-Role Account Support
type: delivery-record
status: completed
date: 2026-10-20
---

# Product Archive Guard, Visibility Guide Fix, and Dual-Role Account Support

## 1. What Changed

1. **Product Archive 404 & Active Reservation Protection**:
   * Resolved product archiving failure (HTTP 404) by adding the `POST /seller/products/:id/archive` endpoint on the backend to match the mobile client expectation.
   * Enforced an atomic guard in `archiveSellerProduct` that prevents archiving any produce with active buyer reservations (`orders.status = 'pending'`).
2. **Marketplace Visibility Guide Card Fix**:
   * Resolved the misleading *"Ensure stock is positive to receive visibility ranking"* notice on active, stocked products.
   * Added the missing `inputs` object (carrying posting age, remaining quantity, prior cycles, and recurrence) to `GET /seller/weightedvisibility` responses.
   * Normalized placement tier to lowercase (`priority`, `standard`, `basic`) and made the mobile card case-insensitive.
   * Modified `VisibilityBreakdownCard.tsx` to display factor metrics whenever `score !== null`, showing specific ineligibility reasons only when unranked.
3. **Dual-Role Account Creation & Re-use Guard**:
   * Implemented the rule restricting accounts to a maximum of **2 roles** (`buyer` and `seller`).
   * Added `POST /auth/check-email` and `POST /auth/register-role` in the backend auth module.
   * If an email is unused (0 roles): creates account with 1 initial role.
   * If an email is already registered with 1 role: permits password verification to unlock/add the second role (advancing from 1 to 2 roles).
   * If an email already holds 2 roles: strictly prevents further registration or role addition.
   * Updated mobile seller registration and web buyer signup to utilize the dual-role flow seamlessly.

## 2. Why

* **Integrity & Fulfillment**: Sellers could not archive products due to route method mismatch, and archiving products with live reservations could strand buyers with unfulfillable orders.
* **Accuracy & Trust**: Positive-stock products were incorrectly flagged as needing positive stock in mobile analytics due to a missing response payload property.
* **Unified Account Experience**: Users previously encountered a hard "Account already exists" wall when attempting to register as both a buyer and a seller with the same email, leading to duplicate account confusion.

## 3. Affected Files

* `backend/src/modules/seller/services/seller.product.archive.ts`
* `backend/src/modules/seller/index/seller.product.archive.ts`
* `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
* `backend/src/modules/auth/model/auth.role-register.ts`
* `backend/src/modules/auth/services/auth.role-check.ts`
* `backend/src/modules/auth/services/auth.role-expand.ts`
* `backend/src/modules/auth/index/auth.role-register.ts`
* `backend/src/utils/order-types/index.ts`
* `backend/src/index.ts`
* `backend/API_ENDPOINTS.md`
* `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
* `mobile/app/(auth)/register.tsx`
* `web/app/(auth)/signup/page.tsx`

## 4. Verification Performed

* `bunx tsc --noEmit` in `backend/` passed (0 errors).
* `bun build src/index.ts --outdir dist --target bun` in `backend/` passed (4.51 MB bundled).
* `bun run typecheck` in `mobile/` passed (0 errors).
* `bun run typecheck` in `web/` passed (0 errors).
