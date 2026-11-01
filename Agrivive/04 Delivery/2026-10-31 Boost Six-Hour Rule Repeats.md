# 2026-10-31 Boost Six-Hour Rule Repeats

Corrects [[2026-10-31 Boost Review Hardening]], which made the 6-hour rule run only once.

## What changed and why
The owner wants the rule to listen again: first post, then every 6 hours cut the price, post, tell the seller to act, and repeat until the price reaches the seller's lowest price.

- After each round is saved, `rearmBoostFollowUp` (new, `integrations.visibility-boost.follow-up.rearm.ts`) sets the next due time 6 hours ahead. It clears it instead when the price is at or below the minimum price, the product is sold out or off, or the seller's percent is 0. `reduce-price` still clears it when nothing was cut.
- Each round compares against the **newest saved post** (first or second), not only the first post: `reduce-price` (retry-safe cut), `facebook-post` (a second post is skipped when the price has not dropped since the last post, and its duplicate check starts after the last post) and `notify-price-lowered` (price before = the post before this one).
- The 12-hour price job is not changed. Every 6-hour cut raises `priceReductionPeriodsApplied`, which pushes that job's next due time out, so it does not cut a boosted product at the same time.
- n8n workflow unchanged: every follow-up call runs the same branch.
- Docs: `backend/README.md`, `backend/API_ENDPOINTS.md`.

## Verification
Backend `bunx tsc --noEmit` passes. Not run against n8n or Meta.

## Notes
- Each round sends a Price Lowered push and creates a price-drop boost prompt; the 3-hour gap between price drop posts still applies to the seller's own Boost taps.
- If n8n keeps failing, a round is retried 5 times (every 15 minutes) and then stops.
