# 2026-10-27 Boost History Pagination Implementation

## Overview
Added pagination to the seller **Boost History** page (`mobile/app/(app)/boosts.tsx`), standardizing its controls with the listing inventory (`inventory.tsx`) and orders (`orders.tsx`) screens. Modularized the boost item card to maintain file sizes strictly under 200 lines.

## What Changed

1. **Boost Card Modularization (`mobile/src/features/boost/components/BoostHistoryCard.tsx`)**:
   - Extracted `BoostHistoryCard` and date formatting logic into a dedicated component.
   - Preserves status badges, icons, price difference labels, error messaging, and "View listing status" action handlers.
   - Kept under 80 lines.

2. **Boost History Pagination (`mobile/app/(app)/boosts.tsx`)**:
   - Integrated `PaginationControl` into the `FlatList`'s `ListFooterComponent`.
   - Added `pageSize` state (default 10, options `[5, 10, 20]`) and `currentPage` state.
   - Added automatic page-1 reset when switching status filters (`all`, `queued`, `sent`, `prompt`, `failed`).
   - Slices `visibleItems` into `paginatedItems` while preserving background cursor loading when paging towards accumulated bounds.
   - Kept under 185 lines.

## Affected Files
- `mobile/src/features/boost/components/BoostHistoryCard.tsx`
- `mobile/app/(app)/boosts.tsx`

## Verification
- `mobile`: `bun run typecheck` passed cleanly with 0 errors.
- Both modified and created files strictly satisfy the $\le 200$ line constraint.

## Commit
- **Hash:** `65cac67`
- **Message:** `add pagination to boost history screen`

