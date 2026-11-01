# 2026-11-02 Trust and Rating Paper Alignment

Fixes every gap found when the Trust and Rating module was compared with the capstone paper (Tables 17 and 18, Equation 3, FR-08).

## What changed
1. **Blocking by score (Table 18).** `utils/trust/policy.ts`: an account is blocked when its weighted score reaches `TRUST_BLOCK_THRESHOLD` (default 12, always above the 72-hour tier at 10) or on one serious violation (QR-code misuse). Before, 10 points was only a 3-day pause and nothing blocked by score. `evaluate-action.ts` never makes a second block while one is open. After an account is restored, only newer serious violations count.
2. **Reply timers cover every buyer question (Table 17).** The 12h reminder, 24h warning plus buyer notice, 48h non-responsive schedule now runs for order questions, product questions (new `product_inquiries.deadline_stage`) and direct chats (new `conversations.awaiting_reply_since` and `deadline_stage`). Files: `process-inquiries.ts`, `process-chats.ts`, `response-deadlines.ts`. Old product questions are marked done by the migration, so nobody is penalised for them. A seller who is blocked or inactive is not timed. One reply from the seller now answers every open question from that buyer (the thread's context changes over time, so it was not reliable). A chat that already has an open question is timed through the question only, so one ignored buyer is not counted twice. Correction requests (`verify-non-response.ts`) now check all three sources.
3. **Other violation types.** Reports are still allegations with zero points. When `TRUST_REPORT_CONFIRM_COUNT` (default 2) different people report the same reason about the same person, one verified violation is recorded (`confirm-report.ts`): `listing_inaccurate` = misleading product information (2 points), `conduct` = inappropriate communication (2), new reason `qr_misuse` = QR-code misuse (3, serious). `pickup_problem` and `other` never count by themselves. Report forms on mobile and web got the "QR code misuse" choice.
4. **Product reviews.** Sellers can list and answer product reviews: `GET /seller/product-reviews`, `POST /seller/product-reviews/:id/reply`, new `product_reviews.seller_response`. The mobile Reviews screen has "Pickup Reviews" and "Product Reviews" tabs. The buyer product page shows the seller response.
5. **Correct messages.** `action-reason.ts` writes the reason from the real cause (missed pickups, slow replies, cancellations, low ratings, reports). Pauses and blocks now use the stored reason (`access.ts`, `auth.session.ts`). A blocked account now says "Please restore your account", so the app shows "Your Account Is Blocked" instead of "Paused, back in a few moments".
6. **Smaller fixes.** Only a rating of 2 or below re-checks the trust score (a good review no longer restarts a pause). The inactivity job only applies to buyer and seller accounts, not admin or stakeholder. The mobile Trust screen no longer crashes on records that have no order.

## Not changed on purpose
Violations never expire (a lifetime total). The paper does not set a window, so this needs a policy choice from the owner.

## Files
New: `utils/trust/action-reason.ts`, `confirm-report.ts`, `process-chats.ts`, `response-deadlines.ts`, `verify-non-response.ts`, `policy.test.ts`; `utils/review-format/`; seller product review route, model and two services; `ReviewKindTabs.tsx` (mobile). Migration `backend/drizzle/20261102140000_trust_alignment/migration.sql` (hand-written, with the earlier drop migration). Docs: `backend/README.md`, `API_ENDPOINTS.md`, `.env.example` (thresholds now match the code).

## Owner steps
Run `bunx drizzle-kit migrate` from `backend/` (it runs both pending migrations in order). Check the server env: `TRUST_ACTIONS_ENABLED` must be `true` for actions to apply, and any `TRUST_*_THRESHOLD` lines should match `.env.example`.

## Verification
Backend `bunx tsc --noEmit`, `drizzle-kit check`, `bun test` (44 pass, 11 new), both `bun build` runs; mobile typecheck and Android export; web typecheck. Not run against a real database or phone.
