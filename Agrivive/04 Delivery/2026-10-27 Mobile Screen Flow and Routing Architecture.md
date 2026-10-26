# 2026-10-27 Mobile Screen Flow and Routing Architecture

## Overview
Restructured the Agrivive mobile seller navigation architecture into a canonical 5-tab dock, eliminated the fake center "Add" button interceptor anti-pattern, elevated the Profile screen to a first-class root tab, relocated Reservations (Orders) adjacent to Home for optimal ergonomic thumb reach, and configured ephemeral tasks (QR Scanner, Add Produce, Adjust Stock) as proper native modals.

## What Changed

### 1. Tab Dock Restructure (`mobile/app/(app)/(tabs)/_layout.tsx`)
- **Canonical 5-Tab Order**:
  1. **Home** (`home.tsx`): Seller command center, today's summary, quick stats.
  2. **Reservations** (`orders.tsx`): Active buyer pickups, status filters (Waiting, Done, Cancelled, Expired), and direct QR scan trigger.
  3. **Listings** (`inventory.tsx`): Surplus produce catalog, stock steppers (Add More / Take Away), and dedicated Floating Action Button.
  4. **Messages** (`messages.tsx`): Web inquiries and direct buyer conversations with unread counter badge.
  5. **Profile** (`profile.tsx`): Stall profile, verification badge, trust score, and security settings.
- **Removed Fake Tab Interceptor**:
  - Deleted the dummy elevated `create` tab button from the tab dock.
  - Adding produce is naturally triggered via the prominent "+ Add Product" button on `inventory.tsx` (FAB) and `home.tsx` (twin actions).
- **Elevated Profile to Root Tab**:
  - Replaced the hidden profile tab (`href: null`) with a visible, accessible tab using the `User` icon.

### 2. Modal vs Push Stack Refinement (`mobile/app/(app)/_layout.tsx`)
- **Configured Ephemeral Modals**:
  - `orders/scan`: `presentation: "fullScreenModal"`, `animation: "slide_from_bottom"`. Fullscreen camera viewfinder with cancel affordance.
  - `inventory/create`: `presentation: "modal"`, `animation: "slide_from_bottom"`. Focused listing creation sheet.
  - `inventory/[id]/stock`: `presentation: "formSheet"`, `animation: "slide_from_bottom"`. Quick stock adjustment sheet.

### 3. Cleanup of Obsolete & Duplicate Routes
- Removed `mobile/app/(app)/(tabs)/create.tsx` (dead redirect screen).
- Removed `mobile/app/(app)/messages.tsx` (redundant duplicate of `(tabs)/messages.tsx`).

## Affected Files
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/(tabs)/create.tsx` (deleted)
- `mobile/app/(app)/messages.tsx` (deleted)

## Verification
- `mobile`: `bun run typecheck` passed with 0 errors.
- `backend`: `bunx tsc --noEmit` and `bun build` passed with 0 errors.
- All files strictly adhere to the $\le 200$ lines limit.

## Commit
- **Hash:** `a6a1365`
- **Message:** `restructure mobile screen flow and tab dock architecture`
