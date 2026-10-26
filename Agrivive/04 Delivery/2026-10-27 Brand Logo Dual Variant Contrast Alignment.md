# 2026-10-27 Brand Logo Dual Variant Contrast Alignment & Crate Produce Update

## Context & Objectives
Update the primary brand logo across the web application using the newly supplied vegetable crate artwork with contrast-adaptive variants:
- **Light Backgrounds**: Green crate and produce icon (`/brand/agrivive-logo-crate.png`).
- **Dark Backgrounds**: White/light outline crate and produce icon (`/brand/agrivive-logo-crate-dark.png`).
- **Proximity & Typographic Alignment**: Bring the logo and "Agrivive" wordmark into close proximity (`gap-1` / `gap-1.5`) with tight line-height (`leading-none`) matching the height of the crate icon.

## Why
- **Figure-Ground Principle & Visual Contrast (Gestalt Psychology)**: High contrast between the foreground brand icon and varying header/footer backgrounds ensures immediate recognizability (*Von Restorff Effect*) and accessibility across diverse light and dark themes.
- **Law of Proximity (Gestalt Psychology)**: Placing the icon and brand name directly adjacent creates a singular, unified visual brandmark lockup.

## What Changed
1. **Asset Deployment & Cache-Busting Migration**:
   - `web/public/brand/agrivive-logo-crate.png`: Deployed the green vegetable crate artwork (469x532, transparent background) for light surfaces.
   - `web/public/brand/agrivive-logo-crate-dark.png`: Deployed the white outline crate artwork (472x529, transparent background) for dark surfaces.
   - Purged `web/.next/cache/images/` to prevent stale WebP cache.
2. **Component Updates & Container Removal**:
   - `web/src/features/auth/components/AuthShell.tsx`: Configured `/brand/agrivive-logo-crate.png` with `text-[32px] font-bold leading-none` and tight `gap-1` spacing across centered and split auth card layouts.
   - `web/src/components/BuyerSiteHeader.tsx`: Configured `/brand/agrivive-logo-crate.png` with `text-[28px] font-bold leading-none` and `gap-1` spacing.
   - `web/src/components/SiteHeader.tsx`: Configured `/brand/agrivive-logo-crate.png` with `text-[28px] font-bold leading-none` and `gap-1` spacing.
   - `web/src/features/home/components/LandingHeader.tsx`: Configured `/brand/agrivive-logo-crate.png` with `text-[28px] font-bold leading-none` and `gap-1` spacing.
   - `web/src/features/home/components/HomeFooter.tsx`: Configured `/brand/agrivive-logo-crate-dark.png` with `gap-1.5` on dark surface.
   - `web/src/features/marketplace/components/MarketplaceFooter.tsx`: Configured `/brand/agrivive-logo-crate-dark.png` with `gap-1.5` on dark surface.
   - `web/app/layout.tsx`: Updated metadata icons to `/brand/agrivive-logo-crate.png`.

## Affected Files
- `web/public/brand/agrivive-logo-crate.png`
- `web/public/brand/agrivive-logo-crate-dark.png`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/src/features/home/components/HomeFooter.tsx`
- `web/src/features/marketplace/components/MarketplaceFooter.tsx`
- `web/app/layout.tsx`

## Verification Performed
- **Live Asset Endpoints**: Verified both `http://localhost:3001/brand/agrivive-logo-crate.png` and `http://localhost:3001/brand/agrivive-logo-crate-dark.png` respond with HTTP `200 OK`.
- **TypeScript Typecheck**: Ran `npm run typecheck` (`tsc --noEmit`) in `web/` — passed with 0 errors.
- **Line Count Limits**: Verified all modified component files remain strictly $\le 200$ lines.
