---
title: Public Overview Descriptive Totals
type: delivery
date: 2026-11-15
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## Why
The public page `/marketplace/overview` was unclear and showed seller details. Quantities of kilos, sacks and piles were added together and labelled "kg". The Top 10 was padded with active listings that nobody had bought. The pickup rate read 100% with no data. The chart axes read 0, 3, 7, 10 and "Week 1 to 4". The API returned stall names and addresses.

## Done
- API `GET /marketplace/overview?range=week|month|year` now returns totals only: `kpis`, `topProduce`, `activityTrends`, `categoryDemand`, `weekdayDemand`. Seller stalls, seller and buyer counts are removed.
- Quantities are counted per unit (kg, sack, pile). Top produce is ranked by order count, with the average price paid per unit. No padding.
- Pickup rate is null (shown as "No data yet") when no reservation ended.
- Trend buckets use Asia/Manila days: 7 days, 4 blocks of 7 days, 12 months. Empty buckets stay.
- Web: bar chart with whole-number y ticks, titled axes and real date labels; "Bought vs Listed, by Kind"; "Pickups by Day of the Week"; tabs renamed Last 7 Days, Last 4 Weeks, Last 12 Months; print view rewritten. The planning advice box is gone. Descriptive only, no prediction.

## Files
- Backend: `modules/marketplace/model/marketplace.overview.ts`, `services/marketplace.overview.ts`, `.trends.ts`, `.produce.ts`, `.demand.ts`, `.weekday.ts`, `API_ENDPOINTS.md`, `dist/index.js` rebuilt.
- Web: `web/app/marketplace/overview/page.tsx`, `web/src/features/marketplace/api/overview.ts` and the `Marketplace*Component.tsx` files, including new `MarketplaceWeekdayDemandComponent.tsx`.

## Checks
Backend and web typecheck pass. The three ranges ran against the local (old Supabase) database and returned sensible totals. Not checked in a browser. A produce sold by only one seller still shows as its own row (no names); a minimum-seller rule is not built.
