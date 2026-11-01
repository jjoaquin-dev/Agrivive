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

Boost now opens only for Priority Boost listings (paper rule, owner choice), Add More keeps the cycle's original stock in sync with a repair migration (applied to dev, not yet on the VPS), and the seller Boost list shows official tier names. 33 tests pass. Rebuild the API; run migration `20261101190000_sync_cycle_original_qty` on the VPS when ready. See [[2026-11-01 Boost Rule and Stock Sync]].

Earlier: Boost screen "Amount left" now uses the same original stock as the Listings screen and buyer feed (it showed 98% for a listing with 6 of 50 kg left). Rebuild and recreate the API on the VPS. See [[2026-11-01 Boost Amount Left Matches Feed]].

Earlier: The `deploy/` folder is removed: `Caddyfile` is at the repo root, `scripts/vps-release.sh` kept for the CD workflows, and all env keys are in the root `.env.example`. See [[2026-11-01 Deploy Folder Removed]].

Earlier: AHP-TOPSIS is now the default marketplace policy (unset or unknown `VISIBILITY_POLICY` uses it; only `visibility-v4` rolls back). The VPS `.env` and container still need updating. See [[2026-11-01 AHP-TOPSIS Default Policy]].

Earlier: Fixed the baseline marketplace paging bug (page 2 repeated page 1 when scores tied; the score is now rounded to 9 decimals in the query). Moved the policy choice into `utils/visibility-ranking/policy.ts`. Added tests: 29 pass (AHP-TOPSIS engine, WSV-008 paging, WSV-010 policy switch) and a `bun test` step in backend CI. Verified read-only on the dev database for both policies; the running API needs a restart. See [[2026-11-01 Baseline Paging Fix and Policy Tests]] and [[2026-11-01 AHP-TOPSIS Test Cases]].

Earlier: All 13 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering the complete seller **Profile** flow: F1 (Profile tab verified & good standing), F2 (New seller setup checklist), F3 (Warning/limited standing), F4 (Avatar action sheet & uploading spinner), F5 (Edit Profile filled with phone error & sticky Save bar), F6 (Edit Profile leave-without-saving dialog), F7 (Setup step 2 pin not moved error & auto-scroll), F8 (Sign-in Safety password + Sign-in Code off), F9 (Sign-in Code step 2 QR & key), F9b (Sign-in Code step 3 6-digit boxes & invalid code error), F10 (Sign-in Code step 4 backup codes & copied badge), F11 (Sign-in Code on with in-card turn-off confirm), and F12 (Log Out confirmation dialog). Element-to-codebase mapping table, copy changes (plain words), and behavioral changes documented in [[2026-11-01 Stitch Seller Profile Redesign Frames]].

Earlier: 12 high-fidelity mobile UI mockups generated in Google Stitch covering the complete seller **Messages** flow: F1 (All filter), F2 (Unread + search 'Kamatis'), F3 (New seller empty state), F3b (Loading skeleton 6 rows), F4 (Sort sheet modal), F5 (Questions waiting + expanded answer composer), F6 (Questions all + answered card & inline send error), F7 (Order context chat with Jose Reyes & reservation pass card), F8 (Product context chat with Maria Santos & photo upload preview), F9 (Reconnecting banner & send error retry), F10 (Closed chat state with Carlo Mendoza & replaced bar), and F11 (Full-screen photo viewer lightbox). See [[2026-11-01 Stitch Seller Messages Redesign Frames]].

Earlier: Boost screen is shorter when boosting is blocked: no preview or price-drop card, a small product row, the wait note, and a button that says how long to wait. Typecheck passed; no device check. See [[2026-11-01 Boost Screen Shorter When Blocked]].

Earlier: Seller Messages and Chat flow cleaned up and aligned to backend endpoints: badge and counts use `GET /conversations/unread-count`, direct chat header uses `GET /conversations/:id`, inbox split into modular components (<200 lines each), sort-only sheet, 6 skeleton rows, waiting urgency pills, Questions tab with segmented control and answer composer that posts into buyer chat, context banner with no cryptic codes, real date dividers, consecutive message clustering, non-sending quick replies, and status banners. All typechecks, android export, and line audits passed. See [[2026-11-01 Messages Flow Cleanup]].

