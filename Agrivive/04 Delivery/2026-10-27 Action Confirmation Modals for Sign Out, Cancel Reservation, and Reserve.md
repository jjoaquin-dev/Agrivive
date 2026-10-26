# 2026-10-27 Action Confirmation Modals for Sign Out, Cancel Reservation, and Reserve

## Context & Objectives
Implement high-fidelity action confirmation modals for three critical workflows:
1. **Sign Out**: Prompting users when clicking sign out from the profile or site navigation headers.
2. **Cancel Reservation**: Guarding against accidental cancellation of active produce pickup orders.
3. **Reserve Produce**: Confirming reservation intent both when ordering from the cart (`CartDrawer`) and directly from a product listing (`ProductDetail`).

The modal visuals strictly mirror the provided reference design: `rounded-[24px]` cards, centered circular soft-tinted status badges, bold headings, human-readable confirmation subtitles, and two-button pill controls (`No` vs. high-contrast action).

## Why
- **Error Prevention & Robustness Principle (Caroline Jarrett & Gerry Gaffney)**: Safeguards users from irreversible or disruptive unintended actions (such as logging out or releasing reserved fresh stock back into the open marketplace).
- **Aesthetic-Usability Effect (Masaaki Kurosu & Kaori Kashimura)**: Clean white surfaces, soft-tinted status circles (positive green, destructive red, neutral dark), and balanced pill geometry foster trust and confidence.
- **Jakob's Law & Fitts's Law**: Standard top-right dismiss (`×`), intuitive `Escape` key and backdrop click dismissal, body scroll locking, and accessible 44px+ touch targets prevent friction.

## What Changed
1. **`web/src/components/ConfirmationModalComponent.tsx`** (New):
   - Shared accessible modal component with portal rendering into `document.body`.
   - Variants:
     - `positive`: Soft green circular badge with `Check` icon + Forest Green action button (`#245914`).
     - `destructive`: Soft red circular badge with `LogOut` icon + Crimson action button (`#880E16`).
     - `neutral`: Soft gray circular badge with `Ban` icon + Dark slate action button (`#2E3438`).
   - Left neutral `"No"` pill button + right action pill button with loading spinner state.
2. **`web/src/components/BuyerAccountMenu.tsx`**:
   - Intercepted the "Sign out" menu item to open the destructive confirmation modal before executing `authClient.signOut()`.
3. **`web/src/components/SiteHeader.tsx`**:
   - Integrated the confirmation modal on desktop and mobile navigation sign out triggers.
4. **`web/src/features/orders/components/OrderCancellation.tsx`**:
   - Replaced inline cancellation block with the neutral/dark `ConfirmationModalComponent` ("Cancel Reservation").
5. **`web/src/features/cart/components/CartDrawer.tsx`**:
   - Added positive confirmation modal when clicking "Reserve cart for pickup", showing total items and price.
6. **`web/src/features/marketplace/components/ProductDetail.tsx`**:
   - Added positive confirmation modal when clicking "Buy now" to reserve single-produce orders.

## Affected Files
- `web/src/components/ConfirmationModalComponent.tsx`
- `web/src/components/BuyerAccountMenu.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/features/orders/components/OrderCancellation.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## Verification Performed
- **TypeScript Typecheck**: Ran `npm run typecheck` (`tsc --noEmit`) in `web/` — passed with 0 errors.
- **Line Count Limits**: Verified all 6 files are strictly $\le 200$ lines (ranging between 69 and 198 lines).
- **Live Server Verification**: Verified active Next.js dev server on port `3001` responds with HTTP `200 OK` across `/marketplace`, `/orders`, and `/profile`.
