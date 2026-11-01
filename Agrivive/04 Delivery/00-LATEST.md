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

Boost screen now shows the 3-hour wait up front ("Almost Time", button disabled, `eligibility.waitUntil`) instead of failing with "A price drop post just went out" after a tap. Typechecks and build passed; owner test pending. See [[2026-11-01 Boost Wait Time Shown Up Front]].

Earlier: Backend: `GET /conversations/unread-count`, `GET /conversations/:id`, `openCount` on `GET /seller/product-inquiries`, and answers to product-page questions now post into the buyer chat (find-or-create chat, notice and live update). No migration. Typecheck, builds and drizzle check passed; owner tests pending. Mobile still needs to use the new endpoints. See [[2026-11-01 Chat Unread Count and Question Answers in Chat]].

Earlier: Low-stock notice now also fires when a seller uses Take Away and the amount reaches the alert amount (before, only buyer reservations did). Shared helper `utils/seller-notifications/stock-level.ts`. Typecheck and build passed; owner to test. See [[2026-11-01 Low Stock Notice On Take Away]].

Earlier: Notifications screen applied from the Stitch frames (flat rows, summary line, count chips, Filter sheet, Phone Alerts sheet, skeleton and empty states). Typecheck passed; no device check. See [[2026-11-01 Notifications Applied From Stitch]].

Earlier: Low-stock alert field restored on Add Produce and Edit Product; the backend already sends the "running low" notice. Typecheck passed; no device check. See [[2026-11-01 Low Stock Alert Field Restored]].

Earlier: Sales Report screen applied from the Stitch frames (header with date range, sticky filters, Sold and How Much Sold cards, Pickup Results, Stock Right Now, Your Produce, Summary, skeleton and error states). Our own gifted-charts bar chart and bar rows were kept and restyled. Typecheck passed; no device check. See [[2026-11-01 Sales Report Applied From Stitch]].

Earlier: Eight Stitch Listings frames applied to the mobile seller app: Listings, Add Produce, Product Details, Archive sheet, Edit Product, Change Amount sheet, Freshness sheet and the in-sheet Saved state. Look only; current rules kept (peso drop every 6 hours, Final price, no low-stock field). New "Selling" filter and shared `productStatus.ts`. Typecheck passed; no device check. See [[2026-11-01 Listings Flow Applied From Stitch]].

Earlier: 7 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering the complete seller **Sales Report** screen (`app/(app)/analytics.tsx`): F1 (Kilos, 30 Days above fold), F1b (Kilos, 30 Days scrolled lower view covering sections 8–11), F2 ('All' units selected with mixed-units warning banner), F3 (Zero-data state for fresh seller with honest explanation), F4 (Produce picker bottom sheet modal with all/individual produce selection and unit tags), F5 (Loading skeleton shimmer state with interactive filters), and F6 (Inline error recovery state with friendly message and retry CTA). Element-to-codebase mapping table connecting every single UI component to backend/mobile lines, copy changes list (plain words for Davao vegetable farmers and market vendors), and behavioral changes documented in [[2026-11-01 Stitch Seller Sales Report Redesign Frames]].

Earlier: All 23 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering the complete seller **Listings** flow: Listings tab (`inventory.tsx`: L1 all listings, L2 expanded card, L3 running low, L4 category bottom sheet, L5 no listings empty, L6 no search results, L7 skeleton, L8 error recovery), Add Produce flow (`create.tsx`: C1 empty form, C2 catalog picker, C3 filled with price drop ON, C4 inline validation errors, C5 upload progress, C6 Boost intro sheet), Product Details (`[id]/index.tsx`: D1 active/boosted Kamatis, D2 running low Talong, D3 archived Repolyo, D4 archive confirmation sheet), Edit Product (`[id]/edit.tsx`: E1 locked selling unit), and Change Amount flow (`[id]/stock.tsx`: S1 Add More tab, S2 Take Away tab with excess stock error, S3 freshness warning for >12h batches, S4 celebratory in-sheet saved state). Element-to-codebase mapping table, copy changes (plain words), and behavioral changes documented in [[2026-11-01 Stitch Listings Redesign Frames]].

Earlier: Price drop is now a peso amount every 6 hours with a final price (form preview shows the final price and when it gets there); the low-stock alert field is removed and sellers get a "Final Price Reached" notice instead. Owner must apply migrations `20261101150000_fb_post_caption` and `20261101160000_price_reduction_amount` ([[2026-11-01 Peso Price Drop and Final Price Alert]]). Checks passed; no device test.

Earlier: Price drops now follow only the 6-hour Boost rule (12-hour job removed); sellers can see and copy the posted Boost text; official tier names (Priority Boost, Standard Exposure, Basic); 30-day notice says Account Blocked; no condition field. Owner must apply migration `20261101150000_fb_post_caption` and run the manual tests ([[2026-11-01 Six-Hour Price Drop Only and Boost Post Text]]). Backend typecheck, builds, drizzle check and mobile typecheck passed; nothing tested on a device.

Earlier: 11 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`) covering the complete seller **Notifications** screen (opened from the bell on Home) with its Filter sheet and Phone Alerts sheet: All feed with unread and urgent items, scrolled feed with Earlier grouping and pagination, category filters (Reservations, Messages, Account), "All caught up" state with disabled check-all, centered empty state, search zero-results state, 5-row loading skeleton, Filter bottom sheet (Unread only toggle + Newest/Oldest order), and Phone Alerts bottom sheet (Stock and Price, Boost, Account, Night Mode). Mapped every UI element directly to existing codebase lines, with comprehensive copy and behavioral change logs ([[2026-11-01 Mobile Notifications Screen Redesign in Google Stitch]]).

Earlier: 14 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`) covering the complete seller **Marketing (Boost)** flow: Marketing Hub (Running tab with price-drop prompts, empty state, skeleton loading, History tab with filter chips, Did not post retry state, and How Buyers Find You ranking tab with Tomato "Why?" factor breakdown expanded), Boost Intro Sheet over Listings, Preview Boost (allowed state with Facebook preview, allowed state with Instagram preview, and not-allowed state with existing boost timeline and disabled action), and Boost Started live confirmation screen (posting spinners, both posted with external links, and all failed error recovery). Mapped every UI element directly to existing codebase lines, with comprehensive copy and behavioral change logs ([[2026-11-01 Mobile Marketing Flow Redesign in Google Stitch]]).

