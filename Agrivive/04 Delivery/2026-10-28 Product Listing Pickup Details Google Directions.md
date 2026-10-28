# 2026-10-28 Product Listing Pickup Details Google Directions

## Overview
Added a direct **"Get Direction"** navigation text button inside the "Pickup details" card on the product listing view page. When clicked, it opens Google Maps directions to the seller's market stall in a new browser tab.

## Changes Made
1. **`web/src/lib/maps.ts`**:
   - Enhanced `getDirectionsUrl` with an optional fallback to `address?: string | null`.
   - When coordinates (`latitude`, `longitude`) are present, it links to `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`.
   - When coordinates are absent or unpinned, it gracefully falls back to the seller's stall address string (`destination=<address>`), ensuring directions work consistently.
2. **`web/src/features/marketplace/components/ProductInfoCard.tsx`**:
   - Imported `Compass` from `lucide-react` and `getDirectionsUrl` from `@/src/lib/maps`.
   - Computed `directionsUrl` passing seller coordinates and `detailAddress`.
   - Added an inline-flex `"Get Direction"` link button with a compass icon in the Pickup details card header.
   - Kept the file compact and readable at 186 lines (under the 200-line limit).

## UI/UX Principles Applied
- **Don Norman (Affordances & Signifiers)**: Compass icon paired with Forest Green text and underline-on-hover communicates an immediate, tactile external navigation action.
- **Gestalt (Law of Proximity & Common Region)**: Positioned directly in the Pickup details container header beside the stall address.
- **Jon Postel (Postel's Law / Robustness Principle)**: Forgiving destination resolution accepting either exact geographic coordinates or street/stall address text.

## Affected Files
- `web/src/lib/maps.ts`
- `web/src/features/marketplace/components/ProductInfoCard.tsx`

## Verification Performed
- Ran `cd web; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Ran `cd backend; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Confirmed file length constraints (`ProductInfoCard.tsx` at 186 lines).
