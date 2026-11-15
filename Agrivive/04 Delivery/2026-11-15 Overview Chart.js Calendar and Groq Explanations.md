---
title: Overview Chart.js Calendar and Groq Explanations
type: delivery
date: 2026-11-15
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Builds on: [[2026-11-15 Public Overview Descriptive Totals]]

## Done
- Every chart on `/marketplace/overview` is now a Chart.js chart (`chart.js`, `react-chartjs-2`, `chartjs-plugin-datalabels`); nothing is hand-drawn. Four charts: Pickups Over Time (bar), Most Bought Produce (horizontal bar), Bought vs Listed by Kind (grouped horizontal bar, with legend), Pickups by Day of the Week (bar). Titled axes, whole-number ticks, the value written on each bar, and tooltips with the full detail.
- Under each chart: a plain-word explanation written by Groq, then a "View breakdown" button that opens a table with every number behind the chart.
- The tabs are gone. The filter is a calendar (`react-day-picker`, range mode): the first and last day are filled green and the days between are shaded, with presets (7 days, 4 weeks, 3 months, 12 months). Future days are disabled and a span is at most 366 days.
- API now takes `from` and `to` (Asia/Manila days) instead of `range`. Bars are days up to 31 days, 7-day weeks up to 98 days, months beyond. New `GET /marketplace/overview/explanations`.
- Groq sees only the computed totals. Each of the four lines is checked with the same number check as the seller report, and rejected if it uses a number it was not given or words that look ahead or advise (will, expect, should, likely, recommend and similar); a rejected line, or all four when Groq is off or slow, becomes a fixed sentence. Saved 30 minutes per set of totals, 60 seconds after a failure.
- "Save as PDF": each chart is copied to a picture (`toBase64Image`) and the print page holds the four pictures, their explanations and their tables, plus the totals and the chosen dates. The browser's print dialog saves it as a PDF.

## Files
- Backend: `modules/marketplace/services/marketplace.overview*.ts` (new `.period`, `.facts`, `.template`, `.explain`), `index/marketplace.overview.ts`, `model/marketplace.overview.ts`, `API_ENDPOINTS.md`, `dist/index.js` rebuilt.
- Web: `web/app/marketplace/overview/page.tsx`, `src/features/marketplace/lib/chartSetup.ts`, `components/Overview*.tsx`, `MarketplaceOverviewHeaderComponent.tsx`, `MarketplaceOverviewKpiComponent.tsx`, `MarketplaceOverviewPrintComponent.tsx`, `api/overview.ts`. The four hand-drawn chart components were deleted. New packages in `web/package.json`.

## Checks
Backend typecheck, web typecheck and `next build` pass. The overview, several date spans and the Groq explanations ran against the local database (all four lines came back from Groq). Not opened in a browser: calendar styling, chart look and the PDF layout still need a look. Deploy the API first, then the web.
