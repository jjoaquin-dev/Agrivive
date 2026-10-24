# 2026-10-25 Mobile Notifications Page UI Replication

## Overview
Replicated the visual design and interaction flow of the mobile Notifications screen from the Figma / design reference assets in `/home/jarajoaquinjara/Downloads/AGRIVIVE - DESIGNS (4)` (`NotificationsPage.png`, `NotificationsPage-1.png`, and `NotificationsPage-2.png`), strictly bound to live database models and real API feeds according to `.agents/rules/design-replication-rule/RULE.md`.

## Key Implementations & Enhancements
1. **Real Data Integration**:
   - **Reservations & Orders**: Directly bound to live records from `/seller/orders` (`orders`, `ordered_items`, `sellers_product`), with urgent expiring countdowns, active pickup confirmations, and cancellations.
   - **Buyer Messages**: Directly bound to live records from `/conversations` (`conversations`, `conversation_messages`, `order_inquiries`), showing actual buyer names, message snippets, and unread states.
   - **Published Listings**: Bound to live products from `/seller/products` (`sellers_product`).
   - **Trust & Compliance Notices**: Bound to `/seller/notifications` (`trust_notices`).
   - **Promotions & Visibility Boosts**: Bound to `/seller/promotions` and `/seller/promotions/boost-prompts`.
2. **Replicated Visual Hierarchy**:
   - **Top Navigation Bar (`NotificationHeaderBar`)**: Clean back arrow, `Notifications` title, orange unread pill badge (`X unread`), Mark All Read checkmark button, and menu options button.
   - **Summary Banner (`NotificationSummaryBanner`)**: Deep forest green card (`#065F46`) displaying total unread updates, immediate attention counters, and tactile `Mark All Read` CTA.
   - **Filter Category Pills (`NotificationCategoryTabs`)**: Horizontally scrollable pills with live counts for `All`, `Reservations`, `Messages`, `Listings`, and `Trust`.
   - **Search & Filter Bar (`NotificationSearchBar` & `NotificationFilterModal`)**: Live client-side text search across titles and descriptions, paired with a bottom sheet modal for filtering by Unread Only, Immediate Attention Only, and Sorting (Newest/Oldest).
   - **Grouped Timeline Sections**: Grouped dynamically by `TODAY`, `YESTERDAY`, and `EARLIER`.
   - **Adaptive Card Variants (`NotificationTimelineCard`)**:
     - *Urgent/Expiring*: Coral border (`#FB923C`), peach icon container, orange action CTA, relative expiration indicator.
     - *New/Unread*: Mint green border (`#86EFAC`), light mint background, green unread dot `●`, green action CTA.
     - *Standard*: Crisp white background, light gray border, relative timestamps, secondary view action buttons.
3. **Ergonomics & Design Standards**:
   - Adheres to **Jakob's Law** (familiar notification timeline patterns), **Fitts's Law** ($\ge 44$px touch targets), **Von Restorff Effect** (accent colors reserved for urgent attention), and **Doherty Threshold** (optimistic mark-as-read state).
   - All source code files strictly maintained under 200 lines.

## Affected Files
- `mobile/src/features/notifications/types.ts`
- `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`
- `mobile/src/features/notifications/components/NotificationHeaderBar.tsx`
- `mobile/src/features/notifications/components/NotificationSummaryBanner.tsx`
- `mobile/src/features/notifications/components/NotificationCategoryTabs.tsx`
- `mobile/src/features/notifications/components/NotificationSearchBar.tsx`
- `mobile/src/features/notifications/components/NotificationTimelineCard.tsx`
- `mobile/src/features/notifications/components/NotificationTimelineCard.styles.ts`
- `mobile/src/features/notifications/components/NotificationFilterModal.tsx`
- `mobile/app/(app)/notifications.tsx`

## Verification Performed
1. `cd mobile && bunx tsc --noEmit` $\to$ Passed (code 0, 0 errors).
2. `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` $\to$ Passed (code 0, 1,704 modules bundled).
3. Verified all 9 files are $\le 200$ lines.
4. Verified real data queries for active seller `HVZYGqepZcVtiqSkq7lnNjF7jjHKpETO` (orders, conversations, products, notices).

## Commit Details
- **Commit Hash**: `87164a6`
- **Message**: `Enhance notifications and messages UI with real data integration`
