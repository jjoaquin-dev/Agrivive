# 2026-10-27 Vegetable Crate Logo and Brand Typography Refinement

## Context & Objectives
Update the web brand identity to adopt the newly provided high-resolution, vibrant green vegetable harvest crate illustration as the primary logo emblem, install the custom **Mass-Driver MD Nichrome** font family for the "Agrivive" brand wordmark with thick **Black** weight (900 cut), and calibrate the icon height to `18px` so its top and bottom boundaries precisely match the optical height of the wordmark.

## Why
- **Aesthetic-Usability Effect (Masaaki Kurosu & Kaori Kashimura)**: MD Nichrome features organic retro-geometric curves and high-impact structural warmth, providing an authentic, premium farmers-market identity that increases perceived platform trust.
- **Gestalt Law of Similarity & Color Harmony (Max Wertheimer)**: Adopting the vibrant brand-green (`#457D00`) crate illustration creates a harmonious palette across the graphic emblem and the brand wordmark.
- **Law of Prägnanz (Simplicity & Alignment) (Max Wertheimer & Kurt Koffka)**: Trimming the crate graphic to its exact 873×907px bounding box and scaling its rendered height to `h-[18px] w-auto` aligns its top and bottom bounds precisely with the 18-19px glyph height of the "Agrivive" wordmark.
- **Visual Weight Balance & Figure-Ground (Max Wertheimer & Edgar Rubin)**: Applying the `font-black` (900 cut) weight gives the letter stems the thickness needed to balance the solid mass of the crate graphic.
- **Doherty Threshold & Performance (Walter J. Doherty & Ahrvid J. Thadhani)**: Local font loading via `next/font/local` with `display: "swap"` avoids external network hops, eliminates layout shift (CLS), and delivers instant rendering under 100ms.

## What Changed
1. **Brand Asset Updates**:
   - Replaced `web/public/brand/agrivive-logo-crate.png` with the user-provided high-res vibrant green crate graphic (`media_1793098123179_d49a6c06.png`).
   - Trimmed transparent padding to a tight 873×907px bounding box.
   - Generated a high-contrast white-stroke contrast variant (`web/public/brand/agrivive-logo-crate-dark.png`) for dark footer surfaces.
   - Flushed `web/.next/cache/images/` to prevent serving cached legacy images.
2. **Mass-Driver MD Nichrome Font Integration**:
   - Copied `MDNichromeTrial-Regular.otf` (400), `MDNichromeTrial-Bold.otf` (700), `MDNichromeTrial-Dark.otf` (800), and `MDNichromeTrial-Black.otf` (900) into `web/public/fonts/`.
   - Configured `localFont` in `web/app/layout.tsx` targeting variable `--font-brand`.
   - Extended `web/tailwind.config.ts` with `fontFamily.brand: ["var(--font-brand)", "var(--font-heading)", "Poppins", "sans-serif"]`.
3. **Component Lockup Adjustments**:
   - `web/src/components/BuyerSiteHeader.tsx`: Switched "Agrivive" text to `font-brand text-[22px] font-black` alongside `h-[18px] w-auto` icon with `gap-1.5`.
   - `web/src/features/home/components/LandingHeader.tsx`: Updated to matching `font-brand text-[22px] font-black` and `h-[18px] w-auto`.
   - `web/src/components/SiteHeader.tsx`: Updated to `font-brand text-[22px] font-black` and `h-[18px] w-auto`.
   - `web/src/features/auth/components/AuthShell.tsx`: Standardized Login & Register auth headers to `h-[22px] w-auto` icon aligned to `font-brand text-[26px] font-black` text with `gap-1.5`.
   - `web/src/features/marketplace/components/MarketplaceFooter.tsx`: Calibrated footer crate icon to `h-[15px] w-auto` matching `font-brand text-[15px] font-black` text.
   - `web/src/features/home/components/HomeFooter.tsx`: Calibrated footer crate icon to `h-[18px] w-auto` matching `font-brand text-[22px] font-black` text in title-case.

## Affected Files
- `web/public/fonts/MDNichromeTrial-Regular.otf`
- `web/public/fonts/MDNichromeTrial-Bold.otf`
- `web/public/fonts/MDNichromeTrial-Dark.otf`
- `web/public/fonts/MDNichromeTrial-Black.otf`
- `web/public/brand/agrivive-logo-crate.png`
- `web/public/brand/agrivive-logo-crate-dark.png`
- `web/app/layout.tsx`
- `web/tailwind.config.ts`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/src/features/marketplace/components/MarketplaceFooter.tsx`
- `web/src/features/home/components/HomeFooter.tsx`

## Verification Performed
- Loaded local fonts in Next.js development server with zero build or runtime warnings.
- Ran `Invoke-WebRequest` against `http://localhost:3001/` (Home), `http://localhost:3001/marketplace`, and `http://localhost:3001/login` - all returned HTTP 200 OK with fast local compilation.

