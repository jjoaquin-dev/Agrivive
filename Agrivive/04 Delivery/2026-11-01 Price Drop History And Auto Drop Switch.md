# Price drop history and an on/off switch for automatic drops (2026-11-01)

**What:** Marketing has a Price Drops tab again, but it is a history, not prompts.
- Top: one switch per listing that has a drop amount and a final price. Off stops the automatic 6-hour drops and keeps the numbers.
- Below: every Facebook post that announced a lower price: photo, product name, old price → new price, amount off, the posted words, date, link to the post.

**Backend:**
- New column `sellers_product.price_reduction_enabled` (default true). Migration `20261101170000_price_reduction_enabled` (NOT yet applied).
- `GET /seller/price-drops`, `PATCH /seller/products/:id/price-reduction`.
- The switch is checked when the first post schedules the timer, in `reduce-price`, in the repeat, in the price cut itself, and on the Boost screen's drop card.
- "Lower price" is a post priced below the product's previous post (SQL `lag`). It covers automatic cuts and manual cuts that were posted.

**Files:** backend schema.ts, seller.price-reduction.{toggle,history.list}.ts, model/seller.price-reduction.ts, index/seller.price-reduction.ts, integrations reduce-price/rearm/schedule/notify-started, seller.visibility-boost.read.ts, price-reduction.followup.ts, API_ENDPOINTS.md. Mobile: PriceDropsSection, PriceDropHistoryList, PriceDropHistoryCard, AutoPriceDropSwitches, MarketingSectionTabs, marketing/index.tsx, types, api.

**Checked:** backend `bunx tsc --noEmit`, mobile `bun run typecheck`, dist rebuilt. Not run against a database or device: the migration is not applied and endpoints are owner-tested.
