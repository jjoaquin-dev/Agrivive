# n8n boost webhook now sends only two reasons (2026-11-01)

**What:** The boost webhook sends `initial` (seller taps Boost) or `follow_up` (worker, 6 hours later). The third kind, `price_reduction` (boost again after a price change) is gone.
- One manual Boost per listing cycle (key `<cycle>:initial`, 3-hour gap between first posts stays). Later price drops come only from the 6-hour rule.
- Removed: creating `price_reduction` boosts, `POST /seller/boost-prompts/:id/boost`, the 3-hour price-drop post gap, the "After price drop" caption, `eligibility.stage`, `progress.waitUntil`, prompt `waitUntil`.
- A leftover `price_reduction` row is refused with 409 "This boost type is no longer used".
- The Boost screen allows Boost once; after that it reads "Boost Is Running".
- n8n workflow file: caption prompt and Format Caption no longer mention price reduction (re-import into n8n).
- Kept: the `price_reduction` value in the Postgres enum (cannot be dropped safely), and the Price Lowered notice after an automatic cut.

**Files:** backend seller.visibility-boost.{queue,read,progress,used,channels,prompts.list}.ts, prompt.accept.ts (deleted), index/seller.visibility-boost.ts, integrations visibility-boost {context,facebook-post,instagram-post,caption}.ts, utils/boost-cooldown, API_ENDPOINTS.md, n8n/workflows/agrivive-visibility-boost.json; mobile marketing/[productId].tsx, BoostPriceDropCard, BoostHistoryCard, BoostHistorySection, types, api, notifications mapper/types.

**Checked:** backend `bunx tsc --noEmit`, mobile `bun run typecheck`, dist rebuilt. Owner to test: Boost once, check n8n shows `initial`; set `follow_up_due_at` to now and check n8n shows `follow_up` on the true path.
