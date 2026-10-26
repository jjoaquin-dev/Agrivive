# 2026-10-26 Systemwide #FDFDFD Background Color Harmonization

## Date
2026-10-26

## What Changed
Standardized the background color to `#FDFDFD` across primary subpages:
1. **Settings / Profile Page**:
   - `web/src/features/profile/components/BuyerProfile.tsx`: Updated main layout and loading fallback background to `bg-[#FDFDFD]`.
   - `web/app/profile/page.tsx`: Updated Suspense fallback wrapper to `bg-[#FDFDFD]`.
2. **Notification Page**:
   - `web/src/features/notifications/components/BuyerNotifications.tsx`: Updated main canvas from `bg-agrivive-background` (`#F8F6F1`) to `bg-[#FDFDFD]`.
3. **Messages Page**:
   - `web/src/features/conversations/components/BuyerConversations.tsx`: Updated main canvas from `bg-[#F6F7F2]` to `bg-[#FDFDFD]`.
   - `web/app/messages/page.tsx`: Updated Suspense fallback wrapper to `bg-[#FDFDFD]`.
4. **View Listing / Product Detail Page**:
   - `web/src/features/marketplace/components/ProductDetail.tsx`: Updated main canvas from `bg-agrivive-background` to `bg-[#FDFDFD]`.
   - `web/app/marketplace/[id]/page.tsx`: Updated auth/session loading fallback to `bg-[#FDFDFD]`.

## Why
- **Figure-Ground Principle (Gestalt Psychology - Max Wertheimer, Kurt Koffka)**: Foreground cards (`#FFFFFF`) with crisp `1px` neutral borders (`#E5E2DA` / `#E8E8E8`) stand out cleanly against `#FDFDFD` with balanced contrast and zero visual muddying.
- **Law of Prägnanz (Simplicity)**: Eliminates conflicting off-white hues (`#F8F6F1`, `#F6F7F2`, `bg-background`) across buyer flows, unifying the platform around a cohesive palette.
- **Aesthetic-Usability Effect (Masaaki Kurosu & Kaori Kashimura)**: Harmonious backgrounds across Orders, Settings, Notifications, Messages, and Product Detail pages instill higher confidence and visual polish.

## Affected Files
- `web/src/features/profile/components/BuyerProfile.tsx` (192 lines)
- `web/app/profile/page.tsx` (14 lines)
- `web/src/features/notifications/components/BuyerNotifications.tsx` (140 lines)
- `web/src/features/conversations/components/BuyerConversations.tsx` (187 lines)
- `web/app/messages/page.tsx` (7 lines)
- `web/src/features/marketplace/components/ProductDetail.tsx` (160 lines)
- `web/app/marketplace/[id]/page.tsx` (40 lines)

## Verification
- Verified line count of each modified file remains strictly $\le 200$ lines.
- Ran `cd web; bun run typecheck` (`tsc --noEmit`): exited with code 0 (zero errors).
- Hot reload refreshed live across all views in the dev server.
