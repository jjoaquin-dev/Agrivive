---
title: Web Landing GSAP Animation Integration
date: 2026-10-29
type: delivery-record
status: complete
tags:
  - web
  - gsap
  - animations
  - splash-screen
  - lenis
  - scrolltrigger
---

# Web Landing GSAP Animation Integration

## Overview

Applied the mobile-first landing experience and brand-symmetric vector splash screen from the prototype in `scratch/splash-demo.html` directly into the Next.js production web application (`web/`), adhering to a strict layered GSAP architecture while **100% preserving all existing web text, copy, statistics, testimonials, categories, and live API data**.

---

## What Changed

### 1. Layered GSAP Architecture

1. **`src/types/animation.ts`**:
   - Standardized TypeScript interfaces for animation directions, presets, `ScrollTrigger` thresholds, and splash timeline options.
2. **`src/lib/gsap/`**:
   - `index.ts`: SSR-safe singleton initialization registering `ScrollTrigger` only in browser context (`typeof window !== 'undefined'`).
   - `easings.ts`: Standardized easings (`SMOOTH`, `DECEL`, `SPRING`, `POP`, `ELASTIC`, `LINEAR`).
   - `presets.ts`: Reusable tween definitions (`fadeIn`, `fadeUp`, `popIn`, `drawStroke`).
   - `timelines.ts`: Full factory for `createSplashTimeline` orchestrating the 5-phase physics sequence, SVG produce drop, letter bounce, and the `<|` 18x10 tile sweep wave.
3. **`src/hooks/`**:
   - `useFadeIn.ts`: Scoped GSAP fade hook with automatic `gsap.context()` cleanup.
   - `useStagger.ts`: Scoped child cascade animation hook.
   - `useScrollReveal.ts`: Viewport-triggered `ScrollTrigger` entrance hook.
   - `useLenis.ts`: Lenis 1.3 smooth momentum scrolling hook bound to `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `lagSmoothing(0)` and anchor offset of `-90px`.
4. **`src/components/animations/`**:
   - `FadeIn.tsx`: Reusable client-side fade wrapper.
   - `Stagger.tsx`: Sequential cascade wrapper for lists and card grids.
   - `Reveal.tsx`: Viewport reveal wrapper.
   - `Parallax.tsx`: Multi-depth scrubbed parallax wrapper.
   - `LenisProvider.tsx`: Client root provider initializing smooth scrolling.
5. **`src/components/ui/`**:
   - `Button.tsx`: Accessible, tactile button with minimum 48px touch targets (`min-h-12`), supporting `#457D00` primary and `#E2FD56` electric volt lime accent.
   - `Card.tsx`: Standardized surface cards with crisp borders and hover lift.
6. **`src/components/sections/`**:
   - `SplashScreen.tsx`: Client component rendering the vector SVG cart with produce cutouts, letter bounce, and the 180-tile sweep `<|` wave.
   - `Hero.tsx`: Choreographed hero with drawn topographic contour lines (`strokeDashoffset`), 11 organic vegetable slices in balanced perimeter framing with multi-depth parallax, while strictly preserving all real hero copy, buttons, and harvest crates image.
   - `Features.tsx`: Choreographed wrapper applying ScrollTrigger cascades to the real-data sections (`HomeCategories`, `HomeFeaturedProduce`, `HomeHowItWorks`, `HomeWhySurplus`, `HomeImpactTestimonials`, `HomeFarmerFaq`, `HomeFinalCta`).
7. **`app/`**:
   - `globals.css`: Added Lenis core rules, topographic SVG stroke styling, paper grain micro-texture, and tile grid layout.
   - `layout.tsx`: Imported `globals.css` and wrapped children with `LenisProvider`.
   - `page.tsx`: Composed `SplashScreen`, `LandingHeader`, `Hero`, `Features`, and `HomeFooter`.
   - `LandingHeader.tsx`: Added dynamic scroll elevation state (`.header-scrolled`).

---

