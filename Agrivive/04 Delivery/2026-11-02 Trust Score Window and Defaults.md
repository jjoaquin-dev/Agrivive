# 2026-11-02 Trust Score Window and Defaults

## What changed
- Old violations now fade. Verified events, low ratings (2 stars or less) and buyer cancellations count only for `TRUST_SCORE_WINDOW_DAYS` (default 90; 0 keeps them forever).
- Buyer cancellation counter uses the same window. Its action keys now include the cancelled order id, so a count that falls and rises again still creates a new warning or pause.
- `.env.example` now says `TRUST_ACTIONS_ENABLED=true` (code already ran unless the value is exactly `false`). README text matched to the code and documents the buyer cancellation rule (warn at 5, pause 12h/24h/3d at 7/9/10).
- Paper re-check: inactivity is 21 days (warning) and 30 days (block), matching "three weeks" and "one month".

## Files
- backend/src/utils/trust/policy.ts, score.ts, policy.test.ts
- backend/src/modules/buyer/services/buyer.order.cancel.ts, buyer.profile.read.ts
- backend/.env.example, backend/README.md, backend/dist/*

## Verification
- `bunx tsc --noEmit` clean, `bun test` 45 pass, both builds done.
- PGlite scenarios t1-t4 and migration test still pass; new t5 proves a 100-day-old violation is dropped while 10- and 89-day-old ones count.
- No schema change, no new migration.

## Owner steps
- Set `TRUST_ACTIONS_ENABLED=true` on the server and optionally `TRUST_SCORE_WINDOW_DAYS`.
