---
title: Web Production Performance Optimization
type: enhancement
status: completed
created: 2026-10-27
updated: 2026-10-27
tags:
  - web
  - performance
  - nextjs
  - core-web-vitals
  - caddy
---

# Web Production Performance Optimization

## Overview
Comprehensive performance audit and optimization of the Agrivive buyer web application (`web/`) and production reverse proxy (`deploy/Caddyfile`) to resolve slow production loading speeds, eliminate network waterfalls, and elevate Core Web Vitals (FCP, LCP, CLS, INP).

---

## What Changed & Why

1. **Caddy Reverse Proxy Compression & Caching (`deploy/Caddyfile`)**
   - **Why**: Caddy v2 by default does not compress proxied responses unless explicitly enabled. All HTML, JS, CSS, and API responses were being transmitted uncompressed.
   - **What**: Added `encode zstd gzip` to both `{$WEB_DOMAIN}` and `{$API_DOMAIN}`. Configured long-term immutable caching (`Cache-Control: public, max-age=31536000, immutable`) for static content-hashed chunks and assets (`/_next/static/*`, `/brand/*`, `/categories/*`, etc.).

2. **Self-Hosted Font Optimization (`web/app/layout.tsx`)**
   - **Why**: An external `<link>` to Google Fonts requested 14 font variants across two remote origins (`fonts.googleapis.com` and `fonts.gstatic.com`), blocking First Contentful Paint.
   - **What**: Migrated to Next.js `next/font/google` (`Lato` and `Poppins`). Fonts are now downloaded at build time, self-hosted, inlined with zero layout shift, and require zero external network requests.

3. **Production Image Optimization Engine (`web/package.json`, `web/next.config.ts`)**
   - **Why**: `sharp` was missing, causing Next.js to fall back to unoptimized JavaScript image processing on the CPU.
   - **What**: Installed `sharp@0.35.5`. Added `output: "standalone"` for minimal Docker builds, configured modern image formats (`avif`, `webp`), set a 30-day minimum image cache TTL, and enabled `experimental.optimizePackageImports` for `lucide-react` and `@base-ui/react`.

4. **Removal of Legacy Pages Router Artifact (`web/pages/_document.tsx`)**
   - **Why**: Having `_document.tsx` alongside Next.js App Router caused Next.js to compile duplicate Pages Router client runtimes (adding ~125KB of dead weight).
   - **What**: Removed `web/pages/_document.tsx` and the `web/pages` directory.

5. **Elimination of Client-Side Auth Gating on Public Marketplace (`web/app/marketplace/page.tsx`, `web/app/marketplace/[id]/page.tsx`)**
   - **Why**: The marketplace and product detail pages were blocked behind client-side `authClient.useSession()` checks, which rendered an empty skeleton pulse during initial SSR and delayed product display by 3–4 seconds. This violated `web/AGENTS.md` (which states marketplace browsing is public).
   - **What**: Removed the client session barrier from `/marketplace` and `/marketplace/[id]`. SSR now streams marketplace components directly on first paint.

6. **Image Optimization in Marketplace & Home (`web/src/features/marketplace/components/ProductImage.tsx`, `HomeCategories.tsx`, `HomeFeaturedProduceCard.tsx`, `HomeHowItWorks.tsx`, `HomeWhySurplusCard.tsx`, `HomeImpactTestimonials.tsx`)**
   - **Why**: Images across the homepage and product grid were loaded using raw `<img>` tags (including 5.8MB of uncompressed category PNGs and 500KB+ produce photos).
   - **What**: Converted raw `<img>` elements to Next.js `Image` components with explicit dimensions or `fill` and responsive `sizes`, allowing automatic conversion to WebP/AVIF and dramatic payload reductions.

7. **Isolating Leaflet CSS & Dynamic Loading (`web/src/features/marketplace/components/InteractiveSellerMap.tsx`, `MarketplaceSellerSection.tsx`)**
   - **Why**: Leaflet CSS was loaded globally in `layout.tsx`, adding unused styles to every page.
   - **What**: Moved Leaflet CSS directly into `InteractiveSellerMap.tsx`, and dynamically imported `InteractiveSellerMap` and `SellerMapModal` with `next/dynamic({ ssr: false })` in `MarketplaceSellerSection.tsx`.

8. **Debouncing Marketplace Price Slider (`web/src/features/marketplace/components/MarketplacePriceSlider.tsx`)**
   - **Why**: Dragging the dual-thumb range slider triggered immediate router URL replacements on every 10-unit tick, flooding the backend with up to 50 concurrent abortable queries.
   - **What**: Added local slider state with 300ms debouncing before triggering URL parameter sync.

9. **Server Component Conversions on Marketing Sections**
   - **Why**: All 10 homepage sections were marked `"use client"`, sending unnecessary JavaScript to the client.
   - **What**: Removed `"use client"` from `HomeHero`, `HomeCategories`, `HomeFeaturedProduce`, `HomeHowItWorks`, `HomeWhySurplus`, `HomeImpactTestimonials`, and `HomeFooter`.

---

## Affected Files

- `deploy/Caddyfile`
- `web/next.config.ts`
- `web/package.json`
- `web/bun.lock`
- `web/pages/_document.tsx` (deleted)
- `web/app/layout.tsx`
- `web/app/marketplace/page.tsx`
- `web/app/marketplace/[id]/page.tsx`
- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`
- `web/src/features/marketplace/components/ProductImage.tsx`
- `web/src/features/marketplace/components/MarketplacePriceSlider.tsx`
- `web/src/features/home/components/HomeCategories.tsx`
- `web/src/features/home/components/HomeFeaturedProduce.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`
- `web/src/features/home/components/HomeHero.tsx`
- `web/src/features/home/components/HomeHowItWorks.tsx`
- `web/src/features/home/components/HomeWhySurplus.tsx`
- `web/src/features/home/components/HomeWhySurplusCard.tsx`
- `web/src/features/home/components/HomeImpactTestimonials.tsx`
- `web/src/features/home/components/HomeFooter.tsx`

---

## Verification Performed

1. **TypeScript Typecheck**:
   - `cd web && bun run typecheck` (`tsc --noEmit`) -> **Passed with 0 errors**.
2. **Production Build**:
   - `cd web && bun run build` (`next build`) -> **Compiled successfully in 14.0s**.
   - Verified homepage route size dropped from `16.6 kB` to `9.33 kB` (**44% reduction**).
   - Verified standalone output generated in `web/.next/standalone`.
   - Verified `sharp` active and package import optimizations enabled.
3. **Backend Health & Build**:
   - `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` -> **Passed with 0 errors**.