Earlier: Boost screen now shows the 3-hour wait up front ("Almost Time", button disabled, `eligibility.waitUntil`) instead of failing with "A price drop post just went out" after a tap. Typechecks and build passed; owner test pending. See [[2026-11-01 Boost Wait Time Shown Up Front]].

Earlier: Backend: `GET /conversations/unread-count`, `GET /conversations/:id`, `openCount` on `GET /seller/product-inquiries`, and answers to product-page questions now post into the buyer chat. Typecheck, builds and drizzle check passed. See [[2026-11-01 Chat Unread Count and Question Answers in Chat]].

Earlier: Low-stock notice now also fires when a seller uses Take Away and the amount reaches the alert amount (before, only buyer reservations did). Shared helper `utils/seller-notifications/stock-level.ts`. Typecheck and build passed; owner to test. See [[2026-11-01 Low Stock Notice On Take Away]].

Earlier: Notifications screen applied from the Stitch frames (flat rows, summary line, count chips, Filter sheet, Phone Alerts sheet, skeleton and empty states). Typecheck passed; no device check. See [[2026-11-01 Notifications Applied From Stitch]].

Earlier: Low-stock alert field restored on Add Produce and Edit Product; the backend already sends the "running low" notice. Typecheck passed; no device check. See [[2026-11-01 Low Stock Alert Field Restored]].

Earlier: Sales Report screen applied from the Stitch frames (header with date range, sticky filters, Sold and How Much Sold cards, Pickup Results, Stock Right Now, Your Produce, Summary, skeleton and error states). Our own gifted-charts bar chart and bar rows were kept and restyled. Typecheck passed; no device check. See [[2026-11-01 Sales Report Applied From Stitch]].

Earlier: Eight Stitch Listings frames applied to the mobile seller app: Listings, Add Produce, Product Details, Archive sheet, Edit Product, Change Amount sheet, Freshness sheet and the in-sheet Saved state. Look only; current rules kept. See [[2026-11-01 Listings Flow Applied From Stitch]].

Earlier: 7 high-fidelity mobile UI mockups generated in Google Stitch covering the seller **Sales Report** screen (`app/(app)/analytics.tsx`): F1, F1b, F2, F3, F4, F5, F6. Mapping table and copy changes in [[2026-11-01 Stitch Seller Sales Report Redesign Frames]].

Earlier: All 23 high-fidelity mobile UI mockups generated in Google Stitch covering the seller **Listings** flow: Listings tab, Add Produce, Product Details, Edit Product, and Change Amount. Mapping table in [[2026-11-01 Stitch Listings Redesign Frames]].

Earlier: 11 high-fidelity mobile UI mockups generated in Google Stitch covering the seller **Notifications** screen: All feed, Earlier grouping, category filters, All caught up, empty state, skeleton, Filter sheet, and Phone Alerts sheet. See [[2026-11-01 Mobile Notifications Screen Redesign in Google Stitch]].

Earlier: 14 high-fidelity mobile UI mockups generated in Google Stitch covering the seller **Marketing (Boost)** flow: Marketing Hub, Boost Intro Sheet, Preview Boost, and Boost Started live screen. See [[2026-11-01 Mobile Marketing Flow Redesign in Google Stitch]].

Earlier: 16 high-fidelity mobile UI mockups generated in Google Stitch covering the seller **Reservations** flow. See [[2026-11-01 Mobile Reservations Flow Redesign in Google Stitch]].

Earlier: 8 high-fidelity mobile UI mockups generated in Google Stitch covering the seller **Authentication and Onboarding** redesign suite. See [[2026-11-01 Stitch Auth Redesign Frames]].

Earlier: 5 high-fidelity mobile dashboard frames generated in Google Stitch covering the seller **Home** dashboard. See [[2026-11-01 Stitch Home Dashboard Redesign Frames]].

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

- `Agrivive/04 Delivery/2026-11-01 Stitch Seller Messages Redesign Frames.md`: created full specification note.
- `Agrivive/04 Delivery/00-LATEST.md`: updated snapshot with Messages Stitch frames delivery.

## Unresolved issues

