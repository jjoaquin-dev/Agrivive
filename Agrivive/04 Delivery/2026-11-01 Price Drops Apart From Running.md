# Price drops are apart from running boosts (2026-11-01)

**What:** The Running tab only lists boosts that are posting, running or need attention (did not post). Anything about the price drop moved to the Price Drops tab: "Waiting for the next drop" cards (photo, price now to lowest, next automatic drop time, and a **Lower Price Now** button that sends `follow_up`), then the history of posted lower prices. The old "price drop ready for boosting" card (a boost made after a price change) no longer shows on Running; nothing in the app creates it any more, so pressing Boost can no longer send a price change as `initial`. The Boost screen is only for the first boost again (the extra Lower Price Now button there was removed).

**Backend:** new `GET /seller/price-drops/running`; `POST /seller/products/:id/price-drop` unchanged.

**Files:** backend seller.price-reduction.running.list.ts, index/seller.price-reduction.ts, API_ENDPOINTS.md (dist rebuilt); mobile RunningPriceDropCard, RunningPriceDropList, PriceDropsSection, ActiveBoostsSection, marketing/index.tsx, marketing/[productId].tsx, types, api.

**Not found:** why one boost showed "Did not post" for Facebook and Instagram while n8n posted. Boosts made before the price-change kind was removed are read correctly now; anything else needs the boost's rows (see the SQL given to the owner).

**Checked:** backend `bunx tsc --noEmit`, mobile `bun run typecheck`. Not run against n8n.
