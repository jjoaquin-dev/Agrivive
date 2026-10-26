---
title: All Orders Page Tabs Cards and Dropdown Redesign
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-09-26 Buyer Web Orders Suite Redesign and UX Laws]]"
  - "[[2026-10-26 Search Header Category Dropdown Redesign]]"
  - "[[2026-10-26 General Font Inter Standardization]]"
---

# All Orders Page Comprehensive UI/UX Redesign

## Overview
Comprehensive redesign of the buyer's All Orders page (`/orders`) into a modern, clean, cohesive, and professional marketplace interface adhering to Agrivive's design system and strict geometric token rhythm:

1. **Canvas & Hierarchy**:
   - Page background set to `#FDFDFD`.
   - **24px outer page padding** (`px-6 py-6`).
   - **24px vertical gap** between major sections (`space-y-6`).
   - **16px component spacing** (`space-y-4` / `gap-4`).
   - **12px compact element padding** (`p-3`).
   - **28px bold page heading** (`text-[28px] font-bold text-[#14231A] leading-tight`).
   - **12px supporting description** (`text-xs text-[#5F7367]`).
   - **16px vertical gap** between heading and description (`mt-4`).
   - **40px-high Browse Marketplace button** (`h-10 min-h-[40px] px-5 rounded-xl font-semibold bg-[#457D00] text-white`) aligned to the upper right.

2. **Success & Error Banners**:
   - **16px-high visual separation** before banners (`mb-4`).
   - Styled with `1px solid #E8E8E8` border, subtle elevation, and accessible contrast.

3. **Status Tabs**:
   - **14px font size** (`text-sm`).
   - **44px height** (`h-11 min-h-[44px]`).
   - **16px horizontal padding** (`px-4`).
   - **2px active underline** in Agrivive primary green (`border-b-2 border-[#457D00] text-[#457D00] font-semibold`).
   - Inactive tabs in `#5F7367` with subtle hover transitions.
   - Preserved tab counts (`All Orders`, `Processing`, `Completed`, `Canceled`).

4. **Search & Sorting Controls**:
   - Search bar: **340px width and 40px height** (`w-full sm:w-[340px] h-10 min-h-[40px]`), pill shape (`rounded-full`), `1px solid #E8E8E8` border, white background, and inset search icon.
   - Sorting control: **40px height** ([`OrderSortDropdown.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/orders/components/OrderSortDropdown.tsx)) with custom floating popover (`rounded-2xl border border-[#E8E8E8] bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)]`), `px-3.5 py-2.5 rounded-xl` options, and brand green hover tint.
   - **16px gap** between search and sort controls (`gap-4`) with responsive wrapping on mobile.

5. **Order Cards**:
   - Minimum height: **160px** (`min-h-[160px]`).
   - Card geometry: **16px internal padding** (`p-4`), **16px border radius** (`rounded-[16px]`), **1px solid #E8E8E8 border**, and white background with subtle shadow.
   - **12px vertical spacing** between cards (`space-y-3`).
   - Top Header Strip: **12px font size** (`text-xs`) with stall information (green dot, stall name, separator, order date) and order ID, followed by **16px spacing** before product details (`pb-3 border-b border-[#E8E8E8] mb-4`).
   - Content Columns: **24px spacing between logical groups** (`gap-6`), **60×60px thumbnail with 10px border radius** (`size-[60px] rounded-[10px]`), **14px semibold produce name** (`text-sm font-semibold`), **12px secondary details** (`text-xs text-[#5F7367]`), and **16px bold price** (`text-base font-bold text-[#14231A]`).
   - Unified status badges: **12px font size**, **28px height** (`h-7 min-h-[28px]`), and **999px border radius** (`rounded-full`).
   - Action buttons: **40px height** (`h-10 min-h-[40px]`) with **8px spacing** (`gap-2`), green primary styling, subtle outlined secondary styling, and distinct disabled states.

## UI/UX Standards & Psychological Principles Applied
- **Gestalt Law of Common Region *(Max Wertheimer, Kurt Koffka)***: Bounding each order within its own card container with self-contained column labels creates complete autonomy per order.
- **Law of Proximity *(Gestalt)***: Grouped stall metadata, product descriptions, pricing, and actions with intentional 16px and 24px intervals.
- **Law of Similarity *(Gestalt)***: The sort dropdown shares identical geometric radius (`rounded-2xl`), ambient drop shadow (`shadow-[0_12px_36px_rgba(0,0,0,0.08)]`), and brand-tinted hover states (`hover:bg-[#457D00]/10`) with the header category dropdown.
- **Fitts's Law *(Paul Fitts)***: 40px hit targets for primary actions (`View Pass`, `View details`) and toolbar controls ensure effortless reachability.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Clean typographic rhythm in Inter, harmonious `#E8E8E8` borders, and `#FDFDFD` canvas elevate visual trust and conversion.

## Affected Files
- `web/src/features/orders/components/OrderSortDropdown.tsx` (94 lines)
- `web/src/features/orders/components/OrderFilterTabs.tsx` (52 lines)
- `web/src/features/orders/components/OrderStatusBadge.tsx` (35 lines)
- `web/src/features/orders/components/OrderCard.tsx` (142 lines)
- `web/src/features/orders/components/BuyerOrders.tsx` (152 lines)
- `web/app/orders/page.tsx` (7 lines)

## Verification Performed
1. Verified all files strictly adhere to the $\le 200$ lines limit:
   - `OrderSortDropdown.tsx`: 94 lines
   - `OrderFilterTabs.tsx`: 52 lines
   - `OrderStatusBadge.tsx`: 35 lines
   - `OrderCard.tsx`: 142 lines
   - `BuyerOrders.tsx`: 152 lines
   - `web/app/orders/page.tsx`: 7 lines
2. Ran `cd web && bun run typecheck` which completed with exit code 0 and zero TypeScript errors.
3. Verified both `http://localhost:3001/orders` and `http://localhost:3001/marketplace` respond with HTTP 200 OK.
