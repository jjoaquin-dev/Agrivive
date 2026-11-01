# The worker no longer calls n8n for a 6-hour rule that has ended (2026-11-01)

**What:** n8n showed red errors every 15 minutes (5 times) for a boost whose listing had started a new cycle, because the worker called n8n and the context route answered 409. Now the worker checks first and ends the rule without calling n8n when the product is sold out, archived, not marketable, paused (switch off), at its final price, has no drop amount or final price, or the listing started a new cycle. The context route also clears the timer on a cycle change (kept as a second guard).

**Files:** backend jobs/deliver-seller-boost-follow-ups.ts, API_ENDPOINTS.md (dist rebuilt).

**Checked:** `bunx tsc --noEmit` clean. Not run against n8n. Needs migration 20261101170000_price_reduction_enabled first: the job reads that column.
