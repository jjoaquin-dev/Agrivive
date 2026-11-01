---
title: Sales Report Applied From Stitch
type: delivery
date: 2026-11-01
status: code complete, no device check
---

# Sales Report Applied From Stitch

## What changed

The seller Sales Report screen (`mobile/app/(app)/analytics.tsx`) now follows the Stitch frames F1 and F1b (project `11184471743007910085`). Our own charts stay: the `react-native-gifted-charts` bar chart and the existing bar-row breakdowns were restyled, not replaced. Data, API and filters are unchanged.

| Stitch section | Applied in |
| --- | --- |
| Header "Sales Report", date range, Tips | `AnalyticsHeader` (green hero banner removed) |
| Sticky 7/30/90 Days, unit chips, Produce picker | `AnalyticsFilterRow`, `AnalyticsProduceSheet` |
| Sold, How Much Sold | `AnalyticsMetricsGrid` (now two cards) |
| Where Your Produce Went | `AnalyticsMovementChart` (our BarChart; Posted, Picked Up, Waiting, Cancelled, Expired; Left to Sell row) |
| Pickup Results | `AnalyticsOrderOutcomes` |
| Posted Again | `AnalyticsRepeatListings` (new, hidden when 0) |
| Stock Right Now | `AnalyticsUnitDistribution` |
| Your Produce | `AnalyticsProductPerformance` |
| Visibility Guide, Summary | `analytics.tsx`, `AnalyticsDescriptiveSummary` (no sparkles) |
| Loading, error, mixed units | `AnalyticsSkeleton`, Try Again card, notice shown when no unit is picked |

## Differences from the frames (on purpose)

- Stitch's "Reserved 96 kg in these days, any result" has no matching field. The chart shows "Waiting" (current reserved) instead.
- Stitch's Key Performance tiles (Available, Reserved) are covered by the chart and the Left to Sell row.
- The old Descriptive Summary heading is now "Summary".

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. No backend change.
