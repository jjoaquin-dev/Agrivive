---
title: Prof Feedback Jara Items
type: delivery
date: 2026-11-08
---

# 2026-11-08 Prof Feedback Jara Items

## What changed and why

The prof asked that every number on the screen has proof. These Jara items from the 2026-11-04 checklist were worked.

| Item | Change |
|---|---|
| 6 or 12 hours | Set to 6. The old prototype score now counts a listing as aged after 6 hours (`freshnessWindowHours`), and the phone stock warning says "over 6 hours old" and starts at 6 hours |
| Score out of 100 | The Visibility card shows `89.4 / 100` (closeness × 100, one decimal) |
| The name "C" | Closeness score is always written in words in the notes and on screen. Criteria are named, not numbered, in the proof pack |
| Weights | Current weights kept (0.3507, 0.3507, 0.1892, 0.1093). The 40/30/20/10 set is the old prototype |
| Hand math, test table, change-one-value | New note [[AHP-TOPSIS Proof Pack]] |
| Analytics | A short description under each chart on the Sales Report |

## Not done (checked, left open)

- Tiers 60/40 are not built, so no tier label and no seller-screen screenshot with a tier. Not ticked.
- Repeat-listings table with sell-through: the screen shows only a count.
- No pie chart exists. The dashboard uses bars.
- Direct buyer notification when a price drops: not built.
- Screenshots and phone checks were not taken.

## Files

- `backend/src/utils/visibility-score/index.ts`
- `mobile/src/features/marketing/components/VisibilityBreakdownCard.tsx`
- `mobile/src/features/marketing/components/VisibilityFactorsGrid.tsx`
- `mobile/src/features/inventory/components/StockFreshnessWarningModal.tsx`
- `mobile/src/features/inventory/components/StockChangeForm.tsx`
- `mobile/src/features/analytics/components/` (five description lines)
- `Agrivive/03 Intelligence/AHP-TOPSIS Proof Pack.md`, `Weighted Surplus Visibility.md`, `00 Home.md`

## Checks

Mobile typecheck passed. Boost selection tests (6) passed. Backend `tsc` reports errors only in two older scratch files (`src/ahp-test.ts`, `src/topsis-test.ts`), none in changed files. Sample numbers come from the real engine. No phone or browser check.

Links: [[00-LATEST]], [[AHP-TOPSIS Proof Pack]].
