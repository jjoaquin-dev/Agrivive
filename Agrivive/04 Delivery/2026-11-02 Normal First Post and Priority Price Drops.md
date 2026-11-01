---
title: Normal First Post and Priority Price Drops
type: delivery
date: 2026-11-02
---

# Normal First Post and Priority Price Drops

Replaces [[2026-11-02 Boost Retry Needs Priority Boost]] (that gate on retries is removed).

## Why
Owner rule: the post after adding produce is a normal post for any listing. Only Priority Boost listings (AHP-TOPSIS score 0.60 or higher) get the 6-hour price drops. The 6-hour interval comes from the Department of Agriculture advice (₱10 every 6 hours); the peso amount and final price are chosen by the seller (Metro Mercado and Agdao interviews).

## Flow
1. Add Produce asks only price, amount and low-stock alert (the price drop fields show only in Edit).
2. After saving, the seller is asked "Post it on Facebook and Instagram?" (`Preview Post` or `Not Now`).
3. When the first Facebook post is saved, the backend scores the listing with AHP-TOPSIS once and saves `priority_score` and `priority_tier` on the boost.
4. Priority Boost: 6 hours after the post the seller gets a "Set Your Price Drop" notice. Saving a peso amount and final price runs the first drop right away; later rounds every 6 hours until the final price (`P_new = max(P_current - d, P_minimum)`). A listing that already had a drop set up gets its first drop 6 hours after the post.
5. Any other tier: normal post only, no price drops. The Boost screen says why.

## Changed files
- Backend: `db/schema.ts` and migration `20261102120000_boost_priority_price_drop_setup` (four columns on `seller_visibility_boosts`); `seller.visibility-boost.queue.ts` (no Priority gate); `seller.visibility-boost.read.ts` (`priceDropRule`, `canBoost` without tier); `integrations.visibility-boost.follow-up.schedule.ts` (score at first post); `seller.price-reduction.toggle.ts` (amount and final price in one call, Priority check); `drop-now.read.ts` and `reduce-price.ts` (Priority guard); `jobs/send-price-drop-setup-notices.ts` and `run-scheduled.ts`; notice kind `price_drop_setup`; `notify-started.ts`; `API_ENDPOINTS.md`; tracked `dist/index.js` and `dist/worker.js`.
- Mobile: `ProductFormOperations.tsx` (create hides price drop), `BoostIntroSheet.tsx` and `create.tsx` (post prompt), `[productId].tsx` (post screen), `PriceDropRuleCard.tsx` and `PriceDropSetupSheet.tsx` (new), `VisibilityBreakdownCard.tsx` ("View Status", "Try Again", "Post It"), `BoostPriceDropCard.tsx`, `BoostEligibilityNote.tsx`, `types.ts`, `visibility-boosts.ts`, `sellerNoticeMapper.ts`.

## Verified
Backend typecheck, 33 tests, API and worker builds, `drizzle-kit check`; mobile typecheck and Android export. Not checked: a device, the live API, or Facebook posting.

## Owner steps
Apply the migration (`bunx drizzle-kit migrate` from `backend/`, on dev, then the VPS), rebuild and recreate the API and worker, and keep the Facebook Page token on the VPS.

## Notes
- A listing with no Boost post yet keeps a "Post It" button on the Boost tab, so choosing "Not Now" after adding produce is not permanent.
- Boosts saved before this change have no tier and keep their old behavior.
- Checked once at the first post because Listing Recency (weight 0.40) falls to half by 6 hours; a lone listing scores 0.50, so very small feeds rarely reach Priority.
