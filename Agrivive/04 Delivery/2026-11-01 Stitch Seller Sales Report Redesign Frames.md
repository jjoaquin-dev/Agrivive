# 2026-11-01 Stitch Seller Sales Report Redesign Frames

## What changed and why
Generated 7 high-fidelity mobile UI mockups in Google Stitch under Project `AGRIVIVE MOBILE UI` (`11184471743007910085`) implementing the visual and UX redesign of the Agrivive Seller "Sales Report" screen (`app/(app)/analytics.tsx`).

The redesign transforms the previous complex, dashboard-style technical view into an intuitive, plain-words report tailored for vegetable farmers and market vendors in Davao City, strictly grounded in the codebase data fields without any invented numbers or unsupported time-series charts.

- **Stitch Project:** `AGRIVIVE MOBILE UI` (`11184471743007910085`)
- **Design System Asset Applied:** `assets/f47dfb9bbc764f6b9ea16ff85a7b3e78` (`Lush Agro-Commerce`)
- **Device Specifications:** Mobile Portrait 390 × 844 px, safe areas respected, light mode only, pushed screen without 5-tab bar.

---

## Complete Catalog of Generated Stitch Frames (F1–F6)

1. **F1 — Sales Report (Kilos, 30 Days, Main Performance View)**
   - Screen ID: `55074d4d6a294e46a65e86f2f51bd6db`
   - Description: Top edge "Sample data", back button (44×44px ChevronLeft), title "Sales Report" (22px Bold), subtitle "Oct 2 – Nov 1", right button "Tips" (CalendarDays icon). Full-width segmented range control ("7 Days" | "30 Days" [active] | "90 Days"), unit chips ("All", "Kilos" [active], "Sacks", "Piles") + "Produce: All ▾". Main card "Sold" (28px Bold: 78.00 kg, ₱3,510.00 earned from pickups, ▲ 18.2% vs Sep 1 – Oct 1). Card "How Much Sold" (65% progress bar, 78.00 of 120.00 kg posted). Card "Where Your Produce Went" (proportional horizontal bars for Posted 120, Reserved 96 with "Reserved in these days, any result" note, Picked Up 78, Cancelled 6, Expired 4; divider and "Left to Sell" 40.50 kg: 32.50 in stock + 8.00 waiting for pickup). Card "Pickup Results" (Picked Up 88.6%, Not Picked Up 11.4%: 6 cancelled · 4 expired). Card "Posted Again" (2 produce, smaller batches advice). No 5-tab bar.

