# 2026-10-26 Reservation Details and Pickup Pass Redesign

## Summary of Changes
Redesigned the entire Reservation Details ("View Pass") page (`/orders/[id]`) into a modern, clean, cohesive, and professionally balanced interface conforming to Agrivive branding and UI/UX cognitive psychology standards (*Jakob's Law*, *Hick-Hyman Law*, *Miller's Law*, *Fitts's Law*, *Figure-Ground Principle*, and *Aesthetic-Usability Effect*), matched to the user's design mockup photo.

### What Changed & Why

1. **Background & Card Foundations**:
   - Updated the page background from creamy tones to `#FDFDFD`.
   - Standardized all content cards with pure white background (`#FFFFFF`), subtle 1px solid `#E8E8E8` borders, and uniform `16px` border-radius (`rounded-[16px]`).
   - Removed visual clutter, oversized gaps, and inconsistent dividers to achieve a sharp *Figure-Ground* relationship.

2. **Order Summary Header (`OrderSummaryHeader.tsx`)**:
   - Top-left subtle pill badge: `Order ID: AGR-BA5F49B` with 1px `#E8E8E8` border, `#FAFAFA` background, and `text-neutral-500 font-mono`.
   - Title: `Surplus Product Reservation` (24px bold `#14231A`).
   - Subline: Calendar icon with `Oct 26, 2026 • 1 item`.
   - Top-right: 24px bold total price (`₱23.47`) with green `Saved ₱7.00` badge and subtle `Pay at pickup` italic note below.

3. **Pickup Stepper (`OrderPickupStepper.tsx`)**:
   - 3-step progress bar:
     - Step 1: Green filled compass/check icon, `Reserved`, `Oct 26`.
     - Step 2: Green bordered clock icon, `Ready for pickup` (green font), `Visit stall`.
     - Step 3: Gray package icon, `Completed`, `Success`.
   - Track line: green between Step 1 & 2, gray between Step 2 & 3.

4. **Items Ordered Card (`OrderItemsCard.tsx`)**:
   - Header with green package icon (`Package`) and `Items Ordered (1)`.
   - Produce thumbnail, product name (`Monggo`), unit/quantity line (`Unit: Sack • Qty: 1`), and bold green price (`₱23.47`).
   - Amber status pill badge displaying `Available`.

5. **Market Stall & Pickup Location (`OrderSellerCard.tsx`)**:
   - Header with green map pin icon and `Market stall & pickup location`.
   - Stall name in bold black (`Jaras`) with role in gray (`Supplier`).
   - Clean address container with circular green map pin badge, address (`Stall #___, Bankerohan Public Market, Davao City`), and `Get directions ↗` link.
   - Removed duplicate product view buttons.

6. **Conversation with the Seller (`OrderMessages.tsx`)**:
   - Header with green chat icon and `Conversation with the seller`.
   - `Write a message` label above textarea with light gray background and placeholder `Message the seller...`.
   - Right-aligned green `Send message` button with paper plane icon.

7. **Bottom Actions (`OrderDetail.tsx` & `OrderCancellation.tsx`)**:
   - Text links placed side-by-side: red `Cancel reservation` link and gray `Report an issue` link.
   - Cancellation expands an inline confirmation dialog with "Yes, cancel" and "Never mind".

8. **Official Pickup Pass (`OrderQr.tsx`)**:
   - Solid green top banner with white centered text `OFFICIAL PICKUP PASS`.
   - Centered `STALL` / `Jaras` above QR code container.
   - Reassuring text: `Show this to the vendor` and `The seller will scan this code to confirm your pickup.`.
   - Cream/yellow pill button: `🕒 Pay ₱23.47 at stall`.

9. **Payment Details (`OrderPaymentBreakdown.tsx`)**:
   - Clean `Payment details` title without icon clutter.
   - Item row (`Monggo ₱23.47`), green `Surplus savings - ₱7.00`, and `Service Fee FREE`.
   - Divider line and bold green `Total ₱23.47`.
   - Reassurance callout with green checkmark: `You're helping reduce food waste! Thank you for choosing surplus products.`.

---

## Affected Files
- `web/src/features/orders/components/OrderDetail.tsx` (178 lines)
- `web/src/features/orders/components/OrderSummaryHeader.tsx` (59 lines)
- `web/src/features/orders/components/OrderPickupStepper.tsx` (86 lines)
- `web/src/features/orders/components/OrderItemsCard.tsx` (65 lines)
- `web/src/features/orders/components/OrderSellerCard.tsx` (64 lines)
- `web/src/features/orders/components/OrderMessages.tsx` (74 lines)
- `web/src/features/orders/components/OrderQr.tsx` (66 lines)
- `web/src/features/orders/components/OrderPaymentBreakdown.tsx` (59 lines)
- `web/src/features/orders/components/OrderCancellation.tsx` (80 lines)

---

## Verification Performed
- `cd web; bunx tsc --noEmit` — passed with 0 errors.
- `cd backend; bunx tsc --noEmit` — passed with 0 errors.
- Verified line count rule: all affected files are strictly <= 200 lines (`OrderDetail.tsx` is 178 lines; all other files are under 90 lines).
- Verified full preservation of existing business logic, QR generation, real-time polling, messaging, cancellation, and reporting.