## Strict Data & Content Integrity

Every piece of existing text in `web/src/features/home/components/` was maintained verbatim:
- **Headline**: "Rescue Surplus Vegetables in Davao City"
- **Subtitle**: "Reserve marketable surplus directly from verified local stalls. Secure your order with a 24-hour QR code and save money while helping vendors reduce food waste."
- **CTAs**: "Shop Today's Harvest" -> `/marketplace`, "Are you a Seller? Get the App here" -> `#sellers`.
- **Categories**: Leafy Greens, Fruit Vegetables, Root Vegetables, Pod Vegetables, Tuber Vegetables, Bulb Vegetables.
- **Live Inventory**: Dynamic query via `listMarketplaceProducts`.
- **How It Works**: 01 SOURCE, 02 DISCOVER, 03 COLLECT.
- **Why Surplus**: 95.1% Live Photos, 97.6% Seller Verification, >20% postharvest loss reduction.
- **Testimonials**: Elena Marasigan, Mang Danilo Tan, Ate Grace Tolentino, Kuya Robert Singson, Chef Marcus Villanueva, Nanay Susan Bautista.
- **FAQ**: 5 authentic questions and answers + social modal contact button.

---

## Affected Files

- `web/package.json`
- `web/bun.lock`
- `web/app/layout.tsx`
- `web/app/page.tsx`
- `web/app/globals.css`
- `web/src/types/animation.ts`
- `web/src/lib/gsap/index.ts`
- `web/src/lib/gsap/easings.ts`
- `web/src/lib/gsap/presets.ts`
- `web/src/lib/gsap/timelines.ts`
- `web/src/hooks/useFadeIn.ts`
- `web/src/hooks/useStagger.ts`
- `web/src/hooks/useScrollReveal.ts`
- `web/src/hooks/useLenis.ts`
- `web/src/components/animations/FadeIn.tsx`
- `web/src/components/animations/Stagger.tsx`
- `web/src/components/animations/Reveal.tsx`
- `web/src/components/animations/Parallax.tsx`
- `web/src/components/animations/LenisProvider.tsx`
- `web/src/components/ui/Button.tsx`
- `web/src/components/ui/Card.tsx`
- `web/src/components/sections/SplashScreen.tsx`
- `web/src/components/sections/Hero.tsx`
- `web/src/components/sections/Features.tsx`
- `web/src/features/home/components/LandingHeader.tsx`

---

## Verification Performed

1. **Typecheck**:
   - `cd web && bun run typecheck`: **0 errors**.
   - `cd backend && bunx tsc --noEmit`: **0 errors**.
2. **Backend Build**:
   - `bun build src/index.ts --outdir dist --target bun`: Bundled 1,832 modules in 107ms.
3. **Automated Headless Chrome CDP Test (`verify_web_gsap.js`)**:
   - **Splash Screen Active**: `hasSplash: true`, `hasTileGrid: true`, `splashDisplay: "block"`. Captured `web_splash_active.png`.
   - **Post-Splash Transition**: Splash dismissed gracefully, 10 topographic lines drawn in, 11 floating veggie slices positioned. Captured `web_hero_entered.png`.
   - **Data Integrity Audit**: Verified `hasHeadline: true`, `hasSubtitle: true`, `hasShopHarvestBtn: true`, `hasSellerBtn: true`, `hasCategories: true`, `hasHowItWorks: true`, `hasWhySurplusStats: true`, `hasTestimonials: true`, `hasFaq: true`, `hasFooter: true`.
   - **Lenis Smooth Anchor Scroll**: Intercepted `#how-it-works`, scrolled to `scrollY: 2333` with exact `targetTop: 90px` clearance under fixed header, and dynamic `.header-scrolled` elevation applied. Captured `web_scrolled_section.png`.
   - **Mobile Viewport (375x812)**: `scrollWidth: 375`, `hasHorizontalOverflow: false` (zero horizontal overflow), nav pill height 58px. Captured `web_mobile_hero.png`.

