---
title: Web Buyer Notification Popover Enhancements
type: enhancement
status: completed
created: 2026-10-26
---

# Web Buyer Notification Popover Enhancements

## Context & Objectives
Replace the standard page navigation on the notification bell (`/notifications`) with an in-place popover modal anchored directly beneath the notification bell in `BuyerSiteHeader`. The interface adopts the visual design and structure of the reference modal (segmented category pills, dual timestamps, message previews, action buttons, and footer controls) while integrating Agrivive's color palette, produce/reservation context, and strict UI/UX laws.

---

## Change Log: 2026-10-26

### In-Place Header Notification Popover
- **Why**: 
  - Navigating away from the active marketplace page to view notifications broke user flow and cognitive momentum (*Jakob's Law*, *Don't Make Me Think*).
  - Users need quick access to reservation alerts, cancellation updates, and followed seller produce listings directly from the header without page reloads.
- **What Changed**:
  - **Hook `useBuyerNotifications.ts`**:
    - Manages fetching `/buyer/notices`, real-time unread counts, segmented category counts, optimistic read actions, and "Mark all as read" execution.
  - **Component `NotificationItemComponent.tsx`**:
    - Renders individual notification rows with circular avatar and activity icon badges (produce sprout, order package, inquiry clock).
    - Formats dual timestamps: calendar date/time (`Thursday 4:20pm`) and relative time (`2 hours ago`).
    - Unread indicator dot in Agrivive Forest Green (`#457D00`).
    - Subtle preview card for notice descriptions.
    - Contextual action buttons (*"View produce"*, *"View order"*, *"Details"*).
  - **Component `NotificationDropdownComponent.tsx`**:
    - Dropdown modal container with rounded corners (`rounded-[24px]`), crisp border (`#E5E2DA`), and soft shadow (`0 20px 50px rgba(31,77,58,0.14)`).
    - Top header with bold title *"Your notifications"* and tactile *"Mark all as read"* button.
    - Segmented filter pills row with live count badges (*"View all"*, *"Orders"*, *"Produce"*, *"Updates"*).
    - Scrollable notification list with animated skeleton loaders and clean empty state.
    - Footer with *"Manage notifications"* link and *"View all notifications"* primary action button.
  - **Component `BuyerSiteHeader.tsx`**:
    - Replaced the static `<Link href="/notifications">` with an interactive button trigger and ref-anchored dropdown.
    - Dynamic unread count badge (`bg-pink-500`) that updates optimistically.
    - Outside-click and `Escape` key listeners for seamless keyboard and pointer dismissal (*Fitts's Law*, *Jakob's Law*).
- **Affected File Paths**:
  - `web/src/features/notifications/hooks/useBuyerNotifications.ts`
  - `web/src/features/notifications/components/NotificationItemComponent.tsx`
  - `web/src/features/notifications/components/NotificationDropdownComponent.tsx`
  - `web/src/components/BuyerSiteHeader.tsx`
- **Verification Performed**:
  - `npm --prefix web run typecheck` (`tsc --noEmit`) completed with 0 errors.
  - Verified modular file size constraints (all files $\le 200$ lines).

### Full-Page Notification Hub Redesign (`/notifications`)
- **Why**: 
  - The previous `/notifications` page displayed a bare, barren empty card with a thin outline bell, lacking category segmentation, visual hierarchy, and actionable CTAs.
  - Needed a cohesive, modern layout conforming to Agrivive UI/UX laws (*Aesthetic-Usability Effect*, *Peak-End Rule*, *Hick-Hyman Law*).
- **What Changed**:
  - **Component `NotificationEmptyStateComponent.tsx`**:
    - Ambient radial warm emerald glow behind an elevated double-ringed icon badge.
    - Encouraging narrative copy explaining Bankerohan & Agdao market surplus drops and hold updates.
    - Dual primary CTAs: *"Explore Surplus Produce"* $\rightarrow$ `/marketplace` and *"Check Active Passes"* $\rightarrow$ `/orders`.
    - Three informative feature highlight ribbons (*"Morning Produce Drops"*, *"Hold Expirations"*, *"Stall Pickup Alerts"*).
  - **Component `NotificationCardComponent.tsx`**:
    - Full-page feed card with avatar, role badge, dual timestamp, preview card, and direct action CTAs (*"View Produce"*, *"Open Details"*).
  - **Component `BuyerNotifications.tsx`**:
    - Upgraded page header with *"Notifications Hub"* kicker, unread chip counter, and tactile *"Mark all as read"* button.
    - Segmented filter pills (*"All Updates"*, *"Reservations"*, *"Produce Drops"*, *"System Alerts"*) with dynamic counters.
