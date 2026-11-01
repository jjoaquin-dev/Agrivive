# 2026-11-02 Stitch Change History and Weather Holidays Frames

**Date:** 2026-11-02  
**Project:** AGRIVIVE MOBILE UI (`11184471743007910085`)  
**Design System:** Lush Agro-Commerce (`assets/f47dfb9bbc764f6b9ea16ff85a7b3e78`)  
**Platform:** Expo / React Native (`mobile/`, TypeScript strict)  
**Viewport:** Mobile Portrait (390 × 844, safe area insets respected, light mode)  

---

## 1. High-Fidelity Stitch Screen Roster (Frames F1–F9)

- **F1 — Change History (All Filter Active)**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`2d4219090033403ba39de08bb3aa532a`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/1b7296239e754829a52828078eb5c8ba:download) — Notice banner, 3-tab segmented filter ("All", "Added", "Taken Away"), "+ Filter by Produce" button, grouped day cards ("Today", "Yesterday", "Oct 28, 2026"), direction badges (+ in green, − in red), quantity progression (`before → after`), formatted timestamp (`h:mm AM`).
- **F2 — Change History (Taken Away + Active Product Chip)**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`69a5d046aafc42eaa717e577bc5b5a6f`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/af6c105ab5a34cbcadd5f5cf637726dc:download) | [HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/1bb77ed8477d43249fb4b775dd033811:download) — "Taken Away" segment selected, active product filter pill `"Tomatoes ✕"` in `#0F920F`, filtered negative adjustments with presets and typed reasons.
- **F3 — Product Filter Bottom Sheet**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`ee87804b0eac49f9aaf944b4d886e60a`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/09722342dc73400490a66b44930315fb:download) — Bottom sheet modal with drag handle, title `"Show Changes For"`, radio option `"All Produce"`, and radio list of seller's current products with thumbnail and stock.
- **F4 — Change History Multi-State Composite**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`249c6d4f085e4582885069c9d7c246c2`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/da25ef43d5a141d09e02f4220415eef0:download) — Top-to-bottom composite demonstrating: (1) 3 shimmer skeleton cards (no text flash), (2) inline network error banner with `[Try Again]` button, and (3) empty state `"No changes yet"`.
- **F5 — Weather & Holidays (Standard State)**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`762eff7e6fa44274be5761fac2a8b0cd`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/893d1e630497435ca3dcf211681ee2a1:download) | [HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/811d97b8b1c446698df10f587ffbc318:download) — Back arrow & ⓘ buttons (44×44), sub-caption `"Updated 2:15 PM · Pull down to refresh"`, white Card 1 `"Now at Your Stall"` (31°C, 20% rain, weather icon, no blue tokens!), Card 2 `"Heads Up"`, Card 3 `"Next 3 Days"`, Card 4 `"Holidays in the Next 2 Weeks"`, and planning disclaimer.
- **F6 — Weather & Holidays (No Stall Pin State)**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`0fe507b5577041039ecc476bd3c0bf89`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/615b309cd37842c9a1d2617770fed994:download) | [HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/1a4414f2f34e45c0aedf4e32a8d8da3a:download) — Warning card replacing Cards 1 & 3: `"Add your stall pin to see weather."` with 48px primary button `[Add Stall Pin]` routing to profile setup. Heads Up retains holiday note without repeating the pin warning.
- **F7 — Weather & Holidays (Weather Source Down)**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`86e6a887aa0944ea97f3c303b10ee96b`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/19ac743f95c14f4aa15f4b1ec69c48c1:download) | [HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/0fb22ea66e3d4cd4940d3511350c563d:download) — Per-card error isolation: Card 1 shows `"Weather isn't available right now."` with `[Try Again]` button; Card 3 shows `"Forecast isn't available right now."`; Card 4 holiday list continues working normally.
- **F8 — "About This Page" Modal Sheet**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`d65ba3b7c987436a9f1f5c50e25283be`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/b4273f1dfe5e49209c7c694b1f408933:download) | [HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/31dcf3142f7b4426adef4ef1e45a5427:download) — Opened by ⓘ button; bottom sheet with plain words: stall pin weather origin, Philippine holidays calendar origin, and assurance that listings/reservations are never changed automatically. 48px `[Got It]` button.
- **F9 — Home "More Tools" Grid**: [Screen](https://stitch.withgoogle.com/project/11184471743007910085) (`5a91c3d8693d4f2480923f42d943e43e`) | [Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/40dbd5c93b8b4b6696af989a00959cf3:download) | [HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/2c2d61aeda2b41e58ef0d70042c59476:download) — 2×2 grid showing Reports, Promote, Change History, and the renamed `"Weather & Holidays"` tile (40×40 amber circle, CloudSun icon).

---

## 2. Element → Field / Action → Codebase Mapping

| UI Element | Field / Action / Data Source | File & Line Reference |
| :--- | :--- | :--- |
| **Notice Banner** | Informational callout on manual amount logging | `mobile/app/(app)/activity.tsx:93-98` |
| **Segmented Control** | Filter `ActivityFilter` ("all" \| "in" \| "out"), 48px height | `mobile/app/(app)/activity.tsx:101-124` |
| **Product Filter Pill / Sheet** | Query param `productId`, `nextCursor` reset, modal sheet selection | `backend/src/modules/seller/services/seller.stock-adjustment.list.ts:18-20`, `mobile/app/(app)/activity.tsx:26-30` |
| **Date Grouping Headers** | "Today", "Yesterday", or formatted `MMM D, YYYY` | `mobile/app/(app)/activity.tsx:71-82, 169` |
| **History Row Card** | `ActivityItemRow` container, 48px hit target, routes to `/inventory/[id]` | `mobile/src/features/inventory/components/ActivityItemRow.tsx:21-56` |
| **Adjustment Badge & Direction** | `parseFloat(item.delta)` sign: `ArrowUpRight` (green) / `ArrowDownRight` (terracotta) | `mobile/src/features/inventory/components/ActivityItemRow.tsx:23-34` |
| **Quantity Progression** | `beforeQty` → `afterQty` formatted with localized scaling unit (`kg`, `sacks`, `piles`) | `mobile/src/features/inventory/components/ActivityItemRow.tsx:39-41, 15` |
| **Timestamp Display** | `createdAt` formatted as `h:mm AM/PM` | `mobile/src/features/inventory/components/ActivityItemRow.tsx:16-19, 53` |
| **Change History Empty / Error** | Skeleton shimmer replacing spinner; inline error box with `[Try Again]` | `mobile/app/(app)/activity.tsx:145-165, 32-34` |
| **Header Navigation & ⓘ Action** | 44×44 back chevron, title `"Weather & Holidays"`, ⓘ button opening modal sheet | `mobile/src/features/advisories/components/AdvisoriesHeader.tsx:32-66`, `mobile/app/(app)/_layout.tsx:89` |
| **Header Refresh Subtitle** | `"Updated [time] · Pull down to refresh"` replacing old subtitle and refresh button | `mobile/src/features/advisories/components/AdvisoriesHeader.tsx:14-20, 44, 69-71` |
| **Now at Your Stall Hero** | Replaces blue `#1D4ED8` card with white `#FFFFFF` surface card; `temperatureC`, `precipitationProbability` | `mobile/src/features/advisories/components/WeatherHeroCard.tsx:49-117` |
| **No Stall Pin Warning Card** | Replaces Hero and Forecast cards when `!advisories.location`; CTA routes to profile edit | `mobile/app/(app)/advisories.tsx:81-91` |
| **Heads Up Reminders** | `reminders` list; excludes redundant stall pin notice; uses amber `#FFFBEB` card | `mobile/src/features/advisories/components/ContextualReminderCard.tsx:17-44` |
| **Next 3 Days Forecast** | `forecast` list (3 days) with date, weather condition, rain chance | `mobile/src/features/advisories/components/WeatherForecastSection.tsx:19-75` |
| **Holidays in Next 2 Weeks** | Calendar date box (`NOV 30`), English & Filipino names, `"in N days"` tag, shared tip | `mobile/src/features/advisories/components/UpcomingHolidaysCard.tsx:13-60` |
| **Per-Card Source Degradation** | Isolated error state when `sources.weather === "unavailable"` without hiding holidays | `mobile/app/(app)/advisories.tsx:116-121` |
| **Planning Disclaimer** | Plain words footer: `"For planning only. Always check your vegetables yourself."` | `mobile/src/features/advisories/components/AdvisoriesLimitationsFooter.tsx:5-14` |
| **About This Page Modal Sheet** | Bottom sheet modal rendering plain-word provenance and safety guarantees | `mobile/src/features/advisories/components/AdvisoriesHeader.tsx:73-91` |
| **Home Operations Hub Tile** | Tile label `"Weather & Holidays"`, CloudSun icon, amber background | `mobile/src/features/dashboard/components/DashboardOperationsHub.tsx:46-51` |

---

## 3. Copy Changes (Old Text → New Plain Text)

| Location | Old Copy | New Plain Copy | Rationale |
| :--- | :--- | :--- | :--- |
| Home Tile (`DashboardOperationsHub.tsx:47`) | `"Weather & Demand"` | `"Weather & Holidays"` | Plain words; page contains zero demand data |
| Screen Title (`_layout.tsx:89`, `AdvisoriesHeader.tsx:43`) | `"Weather & Holiday Advisory"` / `"Advisories"` | `"Weather & Holidays"` | Familiar, short words; consistent across stack and header |
| Header Subtitle (`AdvisoriesHeader.tsx:44`) | `"Local weather and upcoming holiday guidance"` | Replaced by caption: `"Updated 2:15 PM · Pull down to refresh"` | De-clutters header; establishes pull-to-refresh affordance |
| Card 1 Title (`WeatherHeroCard.tsx:64`) | `"OUTDOOR WEATHER"` | `"Now at Your Stall"` | Relatable seller framing; avoids tech uppercase badges |
| Card 2 Title (`ContextualReminderCard.tsx:22`) | `"CONTEXTUAL REMINDERS"` | `"Heads Up"` | Plain conversational phrasing understandable by anyone |
| Card 3 Title (`WeatherForecastSection.tsx:21`) | `"3-Day Weather Forecast"` | `"Next 3 Days"` | Direct, concise time reference |
| Card 4 Title (`UpcomingHolidaysCard.tsx:18`) | `"Upcoming Holidays"` | `"Holidays in the Next 2 Weeks"` | Explicit Miller chunking; specifies exact planning window |
| Footer Disclaimer (`AdvisoriesLimitationsFooter.tsx:8-11`) | `"Important Limitations: Outdoor weather and public holiday advisories are provided as general operational context only..."` | `"For planning only. Always check your vegetables yourself."` | Replaces verbose legalistic paragraph with plain rule |
| No Stall Pin (`advisories.tsx:85-89`) | `"Add a market stall location in your profile to receive localized Open-Meteo weather forecasts."` | Title: `"Add your stall pin to see weather."`<br>Body: `"We use your stall location to show local weather and rain chances."` | Removes third-party API jargon ("Open-Meteo"); explains value |
| External Down Notice (`advisories.tsx:118-120`) | `"Some external advisory data is currently unavailable. Your stored listings and orders remain fully operational."` | Per-card: `"Weather isn't available right now. Your stall listings and reservations are not affected."` | Per-card fault isolation replaces global top-level banner |
| Filter Segment (`activity.tsx:103`) | `"All Activity"` | `"All"` | Concise standard mobile segment label |
| History Empty (`activity.tsx:156-159`) | `"No activity recorded"` / `"Changes you make to amounts will appear here."` | `"No changes yet"` / `"Changes you make to amounts will appear here."` | Short, friendly phrasing |
| Loading (`activity.tsx:149`, `advisories.tsx:35`) | `"Loading activity history..."` / `"Loading advisories..."` | 3-row shimmer skeleton cards (no text) | Prevents text flash while data loads |

---

## 4. Behavior Changes (Code Implementation Tasks)

1. **Change History — Product Filtering**:
   - Add product filter state (`selectedProductId?: string`) to `activity.tsx`.
   - Pass `productId: selectedProductId` to `fetchStockAdjustments()` (already supported in backend service `seller.stock-adjustment.list.ts:18-20`).
   - Implement bottom sheet modal `"Show Changes For"` listing active products, plus an active filter chip with `✕` dismiss.
2. **Change History — Unit & Time Formatting**:
   - In `ActivityItemRow.tsx`, format units cleanly: `"kg"` for kilo, `"sacks"` / `"piles"` with pluralization (e.g. `"+2 sacks"`).
   - Format timestamps as `h:mm AM/PM` (e.g. `2:15 PM`).
   - Make history rows pressable, navigating directly to `/inventory/[id]`.
3. **Change History — Infinite Scroll & Cursor Stability**:
   - Backend `seller.stock-adjustment.list.ts` should paginate by `(createdAt, id)` tuple to guarantee zero duplicated rows across page boundaries.
4. **Weather & Holidays — Remove Fake Data Fallbacks**:
   - In `WeatherHeroCard.tsx`, eliminate hardcoded fallback `"Bankerohan Public Market, Davao City"` and `"0% rain chance"`. If coordinates are absent or API fails, render the explicit missing/error state rather than synthetic data.
   - Remove hardcoded blue card styling (`#1D4ED8`); use brand surface `#FFFFFF` with `#E5E7EB` border.
5. **Weather & Holidays — Streamline Header & About Modal**:
   - In `AdvisoriesHeader.tsx`, remove the separate refresh icon button (standardize on pull-to-refresh).
   - Ensure back button and ⓘ info button have at least 44×44px hit targets.
   - Replace the inline fade modal with a bottom sheet modal matching Frame F8.
6. **Weather & Holidays — Navigation & Rename**:
   - Change Home Operations Hub tile in `DashboardOperationsHub.tsx:47` from `"Weather & Demand"` to `"Weather & Holidays"`.
   - Update Expo router stack title in `mobile/app/(app)/_layout.tsx:89` from `"Advisories"` to `"Weather & Holidays"`.
   - "Add Stall Pin" CTA in the warning card routes directly to `/profile/edit`.

---

## 5. UI/UX Laws & Theoretical Citations

- **Jakob's Law** *(Jakob Nielsen)*: Users expect standard mobile patterns—segmented controls at the top of lists, 44×44px circular icon buttons, pull-to-refresh for real-time updates, and bottom sheets for dismissable filters and explanations.
- **Miller's Law & Chunking** *(George A. Miller)*: Information is chunked into distinct logical surfaces: Card 1 (Now), Card 2 (Heads Up), Card 3 (Next 3 Days), and Card 4 (Next 2 Weeks). Change History is chunked by explicit date groups ("Today", "Yesterday").
- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: Decision overhead is reduced by categorizing history into 3 primary tabs ("All", "Added", "Taken Away") with a single dedicated product filter trigger.
- **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Showing full quantity transitions (`before → after`) and explicit date tags (`"in 5 days"`) means sellers never have to remember past stock or calculate calendar intervals.
- **Fitts's Law** *(Paul Fitts)*: Primary action buttons (`[Add Stall Pin]`, `[Got It]`, `[Try Again]`) are full-width 48px high surfaces. Top-bar icons are padded to 44×44px hit targets.
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: High-contrast primary green (`#0F920F`) and warning amber (`#D97706`) are strictly reserved for critical actions, status highlights, and weather alerts.
- **Law of Common Region** *(Gestalt)*: Grouping related history items inside unified card surfaces with crisp 1px borders cleanly separates distinct operational days.
- **Visibility of System Status** *(Jakob Nielsen)*: Shimmer loading skeletons, pull-to-refresh timestamps, and per-card error degradation provide instant, honest system transparency without jarring blank screens.
- **Ten Principles for Good Design** *(Dieter Rams)*: Honest, unobtrusive design: eliminating fake market names, removing blue tech cards, and stating clearly: *"For planning only. Always check your vegetables yourself."*
