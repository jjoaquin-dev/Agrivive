---
title: AHP-TOPSIS Raw Criteria and Six-Hour Rule
type: delivery
date: 2026-11-08
---

# AHP-TOPSIS Raw Criteria and Six-Hour Rule

## What changed
- `backend/src/utils/ahp-topsis/index.ts` rebuilt on mathjs with the same steps as `ahp-test.ts` and `topsis-test.ts`: four criteria (posting age, price drop, stock level, seller reliability), the 4x4 Saaty matrix, weights from normalised column means, CR with RI 0.90 (refused above 0.10), vector normalisation, weighting, ideal best/worst, closeness. Weights: 0.3507, 0.3507, 0.1892, 0.1093; CR 0.0038.
- Criteria are raw (hours, peso drop, quantity, rating out of 5). No 0-1 conversion before the engine.
- `visibility-ranking/load.ts`, the marketplace feed (`marketplace.products.list.ts`, `.visibility.ts`) and the seller visibility response feed the raw values. A seller with no reviews counts as 2.5 out of 5.
- Six-hour rule: `visibility-ranking/boost-select.ts` (pure) and `boost-select.load.ts` (`selectNextBoost`, read only) pick the first ranked listing whose last boost was 6+ hours ago. The post gap in `utils/boost-cooldown` is now 6 hours (was 3).
- Mobile factors grid shows four rows (Time Posted, Price Drop, Amount left, Reliability).
- n8n workflow already matched the prompt; unchanged.

## Labels removed
Priority Boost, Standard Exposure and Basic/Hold and their 0.60 / 0.40 cut-offs are gone, as the PDF flow has only rank and the six-hour rule. The Priority gate is removed from Boost, the follow-up schedule, price drops, the deals row, the web and mobile screens. The mobile card shows "Rank N". Every boosted listing now gets the 6-hour price drops. The `priority_score` and `priority_tier` columns stay for old rows and are no longer written; no migration. Older notes in this vault still describe the tiers as history.

## Ranked again after 6 hours
As the PDF chart says, a boosted listing is locked for 6 hours (and until its due follow-up has run), then goes back into the ranking and can be boosted again. The worker job passes `nextRound` to the queue: later rounds in the same listing cycle get their own key (`<cycle>:initial:<n>`), and the older round stops its own price-drop timer so two timers never cut the price. The seller's manual Boost button still allows one boost per listing.

## Auto-Post permission
The first post stays manual. After a product is added the seller is asked "Let Agrivive post for you?" (Yes, Auto-Post / Not Now) with how to turn it off (Boost > Settings > Auto-Post). New per-listing columns `auto_post_enabled` (default off) and `auto_post_accepted_at`; migration `20261108120000_auto_post_consent` (NOT applied anywhere yet; it turns Auto-Post on for listings that already have a drop amount and final price). `PATCH /seller/products/:id/auto-post`. Follow-ups (6-hour price drop and flash-sale post) and the worker's re-boost rounds run only for listings with Auto-Post on; the re-boost also needs the seller's own first post. `AUTO_BOOST_ENABLED` stays as the operator kill switch.

## Manual follow-up buttons removed
The only manual trigger is the first post. Removed: the "Lower Price Now" button and `POST /seller/products/:id/price-drop`, and the "Boost Again" button on the Price Lowered notice (now "View Status", no invitation to post by hand).

## Follow-up is a notification with a preview
After each automatic follow-up post the seller only gets the "Price Lowered" notification. It now includes the title and description that went out (shortened to 240 characters, without the order link line), taken from the saved Facebook post. Nothing to tap or post by hand.

## Notes
- All four criteria count as "bigger is better", same as the test files, so older listings and bigger price drops rank higher.
- New worker job `jobs/queue-ranked-boost.ts` (in `run-scheduled.ts`): when `AUTO_BOOST_ENABLED=true` it ranks, takes the top unlocked listing (tries up to 5), and queues its boost through the normal queue, so n8n gets the usual "Boost Confirmed" POST and the follow-up POST 6 hours later. One boost per `AUTO_BOOST_ROUND_MINUTES` (default 60). Off by default.
- `publishedAt` is only set on create, reactivate, a new cycle after sold-out restock, and legacy init; normal edits and Add More never reset it.
- `ahp-test.ts` and `topsis-test.ts` are the owner's scratch files and still have two mathjs type errors under `tsc`.

## Verification
`bun test` 50 pass; backend `tsc` clean except the two scratch files; API and worker bundles build; mobile typecheck passes. No device or database run.
