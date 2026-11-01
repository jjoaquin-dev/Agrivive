---
title: Six-Hour Price Drop Only and Boost Post Text
type: delivery
date: 2026-11-01
status: code complete, manual testing pending
---

# Six-Hour Price Drop Only and Boost Post Text

## What changed

Owner decisions after checking the capstone paper (`docs/CAPSTONE 2 FILES - BARTIQUIEN, JARA, MARUNDAN.pdf`) against the code:

1. **One price-drop rule: the 6-hour Boost rule.** The separate 12-hour schedule is removed. A listing's price only drops through the Boost follow-up (every 6 hours after the first Boost post, until the lowest price). A listing that is not boosted keeps its price.
   - Deleted `backend/src/jobs/apply-seller-price-reductions.ts` and its entry in `jobs/run-scheduled.ts`.
   - `seller.product.price-reduction.ts` now exports `readSellerProductPriceDrop`, which only reads the product and sets `nextPriceReductionAt` from the earliest pending `seller_visibility_boosts.follow_up_due_at`. Used by `seller.product.get.ts` and `seller.product.list.ts`.
   - `buyer.order.reserve.ts` no longer applies a price cut before reserving.
   - The 6-hour path (`notifyBoostPriceLowered`) already creates the Price Lowered notice and the Boost Again prompt, so nothing is lost.
   - The 12-hour old-batch rule (listing recency, C1) is unrelated and unchanged.
2. **Sellers can see the post text (FR-05, FT-S-03).** The posted Facebook caption was not stored anywhere.
   - New nullable column `fb_post_logs.caption`, migration `backend/drizzle/20261101150000_fb_post_caption` (hand-written, `ADD COLUMN IF NOT EXISTS`).
   - `finishFacebookPost` saves the exact caption on success; `seller.visibility-boost.progress.ts` returns `caption` on each `progress.posts[]` item.
   - Mobile: new `BoostPostText.tsx` (See post text, read-only text, Copy Text) shown under each post in `BoostTimeline.tsx`; `BoostPostEntry.caption` added in `marketing/types.ts`.
3. **Official tier names** in `VisibilityBreakdownCard.tsx`: Priority Boost, Standard Exposure, Basic, Not ranked yet, with plain captions; letter spacing removed.
4. **"Account Blocked"** replaces "Account Paused" for the 30-day inactivity notice in `backend/src/utils/seller-notifications/messages.ts`, matching the paper.
5. Mobile price-drop copy now says 6 hours: `ProductFormOperations.tsx` (section "Price drop", label "Drop every 6 hours (%)"), product details rows, `ProductCard.tsx` pill.
6. No product condition field anywhere (adviser: listings are already surplus). The unused backend `condition` column is left as is.

Docs updated: `backend/API_ENDPOINTS.md` (6-hour rule, `nextPriceReductionAt`, `caption`), `backend/README.md` (price lowered trigger).

## Verification

- `bunx tsc --noEmit` (backend): passed.
- `bun build src/index.ts` and `src/worker.ts`: passed (rebuilt `backend/dist/`, which is tracked).
- `bunx drizzle-kit check`: passed.
- `bun run typecheck` (mobile): passed.
- Not run: migration, worker, device check, Meta posting.

## Owner manual tests

1. Apply `backend/drizzle/20261101150000_fb_post_caption` (after `20261031140000_boost_follow_up`).
2. A product with drop % and lowest price but no boost: `GET /seller/products/:id` keeps the same `productPrice` over time and returns `nextPriceReductionAt: null`.
3. Boost it, let the first post save: `GET /seller/products/:id` returns `nextPriceReductionAt` about 6 hours after the post; `GET /seller/products/:id/boost` returns `progress.posts[0].caption` with the posted text.
4. In the app: Marketing → boost card → See post text → Copy Text.
5. Reserve a boosted product: the reserved price is the current price (no extra cut).

## Paper follow-up

The paper still lists product condition in 2.2.1.2, 2.2.1.10 and Table 23; remove it there to match this decision.
