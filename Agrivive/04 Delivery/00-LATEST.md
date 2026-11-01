---
title: Agrivive Latest Snapshot
type: snapshot
last_updated: 2026-11-02 PST
status: active
---

# Agrivive Latest Snapshot

Replace this file after each completed task. Older detail belongs in the dated delivery records in this folder, which are the historical changelog. Verified repository code wins over any note here.

## Last updated

2026-11-02 PST

## Latest completed task

Restore Account screen rebuilt to match the other sign-in screens (one header, errors under the code, exactly 6 digits, success step with Continue or Sign In), and a restored seller is no longer stuck as "paused" for 30 seconds (status cache cleared on restore). Backend typecheck and builds and mobile typecheck passed; no phone check. Rebuild the API. See [[2026-11-02 Restore Account Screen Redesign]].

Earlier: Mobile now uses the web's fonts, colours and logo; real password reset screen; sender photos on Messages questions; duplicate headers removed. Details in [[2026-11-02 Web Look, Password Reset and Messages Photos]].

Earlier: Mobile sign-in screens (email code, sign-in code, backup code, Verify Your Email), App Start states, and the web password rule on mobile. Details in [[2026-11-02 Sign-In Screens and Password Rule]].

Earlier: Weather & Holidays screen rebuilt to match Stitch F5 to F8 using only real `/seller/advisories` data and the seller profile (no sample values). Details in [[2026-11-02 Weather and Holidays Screen Redesign]].

Earlier: High-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering the complete suite of **Extra Sign-In Screens**: F1 (Sign In With Email Code step 1 email error), F2 (Email code step 2 with countdown & QuickType auto-fill keyboard), F3 (Verify email with step progress dots, red box error & "Log out" action), F4 (Sign-in code two-step authenticator mode), F5 (Sign-in code backup mode with inline error), F6 (Restore blocked account step 1 with neutral security notice), F7 (Restore blocked account success card - Peak-End rule), F8 (Make a password with live 2-item checklist & confirm mismatch error), F9 (Login blocked account error context frame with direct restore link), and F10 (Reset password proposed 4-step sequence). Element-to-codebase mapping table, copy changes (plain words), behavioral changes, and UI/UX theoretical citations documented in [[2026-11-02 Mobile Extra Sign-In Screens Redesign in Google Stitch]].

Earlier: High-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering the complete seller **Profile & Security** flow: F1 (Profile tab verified & good standing), F1b (Scrolled view showing settings and Log Out), F2 (New seller checklist with missing fields), F3 (Limited standing with problem points), F4 (Avatar photo picker sheet with active uploading state), F5 (Edit Profile filled with inline phone error & sticky Save bar), F6 (Edit Profile leave-without-saving dialog), F7 (Setup step 2 pin not moved error & first-error scroll), F8 (Sign-in Safety password + Sign-in Code off), F9a (Sign-in Code step 2 QR & key), F9b (Sign-in Code step 3 6-digit boxes with error), F10 (Sign-in Code step 4 backup codes & copied badge), F11 (Sign-in Code on with in-card turn-off confirm), and F12 (Log Out confirmation dialog). Element-to-codebase mapping table, copy changes (plain words), behavioral changes, and UI/UX theoretical citations documented in [[2026-11-02 Mobile Profile Flow Redesign in Google Stitch]].

Earlier: High-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering **Change History** (`app/(app)/activity.tsx`), **Weather & Holidays** (`app/(app)/advisories.tsx`), and the renamed Home tile (`DashboardOperationsHub.tsx`): F1 (Change History All filter), F2 (Taken Away + active product filter chip), F3 (Product filter bottom sheet), F4 (Multi-state composite: skeleton, error banner with Try Again, empty state), F5 (Weather & Holidays standard state with Heads Up and Next 3 Days), F6 (No stall pin warning card replacing Cards 1 & 3 with Add Stall Pin CTA), F7 (Weather unavailable error isolation while holiday list functions), F8 ("About This Page" bottom sheet modal), and F9 (Home 2×2 "More Tools" grid showing renamed "Weather & Holidays" tile). Element-to-codebase mapping table, copy changes (plain words), behavioral changes, and UI/UX theoretical citations documented in [[2026-11-02 Stitch Change History and Weather Holidays Frames]].

