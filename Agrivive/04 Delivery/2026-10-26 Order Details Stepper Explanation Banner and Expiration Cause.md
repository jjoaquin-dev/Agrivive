# 2026-10-26 Order Details Stepper Explanation Banner and Expiration Cause

## Date
2026-10-26

## What Changed
Added a contextual explanation callout banner below the progress stepper in the detailed reservation/order view (`/orders/[id]`), matching the mockup and explaining why a reservation expired:
1. **Stepper Component (`OrderPickupStepper.tsx`)**:
   - Integrated a rounded status callout banner (`rounded-[14px] p-4 flex items-start gap-3`) below the 3-step progress bar.
   - For **Pending / Ready for Pickup** (`status === "pending"`):
     - Displays `bg-[#F0F5FF] border border-[#D0E2FF]` with blue `Info` icon.
     - Title: `Your order is ready at the stall!`.
     - Subline: `Please present your pickup pass to [Shop Name] before the reservation expires.`.
   - For **Expired** (`status === "expired"`):
     - Displays `bg-[#FEF6F6] border border-[#FCD8D8]` with red `AlertCircle` icon.
     - Title: `This reservation has expired`.
     - Subline: Explains the exact reason: `The pickup window ended before the pass was scanned at the stall. Unclaimed items were returned to [Shop Name]'s inventory to avoid food waste.`.
   - For **Cancelled** (`status === "cancelled"`):
     - Displays neutral slate banner detailing cancellation reason and confirmation of items returned to inventory.
   - For **Completed** (`status === "completed"`):
     - Displays soft emerald badge confirming pass verification and food-waste reduction impact.
   - Fixed the third step sublabel: Replaced incorrect fallback `"Success"` on expired orders with `"Unclaimed"`.
   - Fixed step alert label styling: Expired/Cancelled step labels now render in high-contrast alert red (`text-[#B85450] font-bold`) rather than green.
2. **Order Detail Page (`OrderDetail.tsx`)**:
   - Passed `shopName={products[0]?.seller.shopName}` and `cancellationReason={order.cancellationReason}` into `OrderPickupStepper`.

## Why
- **Visibility of System Status (Jakob Nielsen)**: Provides explicit, immediate feedback on why a reservation closed and what happens to reserved surplus produce.
- **Don't Make Me Think (Steve Krug)**: Replaces confusing or absent feedback with intuitive, plain English statements matching user mental models.
- **Figure-Ground Principle & Aesthetic-Usability Effect (Gestalt / Kurosu & Kashimura)**: Seamlessly integrates the callout within the white card container (`rounded-[16px] bg-white border-[#E8E8E8]`), enhancing confidence and clarity.

## Affected Files
- `web/src/features/orders/components/OrderPickupStepper.tsx` (166 lines)
- `web/src/features/orders/components/OrderDetail.tsx` (184 lines)

## Verification
- Verified line count rule: all affected files are strictly <= 200 lines (`OrderPickupStepper.tsx` is 166 lines; `OrderDetail.tsx` is 184 lines).
- Ran `cd web; bun run typecheck` (`tsc --noEmit`) — passed with 0 errors.