Earlier: 16 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`) covering the complete seller **Reservations** flow (Reservations tab with filters and pagination, skeleton loading, empty and error states, pending/completed/cancelled reservation details, cancel & report bottom sheets, camera QR scanner with permission and error states, produce handover sheet with dynamic stepper adjustments, and proposed celebratory pickup completion screen). Mapped every UI element directly to existing codebase lines, with comprehensive copy and behavioral change logs ([[2026-11-01 Mobile Reservations Flow Redesign in Google Stitch]]).

Earlier: How Buyers Find You cards, "Why?" bars, Running empty state and failed History cards aligned to the Stitch frames ([[2026-11-01 Boost Visibility Cards Reference]]). Typecheck passed; no device check.

Earlier: boost hub aligned to the Stitch Marketing frames: "Boost" title, shared banner, renamed tabs, Preview Boost sticky bar ([[2026-11-01 Marketing Boost Hub Reference]]). Typecheck passed; no device check.

Earlier: report sheet, scanner screens, handover sheet and a new Pickup done screen applied from the Stitch Reservations frames ([[2026-11-01 Scanner Handover Report Reference]]). Typecheck passed; camera, handover and upload not tested on a device.

Earlier: reservation details, cancel sheet and list error/empty states applied from the Stitch Reservations frames ([[2026-11-01 Reservation Details Reference]]); scanner, handover and report sheets still pending. Typecheck passed; no device check.

Earlier: reservations tab restyled to the supplied reference: scrolling filter chips, reservation cards with units and pickup deadline, tinted status badges, skeleton, new pagination text ([[2026-11-01 Reservations List Reference]]). Typecheck passed; no device check.

Earlier: home gained the loading skeleton, honest "Unavailable" error, and neutral new-seller states from the Stitch frames ([[2026-11-01 Home Loading Error Empty States]]). Typecheck passed; no device check.

Earlier: Sign In and Create Account tuned to the Stitch reference: left-aligned header, reference placeholders and labels, outlined email-code button, footer last, rounded-rectangle Google button ([[2026-11-01 Auth Screens Match Stitch Reference]]). Typecheck passed; no device check.

Earlier: wrapped and integrated the 8 Google Stitch mobile authentication and onboarding screens from project `AGRIVIVE MOBILE UI` (`11184471743007910085`) into the mobile app codebase (`mobile/app/(auth)/`): Onboarding slides 1–3 (`onboarding.tsx`), Sign In default and error states (`login.tsx`), and Create Account default, existing buyer, and validation error states (`register.tsx`), aligning brand logos, navigation chevrons, typography, elongated pill indicators, and plain-language wording ([[2026-11-01 Mobile Onboarding and Auth Screen Redesign]]).

Earlier: 5 high-fidelity mobile dashboard frames generated in Google Stitch under project `AGRIVIVE MOBILE UI` (`11184471743007910085`) covering the seller home dashboard visual redesign: Above-the-fold view, Full scroll view, New seller zero-state, Loading skeleton state, and Proposed honest error recovery state ("—" metrics and Try Again CTA) with shared design tokens, plain-words wording, and UX psychological laws ([[2026-11-01 Stitch Home Dashboard Redesign Frames]]).

Earlier: 8 high-fidelity mobile frames generated in Google Stitch under project `AGRIVIVE MOBILE UI` (`11184471743007910085`) covering the seller authentication and onboarding redesign suite: Onboarding slides 1–3, Sign In (default & error), and Create Account (default, existing buyer link, & validation errors) with shared design system tokens, plain-words wording, and UX psychological laws ([[2026-11-01 Stitch Auth Redesign Frames]]).

Earlier: Seller Marketing hub redesigned to match familiar social creator & advertising patterns (Facebook, Instagram, Twitter) with official social platform badges, active broadcast summary cards, and quick price-drop boost actions ([[2026-11-01 Mobile Marketing Social Hub Redesign]]).

Earlier: Boost now posts to Facebook and Instagram with separate results, and the mobile flow is three screens: intro sheet, Preview Boost, Boost Started. Details and owner steps (apply migration `20261101120000_instagram_post_logs`, check the Meta token can publish to Instagram): [[2026-11-01 Boost Facebook and Instagram Flow]].

Validation: backend typecheck, drizzle check and build; mobile typecheck. Not tested on a device or against Meta.

Listings tab given the new reference layout ([[2026-11-01 Listings Reference Layout]]). Before that: Home screen redesigned to the new reference on shared tokens ([[2026-11-01 Home Screen Redesign]]). Before that: My Listings and Notifications moved onto shared tokens and `ButtonComponent` ([[2026-11-01 Listings and Notifications Use Shared Tokens]]). Before that: mobile type scale made consistent in the core screens, with shared `type` tokens in the theme ([[2026-11-01 Mobile Type Scale Consistency]]).

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

- Latest entry: [[2026-11-01 Boost Wait Time Shown Up Front]]
- Latest web landing entry: [[2026-10-30 Why Choose Scroll Reveal]]
- Earlier entries: the dated notes in this folder, e.g. [[2026-10-30 Splash Screen Refinement]].
