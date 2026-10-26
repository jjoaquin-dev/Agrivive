---
title: Shopping Cart UI-UX Modern Redesign
date: 2026-10-26
type: delivery
status: verified
related_documents:
  - "[[2026-09-24 Buyer Multi-Store Cart Checkout]]"
  - "[[2026-10-26 Systemwide UI-UX Standards and Layout Harmonization]]"
---

# Shopping Cart UI-UX Modern Redesign

## Summary of Changes

Redesigned the shopping cart drawer item rows, stall grouping header, quantity controls, and item removal actions from the baseline implementation to a modern, balanced, professional agricultural marketplace cart adhering to established UI/UX laws and Agrivive design tokens.

1. **Modular Architecture**:
   - Decomposed monolithic cart item rendering in `CartDrawer.tsx` into four dedicated, reusable, strongly-typed components under 100 lines each:
     - `CartSellerHeaderComponent.tsx`
     - `CartQuantitySelectorComponent.tsx`
     - `CartRemoveButtonComponent.tsx`
     - `CartItemComponent.tsx`
   - Preserved all existing cart business logic, `CartProvider` state, real-time recalculation, and checkout flow.

2. **Stall / Seller Header**:
   - Designed a standalone seller banner placed directly above the items on the drawer background (`bg-[#EAF5E1]` badge with `Store` icon in `#225828`, plus bold store name in `#14231A`).

3. **Standalone Product Card Architecture**:
   - Transformed cart items into individual cards with generous `rounded-[20px]`, crisp light border (`border-neutral-200/90`), white background, and soft elevation (`shadow-xs`).
   - **Left**: Fixed 76–80px square thumbnail with `rounded-[14px]` and full-bleed image cover.
   - **Center**: Product title in bold Inter (`text-base sm:text-lg`), unit description (`1 ${item.scalingType}`) in neutral muted gray, and bold forest green unit price (`text-sm sm:text-base font-bold text-[#225828]`).
   - **Right Column**: Minimalist outline trash icon at the top right, and ergonomic segmented quantity stepper at the bottom right.

4. **Unified Segmented Quantity Selector**:
   - 92px pill-shaped stepper (`h-9 rounded-[12px] border border-neutral-300 bg-white px-1 shadow-2xs`) with tactile minus/plus buttons and tabular number readout.
   - Decrement button automatically disables (`disabled={quantity <= 1}`) to prevent accidental deletion while stepping quantity down.
   - Increment button disables when reaching available inventory (`quantity >= maxQuantity`).
   - Added accessible `aria-label` attributes (`Decrease quantity for [Product]`, `Increase quantity for [Product]`).

5. **Ergonomic Remove Item Action**:
   - Outline trash icon (`Trash2`) positioned at the top-right corner with smooth hover state (`hover:text-red-500`).
   - Screen-reader accessible label: `Remove [Product] from cart`.

## UI/UX Standards & Psychological Principles Applied

- **Gestalt Principle of Common Region *(Max Wertheimer, Kurt Koffka)***: Bounding the minus, quantity display, and plus inside an inline segmented container visually unifies them into a single atomic stepper rather than disconnected floating elements.
- **Fitts's Law & Touch Target Ergonomics *(Paul Fitts, Luke Wroblewski)***: Anchored the remove button at the far right of the row with a full 40 × 40 px hit target, cleanly separated from the quantity stepper to prevent accidental destructive clicks.
- **Error Prevention & Quantity Constraints *(Caroline Jarrett & Gerry Gaffney)***: Disabling decrement at quantity = 1 prevents unintended item removal; item deletion is reserved exclusively for the dedicated trash button.
- **Von Restorff Effect *(Hedwig von Restorff)***: Highlighted unit prices using Agrivive's forest green (`#457D00`), keeping auxiliary units (`/ kilo`) subdued in muted typography.
- **Jakob's Law *(Jakob Nielsen)***: Followed standard e-commerce cart conventions familiar to users across modern web applications.
- **Affordances & Doherty Threshold *(Don Norman, Walter J. Doherty)***: Applied tactile `:active:scale-95` press micro-interactions and instant visual feedback under 400ms.

## Affected Files & Verification

- Created:
  - [`web/src/features/cart/components/CartSellerHeaderComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/components/CartSellerHeaderComponent.tsx) (22 lines)
  - [`web/src/features/cart/components/CartQuantitySelectorComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/components/CartQuantitySelectorComponent.tsx) (58 lines)
  - [`web/src/features/cart/components/CartRemoveButtonComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/components/CartRemoveButtonComponent.tsx) (25 lines)
  - [`web/src/features/cart/components/CartItemComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/components/CartItemComponent.tsx) (87 lines)
- Modified:
  - [`web/src/features/cart/components/CartDrawer.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/components/CartDrawer.tsx) (141 lines, reduced from 180 lines)
- Verification:
  - `bunx tsc --noEmit` in `web/`: Passed with 0 errors.
  - `bun run build` in `web/`: Next.js 15.5.0 compiled all 20 routes successfully without any errors.