- **Affected File Paths**:
  - `web/src/features/notifications/components/NotificationEmptyStateComponent.tsx`
  - `web/src/features/notifications/components/NotificationCardComponent.tsx`
  - `web/src/features/notifications/components/BuyerNotifications.tsx`
- **Verification Performed**:
  - `npm --prefix web run typecheck` (`tsc --noEmit`) completed with 0 errors.
  - Checked all files strictly adhere to the $\le 200$ lines limit.

### Typography Weight Calibration & Hierarchy Refinement
- **Why**: 
  - Multiple components across the marketplace and notification features used heavy `font-black` (weight 900) and `font-extrabold` (weight 800), resulting in visual fatigue and a chunky "100% bold" appearance.
  - Aligned typography with calibrated `font-semibold` (weight 600, ~70% bold) to maintain visual hierarchy and an editorial feel without optical noise (*Weber-Fechner Law*, *Aesthetic-Usability Effect*).
- **What Changed**:
  - **`ProductCardAction.tsx`**: Refined "Add to Cart" button, stock quantity selector, and in-cart indicators from `font-black`/`font-extrabold` to `font-semibold`.
  - **`ProductCard.tsx`**: Refined price display (`₱25`) from `font-black` to `font-bold tracking-tight`, and card header kickers to `font-semibold`.
  - **`MarketplaceFilterSidebar.tsx`**: Softened sidebar title *"Filters"* and uppercase category labels from `font-extrabold`/`font-bold` to `font-semibold`.
  - **`NotificationDropdownComponent.tsx`**: Calibrated *"View all notifications"* button and header from `font-bold` to `font-semibold tracking-wide`.
  - **`BuyerNotifications.tsx`**: Adjusted page `h1` from `font-black` to `font-bold`, and filter tabs from `font-bold` to `font-semibold`.
  - **`NotificationEmptyStateComponent.tsx`** & **`NotificationCardComponent.tsx`**: Calibrated headline, badges, and action buttons to `font-semibold`.
- **Affected File Paths**:
  - `web/src/features/marketplace/components/ProductCardAction.tsx`
  - `web/src/features/marketplace/components/ProductCard.tsx`
  - `web/src/features/marketplace/components/MarketplaceFilterSidebar.tsx`
  - `web/src/features/notifications/components/NotificationDropdownComponent.tsx`
  - `web/src/features/notifications/components/BuyerNotifications.tsx`
  - `web/src/features/notifications/components/NotificationEmptyStateComponent.tsx`
  - `web/src/features/notifications/components/NotificationCardComponent.tsx`
  - `web/src/features/notifications/components/NotificationItemComponent.tsx`
- **Verification Performed**:
  - `npm --prefix web run typecheck` (`tsc --noEmit`) completed with 0 errors.
  - Verified modular file size constraints (all files $\le 200$ lines).

### Notification Modal Filter Pills Horizontal Scrollbar Removal
- **Why**:
  - On Windows browsers, an intrusive native gray scrollbar appeared below the filter pills (*"View all 0"*, *"Orders 0"*, etc.) in the notification dropdown modal.
  - The pills container used `overflow-x-auto` alongside a `.no-scrollbar` utility class that was not yet defined in the global stylesheet, breaking the visual integrity and seamless capsule look (*Aesthetic-Usability Effect*, *Gestalt Law of Common Region & Simplicity*).
- **What Changed**:
  - **`web/src/styles/tokens.css`**: Added cross-browser `.no-scrollbar` utility rules suppressing WebKit, Firefox, and legacy Edge scrollbars.
  - **`web/src/features/notifications/components/NotificationDropdownComponent.tsx`**: Added explicit inline arbitrary variants `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` and calibrated pill horizontal padding from `px-3` to `px-2.5` to sit naturally within the container width.
  - **`web/src/features/notifications/components/BuyerNotifications.tsx`**: Added consistent inline scrollbar suppression variants to the full-page notification pills.
- **Affected File Paths**:
  - `web/src/styles/tokens.css`
  - `web/src/features/notifications/components/NotificationDropdownComponent.tsx`
  - `web/src/features/notifications/components/BuyerNotifications.tsx`
- **Verification Performed**:
  - `bun run typecheck` (`tsc --noEmit`) completed with 0 errors.
  - Verified running Next.js dev server hot reload and clean responsive rendering.

