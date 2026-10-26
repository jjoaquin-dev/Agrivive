# 2026-10-26 Systemwide Back Navigation Standardization and Consistency

## Date
2026-10-26

## What Changed
Standardized the back navigation button component, visual styling, positioning, and spacing across all buyer subpages:
1. **Notifications Page (`web/src/features/notifications/components/BuyerNotifications.tsx`)**:
   - Added top-left `<div className="mb-6"><Link href="/marketplace" ...><span>Back to Marketplace</span></Link></div>` back link with `ArrowLeft` icon.
2. **Settings Page (`web/src/features/profile/components/BuyerProfile.tsx`)**:
   - Added top-left back link with `mb-6` spacing above the Settings heading and verified buyer badge.
   - Refactored and compacted helper code to ensure strict adherence to the repository's $\le 200$ lines rule (192 lines).
3. **All Orders Page (`web/src/features/orders/components/BuyerOrders.tsx`)**:
   - Relocated the back button from the far-right side of the `<header>` container to its dedicated top-left position preceding `<header>`.
   - Standardized `min-h-[36px]` button target size and 24px vertical separation (`space-y-6`).
4. **Messages / Conversation Page (`web/src/features/conversations/components/BuyerConversations.tsx`)**:
   - Updated the top-left navigation wrapper from `mb-3` (12px) to `mb-6` (24px) for exact spatial rhythm and alignment with other pages.
   - Preserved dynamic contextual target (`Back to Listing` if `productId` present, else `Back to Marketplace`).
5. **Seller Storefront (`web/src/features/marketplace/components/SellerStorefront.tsx`)**:
   - Enclosed the back link in `<div className="mb-6">` to provide uniform 24px separation above storefront content.

## Why
- **Jakob's Law (Jakob Nielsen)**: Users expect standard, predictable navigation placements. Placing back buttons consistently at the upper-left corner across all sub-views minimizes cognitive friction and eliminates disorientation.
- **Serial Position Effect (Hermann Ebbinghaus)**: Primacy effect—users scan the top-left corner first when searching for wayfinding controls to retreat to the preceding view.
- **Don't Make Me Think (Steve Krug)**: A unified visual language (`ArrowLeft` + `text-[14px] font-medium text-neutral-500 hover:text-black transition-colors cursor-pointer`) ensures instant recognition across Notifications, Settings, Orders, Messages, Product Detail, and Storefront views.
- **Gestalt Principle of Proximity & Spacing Rhythm**: Standardizing to `mb-6` (24px) creates visual breathing room and consistent vertical cadence across all views before cards and headers begin.

## Affected Files
- `web/src/features/notifications/components/BuyerNotifications.tsx` (140 lines)
- `web/src/features/profile/components/BuyerProfile.tsx` (192 lines)
- `web/src/features/orders/components/BuyerOrders.tsx` (162 lines)
- `web/src/features/conversations/components/BuyerConversations.tsx` (187 lines)
- `web/src/features/marketplace/components/SellerStorefront.tsx` (187 lines)

## Verification
- Checked line counts for all 5 modified files: all strictly $\le 200$ lines.
- Ran `cd web; bun run typecheck` (`tsc --noEmit`): exited with code 0 (zero errors).
