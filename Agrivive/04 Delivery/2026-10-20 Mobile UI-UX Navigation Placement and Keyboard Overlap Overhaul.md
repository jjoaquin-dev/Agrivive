# 2026-10-20 Mobile UI-UX Navigation Placement and Keyboard Overlap Overhaul

## Overview
Comprehensive overhaul of the mobile UI/UX focusing on navigation architecture (#1 priority), keyboard occlusion prevention across all forms, elimination of pill filter loading flickering, dynamic unread status indicators, and modular decomposition adhering to the strict $\le 200$ lines per source file rule.

---

## What Changed

### 1. Navigation Placement & Hierarchy (#1 Priority)
- **Bottom Tab Restructure** (`mobile/app/(app)/(tabs)/_layout.tsx`):
  - Promoted `Messages` into the primary bottom navigation bar with a live unread badge counter (`tabBarBadge`) and dynamic icon morphing (`MessageCircle` when clear, `MessageCircleMore` when unread).
  - Configured 5 primary seller operational tabs: `Home` | `Inventory` | `Reservations` (Pickups) | `Messages` | `Profile`.
  - Calibrated platform-specific tab bar height and insets (`height: Platform.OS === 'ios' ? 84 : 64`, `paddingBottom: Platform.OS === 'ios' ? 24 : 8`) for thumb reachability and gesture bar clearance.
  - Relocated stock audit ledger from `(tabs)/activity.tsx` to a dedicated stack screen (`mobile/app/(app)/activity.tsx`, titled *"Change History"*), accessible from the Home dashboard and Inventory.
  - Registered `activity` stack route in `mobile/app/(app)/_layout.tsx`.
  - Maintained backward-compatibility for direct route pushes in `mobile/app/(app)/messages.tsx`.

### 2. Elimination of Pill Filter Loading Flicker
- Fixed the issue where selecting category or status pills caused full-screen loading spinners and layout tearing:
  - **Orders Screen** (`mobile/app/(app)/(tabs)/orders.tsx`): Removed screen-wiping conditional block. The header and status pill bar (`Waiting`, `Done`, `Cancelled`, `Expired`, `All`) stay persistently mounted. Inline loading spinner is rendered inside the list area when fetching.
  - **Notifications Screen** (`mobile/app/(app)/notifications.tsx`): Preserved the header and horizontal category filter pills (`All`, `Priority Boost`, `Orders`, `Messages`, `Trust`, `Filter Unread`) during filter selection and unread toggling.
  - **Activity Screen** (`mobile/app/(app)/activity.tsx`): Maintained persistent header and filter chips (`All Activity`, `Added`, `Taken Away`) with in-memory memoized transitions.

### 3. Dynamic Unread Indicators on Dashboard Header
- Built `DashboardHeader.tsx` (`mobile/src/features/dashboard/components/DashboardHeader.tsx`):
  - Dynamically switches the message icon between `MessageCircle` (0 unread) and `MessageCircleMore` with Terracotta accent and badge when open messages exist.
  - Dynamically switches the notification icon between `Bell` (0 unread) and `BellDot` with Terracotta accent and badge when unread notifications exist.
  - Added elevated tinted icon buttons for clear system status visibility.

### 4. Home Dashboard Overhaul & Decomposition
- Decomposed the legacy 800-line monolithic `home.tsx` into modular components under 200 lines each:
  - `mobile/app/(app)/(tabs)/home.tsx` (139 lines): Coordinator, auth state, and refresh hooks.
  - `DashboardHeader.tsx` (167 lines): Dynamic unread badges and shop badge.
  - `DashboardTwinActions.tsx` (84 lines): Primary `[ + Add Product ]` and `[ 📷 Scan QR Pass ]` action bar.
  - `DashboardMetrics.tsx` (152 lines): Overview cards (Total Produce, Low Amount, Out of Stock).
  - `DashboardUnitTotals.tsx` (95 lines): Separate breakdown for kg, sacks, and piles.
  - `DashboardOperationsHub.tsx` (136 lines): 2×2 grid (*Analytics*, *Boosts*, *Change History*, *Advisories*).
  - `DashboardLowStockAlerts.tsx` (168 lines): Actionable alerts with tactile "Add More" action.
  - `DashboardRecentActivity.tsx` (180 lines): Ledger snapshot with direct navigation to Change History.

### 5. Keyboard Occlusion Fix Across Forms
- Prevented virtual keyboard from covering inputs and submit buttons:
  - `ProductForm.tsx` (`mobile/src/features/inventory/components/ProductForm.tsx`): Wrapped in `KeyboardAvoidingView` (`keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}`), enabled `keyboardDismissMode="on-drag"` and `keyboardShouldPersistTaps="handled"`, and expanded bottom scroll clearance to `paddingBottom: 140`.
  - `StockChangeForm.tsx` (`mobile/src/features/inventory/components/StockChangeForm.tsx`): Modularized with `StockActionTabs.tsx`, `StockProjectionCard.tsx`, and `StockReasonSelector.tsx` (all $\le 160$ lines). Wrapped in `KeyboardAvoidingView` with `keyboardDismissMode="on-drag"` and `paddingBottom: 140`.
  - `ConversationDetailScreen` (`mobile/app/(app)/conversations/[id].tsx`): Calibrated `keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}` and `keyboardDismissMode="on-drag"`.
  - `ProfileEditScreen` (`mobile/app/(app)/profile/edit.tsx`): Calibrated `keyboardVerticalOffset={88}`, added `keyboardDismissMode="on-drag"`, and increased `paddingBottom: 140`.
  - `ProfileSetupScreen` (`mobile/app/(app)/profile/setup.tsx`): Calibrated `keyboardVerticalOffset={88}`, added `keyboardDismissMode="on-drag"`, and increased `paddingBottom: 140`.
  - `LoginScreen` & `RegisterScreen` (`mobile/app/(auth)/`): Added calibrated vertical offsets, `keyboardDismissMode="on-drag"`, and bottom clearance.

### 6. Design System Tokens & Tactile Interactions
- `mobile/src/theme/index.ts`: Added ambient shadows (`shadows.card`, `shadows.elevated`), surface tints (`primaryLight`, `primarySurface`, `surfaceMuted`), and radii (`card: 16`, `button: 14`).
- `CardComponent.tsx`: Added soft ambient elevation (`#1F4D3A` shadow tint, figure-ground separation).
- `ButtonComponent.tsx`: Added tactile `:active` scale compression (`scale: 0.98`) under $400\text{ms}$ response threshold.

---

## Affected Files
- `mobile/src/theme/index.ts`
- `mobile/src/components/CardComponent.tsx`
- `mobile/src/components/ButtonComponent.tsx`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/app/(app)/(tabs)/home.tsx`
- `mobile/app/(app)/(tabs)/messages.tsx`
- `mobile/app/(app)/(tabs)/orders.tsx`
- `mobile/app/(app)/activity.tsx`
- `mobile/app/(app)/messages.tsx`
- `mobile/app/(app)/notifications.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/conversations/[id].tsx`
- `mobile/app/(app)/profile/edit.tsx`
- `mobile/app/(app)/profile/setup.tsx`
- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/register.tsx`
- `mobile/src/features/dashboard/components/DashboardHeader.tsx`
- `mobile/src/features/dashboard/components/DashboardTwinActions.tsx`
- `mobile/src/features/dashboard/components/DashboardMetrics.tsx`
- `mobile/src/features/dashboard/components/DashboardUnitTotals.tsx`
- `mobile/src/features/dashboard/components/DashboardOperationsHub.tsx`
- `mobile/src/features/dashboard/components/DashboardLowStockAlerts.tsx`
- `mobile/src/features/dashboard/components/DashboardRecentActivity.tsx`
- `mobile/src/features/inventory/components/ProductForm.tsx`
- `mobile/src/features/inventory/components/ProductFormStyles.ts`
- `mobile/src/features/inventory/components/StockChangeForm.tsx`
- `mobile/src/features/inventory/components/StockActionTabs.tsx`
- `mobile/src/features/inventory/components/StockProjectionCard.tsx`
- `mobile/src/features/inventory/components/StockReasonSelector.tsx`
- `mobile/src/features/inventory/components/ActivityItemRow.tsx`
- `mobile/src/features/inventory/components/ActivityStyles.ts`

---

## Verification Performed
1. **TypeScript Typecheck**:
   - `mobile/`: `bunx tsc --noEmit` exited with code 0 (zero errors).
   - `backend/`: `bunx tsc --noEmit` exited with code 0 (zero errors).
   - `web/`: `bunx tsc --noEmit` exited with code 0 (zero errors).
2. **Source Code Length Audit**:
   - Verified programmatically via Node.js script that all 25 touched and created files are strictly under the 200-line limit.
