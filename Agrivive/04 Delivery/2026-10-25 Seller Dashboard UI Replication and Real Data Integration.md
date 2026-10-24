---
title: Seller Dashboard UI Replication and Real Data Integration
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-24 Mobile Login Flow UI Replication]]"
  - "[[02 Product/Feature Map]]"
  - "[[05 Enhancements/05 Mobile and Backend Flow Enhancements]]"
---

# Seller Dashboard UI Replication and Real Data Integration

## What changed

Replicated the complete Seller Dashboard UI from the approved design reference (`media_1792860454963_76b79a91.png`) following the strict field-mapping and architectural principles in `.agents/rules/design-replication-rule/RULE.md` and repository guidelines in `AGENTS.md`.

Every visual component maps 100% directly to real system models, backend API responses, and user state:

1. **`DashboardHeader.tsx` & `DashboardHeaderBrand.tsx`**:
   - Replicated top brand row: Agrivive logo in Forest Green (`#16A34A`), stall address with `MapPin` (derived from `setup.profile.detailAddress` or `shopName`), circular notification bell with unread indicator dot, and seller avatar circle with initials (`MS`).
   - Dynamic time-based greeting ("Good morning," / "Good afternoon," / "Good evening,"), bold seller name (`setup.account.name` or `session.user.name`), `✓ Verified` badge when verified, and seller role tagline.

2. **`DashboardTwinActions.tsx`**:
   - Primary full-width **"Add Surplus Product"** card in `#0F920F` with circular vegetable sprout icon, subtitle, and chevron `>` navigating to `/(app)/inventory/create`.
   - Secondary **"Scan Pickup QR"** white card with green QR icon in light mint square navigating to `/(app)/orders/scan`.

3. **`DashboardMetrics.tsx`**:
   - 2x2 grid of metric cards:
     - 📋 **Active Listings**: Real active listings count (`summary.activeCount`) in green.
     - 📦 **Reserved**: Real reserved volume (`{reservedKg} kg reserved` or active reservation orders count) in indigo `#4F46E5`.
     - ✅ **Completed Pickups**: Real completed orders count (`orderCounts.completed`) via QR in green.
     - 🍃 **Available Surplus**: Real available inventory across units (`{kiloTotal} kg · {sackTotal} sacks`) in warm amber `#D97706`.

4. **`DashboardAttentionGrid.tsx`**:
   - 3x2 grid of pastel colored alert cards under "Needs Your Attention" (Tap any item for details):
     - ⏰ **Expiring Soon**: Count of buyer reservations within 6h of expiration (`/(app)/(tabs)/orders`).
     - ⚠️ **Low Stock**: Real count of produce at or below low stock threshold (`/(app)/(tabs)/inventory`).
     - 💬 **Messages**: Real open customer inquiry / conversation count (`/(app)/(tabs)/messages`).
     - 🌡️ **Weather Alert**: Navigation to real-time Davao weather advisory (`/(app)/advisories`).
     - 📢 **Content Ready**: Real visibility boost prompts ready for social promotion (`/(app)/boosts`).
     - 🔄 **Update Needed**: Navigation to stock audit history and ledger (`/(app)/activity`).

5. **`DashboardListingsSummary.tsx`**:
   - "My Listings" status breakdown with 4 colored status pills:
     - **Active** (green)
     - **Draft** (slate/grey)
     - **Reserved** (indigo)
     - **Sold Out** (coral red)
   - Full-width mint pill button "View All Listings >" (`/(app)/(tabs)/inventory`).

6. **`DashboardReservationsSummary.tsx`**:
   - "Reservations" status breakdown with 4 colored status pills:
     - **Active** (green)
     - **Expiring** (salmon orange)
     - **Completed** (slate)
     - **Cancelled** (light red)
   - Full-width mint pill button "View All Reservations >" (`/(app)/(tabs)/orders`).

7. **`DashboardAnalyticsSection.tsx` & `DashboardAnalyticsChart.tsx`**:
   - "Analytics" card with "Full View" pill button navigating to `/(app)/analytics`.
   - Interactive date range tabs: `Today` | `Last 7 Days` | `Last 30 Days`.
   - 3 KPI metric tiles: Posted volume (`metrics.postedQuantity`), Sold volume (`metrics.completedQuantity`), and Sell-Through Rate (`metrics.sellThroughRate`).
   - "Posted vs. Sold by Vegetable" comparison bars calculated from real seller inventory.
   - Descriptive AI surplus advisory note box from `analytics.summary`.

8. **`DashboardAdvisoriesRow.tsx`**:
   - Side-by-side cards: Weather Advisory with orange "Review" button and Upcoming Market Holiday with blue "View" button (`/(app)/advisories`).

9. **`home.tsx` Orchestration & `_layout.tsx` Header Visibility**:
   - Integrated `useSafeAreaInsets()` to maintain status-bar breathing room.
   - Connected all real data fetchers with `Promise.allSettled()` and pull-to-refresh (`RefreshControl`).
   - Configured `headerShown: false` on the `home` tab in `_layout.tsx` to eliminate redundant navigation headers.

## Why

To achieve 100% visual fidelity with the approved Figma seller dashboard design while strictly preserving existing business logic, validation, and real database/API integration.

## Affected paths

- `mobile/src/features/dashboard/components/DashboardHeader.tsx`
- `mobile/src/features/dashboard/components/DashboardHeaderBrand.tsx`
- `mobile/src/features/dashboard/components/DashboardTwinActions.tsx`
- `mobile/src/features/dashboard/components/DashboardMetrics.tsx`
- `mobile/src/features/dashboard/components/DashboardAttentionGrid.tsx`
- `mobile/src/features/dashboard/components/DashboardListingsSummary.tsx`
- `mobile/src/features/dashboard/components/DashboardReservationsSummary.tsx`
- `mobile/src/features/dashboard/components/DashboardAnalyticsSection.tsx`
- `mobile/src/features/dashboard/components/DashboardAnalyticsChart.tsx`
- `mobile/src/features/dashboard/components/DashboardAdvisoriesRow.tsx`
- `mobile/app/(app)/(tabs)/home.tsx`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `Agrivive/04 Delivery/2026-10-25 Seller Dashboard UI Replication and Real Data Integration.md`

## Verification performed

1. **Mobile verification**:
   - `bunx tsc --noEmit --project mobile/tsconfig.json` $\to$ **Exit code 0, 0 type errors**.
2. **Backend verification**:
   - `cd backend && bunx tsc --noEmit` $\to$ **Exit code 0, 0 type errors**.
   - `cd backend && bun build src/index.ts --outdir dist --target bun` $\to$ **1704 modules bundled successfully**.
3. **Line count audit**:
   - Every file strictly obeys the $\le 200$ line rule:
     - `DashboardHeader.tsx`: 107 lines
     - `DashboardHeaderBrand.tsx`: 153 lines
     - `DashboardTwinActions.tsx`: 148 lines
     - `DashboardMetrics.tsx`: 144 lines
     - `DashboardAttentionGrid.tsx`: 165 lines
     - `DashboardListingsSummary.tsx`: 120 lines
     - `DashboardReservationsSummary.tsx`: 120 lines
     - `DashboardAnalyticsSection.tsx`: 196 lines
     - `DashboardAnalyticsChart.tsx`: 147 lines
     - `DashboardAdvisoriesRow.tsx`: 145 lines
     - `home.tsx`: 177 lines
     - `_layout.tsx`: 106 lines
