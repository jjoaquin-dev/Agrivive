# Mobile Pagination and Page Size Filter Across 4 Key Screens

**Date:** 2026-10-27  
**Type:** Feature / UX Polish  
**Scope:** Mobile (`mobile/src/components/PaginationControl.tsx`, `mobile/app/(app)/(tabs)/inventory.tsx`, `mobile/app/(app)/(tabs)/orders.tsx`, `mobile/app/(app)/notifications.tsx`, `mobile/app/(app)/analytics.tsx`)

---

## 1. Context & User Request
The user requested:
> "PROPOSE AN PAGINATION and can filter how many can show in mobile
> PAGES:
> - LISTING INVENTORY
> - ORDERS
> - NOTIFICATION
> - MARKETPLACE VISIBILITY GUIDE"

---

## 2. Key Changes Made

### Mobile Architecture
1. **[`mobile/src/components/PaginationControl.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/components/PaginationControl.tsx)** *(New Shared Component, 197 lines)*:
   - **Page Size Selector**: Segmented pill controls (`Show: [ 5 ] [ 10 ] [ 20 ]` or custom options like `[ 3 | 5 | 10 ]` for guide cards).
   - **Count Indicator**: Dynamic counter on the right (`Showing 1–10 of 42`).
   - **Stepper Navigation**: Clean `< Previous` and `Next >` buttons meeting Fitts’s Law ($\ge 48$px min touch targets) with bold `Page X of Y` center text.
   - **Auto-reset**: Changes in filter tabs, search terms, or page size automatically reset pagination to Page 1.

### Screen Integrations
1. **Listing Inventory ([`inventory.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/(tabs)/inventory.tsx))**:
   - Paginates product listings with options `[5, 10, 20]`, default `10`.
   - List footer renders `<PaginationControl ... />` with auto-reset on tab and search changes.
2. **Orders ([`orders.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/(tabs)/orders.tsx))**:
   - Paginates buyer order cards with options `[5, 10, 20]`, default `10`.
   - Auto-resets to Page 1 when switching order status filters (Waiting, Done, Cancelled, Expired, All).
3. **Notifications ([`notifications.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/notifications.tsx))**:
   - Paginates notifications before date grouping (`TODAY`, `YESTERDAY`, `EARLIER`).
   - Options `[5, 10, 20]`, default `10`, with auto-reset on category tabs and search queries.
4. **Marketplace Visibility Guide ([`analytics.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/analytics.tsx))**:
   - Replaced hardcoded `.slice(0, 3)` with dynamic pagination with options `[3, 5, 10]`, default `3`.
   - Preserved file line limit (197 lines, $\le 200$).

---

## 3. Verification Performed
- `cd mobile && bunx tsc --noEmit`: 0 errors.
- `cd mobile && npx -y expo-doctor`: 21/21 checks passed.
- `cd backend && bunx tsc --noEmit`: 0 errors.
- `cd backend && bun build src/index.ts --outdir dist --target bun`: Success (1820 modules in 158ms).
- File length check:
  - `PaginationControl.tsx`: 197 lines ($\le 200$)
  - `orders.tsx`: 142 lines ($\le 200$)
  - `notifications.tsx`: 163 lines ($\le 200$)
  - `analytics.tsx`: 197 lines ($\le 200$)
