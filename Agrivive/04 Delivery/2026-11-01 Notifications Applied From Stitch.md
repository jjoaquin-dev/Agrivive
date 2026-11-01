---
title: Notifications Applied From Stitch
type: delivery
date: 2026-11-01
status: code complete, no device check
---

# Notifications Applied From Stitch

## What changed

The seller Notifications screen (`mobile/app/(app)/notifications.tsx`) now follows Stitch "Notifications v1" (frames 1, 10, 11 read in full; empty, loading and no-result states built from the same style). Data, hooks, categories and actions are unchanged.

| Stitch part | Applied in |
| --- | --- |
| Header: back, centered title, Settings, Mark all as read (greyed when nothing is unread) | `NotificationHeaderBar` (More menu and unread badge removed) |
| Summary line "3 new · 2 need you" / "All caught up" | `NotificationSummaryBanner` |
| Chips with count badges; "Trust" tab now reads "Account" | `NotificationCategoryTabs` |
| Search plus 44px filter button | `NotificationSearchBar` |
| Flat full-width rows: unread dot, left bar for urgent, 40px tinted icon, "Needs action" pill, outlined and plain actions | `NotificationTimelineCard`, `.styles.ts` |
| Filter bottom sheet: Unread only, Needs action only, Order, Reset, Show Results | `NotificationFilterModal` |
| Phone Alerts bottom sheet | `NotificationSettingsSheet` (handle, slide, larger rows) |
| Loading skeleton, empty and no-match states | `NotificationSkeleton`, `NotificationEmptyState` |

## Notes

- "Needs action" maps to the existing `urgent` flag. The category id stays `trust`; only its label changed.
- The "Sample data" watermark from the frames is not shown.

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. No backend change.
