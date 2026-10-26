# 2026-10-26 Order Details Cards Redesign and Color Palette Alignment

## Date
2026-10-26

## What Changed
Redesigned the cards on the detailed reservation page (`/orders/[id]`) to replicate the user's reference mockup and harmonize with the official Agrivive 5-color palette (`#457D00`, `#386600`, `#FEA938` / `#EA580C`, `#FDFDFD`):
1. **Items Ordered Card (`OrderItemsCard.tsx`)**:
   - Switched header icon to produce basket (`ShoppingBasket`) in `#457D00`.
   - Updated price color to vibrant brand green (`#457D00`).
   - Added warm peach/tangerine status pill badge (`bg-[#FFF7ED] text-[#EA580C] border-orange-200/70`) reading `"Ready at stall"` (or contextual status).
2. **Market Stall & Pickup Location Card (`OrderSellerCard.tsx`)**:
   - Switched header icon to store icon (`Store`) in `#457D00`.
   - Added top-right `"View Stall"` direct link in brand green.
   - Added circular vendor profile avatar beside stall name and supplier role.
   - Refined pickup location box: clean light-gray background (`#F9FAFB`) with green circular pin badge and `"Get directions"` link.
3. **Conversation with the Seller Card (`OrderMessages.tsx`)**:
   - Added dedicated empty-state helper box: *"Ask the seller about pickup details or this reservation."*
   - Refined message textarea with clean rounded border (`rounded-[14px]`), character counter `0/2000`, and primary green pill button (`#457D00`) with paper plane icon.
4. **Pickup Pass Banner & Payment Details (`OrderQr.tsx` & `OrderPaymentBreakdown.tsx`)**:
   - Standardized banner background to official Agrivive brand green (`#457D00`).
   - Total amount and surplus savings highlighted in `#457D00`.
5. **Bottom Actions (`OrderDetail.tsx` & `OrderCancellation.tsx`)**:
   - Replaced plain text with red rounded pill button (`<XCircle /> Cancel reservation`).
   - Formatted `"Report an issue with this order"` with warning triangle icon separated across the container.

## Why
- **Aesthetic-Usability Effect (Masaaki Kurosu & Kaori Kashimura)**: High aesthetic alignment with reference mockups builds trust and visual consistency.
- **Law of Similarity (Gestalt Psychology)**: Brand green (`#457D00`) consistently denotes forward actions and positive monetary outcomes; warm tangerine (`#EA580C` / `#FFF7ED`) denotes awaiting pickup.
- **Fitts's Law (Paul Fitts)**: Bottom destructive control (`Cancel reservation`) is clearly differentiated in styling and placed opposite the reporting action to prevent accidental triggers.

## Affected Files
- `web/src/features/orders/components/OrderItemsCard.tsx` (75 lines)
- `web/src/features/orders/components/OrderSellerCard.tsx` (77 lines)
- `web/src/features/orders/components/OrderMessages.tsx` (83 lines)
- `web/src/features/orders/components/OrderCancellation.tsx` (82 lines)
- `web/src/features/orders/components/OrderQr.tsx` (66 lines)
- `web/src/features/orders/components/OrderDetail.tsx` (185 lines)

## Verification
- Checked line count of all 6 files: all strictly $\le 200$ lines.
- Ran `cd web; bun run typecheck` (`tsc --noEmit`): exited with code 0 (zero errors).
