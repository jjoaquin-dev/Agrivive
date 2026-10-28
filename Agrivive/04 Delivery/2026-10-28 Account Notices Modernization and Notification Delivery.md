# 2026-10-28 Account Notices Modernization and Notification Delivery

## Context & Objectives
1. Modernize the account notice / cancellation advisory alert in the buyer orders page (`/orders`) by replacing the stretched, pale-yellow banner with a clean, modern card adhering to UI/UX hierarchy and Gestalt principles.
2. Deliver account notices (e.g. cancellation warnings, missed pickup warnings, and temporary reservation pauses) directly into the Buyer Notifications stream so they notify the user via the Header Notification Bell Dropdown and the dedicated `/notifications` hub.

## Why
1. Previously, the cancellation advisory was displayed as a full-width flat yellow `<Alert>` box with a bare icon and an unformatted block of text that stretched across the screen.
2. Account notices were only calculated on the profile and orders pages, but never flowed into the notifications list (`/notifications` or header dropdown). Consequently, buyers were not alerted to cancellation thresholds or warnings through their standard notification hub.

## What Changed
1. **Backend Notification Stream (`buyer.notices.list.ts` & `buyer.notice.read.ts`)**:
   - [`backend/src/modules/buyer/services/buyer.notices.list.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/buyer/services/buyer.notices.list.ts):
     - Integrated `trust_actions` into the buyer notices list query.
     - Returned account warnings (`trust_action_warning`) and temporary pauses (`trust_action_restriction`) with their specific explanatory `reason`.
   - [`backend/src/modules/buyer/services/buyer.notice.read.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/buyer/services/buyer.notice.read.ts):
     - Added support for reading and acknowledging action-based notices (`action:*`).
2. **Frontend Types (`types.ts`)**:
   - [`web/src/features/notifications/types.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/notifications/types.ts):
     - Added `trust_action_warning` and `trust_action_restriction` kinds, and added optional `reason?: string | null` to `BuyerNotice`.
3. **Notifications Page (`NotificationCardComponent.tsx` & `useBuyerNotifications.ts`)**:
   - [`web/src/features/notifications/components/NotificationCardComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/notifications/components/NotificationCardComponent.tsx):
     - Added dedicated render states for `isWarning` and `isRestriction`.
     - Displays `AlertTriangle` in amber/rose badge, clear headline ("Account Notice: Cancellation Advisory" or "Reservations Temporarily Paused"), the exact reason description, and a direct "View Orders" link.
   - [`web/src/features/notifications/hooks/useBuyerNotifications.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/notifications/hooks/useBuyerNotifications.ts):
     - Categorizes trust action notices under the **System Alerts** tab (`updates`) as well as **All Updates**.
4. **Header Notification Dropdown (`NotificationItemComponent.tsx`)**:
   - [`web/src/features/notifications/components/NotificationItemComponent.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/notifications/components/NotificationItemComponent.tsx):
     - Formatted real-time notice item cards with the warning icon badge and direct button routing to `/orders`.
5. **Modernized In-Page Order Banners (`BuyerTrustBanner.tsx` & `TrustAccessNotice.tsx`)**:
   - [`web/src/features/orders/components/BuyerTrustBanner.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/orders/components/BuyerTrustBanner.tsx):
     - Redesigned into an elevated white card (`bg-white border border-amber-200/80 shadow-xs`) with a rounded icon badge (`size-10 bg-amber-50 ring-4 text-amber-600`), bold headline with "Advisory" pill, and at-a-glance count badge (`6 of 7 cancellations`).
   - [`web/src/features/trust/components/TrustAccessNotice.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/trust/components/TrustAccessNotice.tsx):
     - Redesigned into matching modern card architecture with rose accents.

## Affected Files
- `backend/src/modules/buyer/services/buyer.notices.list.ts`
- `backend/src/modules/buyer/services/buyer.notice.read.ts`
- `web/src/features/notifications/types.ts`
- `web/src/features/notifications/hooks/useBuyerNotifications.ts`
- `web/src/features/notifications/components/NotificationCardComponent.tsx`
- `web/src/features/notifications/components/NotificationItemComponent.tsx`
- `web/src/features/orders/components/BuyerTrustBanner.tsx`
- `web/src/features/trust/components/TrustAccessNotice.tsx`

## Verification Performed
- `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` -> Passed with 0 errors (bundled 1,833 modules in 482ms).
- `cd web && bunx tsc --noEmit` -> Passed with 0 errors.
- Verified all source files strictly adhere to the 200-line requirement:
  - `buyer.notices.list.ts`: 86 lines ($\le 200$)
  - `buyer.notice.read.ts`: 83 lines ($\le 200$)
  - `types.ts`: 26 lines ($\le 200$)
  - `useBuyerNotifications.ts`: 117 lines ($\le 200$)
  - `NotificationCardComponent.tsx`: 189 lines ($\le 200$)
  - `NotificationItemComponent.tsx`: 166 lines ($\le 200$)
  - `BuyerTrustBanner.tsx`: 61 lines ($\le 200$)
  - `TrustAccessNotice.tsx`: 39 lines ($\le 200$)
