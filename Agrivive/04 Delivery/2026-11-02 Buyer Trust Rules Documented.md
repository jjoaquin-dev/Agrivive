# 2026-11-02 Buyer Trust Rules Documented

**What changed:** `03 Intelligence/Trust and Flagging.md` now lists the current trust points table (warn 4, pause 12h/24h/3d at 6/8/10, block 12, 90-day window) and a new "Buyer rules" section. The old defaults (warning 3, restriction 5, block 8, seven-day restriction) were removed. `00-LATEST.md` points here.

**Why:** The note was seller-only and out of date. The buyer rules are not in the paper but must stay in the system, so they needed one place in the vault. The buyer rules:
- Cancelling reservations: warn at 5, pause at 7/9/10 (12h/24h/3d).
- Unpicked expired reservation: 2 points plus a warning notice.
- Inactivity: 3 weeks warning, 1 month deactivation.

**Files:** `backend/src/utils/trust/policy.ts`, `cancellation-policy.ts`, `backend/src/modules/buyer/services/buyer.order.expire.ts` (read only; no code changed).

**Verification:** Every number was checked against `policy.ts` and `cancellation-policy.ts`. No tests run (documentation only). No secrets recorded.
