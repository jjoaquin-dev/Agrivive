# 2026-10-27 Collapsible Market Visibility Guide Cards

## Overview
Transformed the Market Visibility Guide cards on the seller analytics/visibility screen (`VisibilityBreakdownCard.tsx`) into collapsible cards matching the UX pattern of the listing inventory cards (`ProductCard.tsx`).

## What Changed
1. **Collapsible State & Toggle**:
   - Added `const [expanded, setExpanded] = useState(false)` state to toggle detailed factor breakdown visibility.
   - Encapsulated the 4-factor grid (`VisibilityFactorsGrid`) and ranking disclaimer in an `expanded && <View style={styles.expandedContent}>` container separated with a divider.
   - Maintained the top snapshot overview (product name, tier badge, placement score, browse positioning note) visible at all times.
2. **Action Buttons Row**:
   - Replaced full-width bottom button with an `actionRow` containing:
     - `detailsButton`: Outlined button with "Details" / "Less" and `ChevronDown` / `ChevronUp` icons toggling the breakdown.
     - `boostButton`: Prominent button ("Boost Visibility" or "Boost Deal") launching the boost flow.
3. **Ergonomics & Standards**:
   - Adheres to **Jakob's Law** (*Jakob Nielsen*) by aligning interaction patterns with the existing inventory `ProductCard.tsx`.
   - Adheres to **Fitts's Law** (*Paul Fitts*) with 44px min touch targets and comfortable hit slop.
   - Preserved file size strictly under the project limit (178 lines $\le 200$ lines).

## Affected Files
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`

## Verification
- `mobile`: `bun run typecheck` (`tsc --noEmit`) completed with 0 errors.
- Line count verified: `178 mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx` ($\le 200$ lines).
