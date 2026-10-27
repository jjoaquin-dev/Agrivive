# 2026-10-27 Unified Produce Bag Application and Internal Logo Replacement

## Context & Objectives
Replace the legacy brand logo marks across both **Web** and **Mobile** with the new official produce tote bag artwork (`Agrivive_Logo.png`). Ensure unified brand identity, high visual contrast across light and dark surfaces, and replace generic internal placeholder icons (such as `<Sprout />`) with the authentic brand emblem.

## Why
- **Recognition Over Recall & Jakob's Law (Cognitive Psychology)**: Consistent, recognizable visual signifiers across web marketplace, mobile seller app, browser tabs, home screen launcher icons, and splash screens establish strong brand recall and trust.
- **Figure-Ground Principle & Visual Contrast (Gestalt Psychology)**: Generating crisp, high-resolution dark-variant outlines (pure white stroke retaining anti-aliased alpha transparency) ensures optimal legibility on dark surfaces (`HomeFooter` and `MarketplaceFooter`), while the primary green artwork shines on light surfaces.
- **Law of Common Region (Gestalt Psychology)**: Replacing generic placeholder icons with the unified brand mark in internal headers ([`DashboardHeader.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/dashboard/components/DashboardHeader.tsx) and [`onboarding.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(auth)/onboarding.tsx)) solidifies the internal brand presence.

## What Changed
1. **Master Artwork & Variant Generation (`sharp`)**:
   - Source: [`mobile/assets/brand/Agrivive_Logo.png`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/assets/brand/Agrivive_Logo.png) (1254×1254 RGBA).
   - Generated Web Brand Assets:
     - `web/public/brand/agrivive-logo-crate.png` & `agrivive-logo-bag.png`: Master 1024×1024 transparent produce bag logo.
     - `web/public/brand/agrivive-logo-icon.png`: Master high-res brand icon.
     - `web/public/brand/agrivive-logo-crate-dark.png` & `agrivive-logo-bag-dark.png`: White-stroke contrast variant on transparent alpha.
     - `web/public/brand/agrivive-logo-icon-dark.png`: Master dark mode brand icon.
     - `web/public/brand/Agrivive_Logo.png`: Direct copy for explicit asset reference.
   - Generated Web Favicons & PWA Icons:
     - `web/app/icon.png` (192×192 PNG)
     - `web/app/apple-icon.png` (180×180 PNG)
     - `web/app/favicon.ico` (32×32 PNG favicon)
   - Generated Mobile Launcher, Adaptive, and Splash Assets:
     - `mobile/assets/agrivive-icon.png` & `mobile/assets/icon.png`: 1024×1024 app icon centered on white background.
     - `mobile/assets/agrivive-adaptive-foreground.png` & `mobile/assets/android-icon-foreground.png`: Android adaptive foreground with inner 60% safe-zone padding.
     - `mobile/assets/agrivive-splash.png` & `mobile/assets/splash-icon.png`: Splash screen icon.
     - `mobile/assets/favicon.png`: 48×48 Expo web favicon.
     - `mobile/assets/brand/agrivive-logo-icon.png`: Master brand icon.
   - Cache Invalidation: Purged `web/.next/cache/images/` to prevent serving stale image cache.

2. **Internal Code & Component Updates**:
   - [`mobile/src/features/dashboard/components/DashboardHeader.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/dashboard/components/DashboardHeader.tsx): Replaced the generic `<Sprout />` icon inside `logoCircle` with the official `<Image source={require("../../../../assets/brand/Agrivive_Logo.png")} style={styles.logoImage} resizeMode="contain" />` (26×26px) next to the "Agrivive" wordmark.
   - [`mobile/app/(auth)/onboarding.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(auth)/onboarding.tsx): Replaced outdated `agrivive-logo-full.png` with a clean vector-sharp lockup combining `Agrivive_Logo.png` and bold green "Agrivive" wordmark.

## Affected Files
- `mobile/assets/brand/Agrivive_Logo.png`
- `mobile/assets/brand/agrivive-logo-icon.png`
- `mobile/assets/agrivive-icon.png`
- `mobile/assets/icon.png`
- `mobile/assets/agrivive-adaptive-foreground.png`
- `mobile/assets/android-icon-foreground.png`
- `mobile/assets/agrivive-splash.png`
- `mobile/assets/splash-icon.png`
- `mobile/assets/favicon.png`
- `mobile/src/features/dashboard/components/DashboardHeader.tsx`
- `mobile/app/(auth)/onboarding.tsx`
- `web/public/brand/Agrivive_Logo.png`
- `web/public/brand/agrivive-logo-crate.png`
- `web/public/brand/agrivive-logo-bag.png`
- `web/public/brand/agrivive-logo-icon.png`
- `web/public/brand/agrivive-logo-crate-dark.png`
- `web/public/brand/agrivive-logo-bag-dark.png`
- `web/public/brand/agrivive-logo-icon-dark.png`
- `web/app/icon.png`
- `web/app/apple-icon.png`
- `web/app/favicon.ico`

## Verification Performed
1. **Asset File Verification**: Verified all generated PNGs with the `file` utility for correct dimensions and RGBA non-interlaced formatting.
2. **TypeScript Typecheck**:
   - `cd mobile && bunx tsc --noEmit` -> Passed with 0 errors.
   - `cd web && bunx tsc --noEmit` -> Passed with 0 errors.
   - `cd backend && bunx tsc --noEmit` -> Passed with 0 errors.
3. **Production Build**:
   - `cd web && bun run build` -> Passed with static generation of 20/20 routes and optimized bundle sizes.
4. **Code Quality**:
   - Verified [`DashboardHeader.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/dashboard/components/DashboardHeader.tsx) is 123 lines (strictly $\le 200$ lines).
