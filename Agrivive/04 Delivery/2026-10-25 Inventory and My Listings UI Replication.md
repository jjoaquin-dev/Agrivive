---
title: Inventory and My Listings UI Replication
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-25 Single Character OTP and TOTP Input Replication]]"
  - "[[2026-10-25 Mobile Login UI Enhancement]]"
  - "[[2026-10-20 Mobile UI-UX Navigation Placement and Keyboard Overlap Overhaul]]"
---

# Inventory and My Listings UI Replication

## What changed

1. **`mobile/src/features/inventory/components/ProductCard.tsx`**:
   - Replicated the visual design from `MyListingsPage.png` and `MyListingsPage-1.png`.
   - Card container updated with 16px border-radius, crisp `#E5E7EB` border, and soft elevation.
   - 64×64px squircle product thumbnail with pastel green `#ECFDF5` background for vegetable listings.
   - Header with bold product title, product ID (`PRD-XXXX`), status badges (`Active`, `Low Stock`, `Sold Out`, `Archived`), and green price (`₱XX / kg`).
   - Integrated a **segmented stock progress bar** with Available vs Sold breakdown metrics.
   - Added an **expandable details accordion** ("Details v" / "Less ^") revealing category, unit, condition, and 12-hour price reduction schedule.
   - Added dual action buttons: white "Details" toggle button alongside a full green **"Edit Listing"** button (`#0F920F`, `borderRadius: 12`, white bold text).

2. **`mobile/app/(app)/(tabs)/inventory.tsx`**:
   - Top header with title **"My Listings"** (`#111827`, 24px bold) and subtitle `"Manage your surplus products"`.
   - Top action buttons: notification bell with indicator dot and three-dot options menu popup matching `image 1.png` ("View Archived Listings", "Marketing & Boosts", "Listing Advisories & Help").
   - **Horizontal metric / summary cards**:
     - *Active Card*: Mint `#ECFDF5` background, `#059669` count and text, "Visible to buyers".
     - *Low Stock Card*: Amber `#FFFBEB` background, `#D97706` count and text, "Needs attention".
     - *Out of Stock Card*: Rose `#FEF2F2` background, `#DC2626` count and text, "Restock or archive".
   - Search bar styled with squircle rounded border (`borderRadius: 14`, border `1px solid #E5E7EB`).
   - Filter chips with counters (`All`, `Low Stock`, `Out of Stock`, `Archived`) in pill styling with green active state.
   - Horizontal category scroll pills matching the standard vegetable catalog categories.
   - Filter & sort summary row with count indicator.
   - Floating Action Button (FAB) and empty state CTAs navigating directly to product creation.

## Why

- To achieve high-fidelity visual alignment with the Figma design references in `AGRIVIVE - DESIGNS (2)` (`MyListingsPage.png`, `MyListingsPage-1.png`, and `image 1.png`) in strict accordance with `.agents/rules/design-replication-rule/RULE.md` (visual enhancements only, strictly preserving existing business logic, validation, API hooks, and data models).

## Affected paths

- `mobile/src/features/inventory/components/ProductCard.tsx`
- `mobile/app/(app)/(tabs)/inventory.tsx`
- `Agrivive/04 Delivery/2026-10-25 Inventory and My Listings UI Replication.md`

## Verification performed

- Ran `bunx tsc --noEmit` in `mobile/` &rarr; Passed with 0 errors.
- Verified all card interactions: expansion toggle, press navigation to details, and "Edit Listing" navigation to edit screen.
- Verified filtering, search, category pills, and pull-to-refresh.