Earlier: High-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`, screen `7e109b890c104c4cb7a2b940d5cf5d90`) covering the complete suite of Agrivive Seller **App Start States**: F1 (Splash), F2 (Loading with 1.5s caption delay & 10s Try Again button), F3 (No Internet / 408 timeout), F4 (Server Problem / 5xx), F5 (Account Paused with remaining time pill), F6 (Account Blocked with Restore My Account CTA), and F7 (Log Out confirmation dialog). Element-to-codebase mapping table, copy changes (plain words), and behavioral changes documented in [[2026-11-02 Stitch App Start States Redesign Frames]].

Earlier: Mobile Profile flow redesigned from the Stitch screens: Profile page, Edit Profile (with the leave-without-saving question), Sign-in Safety with the 4-step sign-in code flow, and Seller Setup. Our fields and logic are unchanged; see the note for what was left out on purpose. Mobile typecheck and Android export passed; not checked on a phone. See [[2026-11-02 Profile Flow Redesign]].

Earlier: The post after adding produce is now a normal post for any listing; only Priority Boost listings (score 0.60 or higher, checked once when the first post is saved) get the 6-hour price drops. 6 hours after the post the seller is asked to set the peso drop and final price, and saving it runs the first drop. Add Produce no longer asks for the drop. New migration `20261102120000_boost_priority_price_drop_setup` is not applied anywhere yet. Backend typecheck, 33 tests, builds, drizzle check and mobile typecheck and Android export passed; no device check. Rebuild and recreate the API and worker. See [[2026-11-02 Normal First Post and Priority Price Drops]].

Earlier: Boost retry fix (stale "did not post" after a retry); see [[2026-11-02 Boost Retry Shows Old Failure]].

Earlier: Fixed the Boost retry showing the old failure: a retried boost kept its old `sentAt` and old failed post logs, so the next screen said "did not post" while the list said "Posting now". Retry now clears `sentAt` and channels count only logs from the latest send. Typecheck, 33 tests and builds passed; no device check. Rebuild and recreate the API. See [[2026-11-02 Boost Retry Shows Old Failure]].

Earlier: Buyer Messages empty state ("Choose a conversation") shows the new green chat-bubble illustration with its background removed (`web/public/brand/empty-chat-bubble.png`). Details: [[2026-11-02 Messages Empty State Chat Image]]. Validation: typecheck passed; seen in the browser pane at desktop width. Not checked: phone width.

Earlier: Buyer All Orders empty state shows the new green box illustration (`web/public/brand/empty-orders-box.png`) with its background removed. Details: [[2026-11-02 Orders Empty State Box Image]]. Validation: typecheck passed; not seen in the browser (sign-in required). Not checked: phone width.

Earlier: Buyer cart empty state uses the new green cart illustration with its background removed (`web/public/brand/empty-cart-plus.png`). Details: [[2026-11-02 Empty Cart Image Swap]]. Validation: typecheck passed; checked in the browser pane at desktop width. Not checked: phone width.

Earlier: Boost now opens only for Priority Boost listings (paper rule, owner choice), Add More keeps the cycle's original stock in sync with a repair migration (applied to dev, not yet on the VPS), and the seller Boost list shows official tier names. 33 tests pass. Rebuild the API; run migration `20261101190000_sync_cycle_original_qty` on the VPS when ready. See [[2026-11-01 Boost Rule and Stock Sync]].

Earlier: Boost screen "Amount left" now uses the same original stock as the Listings screen and buyer feed (it showed 98% for a listing with 6 of 50 kg left). Rebuild and recreate the API on the VPS. See [[2026-11-01 Boost Amount Left Matches Feed]].

Earlier: The `deploy/` folder is removed: `Caddyfile` is at the repo root, `scripts/vps-release.sh` kept for the CD workflows, and all env keys are in the root `.env.example`. See [[2026-11-01 Deploy Folder Removed]].

Earlier: AHP-TOPSIS is now the default marketplace policy (unset or unknown `VISIBILITY_POLICY` uses it; only `visibility-v4` rolls back). The VPS `.env` and container still need updating. See [[2026-11-01 AHP-TOPSIS Default Policy]].

Earlier: Fixed the baseline marketplace paging bug (page 2 repeated page 1 when scores tied; the score is now rounded to 9 decimals in the query). Moved the policy choice into `utils/visibility-ranking/policy.ts`. Added tests: 29 pass (AHP-TOPSIS engine, WSV-008 paging, WSV-010 policy switch) and a `bun test` step in backend CI. Verified read-only on the dev database for both policies; the running API needs a restart. See [[2026-11-01 Baseline Paging Fix and Policy Tests]] and [[2026-11-01 AHP-TOPSIS Test Cases]].

Earlier: All 13 high-fidelity mobile UI mockups generated in Google Stitch (`AGRIVIVE MOBILE UI`, project `11184471743007910085`, design system `Lush Agro-Commerce`) covering the complete seller **Profile** flow: F1 (Profile tab verified & good standing), F2 (New seller setup checklist), F3 (Warning/limited standing), F4 (Avatar action sheet & uploading spinner), F5 (Edit Profile filled with phone error & sticky Save bar), F6 (Edit Profile leave-without-saving dialog), F7 (Setup step 2 pin not moved error & auto-scroll), F8 (Sign-in Safety password + Sign-in Code off), F9 (Sign-in Code step 2 QR & key), F9b (Sign-in Code step 3 6-digit boxes & invalid code error), F10 (Sign-in Code step 4 backup codes & copied badge), F11 (Sign-in Code on with in-card turn-off confirm), and F12 (Log Out confirmation dialog). Element-to-codebase mapping table, copy changes (plain words), and behavioral changes documented in [[2026-11-01 Stitch Seller Profile Redesign Frames]].
Priority deals row added under the marketplace hero (`GET /marketplace/products/deals`: AHP "Priority Boost" tier and at least 30% below base price). The marketplace was reordered so the products come before the seller map, and dead footer sort links and three unused components were removed. Details: [[2026-11-01 Priority Deals Row and Marketplace Reorder]]. Validation: backend typecheck and bundle passed, web typecheck and build passed. Not checked: the deals data path (backend not running) and the desktop and phone layout of the row.

Previous task: Sign-in and sign-up side panel now plays the uploaded video (`web/public/brand/sign-in-video.mp4`) instead of the photo carousel, and it is shorter (80vh). Details: [[2026-10-31 Auth Video Panel]]. Follow-up: the video column was shifted right with more left padding ([[2026-10-31 Auth Video Shifted Right]]). Validation: `bun run typecheck` in `web/` passed. Not checked in a browser.

Cart icon replaced everywhere in the buyer site with the supplied glyph (`CartIcon`). The empty cart shows a basket illustration, and marketplace category images are larger ([[2026-10-31 Cart Icon Category Image and Cart Illustration]]). Typecheck passed; not checked in a browser.

Parkinsans now used for headers (`font-heading`), footers and the marketplace hero. Alerts, toasts and the restriction notice restyled. Cart has icon and item motion ([[2026-10-31 Parkinsans Headers Alerts and Cart Motion]]). Typecheck passed; not checked in a browser.

Profile settings: search bar removed and the Profile, Security and Notifications cards share one style ([[2026-10-31 Profile Settings Consistent Cards]]). Typecheck passed; not checked in a browser.

Previous task: landing hero image swapped for a muted, looping video (`web/public/brand/hero-veggies.mp4`) in `web/src/components/sections/Hero.tsx`. The old image is the poster. Details: [[2026-10-31 Hero Image Swapped for Video]].

Validation: `bun run typecheck` in `web/` passed. At 1024px the video plays and sits inside the hero column. Not checked: reduced motion in the browser, and phone widths.

The intro animation ([[2026-10-31 Surplus Veggies Intro Animation]]) was rejected by the user and is not used.

Previous task: [[2026-10-30 Hero Basket Green Redesign]] and [[2026-10-30 Hero Headline One Line and Floating Labels]].

Merged from `main`: 13 Google Stitch mobile mockups for the seller Profile flow (F1 to F12, plus F9b). Mapping and copy changes in [[2026-11-01 Stitch Seller Profile Redesign Frames]].

Earlier on `main`: Stitch frames for Messages, Boost, Notifications, Listings, Sales Report, Reservations, Auth and Home, plus the Messages flow cleanup. See the dated notes in this folder.

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
