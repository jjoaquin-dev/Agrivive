---
title: Visibility Cycle Label
type: delivery
date: 2026-10-07
status: implemented; device visual review pending
---

# Visibility Cycle Label

## What changed and why

Replaced the Marketplace Visibility Guide's inaccurate `0 completed` wording with `Prior cycles (30d)` and the recorded count. The score calculation and cycle data are unchanged. The label now names the data and time window without implying that cycles are marked complete.

## Affected paths

- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`

## Verification

- `cd mobile && bun run typecheck` — passed.
- Device screenshot review — not performed in this environment.

## Remaining acceptance

- Confirm the updated label and count on the seller Analytics screen on a device.
