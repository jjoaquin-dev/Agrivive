---
title: Seller Dashboard UI Replication (Strict RULE.md Compliance)
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-24 Mobile Login Flow UI Replication]]"
  - "[[02 Product/Feature Map]]"
  - "[[05 Enhancements/05 Mobile and Backend Flow Enhancements]]"
---

# Seller Dashboard UI Replication (Strict RULE.md Compliance)

## What changed

Applied the visual design, typography, card shapes, 2×2 metric grid, and 3×2 pastel tile styling from the reference design (`media_1792860454963_76b79a91.png`) **strictly to our actual existing system fields and data**, eliminating all mock/synthetic placeholders in full adherence to `.agents/rules/design-replication-rule/RULE.md`.

### Field & Component Mapping:

1. **`DashboardHeader.tsx`**:
   - Replicated top brand row: Agrivive logo in Forest Green (`#16A34A`), stall location with `MapPin` (bound strictly to `setup.profile.shopName`), circular notification bell with unread indicator dot (`unreadCount > 0`), and seller initials avatar circle (`MS` derived from `sellerName`).
   - Greeting ("Good morning," / "Maayong adlaw,"), seller name (`setup.account.name || session.user.name || "Seller"`), `✓ Verified` badge (bound to `setup.sellerVerified`), and tagline.

2. **`DashboardTwinActions.tsx`**:
   - Primary full-width Forest Green **"Add Surplus Product"** card (`#0F920F`) with circular icon and chevron `>` navigating to `/(app)/inventory/create`.
   - Secondary **"Scan Pickup QR"** white card (`#FFFFFF`, border `#E5E7EB`) with green QR icon in light mint square navigating to `/(app)/orders/scan`.

3. **`DashboardMetrics.tsx`**:
   - 2×2 grid of metric cards mapped strictly to existing `summary: InventorySummary`:
     - 📋 **Active Listings**: Bound to `summary.activeCount` (green `#16A34A`, "Visible to buyers").
     - ⚠️ **Low Amount**: Bound to `summary.lowStockCount` (amber `#D97706`, "Needs attention").
     - 📦 **Out of Stock**: Bound to `summary.outOfStockCount` (coral `#DC2626`, "Depleted produce").
     - 🍃 **Available Surplus**: Bound to `summary.unitTotals` (`${kilo} kg · ${sack} sacks`, indigo `#4F46E5`, "Across active listings").

4. **`DashboardOperationsHub.tsx`**:
   - Replicated the 3×2 pastel tile grid under "Needs Your Attention" (Tap any item for details), mapped strictly to our 6 actual operational routes:
     - ⚠️ **Low Stock** (Amber `#FFFBEB`): Shows actual `lowStockCount` $\to$ `/(app)/(tabs)/inventory`
     - 💬 **Messages** (Indigo `#EEF2FF`): Shows actual `openMessageCount` $\to$ `/(app)/(tabs)/messages`
     - 📊 **Analytics** (Mint `#ECFDF5`): Sales & insights $\to$ `/(app)/analytics`
     - 📢 **Boosts** (Orange `#FFF7ED`): Visibility boosts $\to$ `/(app)/boosts`
     - 🔄 **Change History** (Blue `#F0F9FF`): Audit ledger $\to$ `/(app)/activity`
     - 🌡️ **Advisories** (Yellow `#FEFCE8`): Market alerts $\to$ `/(app)/advisories`

5. **`DashboardLowStockAlerts.tsx`**:
   - White rounded card (`borderRadius: 16`, border `#E5E7EB`) rendering real `lowStockProducts` when items are near threshold.

6. **`DashboardRecentActivity.tsx`**:
   - White rounded card rendering real `recentActivity` items from `fetchStockAdjustments()`.

7. **`mobile/app/(app)/(tabs)/home.tsx`**:
   - Coordinates only real data from `useAuth()`, `useInventory()`, `fetchStockAdjustments()`, `fetchSellerNotifications()`, and `fetchSellerMessages()`.
   - Zero hallucinated fields, zero mock bar charts, zero synthetic weather/holiday placeholders.

8. **Bottom Dock Replication (`mobile/app/(app)/(tabs)/_layout.tsx` & `create.tsx`)**:
   - Tab 1: **Home** (`Home` icon, filled green `#16A34A` when active).
   - Tab 2: **Listings** (`LayoutGrid` icon, routes to `inventory.tsx`).
   - Tab 3 (Center): **Elevated Floating Green Button** (`#16A34A`, 48×48px, circle with white `+` icon, green "Add" label underneath, intercepts press to route immediately to `/(app)/inventory/create`).
   - Tab 4: **Messages** (`MessageCircle` icon with red `#EF4444` unread badge count, routes to `messages.tsx`).
   - Tab 5: **Reservations** (`CalendarDays` icon, routes to `orders.tsx`).
   - Profile tab: Hidden from tab bar (`href: null`), accessible via top header avatar circle.
   - Redirect fallback: `mobile/app/(app)/(tabs)/create.tsx` ensures clean Expo Router route resolution.

## Verification performed

1. **Mobile TypeScript Verification:**
   - Ran `bunx tsc --noEmit --project mobile/tsconfig.json` $\to$ **Exit code 0, 0 type errors**.
2. **Backend Verification:**
   - Ran `bunx tsc --noEmit` & `bun build src/index.ts --outdir dist --target bun` $\to$ **Exit code 0, 1704 modules bundled successfully**.
3. **Line Count Audit:**
   - All components strictly observe the $\le 200$ line limit:
     - `DashboardHeader.tsx`: 120 lines
     - `DashboardMetrics.tsx`: 141 lines
     - `DashboardOperationsHub.tsx`: 161 lines
     - `DashboardTwinActions.tsx`: 148 lines
     - `DashboardLowStockAlerts.tsx`: 167 lines
     - `DashboardRecentActivity.tsx`: 179 lines
     - `home.tsx`: 146 lines
     - `_layout.tsx`: 177 lines
     - `create.tsx`: 7 lines
