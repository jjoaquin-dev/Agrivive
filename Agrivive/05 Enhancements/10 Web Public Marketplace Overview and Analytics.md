---
title: Web Public Marketplace Overview and Analytics
type: enhancement
status: completed
created: 2026-10-28
updated: 2026-10-28
tags:
  - web
  - landing-page
  - analytics
  - marketplace
  - charts
  - agricultural-planning
---

# Web Public Marketplace Overview and Analytics

## Overview
Added the **"Public Marketplace Overview"** tab to the landing page navbar and primary application headers, providing a dedicated public analytics dashboard at `/marketplace/overview`. The feature visualizes real-time marketplace metrics, food surplus rescue volume, Top 10 produce buying trends (with week, month, and year filters), market activity timeline trends, and category distribution to monitor supply flow and assist farmers, stall owners, and city planners.

---

## What Changed & Why

1. **Backend Overview Endpoint (`backend/src/modules/marketplace/`)**
   - **Why**: Tesler's Law (*Larry Tesler*) and Doherty Threshold (*Walter Doherty*): Centralizes multi-table database aggregation in an optimized SQL query on the backend rather than burdening the client with heavy joins and processing.
   - **What**: Added `GET /marketplace/overview?range=week|month|year`:
     - Queries `orders`, `ordered_items`, `sellers_product`, `vegetable_catalog`, and `user`.
     - Groups completed orders within the chosen timeframe (past 7 days, 30 days, or 365 days) to compute the Top 10 most purchased produce items ranked by rescued volume (kg), total order count, and gross value.
     - Computes KPIs: Total Rescued Quantity, Active Listings, Verified Pickup Fulfillment Rate, and Participating Community Stalls & Shoppers.
     - Computes crop category distribution across Davao public markets.
     - Provides realistic sample data fallback when database orders are sparse, labeled visibly as sample data per repository rules.

2. **Navbar Integration (`web/src/features/home/components/LandingHeader.tsx`, `web/src/components/SiteHeader.tsx`, `web/src/components/BuyerSiteHeaderNav.tsx`)**
   - **Why**: Jakob's Law (*Jakob Nielsen*): Users expect predictable navigation from the landing page navbar as well as inside the application.
   - **What**: Added "Public Marketplace Overview" to `sectionLinks` and the mobile drawer in `LandingHeader.tsx`. Added direct links in `SiteHeader.tsx`, `SiteHeaderMobileNav.tsx`, and `BuyerSiteHeaderNav.tsx`.

3. **Dedicated Interactive Dashboard (`web/app/marketplace/overview/page.tsx`)**
   - **Why**: Miller's Law & Chunking (*George A. Miller*): Separates analytical depth from promotional marketing copy, breaking data into 4 digestible visual chunks.
   - **What**: Built page with responsive container, loading skeletons, and error handling.

4. **Bespoke Interactive SVG Visualizations (`web/src/features/marketplace/components/`)**
   - **Why**: Zero external charting dependencies (adhering to Agrivive UI conventions), instant sub-400ms rendering, and brand-tailored styling in Agrivive Forest Green (`#457D00` / `#1F4D3A`).
   - **Components Created**:
     - `MarketplaceOverviewHeaderComponent.tsx`: Header with title, live timestamp, timeframe toggle pills (`This Week`, `This Month`, `This Year`), and "Save Plan Report" action.
     - `MarketplaceOverviewKpiComponent.tsx`: 4 summary metric cards.
     - `MarketplaceTopProduceChartComponent.tsx`: Interactive SVG Horizontal Bar Chart + Top 10 Leaderboard ranking table.
     - `MarketplaceActivityTrendComponent.tsx`: SVG Area/Line Chart with gradient fill and interactive hover tooltips.
     - `MarketplaceCategoryBreakdownComponent.tsx`: SVG Donut Chart with category proportion cards and agricultural planning guidance.
     - `MarketplaceOverviewPrintComponent.tsx`: Formal printable report layout for executive and agricultural planning reviews.

---

## Affected File Paths

### Backend
- `backend/src/modules/marketplace/model/marketplace.overview.ts` *(Created)*
- `backend/src/modules/marketplace/services/marketplace.overview.ts` *(Created)*
- `backend/src/modules/marketplace/index/marketplace.overview.ts` *(Created)*
- `backend/src/modules/marketplace/index.ts` *(Updated)*

### Web Application
- `web/src/features/marketplace/api/overview.ts` *(Created)*
- `web/src/features/home/components/LandingHeader.tsx` *(Updated)*
- `web/src/components/SiteHeader.tsx` *(Updated)*
- `web/src/components/SiteHeaderMobileNav.tsx` *(Updated)*
- `web/src/components/BuyerSiteHeaderNav.tsx` *(Updated)*
- `web/app/marketplace/overview/page.tsx` *(Created)*
- `web/src/features/marketplace/components/MarketplaceOverviewHeaderComponent.tsx` *(Created)*
- `web/src/features/marketplace/components/MarketplaceOverviewKpiComponent.tsx` *(Created)*
- `web/src/features/marketplace/components/MarketplaceTopProduceChartComponent.tsx` *(Created)*
- `web/src/features/marketplace/components/MarketplaceActivityTrendComponent.tsx` *(Created)*
- `web/src/features/marketplace/components/MarketplaceCategoryBreakdownComponent.tsx` *(Created)*
- `web/src/features/marketplace/components/MarketplaceOverviewPrintComponent.tsx` *(Created)*

---

## Verification Performed
1. **Backend Verification**:
   - `bunx tsc --noEmit` passed with 0 errors.
   - `bun build src/index.ts --outdir dist --target bun` passed (1,825 modules bundled in 383ms).
2. **Frontend Verification**:
   - `tsc --noEmit` passed with 0 errors.
