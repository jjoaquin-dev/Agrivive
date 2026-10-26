# 2026-10-27 Messages Screen Horizontal Filter Scroll Fix

## Overview
Fixed an issue in the mobile seller app's **Messages** screen (`mobile/app/(app)/(tabs)/messages.tsx`) where the filter pill tabs (`All`, `Unread`, `Inquiries`, `Reservations`, `Web Inquiries`) could not be scrolled horizontally, causing the later chips to be cut off and inaccessible on narrower devices.

## What Changed
1. **`mobile/src/features/conversations/components/SellerMessagesStyles.ts`**:
   - Replaced static `filterRow` style (`overflow: "scroll"`, which has no effect on a React Native `View`) with `filterScrollView` and `filterScrollContent`.
   - Used negative horizontal margins matching header padding (`marginHorizontal: -spacing.base`) and symmetric inner content padding (`paddingHorizontal: spacing.base`) to allow smooth edge-to-edge swiping.
2. **`mobile/app/(app)/(tabs)/messages.tsx`**:
   - Imported `ScrollView` from `react-native`.
   - Replaced `<View style={styles.filterRow}>` with `<ScrollView horizontal showsHorizontalScrollIndicator={false}>`.
   - Added `accessibilityRole="tab"` and `accessibilityState={{ selected }}` on filter chips.

## Affected Files
- `mobile/src/features/conversations/components/SellerMessagesStyles.ts`
- `mobile/app/(app)/(tabs)/messages.tsx`

## Verification
- `mobile`: `bun run typecheck` passed cleanly with 0 errors.
- `messages.tsx` line count is 184 lines (strictly adhering to the $\le 200$ line limit).

## Commit
- **Hash:** `54f1758`
- **Message:** `fix messages filter pill horizontal scrolling`

