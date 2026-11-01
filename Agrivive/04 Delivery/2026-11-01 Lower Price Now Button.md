# Lower Price Now: a manual drop that uses the same follow_up call (2026-11-01)

**What:** On the Boost screen of a listing that is already boosted, a "Lower Price Now" button brings the next 6-hour round forward to now. The worker sends `reason: "follow_up"`, so n8n takes the true path (lower the price, "Price drop!" post), same as the automatic round. The 6 hours then restart. It is blocked, with a plain message, when the first post is not out, drops are off, the price is at the final price, the listing is unavailable, or a lower price was posted under 3 hours ago (then the button is grey and says "Lower price again in about N hours").

**Also fixed:** boosts made before the price change kind was removed kept looking at the wrong post type and showed "Did not post" after n8n posted. They now read their own post type again.

**Files:** backend seller.price-reduction.drop-now(.read).ts, index/seller.price-reduction.ts, seller.visibility-boost.read.ts (`eligibility.priceDrop`), used.ts, channels.ts, utils/boost-cooldown, API_ENDPOINTS.md; mobile marketing/[productId].tsx, api, types.

**Checked:** backend `bunx tsc --noEmit`, mobile `bun run typecheck`, dist rebuilt. Not run against n8n. Needs the price_reduction_enabled migration.
