---
title: Home Loading, Error and Empty States
type: delivery
date: 2026-11-01
---

# Home Loading, Error and Empty States

## What changed

The Home layout already matched the Stitch frames (project `11184471743007910085`), so the work covered the state frames: loading skeleton, "could not load", and new seller empty.

- Loading: Your Stock Now, Running Low and Recent Changes show pulsing placeholder blocks until data arrives.
- Could not load: stock cards show "—" and "Unavailable" with muted icons; Running Low says "Stock alerts unavailable. Tap 'Try Again' above to reload."; Recent Changes says "Unable to load recent activity." Before, a failed load showed zeros and "All stocked up", which was untrue.
- New seller: Running Low and Out of Stock pills go neutral grey when the count is 0; the empty Recent Changes card gets a history icon.
- More Tools: labels wrap to two lines so "Weather & Demand" fits.

No API calls or data fields changed.

## Files

- `mobile/app/(app)/(tabs)/home.tsx` (passes `loading` and `error`; tracks recent-activity failure)
- `mobile/src/features/dashboard/components/DashboardMetrics.tsx`, `DashboardLowStockAlerts.tsx`, `DashboardRecentActivity.tsx`, `DashboardOperationsHub.tsx`
- New: `DashboardSkeleton.tsx`, `DashboardLowStockStates.tsx`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. A failed pull-to-refresh with old data on screen now also shows the "Unavailable" state.