---

## Commit Record

- **Initial Commit**: `abfc30a`
  - **Message**: `add gsap landing animations and splash screen`
- **Follow-up Commit**: `cad3239`
  - **Message**: `update header layout fonts and splash screen physics`
  - **Key Adjustments**:
    1. Removed Testimonials section completely from landing page per user instruction (`Features.tsx`).
    2. Replicated the exact floating pill header layout and mega-menu from `scratch/splash-demo.html` into `LandingHeader.tsx` and `HeaderMegaMenu.tsx` (tilted vector cart logo lockup, "Browse Produce" mega-menu with category cards and live Bankerohan market stall card, "Live Surplus" pulsing dot, and `#E2FD56` electric volt lime Register button).
    3. Updated typography across the application to Google Fonts **Parkinsans** (brand) and **Plus Jakarta Sans** (headings, subheadings, and body).
    4. Upgraded splash screen physics in `timelines.ts` and `splash-grid.ts` to replicate `scratch/splash-demo.html` pixel-for-pixel: isolated dead-center cart start, 3 projectile produce drops with squash & shake keyframes, rolling cart wheels, -11° tilt, exact coordinate color inversion, and left-chevron exit peel.
    5. Maintained all source code files strictly under 200 lines.
- **Fix Commit**: `a058dc3`
  - **Message**: `fix splash fadeout transparency, fixed header, hero entrance animations`
  - **Key Adjustments**:
    1. **Fixed splash white flash**: `LandingHeader` changed from `sticky` to `fixed` positioning so `#hero` sits at viewport `top: 0` behind `#splash-container`. In `timelines.ts`, the splash container background switches to `transparent` at `waveSweep += fullCoverTime` — peeling the green tiles now reveals the green hero section instead of white.
    2. **Hero "IN" entrance animations**: Created `hero-entrance.ts` with `setupHeroInitialStates()` (pre-hides hero elements) and `animateHeroEntrance(tl, "tileOut")` (topo lines draw in with `strokeDashoffset → 0`, floating produce slices pop with `back.out(1.35)`, headline/description glide up with `power3.out`, CTA buttons spring up with `back.out(1.4)`, harvest crates float up — all overlapping the tile peel).
    3. **Restored real header contents**: Search input with `HeaderCategoryDropdown`, real section links (Home, Marketplace, Categories, Live Surplus, etc.), Marketplace link with ShoppingBag icon, session-aware Sign In/Register vs My Passes. Extracted `LandingHeaderMobileDrawer` to keep under 200 lines.
    4. **Extracted components for 200-line limit**: `HeroFloatingSlices.tsx` (70 lines), `LandingHeaderMobileDrawer.tsx` (95 lines), `wave-inversion.ts` (28 lines).
    5. **Removed `HeaderMegaMenu.tsx`** (mock dummy categories).
    6. **Hero padding**: Adjusted `pt-[140px] sm:pt-[180px]` to account for fixed header height.
  - **Files Changed**:
    - `web/src/features/home/components/LandingHeader.tsx` (198 lines)
    - `web/src/features/home/components/LandingHeaderMobileDrawer.tsx` (95 lines, new)
    - `web/src/features/home/components/HeaderMegaMenu.tsx` (deleted)
    - `web/src/components/sections/Hero.tsx` (148 lines)
    - `web/src/components/sections/HeroFloatingSlices.tsx` (70 lines, new)
    - `web/src/components/sections/Features.tsx` (165 lines)
    - `web/src/lib/gsap/timelines.ts` (178 lines)
    - `web/src/lib/gsap/hero-entrance.ts` (21 lines, new)
    - `web/src/lib/gsap/wave-inversion.ts` (28 lines, new)
  - **Verification**: `tsc --noEmit` 0 errors. Headless Chrome CDP screenshots confirm: splash plays on white → green tiles cover → container goes transparent → tiles peel revealing green hero with animated entrance → header `position: fixed`. No white flash.