- VPS: set `VISIBILITY_POLICY=visibility-ahptopsis-v1` in its `.env` and recreate the API container.
- Mobile freshness: owner to check on a development build that lists update after a push, nothing is fetched while backgrounded, and chat reconnects after an API restart.
- Seller notifications: owner must apply the migration, test `GET /seller/notifications`, the read routes and `/seller/notification-settings`, and walk each trigger on a development build.
- Marketing hub: Boost, History, Active and the Visibility Guide now live in one Marketing hub ([[2026-10-31 Marketing Hub]]).
- No browser check yet for: splash lifecycle (first visit, navigation, reload, reduced motion), hydration, landing responsive layout, and Core Web Vitals.
- The `ui-enhancements` web diff is large, so review it before merging to `main`.

## Next development task

Owner manual testing of the seller mobile app with real device builds, verifying the Messages inbox, Questions tab with public answer cross-posting to buyer chat, and individual chat threads.

## Historical changelog

- Latest entry: [[2026-11-01 Boost Rule and Stock Sync]]
- Earlier entry: [[2026-11-01 Boost Amount Left Matches Feed]]
- Earlier entry: [[2026-11-01 Deploy Folder Removed]]
- Earlier entry: [[2026-11-01 AHP-TOPSIS Default Policy]]
- Earlier entry: [[2026-11-01 Baseline Paging Fix and Policy Tests]]
- Earlier entry: [[2026-11-01 AHP-TOPSIS Test Cases]]
- Earlier entry: [[2026-11-01 Stitch Seller Messages Redesign Frames]]
- Earlier entry: [[2026-11-01 Boost Screen Shorter When Blocked]]
- Earlier entry: [[2026-11-01 Messages Flow Cleanup]]
- Earlier entries: the dated notes in this folder.
- Prompt in its 3-hour wait shows Posted + wait text, not Needs your choice (waitUntil on progress and /seller/boost-prompts). See 2026-11-01 Boost Prompt Wait Shown Not Needs Your Choice.
- Price drop 'Boost again' prompt no longer created or shown; auto cut posts by itself. See 2026-11-01 Price Drop Prompt Removed.
- Marketing > Price Drops tab = history of lower-price posts + per-listing switch for automatic drops (needs migration 20261101170000). See 2026-11-01 Price Drop History And Auto Drop Switch.
- Marketing tabs are underlined and spaced; History filters by activity with counts. See 2026-11-01 Marketing Tabs Spaced And Activity Filter.
- Marketing hub: tabs Running/Price Drops/History, Settings + How buyers find you buttons, Running grouped by activity. See 2026-11-01 Boost Hub Grouped By Activity.
- Price Lowered notice says the new price was posted; follows the Boost alert setting. See 2026-11-01 Price Lowered Notice Says It Was Posted.
- Bottom bar: Home, Reservations, Listings, Messages, Boost. Profile opens from Home's picture (now shows the photo). See 2026-11-01 Boost Tab Replaces Profile Tab.
- Boost tabs are equal width and centered. See 2026-11-01 Boost Tabs Centered.
- Chat screen restyled from Stitch F7-F11 (banner, photo viewer, failed-message retry, closed panel). Backend never closes chats. See 2026-11-01 Chat Screen Applied From Stitch.
- n8n boost webhook sends only initial and follow_up; price_reduction boost, prompt-accept route and 3-hour price-drop gap removed. See 2026-11-01 Boost Reasons Only Initial And Follow Up.
- A listing that starts a new cycle ends its old boost's 6-hour rule (context route clears the timer). See 2026-11-01 Follow Up Stops When Listing Starts Over.
- Worker ends the 6-hour rule without calling n8n when no cut is possible (sold out, archived, paused, at floor, new cycle). See 2026-11-01 Follow Up Not Sent When Rule Has Ended.
- Boost screen has Lower Price Now (manual follow_up round); old price_reduction boosts show correct post status. See 2026-11-01 Lower Price Now Button.
- Running tab = running boosts only; Price Drops tab = waiting drops (Lower Price Now sends follow_up) + history. See 2026-11-01 Price Drops Apart From Running.
- Leftover boost-again prompts show as skipped; migration 20261101180000 dismisses them; Boost on an already boosted listing answers 409. See 2026-11-01 Old Boost Prompts Retired.
