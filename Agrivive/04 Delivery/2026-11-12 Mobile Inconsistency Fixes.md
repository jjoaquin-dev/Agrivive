---
title: Mobile Inconsistency Fixes
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-12 Trust Level Screens and Recovery Fix]]

## Why
A scan of the mobile app found about 60 inconsistencies. This record covers group A (wrong or misleading) and the safe part of group B (design tokens). Groups C to F are not done.

## Fixed (group A)
- **Trust History:** the card saying points "do not restrict your account" is gone. One standing card now lists every event with its points, with **Dispute** (7 days) or **Ask for a Check** (cancellation or unanswered question, once). `/trust/me` events gained `canCorrect`. The old event list, correction form and `TrustMonitoringSummary` were removed.
- **State names:** "Account Blocked" for inactive accounts, "Paused until ..." for pauses (was "Limited"). The start-screen default message no longer says "paused" and "restore" together.
- **Wording:** "Priority Boost" became "Boost" in the app, backend notices and guidance. Seller notices for slow replies say "12 / 24 open hours".
- **Dead call:** `requestPriceDropNow` (a route that does not exist) was removed.
- **Time:** `src/utils/dates.ts` formats in Asia/Manila. About 25 timestamp formats now pin the timezone. Calendar-date formats (analytics keys, holidays, weather) were left alone on purpose, because forcing a timezone on them can show the wrong day.
- **Docs:** `AGENTS.md` lists the real tabs; `backend/API_ENDPOINTS.md` lists the seller-app endpoints it was missing.

## Fixed (group B, safe part)
Hard-coded colours that exactly matched a theme colour now use the theme token. 360 became 230. The rest are off-palette colours that need a design choice.

## Fixed afterwards (groups B to F)
- **Colours:** every hard-coded colour that matched a theme colour now uses the token. New semantic tokens: status tints (`warningSurface`, `errorSurface`, `successSurface` and their borders and text), `overlay` for every dim layer, and `star`. 360 hard-coded colours became 19, all brand colours (Google, Facebook, Instagram) and black shadows.
- **Type:** font sizes snapped to the type scale (20 became 18; 24 to 22; 26, 32 and 34 to 28; 9 to 10; 19 to 18). Every `fontWeight` became a font face.
- **Touch targets:** five controls under 44 raised to 44 (orders filter, unit chips, message chips, product filter, boost button).
- **Copy:** user-visible errors say "Could not…"; one retry label ("Try Again"); Sign In, Sign Out, Sign Up; "Restore Account"; "Listing" for the posted item; "Reservation" for orders; "..." for ellipsis; the block and no-show confirmations use the shared dialog.
- **Formatting:** one peso formatter (`src/utils/money.ts`, thousands separators) and one relative-time formatter in `src/utils/dates.ts`; all eight old peso helpers use it.
- **Screens:** layout titles removed where the screen draws its own header, `stall` registered in the layout, Cancel button uses tokens, pull-to-refresh on order, listing and stall screens (quiet refresh, no spinner flash).
- **Code:** 12 unused files deleted; style files renamed to `Name.styles.ts`; `register` (491 lines), `login` (435), `onboarding`, `home`, `ProductPhotoField` and `SellerOrderCommunication` are now under 200 lines (logic in `useLogin` and `useRegister`, styles in `*.styles.ts`); `MyTrust` type moved to `types.ts`; `conversations/api` is a folder like the other features.
- **Accessibility:** verified no pressable lacks a role and no icon-only button lacks a label (the earlier count of 100 missing roles was a counting error).

## Not done on purpose
- Border radius (about 40 literal values), off-scale spacing (2, 6 and 10) and icon sizes (14 sizes): each needs a look at the screen, because snapping them changes shapes.
- 91 uses of `any` and 21 `console.*` calls in catch blocks.
- "Pickup" (noun) and "pick up" (verb) are both correct and stay.
- `disableNotificationDevice` is never called, so signing out may leave the phone registered for push. This is a real gap, not a style issue.

## Verification
Typecheck clean (backend, web, mobile); `bun test` 275 pass; the Android export (`expo export --platform android`, run with bun) builds. Not run on a phone, so the look of snapped font sizes, touch targets and colours has not been seen.
