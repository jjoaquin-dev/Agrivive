# 2026-10-28 Produce Tote Bag Logo Integration and Wordmark Height Alignment

## Overview
Updated the Agrivive brand logo emblem across the entire web application to the user-provided vibrant green vegetable produce tote bag (`media_1793184761052_df1c9d7c.png`), calibrated to precisely match the optical height of the "Agrivive" brand wordmark.

## Changes Made
1. **Brand Asset Processing**:
   - Cropped `media_1793184761052_df1c9d7c.png` to its exact $461 \times 495\text{px}$ content boundary, removing all empty transparent padding at top and bottom.
   - Saved as the primary emblem at `web/public/brand/agrivive-logo-bag.png`.
   - Generated a high-contrast white variant (`web/public/brand/agrivive-logo-bag-dark.png`) for dark surfaces such as the footer.
   - Synchronized to mobile assets (`mobile/assets/brand/Agrivive_Logo.png`).
   - Flushed `.next/cache/images` to avoid cached legacy images.
2. **Component Logo & Height Alignment**:
   - `web/src/components/SiteHeader.tsx`: Set to `h-[22px] w-auto` matching `text-[22px]` font size.
   - `web/src/components/BuyerSiteHeader.tsx`: Set to `h-[22px] w-auto` matching `text-[22px]` font size.
   - `web/src/features/home/components/LandingHeader.tsx`: Set to `h-[22px] w-auto` matching `text-[22px]` font size.
   - `web/src/features/auth/components/AuthShell.tsx`: Set to `h-[26px] w-auto` matching `text-[26px]` font size in login and registration panels.
   - `web/src/features/home/components/HomeFooter.tsx`: Calibrated dark variant to `h-[22px] w-auto` matching `text-[22px]` footer wordmark.
   - `web/src/features/marketplace/components/MarketplaceFooter.tsx`: Calibrated dark variant to `h-[15px] w-auto` matching `text-[15px]` wordmark.
   - `web/app/layout.tsx`: Updated favicon and app icon definitions to `/brand/agrivive-logo-bag.png`.

## UI/UX Principles Applied
- **Max Wertheimer & Kurt Koffka (Gestalt Law of Prägnanz & Alignment)**: Eliminating transparent padding ensures the emblem top and bottom align with the wordmark cap-height and baseline.
- **Masaaki Kurosu & Kaori Kashimura (Aesthetic-Usability Effect)**: Balanced proportions between the organic tote bag illustration and the MD Nichrome typography create a cohesive, trustworthy brand identity.

## Affected Files
- `web/public/brand/agrivive-logo-bag.png`
- `web/public/brand/agrivive-logo-bag-dark.png`
- `mobile/assets/brand/Agrivive_Logo.png`
- `mobile/assets/brand/agrivive-logo-icon.png`
- `web/src/components/SiteHeader.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/src/features/home/components/HomeFooter.tsx`
- `web/src/features/marketplace/components/MarketplaceFooter.tsx`
- `web/app/layout.tsx`

## Verification Performed
- Ran `cd web; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Verified file constraints (all files remain $\le 200$ lines).
- Cleared Next.js image cache to ensure fresh asset delivery.
