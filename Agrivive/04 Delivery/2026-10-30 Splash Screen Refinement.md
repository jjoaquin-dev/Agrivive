---
title: Splash Screen Refinement
date: 2026-10-30
type: delivery-record
status: uncommitted
tags:
  - web
  - gsap
  - splash-screen
  - hydration
---

# Splash Screen Refinement

## Overview

Refined the existing web splash screen without redesigning it. The logo, colors, typography, layout, and veggie-to-cart concept are unchanged. The changes address first-paint flicker, asset readiness, session lifecycle, and GSAP cleanup.

## What Changed

1. **Pre-paint start state** (`web/app/layout.tsx`, `web/app/globals.css`): the head script now adds `splash-pending` when the splash will play, or `splash-skip` when it will not. `.splash-pending #brand-stage` is hidden until the timeline sets its start frame, so the server-rendered logo never flashes in its final position.
2. **Asset gate** (`web/src/lib/motion.ts`, `web/src/components/sections/SplashScreen.tsx`): `waitForSplashAssets` waits for `document.fonts.ready` and the hero image `decode()`, capped at 1500 ms. The wordmark is measured and animated with its real font, and the hero is ready when the overlay lifts.
3. **Session marking** (`SplashScreen.tsx`): `markSplashSeen()` now runs when the timeline starts, not when it finishes. A reload or navigation during the splash no longer replays it.
4. **GSAP scoping and cleanup** (`SplashScreen.tsx`): the timeline is created inside `gsap.context(..., container)`. Cleanup calls `ctx.revert()`, which kills the timeline and reverts the hero's inline `gsap.set` states. A `cancelled` flag stops a late asset gate from starting a timeline after unmount.

## Decisions

- `@gsap/react` is not installed and was not added. `gsap.context` provides the same scoping and cleanup without a new dependency.
- Timeline timings are unchanged from the prior uncommitted tuning (`speed` 1.4, wave starts at `assemble+0.7`). Estimated overlay exit is about 2.5 s wall clock. This is an estimate from the timeline math, not a measured value.

## Affected Files

- `web/app/layout.tsx`
- `web/app/globals.css`
- `web/src/lib/motion.ts`
- `web/src/components/sections/SplashScreen.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- `bun run build` in `web/`: passed. The prerendered `/` HTML contains the `splash-pending` head script and one `#splash-container`.
- Not run: browser lifecycle checks (first visit, internal navigation, reload, reduced motion), hydration error check, and GSAP cleanup check. No browser runner is installed in this environment.

## Landing Page Refinement (same day)

Refined the existing landing page; content, links, data, and the live produce cards' behavior are unchanged.

- **Fonts** (`app/layout.tsx`, `tailwind.config.ts`, `app/globals.css`): Plus Jakarta Sans and Parkinsans were loaded by a render-blocking CSS `@import` from Google. They are now self-hosted through `next/font` with size-matched fallbacks (Parkinsans has no override metrics, so its fallback adjustment is off). The older Poppins, Lato, and MD Nichrome stay as fallbacks only and are no longer preloaded.
- **Type scale** (`app/globals.css`): fluid `type-display`, `type-section`, `type-card`, `type-lede`, `type-eyebrow` classes, applied across all sections.
- **Motion** (`src/hooks/useRevealOnScroll.ts`, `Features.tsx`): six ScrollTriggers replaced by one IntersectionObserver reveal over `[data-reveal]` elements. Each element reveals once; the live-produce wrapper reveals once, and loading, error, or refreshed products render inside it without replaying. Reduced motion registers nothing.
- **Removed**: infinite float/breathe/glow loops, hero scrub parallax on phones and tablets (now desktop-only, 2 tweens), and the hover scale on the hero image.
- **Hero** (`Hero.tsx`, `HeroFloatingSlices.tsx`, `hero-entrance.ts`): eyebrow reuses the footer's existing "Davao City Farms & Public Market Stalls" line; headline break; calmer entrance (eyebrow, title, text, buttons, crate, slices) with a single easing and no bounce. Two mid-height slices hidden on phones.
- **Sections**: categories are a 2/3/6-column grid instead of a sideways scroller; How It Works uses a 4:3 image ratio; benefit cards, FAQ (grid-rows height transition, aria-controls, region, inert when closed), CTA, footer spacing, and header (focus rings, pill hover, no layout jump) refined.
- **Anchors**: `scroll-margin-top` and the Lenis offset are both 112px to clear the two-row header.

Verification: `bun run typecheck` passes. `bun run build` passed on re-run; one run failed with no error shown (likely the network font fetch, since `next/font/google` downloads at build time). No browser was available, so rendering, responsive layouts, hydration, reveal behavior, and Core Web Vitals were not checked.