2. **F1b — Sales Report (Kilos, 30 Days, Scrolled Lower View, Sections 8 to 11)**
   - Screen ID: `8f8da4c9052a4c179a6fc2a629d3b4de`
   - Description: Scrolled continuation. Section 8 "Stock Right Now" (segmented bar Kilos 76% #0F920F, Sacks 9% #A8BFA3, Piles 14% #C97850 with legend). Section 9 "Your Produce" (tabs "All (6)" [active], "10 or Less", "Sold Out"; 5 rows with 40×40 photos, stock left, prices, strikethrough price drops, status pills, 44px terracotta "Boost" buttons; footer link "See All in Listings ›"). Section 10 "Visibility Guide" row card ("How high your listings show to buyers" ›). Section 11 "Summary" card (FileText icon, caption "Made from your numbers", rule-based deterministic summary text without AI sparkles).

3. **F2 — Sales Report ('All' Units Selected with Mixed-Units Warning)**
   - Screen ID: `4dceb622e56144c5bb64c2396ba9731a`
   - Description: Demonstrates unit = "All" active. Features prominent mixed-units warning banner directly under filters: *"Kilos, sacks and piles are added together. Pick one for exact amounts."* Displays aggregated values with the "units" suffix (88.00 units sold, ₱3,510.00 earned, 88.00 of 135.00 units posted, Where Your Produce Went in units, Left to Sell 42.50 units).

4. **F3 — Sales Report (Zero Data / Not Enough Data State, 7 Days)**
   - Screen ID: `d84ad3b14d764f38a58e9afeb548490b`
   - Description: New seller / zero data state (posted = 0, completed = 0, notComputable true). Main card "Sold" shows 0.00 kg, ₱0.00 earned, and muted comparison note *"No sales in the previous 7 days to compare with."* (replacing trend chip). Card "How Much Sold" shows large em-dash "—" with *"Nothing was posted in these days, so this can't be worked out yet."* and 0% empty progress bar. Where Your Produce Went shows 0.00 kg. Pickup Results and Posted Again cards are cleanly **hidden**. Summary card displays *"No summary for these days yet."*

5. **F4 — Produce Picker Bottom Sheet Modal**
   - Screen ID: `feaf259c77834f6eaa314dbad6f8088f`
   - Description: Replaces horizontal chips with a bottom sheet modal (radius 20, top drag handle 36×4px) over a 50% dimmed backdrop. Title "Pick Produce", subtitle "Filter report to a single vegetable listing", search input with Lucide Search icon ("Search your produce..."). Row 1: "All Produce" with store icon and active green radio checkmark. Rows 2–7: Individual produce items with 40×40 rounded photos, name, unit, live in-stock quantity, and unselected radio circles.

6. **F5 — Sales Report (Loading Skeleton State with Usable Filters)**
   - Screen ID: `2788c744d7874f9cb9077dea1acbee8b`
   - Description: Adheres to the Doherty Threshold. Top header and sticky filters (7 Days | 30 Days | 90 Days, unit chips, Produce dropdown) remain fully interactive and rendered while background queries load. Sections 3, 4, and 5 display pulsing `#E5E7EB` shimmer bone placeholders within `#FFFFFF` cards matching exact proportions.

7. **F6 — Sales Report (Inline Error Recovery State)**
   - Screen ID: `3d4c86d3114b43aaabbe53c1c6121302`
   - Description: Error Prevention & Inline Validation (Jarrett & Gaffney). Sticky filters remain usable. Directly below filters sits a single inline error recovery card with `#FECACA` border, red CloudOff icon, title *"Couldn't load your report"*, subtitle *"Check your internet connection and try again."*, and a 48px brand green `#0F920F` "Try Again" CTA button with RefreshCw icon. No second empty state or duplicate alerts below it.

---

## Element-to-Codebase Mapping Table

| Mockup Element | UI / Data Purpose | Source Field | Source File & Line Range |
| :--- | :--- | :--- | :--- |
| **Top Bar Subtitle** | Reporting date range | `period.from`, `period.to` | `backend/seller.analytics.metrics.ts:153-158` |
| **Top Bar Tips Button** | Navigation to Advisories | Route `/(app)/advisories` | `mobile/analytics/AnalyticsHeader.tsx:31-38` |
| **Sticky Period Control** | Filter days {7, 30, 90} | `days` state parameter | `mobile/useSellerAnalytics.ts:10-14, 22-25` |
| **Sticky Unit Chips** | Filter unit {all, kilo, sack, pile} | `query.unit` | `backend/seller.analytics.metrics.ts:34, 162` |
| **Sticky Produce Button** | Open produce picker sheet | `query.productId` | `backend/seller.analytics.metrics.ts:33, 160` |
| **Mixed-Units Note** | Warning on mixed aggregation | Triggered when `unit === undefined` | `mobile/analytics.tsx:24` |
| **Sold: Main Metric** | Picked-up surplus amount | `metrics.completedQuantity` | `backend/seller.analytics.metrics.ts:113-116, 168` |
| **Sold: Revenue Line** | Pesos earned from pickups | `metrics.completedSalesTotal` | `backend/seller.analytics.metrics.ts:115, 172` |
| **Sold: Trend Chip** | % change vs previous period | `metrics.completedQuantityChange` | `backend/seller.analytics.metrics.ts:143-148, 174` |
| **Sold: Comparison Range** | Date range of prior period | `period.previousFrom`, `period.previousTo`| `backend/seller.analytics.metrics.ts:156-157` |
| **Sold: Muted Comparison** | Fallback when prior sales = 0 | `notComputable.completedQuantityChange` | `backend/seller.analytics.metrics.ts:179` |
| **How Much Sold: Rate** | Sell-through percentage | `metrics.sellThroughRate` | `backend/seller.analytics.metrics.ts:147, 173` |
| **How Much Sold: Fraction** | Ratio of picked up over posted | `completedQuantity`, `postedQuantity` | `backend/seller.analytics.metrics.ts:165, 168` |
| **How Much Sold: Muted Note**| Fallback when posted = 0 | `notComputable.sellThroughRate` | `backend/seller.analytics.metrics.ts:178` |
| **Where Produce Went: Posted**| Total surplus posted | `metrics.postedQuantity` | `backend/seller.analytics.metrics.ts:95, 165` |
| **Where Produce Went: Reserved**| Amount reserved (any outcome) | `metrics.reservedQuantity` | `backend/seller.analytics.metrics.ts:98, 111, 167` |
| **Where Produce Went: Picked Up**| Completed pickups | `metrics.completedQuantity` | `backend/seller.analytics.metrics.ts:114, 168` |
| **Where Produce Went: Cancelled**| Cancelled buyer reservations | `metrics.cancelledQuantity` | `backend/seller.analytics.metrics.ts:120, 169` |
| **Where Produce Went: Expired**| Unclaimed expired reservations | `metrics.expiredQuantity` | `backend/seller.analytics.metrics.ts:121, 170` |
| **Left to Sell: Metric** | In stock + waiting for pickup | `metrics.remainingQuantity` | `backend/seller.analytics.metrics.ts:149, 171` |
| **Left to Sell: Breakdown** | In stock & pending pickup breakdown | `availableQuantity`, `remaining - available` | `backend/seller.analytics.metrics.ts:96, 149` |
| **Pickup Results: Picked Up**| Handover fulfillment rate | `completed / (completed + cancelled + expired)` | `mobile/AnalyticsOrderOutcomes.tsx:18` |
| **Pickup Results: Not Picked Up**| Waste / unclaimed breakdown | `(cancelled + expired) / totalOutcomes` | `mobile/AnalyticsOrderOutcomes.tsx:19` |
| **Posted Again Card** | Reposted produce cycles | `metrics.recurringListings` | `backend/seller.analytics.metrics.ts:124-141, 175` |
| **Stock Right Now: Bar** | Live inventory packaging scale | `summary.unitTotals {kilo, sack, pile}` | `mobile/AnalyticsUnitDistribution.tsx:11-18` |
| **Your Produce: List** | Produce rows with photos & price | `products[]` from `useInventory` | `mobile/AnalyticsProductPerformance.tsx:74-85` |
| **Your Produce: Price Drop** | Strikethrough & discount pill | `basePrice > productPrice` | `mobile/AnalyticsProductPerformance.tsx:78, 95` |
| **Your Produce: Boost CTA** | Promote produce listing | Route `/(app)/marketing/[productId]` | `mobile/AnalyticsProductPerformance.tsx:99` |
| **Visibility Guide Link** | Educational link to marketing hub | Route `/(app)/marketing?section=visibility` | `mobile/analytics.tsx:94` |
| **Summary Card** | Template-generated text | `analytics.summary` | `backend/seller.analytics.summary.ts:7-45` |

---

## Change List A: Plain-Words Copy Changes

| Location | Old Technical / Complex Text | New Plain-Words Text | Rationale |
| :--- | :--- | :--- | :--- |
| Screen Title | `"Seller Analytics"` | `"Sales Report"` | Plain, everyday business terminology for farmers and market vendors. |
| Top Bar Subtitle | `"Understand what happened to your surplus"` | `"Oct 2 – Nov 1"` (Date range) | Visibility of system status: sellers know exact timeframe at a glance. |
| Main Metric Card | `"Gross Sales Value"` | `"Sold"` with `"₱3,510.00 earned from pickups"` | Immediate answer to "How much did I sell?". Eliminates financial jargon. |
| Trend Chip | `"+18.2% vs prev"` | `"▲ 18.2% vs Sep 1 – Oct 1"` | Explicitly names the comparison date range instead of vague "prev". |
| Trend Fallback | `"No data"` / empty chip | `"No sales in Sep 1 – Oct 1 to compare with."` | Recognition over recall: explains why comparison cannot be calculated. |
| Sell-Through Card | `"Sell-Through Rate: 65.0%"` | `"How Much Sold"`: `"65%"` with `"78.00 of 120.00 kg posted"` | Plain words explanation of percentage conversion. |
| Sell-Through Fallback | `"N/A"` | `"Nothing was posted in these days, so this can't be worked out yet."` | Clear causal explanation for new sellers. |
| Volume Movement | `"Surplus Volume Flow"` | `"Where Your Produce Went"` | Natural conversational phrasing. |
| Reserved Quantity Caption | `"Pending pickup pass"` | `"Reserved in these days, any result."` | Clarifies that metric counts all reservations created in the period, not just current pending. |
| Available Stock Caption | `"Active in marketplace"` | `"Left to Sell"` with `"32.50 in stock + 8.00 waiting for pickup"` | Differentiates available stock from physical remaining stock. |
| Order Outcomes Card | `"Pickup & Order Outcomes"` | `"Pickup Results"` | Short, direct section title. |
| Handover Metric | `"Handover Fulfillment Rate"` | `"Picked Up 88.6%"` | Action-oriented terminology. |
| Waste Metric | `"Unclaimed / Waste Rate"` | `"Not Picked Up 11.4%"` with `"6.00 cancelled · 4.00 expired"` | Transparent and simple. |
| Re-listing Card | `"Repeat Listings: 2 cycles"` | `"Posted Again"`: `"2 produce"` with `"Smaller batches may sell out faster."` | Contextual actionable coaching. |
| Packaging Breakdown | `"Unit Breakdown"` | `"Stock Right Now"` with `"All produce, today"` | Clarifies that inventory totals are live/current, not period-filtered. |
| Product Status Badges | `"Depleted"` / `"Low Stock"` | `"Sold Out"` / `"10 or Less"` / `"In Stock"` | 5-year-old plain-words vocabulary. |
| Summary Card | `"Descriptive Summary"` | `"Summary"` with `"Made from your numbers"` | Removes AI / algorithmic pretension. Honest design (Dieter Rams). |
| Filter Range Labels | `"Last 30 Days"` / `"Last 90 Days"` | `"30 Days"` / `"90 Days"` | Concise, readable chips on compact mobile widths. |

---

## Change List B: Behavior & Style Changes Needing Implementation

1. **Display `remainingQuantity` with Breakdown**:
   - The backend already calculates `remainingQuantity` (`availableQuantity + activeReservedQuantity`). The UI currently ignores it. Update Section 5 to show `"Left to Sell"` (`40.50 kg`) with the honest subtext breakdown: `"32.50 in stock + 8.00 waiting for pickup"`.
2. **Dynamic Previous Date Range on Trend Chip**:
   - The backend provides `period.previousFrom` and `period.previousTo`. Update the trend badge to display the exact dates (e.g. `"▲ 18.2% vs Sep 1 – Oct 1"`) rather than the ambiguous string `"vs prev"`.
3. **Mixed-Units Notice on 'All' Units Filter**:
   - When `unit === undefined` ("All Units"), inject an informative banner directly below the filters: *"Kilos, sacks and piles are added together. Pick one for exact amounts."* Update metric suffixes from unit-specific terms to `"units"`.
4. **Produce Picker Bottom Sheet**:
   - Replace the horizontal scrolling product chip row with a dedicated, full-featured bottom sheet modal (`F4`) containing search, an "All Produce" option, and listing rows displaying crop thumbnails, units, and live inventory.
5. **Skeleton Shimmer Loading State**:
   - Replace the full-screen centered `ActivityIndicator` with inline skeleton loading cards (`F5`) mimicking the exact shape of Sections 3, 4, and 5 while preserving interactive filter controls (Doherty Threshold).
6. **Single Inline Error Recovery Card with 'Try Again'**:
   - Replace the generic error text box and redundant empty-state messages with a single, tactile inline recovery card (`F6`) featuring a 48px brand green `#0F920F` "Try Again" button.
7. **Conditional Card Rendering**:
   - **Hide "Pickup Results"** when `completedQuantity + cancelledQuantity + expiredQuantity === 0`.
   - **Hide "Posted Again"** when `recurringListings === 0`.
8. **Real Photo Display in 'Your Produce'**:
   - Replace hardcoded emoji avatars with real crop images from `product.displayImageUrl` (with a clean leaf fallback).
9. **Listings Link**:
   - Add a direct footer action: `"See All in Listings ›"` linking to `/(app)/(tabs)/inventory`.
10. **Ergonomic Touch Targets**:
    - Ensure all icon buttons and dropdown triggers maintain minimum 44×44px hit areas, and primary CTAs maintain ≥48px height (Fitts's Law).
11. **Remove Unused Components & Clutter**:
    - Remove the green hero banner (`TrendingUp` banner) in `AnalyticsHeader.tsx`.
    - Remove the unused 7-tile grid in `AnalyticsMetricsGrid.tsx` in favor of focused cards.

---

## Psychological & Ergonomic Laws Cited

* **Don't Make Me Think** *(Steve Krug)* & **Von Restorff Effect** *(Hedwig von Restorff)*: The primary question every seller has ("How much did I sell?") is answered immediately in the largest type on screen (28px Bold) in Card 1 ("Sold").
* **Miller's Law & Chunking** *(George A. Miller)* & **Law of Prägnanz** *(Gestalt)*: Instead of 20 fragmented tiles, data is organized into ~6 distinct, digestible conceptual cards with white background surfaces and 16px radii.
* **Visibility of System Status** *(Jakob Nielsen)*: Explicit reporting date ranges ("Oct 2 – Nov 1"), transparent notes on what "Reserved" actually means, and "Right now" labels on unfiltered live stock sections.
* **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Uncomputable metrics display an em-dash "—" accompanied by a plain-language explanation of why it cannot be computed.
* **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: Moving produce selection from an endless horizontal scroll into a searchable, structured modal sheet reduces decision cognitive load.
* **Tesler's Law (Conservation of Complexity)** *(Larry Tesler)*: The app absorbs arithmetic complexity by warning about mixed unit additions and projecting total stock vs reserved breakdowns.
* **Fitts's Law** *(Paul Fitts)*: Touch targets for back navigation, calendar/tips triggers, and retry CTAs are at least 44×44px or 48px high.
* **Doherty Threshold** *(Walter J. Doherty & Ahrvid J. Thadhani)*: Sticky filter controls remain interactive and responsive during loading while skeleton placeholders shimmer beneath.
* **Error Prevention & Inline Validation** *(Caroline Jarrett & Gerry Gaffney)*: Clear inline recovery card with a direct retry button rather than generic alert boxes.
* **Law of Similarity & Aesthetic-Usability Effect** *(Masaaki Kurosu & Kaori Kashimura)*: Unified 5-color palette (Primary Green `#0F920F`, Sage `#A8BFA3`, Error Red `#DC2626`, Warning Amber `#D97706`, Neutral Gray `#D1D5DB`) harmonizes with the brand design system.
* **Ten Principles for Good Design** *(Dieter Rams)*: Honest design — the summary is clearly captioned "Made from your numbers" and is never mislabeled as AI or embellished with sparkles.

---

## Affected Paths
- Stitch Remote Project: `projects/11184471743007910085` (`AGRIVIVE MOBILE UI`)
- Mobile Codebase:
  - `mobile/app/(app)/analytics.tsx`
  - `mobile/src/features/analytics/types.ts`
  - `mobile/src/features/analytics/hooks/useSellerAnalytics.ts`
  - `mobile/src/features/analytics/components/AnalyticsHeader.tsx`
  - `mobile/src/features/analytics/components/AnalyticsFilterRow.tsx`
  - `mobile/src/features/analytics/components/AnalyticsMetricsGrid.tsx`
  - `mobile/src/features/analytics/components/AnalyticsMovementChart.tsx`
  - `mobile/src/features/analytics/components/AnalyticsOrderOutcomes.tsx`
  - `mobile/src/features/analytics/components/AnalyticsProductPerformance.tsx`
  - `mobile/src/features/analytics/components/AnalyticsUnitDistribution.tsx`
  - `mobile/src/features/analytics/components/AnalyticsDescriptiveSummary.tsx`
- Obsidian Vault:
  - `Agrivive/04 Delivery/2026-11-01 Stitch Seller Sales Report Redesign Frames.md`
  - `Agrivive/04 Delivery/00-LATEST.md`

## Verification
- Verified all 7 Stitch mockups via `call_mcp_tool` (`generate_screen_from_text`) using `GEMINI_3_8_FLASH`.
- Validated every metric and computation against backend services (`seller.analytics.metrics.ts`, `seller.analytics.summary.ts`).
- Confirmed zero code modifications per instructions.
