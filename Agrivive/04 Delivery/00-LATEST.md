---
title: Agrivive Latest Snapshot
type: snapshot
last_updated: 2026-11-01 PST
status: active
---

# Agrivive Latest Snapshot

Replace this file after each completed task. Older detail belongs in the dated delivery records in this folder, which are the historical changelog. Verified repository code wins over any note here.

## Last updated

2026-11-01 PST

## Latest completed task

Boost now posts to Facebook and Instagram with separate results, and the mobile flow is three screens: intro sheet, Preview Boost, Boost Started. Details and owner steps (apply migration `20261101120000_instagram_post_logs`, check the Meta token can publish to Instagram): [[2026-11-01 Boost Facebook and Instagram Flow]].

Validation: backend typecheck, drizzle check and build; mobile typecheck. Not tested on a device or against Meta.

Earlier: [[2026-10-31 Remove Seller Type]], [[2026-10-31 Mobile Data Freshness]], [[2026-10-31 Seller Notifications]].

Web landing stream (branch `ui-enhancements`, 2026-10-30): hero redesigned to the uploaded green reference, with "Rescue Surplus Vegetables" on one line from 1024px, a centred sentence and both CTAs, a smaller transparent basket cutout, and four floating labels from 768px. The floating slices and their components are removed. Details: [[2026-10-30 Hero Basket Green Redesign]] and [[2026-10-30 Hero Headline One Line and Floating Labels]]. Earlier: [[2026-10-30 Hero Decluttered with Line Art]]. Validation: `bun run typecheck` in `web/` passed; browser check at 1440 and 375 passed on a dev server at port 3002; `bun run build` and reduced motion not yet run for that work.

## Current project status

- Backend and mobile work (seller notifications, data freshness, seller type removal) is merged to `main` (PR #57). Migrations `20261031120000_seller_notifications`, `20261031130000_remove_seller_type` (applied on dev only) and `20261031140000_boost_follow_up` are **not applied to production**. Production order: notifications before the deploy, remove_seller_type after it (see [[2026-10-31 Remove Seller Type]]). Boost posting runs through `/seller/social-campaigns/*` and `agrivive-social-publishing.json`.
- Branch `ui-enhancements` carries the buyer website (`web/`) landing, splash and Why Choose work. The landing page is refined; browser checks cover the reveal only, and the remaining layout checks are still open.

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

- Mobile freshness: owner to check on a development build that lists update after a push, nothing is fetched while backgrounded, and chat reconnects after an API restart.
- Seller notifications: owner must apply the migration, test `GET /seller/notifications`, the read routes and `/seller/notification-settings`, and walk each trigger on a development build (reserve, cancel, expire, scan, stock low and zero, price drop, Boost result).
- Marketing hub: Boost, History, Active and the Visibility Guide now live in one Marketing hub ([[2026-10-31 Marketing Hub]]).
- Boost UI: screens now show the real Boost state; Priority Promotion was retired ([[2026-10-31 Boost UI Aligned With Backend]]); listing and analytics cards show a Boost chip ([[2026-10-31 Boost Chips and Photo Check]]).
- Boost: the 6-hour rule repeats every 6 hours until the seller's lowest price ([[2026-10-31 Boost Six-Hour Rule Repeats]]). The old preview-and-post feature and its n8n workflow were removed ([[2026-10-31 Remove Old Social Publishing]]); only the `N8N_VISIBILITY_BOOST_*` settings are needed. The Boost Visibility screen now has one Boost button using the same n8n flow ([[2026-10-31 Boost Screen Uses Same Boost]]); `backend/.env` was missing the two `N8N_VISIBILITY_BOOST_*` values. Owner must apply the follow-up migration, import `agrivive-visibility-boost.json` with credentials, set the two env vars, and test the popup, one post per boost, the 6-hour follow-up from the worker, and the 3-hour gap. A stuck `pending` row in `fb_post_logs` needs a manual Page check. 
- No browser check yet for: splash lifecycle (first visit, navigation, reload, reduced motion), hydration, landing responsive layout, and Core Web Vitals. The Why Choose reveal was checked in a browser, but not with reduced motion on.
- Port 3001 was held by another process during the web work, so the dev server ran on 3002.
- The splash length is estimated from timeline math (about 3.04 s to hand-off), not measured.
- Parkinsans has no size-matched fallback metrics, so the wordmark may shift slightly while the font loads.
- The `ui-enhancements` web diff is large, so review it before merging to `main`.

## Next development task

Check the buyer site in a browser (`bun run dev` in `web/`). Turn on reduced motion in the OS and confirm the Why Choose section shows at once. Then check the splash on first visit, and the landing page at phone, tablet and desktop widths. Then decide whether to commit.

## Historical changelog

- Latest entry: [[2026-11-01 Boost Facebook and Instagram Flow]]
- Latest web landing entry: [[2026-10-30 Why Choose Scroll Reveal]]
- Earlier entries: the dated notes in this folder, e.g. [[2026-10-30 Splash Screen Refinement]].
