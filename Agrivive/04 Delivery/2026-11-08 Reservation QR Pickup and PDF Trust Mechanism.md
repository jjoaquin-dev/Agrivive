---
title: Reservation, QR Pickup and PDF Trust Mechanism
type: changelog
date: 2026-11-08
---

# 2026-11-08 Reservation, QR Pickup and PDF Trust Mechanism

Source spec: `Flagging and Trust Mechanism.pdf` plus the owner's locked-in decisions (3-hour auto-confirm, QR valid to slot end + 15 minutes, first no-show is a warning, reschedule needs buyer consent, 5 seller-fault returns flag a seller).

## What changed

- **Stall setup:** weekly hours per seller, Closed today, Away (max 14 days, stops the 48-hour clock), pickup capacity and range limit. Mobile screen `Stall Hours & Away`.
- **Reservation:** buyers choose Today or Tomorrow and a From/To range (15-minute steps). Server checks hours, closed days, 30-minute closing buffer, range limit, seller capacity, and the buyer's own open orders across all sellers. Locks per buyer and per stall stop races. Pause or block stops reserving on the server too.
- **Order life:** placed, confirmed (seller or auto after 3 hours), preparing, ready, completed. Cancel only before confirmation. QR works from slot start to end + 15 minutes; every scan is saved.
- **Decline at pickup:** Table 8 reasons, in-app photo, reused-photo detection by hash, 24-hour seller answer, 3-day admin decision, outcomes and stock rules from Table 9, repeat-return flag.
- **No-show, excuse, reschedule:** first no-show 0 points (never reset), later 2; excuse within 24 hours, once per 30 days; reschedule only after buyer accepts, with an audit row.
- **Trust engine (`monitoring-v4`):** PDF weights, bands (notice 2-3, warning 4-5, pause 24 h 6-7, pause 3 days 8-11, block 12+), consequence only when moving up, recalculation when points fade or events are overturned, seller fault-rate gate (10 orders, 10%, 15% review), Bayesian rating, Trusted Seller, reports (20 characters, reciprocal ignore, pair limit, statuses), disputes (7 days), review requests, admin tools.
- **Old buyer cancel counter (5/7/9/10) removed.** Paused sellers keep serving orders; only new listings and Priority Boost stop.

## Files

Backend: `db/schema.ts`, migration `20261108140000_pickup_trust_pdf`, `utils/pickup/*`, `utils/trust/*` (policy, level, standing, fault-rate, rating, evaluate-action, recalculate, report, confirm-report, low-rating, notice-text), `modules/pickup/*`, `modules/trust/*`, `modules/admin/index/admin.trust.ts`, `jobs/run-scheduled.ts`. Web: `features/reservation/*`, product page, cart drawer, order detail (progress, pass, decline, excuse, reschedule). Mobile: stall screen, order steps, trust standing card.

## Verification

- Backend `bunx tsc --noEmit` clean except the 4 old errors in `ahp-test.ts` and `topsis-test.ts`; `drizzle-kit check` fine; API and worker bundles rebuilt.
- 10 test files run one by one: all pass (new: `pickup.flow.test.ts` 56 tests against in-memory Postgres, `pickup-rules.test.ts` 21, `fault-rate.test.ts` 13, rewritten `policy.test.ts` 28). Running every file in one `bun test` process fails because the older review tests mock the database module differently from each other; run files one by one.
- Web `bun run typecheck` and `bun run build` pass. Mobile `bun run typecheck` passes. Android export not run (no `node` on this machine). No phone or browser check.
- Not tested by the owner.

## Needs doing

- Apply the migration before deploying; rebuild API and worker.
- Sellers must save opening hours before buyers can reserve.
- Admin screens do not exist; admin works through the API (`/admin/*`).
- Blocked accounts can still restore through the email-code recovery. The PDF says a blocked user may ask for a review; a review request route exists for the 3-day pause, but a blocked person cannot sign in to use it.
