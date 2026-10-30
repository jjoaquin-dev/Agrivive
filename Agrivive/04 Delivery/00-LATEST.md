---
title: Agrivive Latest Snapshot
type: snapshot
last_updated: 2026-10-31 PST
status: active
---

# Agrivive Latest Snapshot

Replace this file after each completed task. Older detail belongs in the dated delivery records in this folder, which are the historical changelog. Verified repository code wins over any note here.

## Last updated

2026-10-31 PST

## Latest completed task

Added the Boost / Not now popup after a seller lists a product (mobile) and rebuilt the n8n workflow around the existing confirmed Boost. Details: [[2026-10-31 Boost Popup and Confirmed Boost Workflow]]. This supersedes [[2026-10-31 n8n Seller Flow Hardening]].

Validation: backend `bunx tsc --noEmit` and both builds, mobile `bun run typecheck`. Not tested on a device or against n8n/Meta.

## Current project status

- Branch `development`; last commit `a058dc3`. Web landing and splash work is **uncommitted**.
- Buyer website (`web/`) landing page is refined but not yet visually verified in a browser.
- Backend and mobile Boost changes and the rebuilt `dist/` are **uncommitted**. Boost posting uses `N8N_VISIBILITY_BOOST_*`; `/integrations/visibility-boosts/:id/context|facebook-post` need its Bearer token.

## Active architectural decisions

- **Splash lifecycle** (`web/src/components/sections/SplashScreen.tsx`, `web/src/lib/motion.ts`): the splash plays once per tab session using the `agrivive-splash-seen` sessionStorage key. The key is set when the timeline starts. Reduced motion skips it.
- **Pre-paint classes** (`web/app/layout.tsx`): an inline head script sets `splash-skip` or `splash-pending` on `<html>` before first paint, so the logo never flashes in its final position.
- **GSAP scoping**: `gsap.context` with `ctx.revert()` on cleanup. No `@gsap/react` dependency was added.
- **Landing reveals** (`web/src/hooks/useRevealOnScroll.ts`): one IntersectionObserver over `[data-reveal]` elements, replacing per-section ScrollTriggers. Each element reveals once. Reduced motion registers nothing.
- **Fonts**: all four faces are vendored in `web/src/fonts/` and loaded with `next/font/local` (no build-time network). Poppins, Lato and MD Nichrome are fallbacks only.
- **Header and anchors**: the two-row header is kept. Anchor offset is 112px in both `scroll-margin-top` and the Lenis hook.

## Recently modified files

- `web/src/lib/gsap/timelines.ts`: splash timing and easing (real seconds, `speed` 1).
- `web/src/components/sections/SplashScreen.tsx`: asset gate, session marking, `gsap.context` cleanup.
- `web/src/lib/gsap/hero-entrance.ts`: hero entrance order and easing.
- `web/src/lib/motion.ts`: `waitForSplashAssets`.
- `web/src/hooks/useRevealOnScroll.ts` (new), `web/src/components/sections/Features.tsx`.
- `web/src/components/sections/Hero.tsx`, `HeroFloatingSlices.tsx`.
- `web/src/features/home/components/`: categories, featured produce, how it works, why surplus and its card, FAQ, final CTA, footer, header.
- `web/app/layout.tsx`, `web/app/globals.css`, `web/tailwind.config.ts`: fonts, pre-paint script, type scale.
- `web/src/hooks/useLenis.ts`: anchor offset.

Many other `web/` files show as modified in git from earlier sessions. Those were not reviewed in the latest work.

## Completed implementations (recent)

- Splash: asset gate, session marking, lifecycle cleanup, pacing (see [[2026-10-30 Splash Pacing Three-Second Sequence]]; the earlier [[2026-10-30 Splash Timing and Wave Refinement]] is superseded).
- Landing: fonts self-hosted, type scale, reveal system, categories grid, hero composition, FAQ accessibility, header focus states.
- Also in the vault today, by another record: [[2026-10-30 Web Landing Audit Fixes]] (status: code complete, manual testing pending).

## Unresolved issues

- Boost: owner must test the popup, `POST /seller/products/:id/boost`, the two integration routes (401 without token, one post per boost), and import `agrivive-visibility-boost.json` with credentials.

- No browser check yet: splash lifecycle (first visit, navigation, reload, reduced motion), hydration, landing responsive layout, reveal behavior, and Core Web Vitals.
- The splash length is estimated from timeline math (about 3.04 s to hand-off), not measured.
- Parkinsans has no size-matched fallback metrics, so the wordmark may shift slightly while the font loads.
- Nothing is committed. The diff is large, so review it before committing.

## Next development task

Open the buyer site in a browser (`bun run dev` in `web/`, port 3001). Check the splash on first visit, internal navigation, reload, and reduced motion. Then check the landing page at phone, tablet and desktop widths. Then decide whether to commit.

## Historical changelog

- Latest entry: [[2026-10-31 Boost Popup and Confirmed Boost Workflow]]
- Earlier entries: the dated notes in this folder, e.g. [[2026-10-30 Splash Screen Refinement]].
