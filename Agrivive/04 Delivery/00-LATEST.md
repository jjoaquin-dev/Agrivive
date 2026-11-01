---
title: Agrivive Latest Snapshot
type: snapshot
last_updated: 2026-10-30
status: active
---

# Agrivive Latest Snapshot

Replace this file after each completed task. Older detail belongs in the dated delivery records in this folder, which are the historical changelog. Verified repository code wins over any note here.

## Last updated

2026-11-01

## Latest completed task

Priority deals row added under the marketplace hero (`GET /marketplace/products/deals`: AHP "Priority Boost" tier and at least 30% below base price). The marketplace was reordered so the products come before the seller map, and dead footer sort links and three unused components were removed. Details: [[2026-11-01 Priority Deals Row and Marketplace Reorder]]. Validation: backend typecheck and bundle passed, web typecheck and build passed. Not checked: the deals data path (backend not running) and the desktop and phone layout of the row.

Previous task: Sign-in and sign-up side panel now plays the uploaded video (`web/public/brand/sign-in-video.mp4`) instead of the photo carousel, and it is shorter (80vh). Details: [[2026-10-31 Auth Video Panel]]. Follow-up: the video column was shifted right with more left padding ([[2026-10-31 Auth Video Shifted Right]]). Validation: `bun run typecheck` in `web/` passed. Not checked in a browser.

Cart icon replaced everywhere in the buyer site with the supplied glyph (`CartIcon`). The empty cart shows a basket illustration, and marketplace category images are larger ([[2026-10-31 Cart Icon Category Image and Cart Illustration]]). Typecheck passed; not checked in a browser.

Parkinsans now used for headers (`font-heading`), footers and the marketplace hero. Alerts, toasts and the restriction notice restyled. Cart has icon and item motion ([[2026-10-31 Parkinsans Headers Alerts and Cart Motion]]). Typecheck passed; not checked in a browser.

Profile settings: search bar removed and the Profile, Security and Notifications cards share one style ([[2026-10-31 Profile Settings Consistent Cards]]). Typecheck passed; not checked in a browser.

Previous task: landing hero image swapped for a muted, looping video (`web/public/brand/hero-veggies.mp4`) in `web/src/components/sections/Hero.tsx`. The old image is the poster. Details: [[2026-10-31 Hero Image Swapped for Video]].

Validation: `bun run typecheck` in `web/` passed. At 1024px the video plays and sits inside the hero column. Not checked: reduced motion in the browser, and phone widths.

The intro animation ([[2026-10-31 Surplus Veggies Intro Animation]]) was rejected by the user and is not used.

Previous task: [[2026-10-30 Hero Basket Green Redesign]] and [[2026-10-30 Hero Headline One Line and Floating Labels]].

## Current project status

- Branch `ui-enhancements`. Landing, splash and Why Choose work is **uncommitted**.
- Buyer website (`web/`) landing page is refined. Browser checks cover the reveal only; the remaining layout checks are still open.
- Mobile app and backend are not part of the recent work.

## Active architectural decisions

- **Splash lifecycle** (`web/src/components/sections/SplashScreen.tsx`, `web/src/lib/motion.ts`): the splash plays once per tab session using the `agrivive-splash-seen` sessionStorage key. The key is set when the timeline starts. Reduced motion skips it.
- **Pre-paint classes** (`web/app/layout.tsx`): an inline head script sets `splash-skip` or `splash-pending` on `<html>` before first paint, so the logo never flashes in its final position.
- **GSAP scoping**: `gsap.context` with `ctx.revert()` on cleanup. No `@gsap/react` dependency was added.
- **Landing reveals** (`web/src/hooks/useRevealOnScroll.ts`): one IntersectionObserver over `[data-reveal]` elements, wired once in `web/src/components/sections/Features.tsx`. Each element reveals once. `data-reveal="pop"` is the house card motion for other sections; the Why Choose section uses plain `data-reveal`. Reduced motion registers nothing.
- **Fonts**: all four faces are vendored in `web/src/fonts/` and loaded with `next/font/local` (no build-time network). Poppins, Lato and MD Nichrome are fallbacks only.
- **Header and anchors**: the two-row header is kept. Anchor offset is 112px in both `scroll-margin-top` and the Lenis hook.

## Recently modified files

- `web/src/features/home/components/HomeWhySurplus.tsx`, `HomeWhySurplusCard.tsx`: card reveal and hover zoom.
- `web/src/lib/gsap/timelines.ts`, `SplashScreen.tsx`, `hero-entrance.ts`, `web/src/lib/motion.ts`: splash and hero.
- `web/src/hooks/useRevealOnScroll.ts` (new), `web/src/components/sections/Features.tsx`.
- `web/src/features/home/components/`: categories, featured produce, how it works, FAQ, final CTA, footer, header.
- `web/app/layout.tsx`, `web/app/globals.css`, `web/tailwind.config.ts`: fonts, pre-paint script, type scale.

Many other `web/` files show as modified in git from earlier sessions. Those were not reviewed in the latest work.

## Completed implementations (recent)

- Why Choose: card reveal matches the other blocks; hover photo zoom removed ([[2026-10-30 Why Choose Scroll Reveal]]).
- Landing navbar glass, logo size, hero pill removal, Process timeline ([[2026-10-30 Landing Navbar and Sections Redesign]]).
- Splash: asset gate, session marking, lifecycle cleanup, pacing ([[2026-10-30 Splash Pacing Three-Second Sequence]]; the earlier [[2026-10-30 Splash Timing and Wave Refinement]] is superseded).
- Landing: fonts self-hosted, type scale, reveal system, categories grid, hero composition, FAQ accessibility, header focus states.
- Also in the vault today: [[2026-10-30 Web Landing Audit Fixes]] (status: code complete, manual testing pending).

## Unresolved issues

- No browser check yet for: splash lifecycle (first visit, navigation, reload, reduced motion), hydration, landing responsive layout, and Core Web Vitals. The Why Choose reveal was checked in a browser, but not with reduced motion on.
- Port 3001 was held by another process during this task, so the dev server ran on 3002.
- The splash length is estimated from timeline math (about 3.04 s to hand-off), not measured.
- Parkinsans has no size-matched fallback metrics, so the wordmark may shift slightly while the font loads.
- Nothing is committed. The diff is large, so review it before committing.

## Next development task

Check the buyer site in a browser (`bun run dev` in `web/`). Turn on reduced motion in the OS and confirm the Why Choose section shows at once. Then check the splash on first visit, and the landing page at phone, tablet and desktop widths. Then decide whether to commit.

## Historical changelog

- Latest entry: [[2026-10-30 Why Choose Scroll Reveal]]
- Earlier entries: the dated notes in this folder, e.g. [[2026-10-30 Splash Screen Refinement]].
