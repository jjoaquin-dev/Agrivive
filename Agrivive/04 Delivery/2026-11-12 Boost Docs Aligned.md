# 2026-11-12 Boost Docs Aligned

Up: [[Delivery Index 2026-11]]

**Why:** Notes and comments still described a 0.60 closeness cutoff, "Priority Boost" tiers and a Recurrence criterion. The code no longer has them: four criteria (posting age, price drop, stock level, seller reliability), best rank not boosted in the last 6 hours is picked, no minimum score.

**Changed:** `CLAUDE.md` (utilities line), `backend/API_ENDPOINTS.md` (boost paragraph), comments in `seller-access`, `order-access` and `seller.visibility-boost.queue.ts`, and the note `03 Intelligence/Marketing Boost.md` (rewritten to the current flow). `backend/dist` rebuilt.

**Still stale (not changed):** `03 Intelligence/Weighted Surplus Visibility.md`, `03 Intelligence/AHP-TOPSIS Proof Pack.md`, `docs/WSV-AHP-TOPSIS-test-results.md` still show tiers or 0.60.

**Verified:** `tsc` clean, build ok. See [[Marketing Boost]].
