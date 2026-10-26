# 2026-10-27 Notification FlatList KeyExtractor and Date Sort Crash Fix

## Date
2026-10-27

## What Changed
1. **Defensive FlatList keyExtractor & Render Guards**:
   - In `mobile/app/(app)/notifications.tsx`, updated `keyExtractor` to `(item, index) => item?.id ?? `notif-${index}``, preventing unhandled `TypeError: Cannot read property 'id' of undefined`.
   - Added null-guards in `renderItem` (`if (!item) return null;`) to avoid crashes when rendering sectioned notification lists.
   - Guarded unique ID generation for each sectioned card (`${c.id}-today-${i}`) to eliminate React child key collisions.
2. **Safe Date Sorting & NaN Protection**:
   - In `mobile/app/(app)/notifications.tsx` and `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`, implemented `!isNaN(date.getTime())` fallbacks in the sorting comparators. When any notification has an invalid or missing date, the comparator returns a deterministic integer instead of `NaN`, preventing Timsort invariant failure and sparse arrays with `undefined` holes.
3. **Resilient Date Parsing in Notification Mappers**:
   - In `mobile/src/features/notifications/utils/unifiedNotificationMappers.ts`, added `parseDate` helper so malformed or null timestamps fall back to `new Date()` instead of producing `Invalid Date`.
   - Guarded `formatRelativeTime(date)` to return `"Recently"` if `!date || isNaN(date.getTime())`.

## Why
When notifications without standard timestamps were sorted using `b.rawDate.getTime() - a.rawDate.getTime()`, the subtraction produced `NaN`. In JavaScript engines (Hermes on Android/iOS), sorting with `NaN` can leave `undefined` slots in the resulting array. This cascaded into runtime errors inside `useMemo` (`item.timestamp`) and `FlatList`'s `keyExtractor` (`item.id`).

## Affected Files
- `mobile/app/(app)/notifications.tsx`
- `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`
- `mobile/src/features/notifications/utils/unifiedNotificationMappers.ts`

## Verification
- `bunx tsc --noEmit` on mobile: **0 errors**.
- `bunx tsc --noEmit` & `bun build src/index.ts` on backend: **0 errors** (1819 modules bundled).
- Verified line limits: All touched files $\le 200$ lines.

## Git Commit
- **Commit Hash:** `5ba83ca`
- **Message:** `fix notifications flatlist keyExtractor and safe date sorting crash`
