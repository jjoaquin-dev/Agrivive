# 2026-10-31 Boost Review Hardening

Builds on [[2026-10-31 Boost Straight to n8n With 6-Hour Price Cut]]. That note's "Wait 6 Hours" node and "post once and stop" price-drop rule are replaced by this one.

## What changed and why
An outside review of the Boost flow found three real gaps. All three are fixed.

- **The 6 hours are kept in our database, not in n8n.** Saving the first post sets `follow_up_due_at` (post time + 6 hours) on the boost, only when the seller turned on price drops. A new worker job (`deliver-seller-boost-follow-ups.ts`) sends `{ boostId, reason: "follow_up" }` to the same n8n webhook once it is due. It asks again every 15 minutes, up to 5 times, until the second post is saved or the cut is skipped (`follow_up_due_at` is cleared). n8n has no Wait node now; a new "Follow-Up Call?" check sends follow-up calls to the price cut branch.
- **A pending row guards every Facebook post.** The post is claimed with a `pending` row in `fb_post_logs` (under a per-product lock) before Meta is called, then closed as `success` or `failed`. A leftover `pending` row blocks a retry with `409` so a crash between posting and saving never posts twice. The owner checks the Page and fixes that row by hand.
- **No near-identical price-drop posts.** A boost again after a price drop must wait 3 hours after the last price drop post (`utils/boost-cooldown`). The seller route and the post route both enforce it. The Price Lowered push now says "You can boost it again in 3 hours." Reminder wording ("Still available...") is used for these posts in the Groq prompt, the n8n fallback and the backend template.
- The add-product popup now says it is a free post, not a paid ad.

## Affected files
- Schema and migration: `backend/src/db/schema.ts`, `backend/drizzle/20261031140000_boost_follow_up/migration.sql` (not applied).
- Jobs: `backend/src/jobs/deliver-seller-boost-follow-ups.ts` (new), `boost-webhook-target.ts` (new, shared), `deliver-seller-visibility-boosts.ts`, `run-scheduled.ts`.
- Services: `integrations.visibility-boost.post-claim.ts`, `post-finish.ts`, `follow-up.schedule.ts`, `follow-up.finish.ts` (all new), `facebook-post.ts`, `reduce-price.ts`, `notify-price-lowered.ts`; `seller.visibility-boost.queue.ts`; `utils/boost-cooldown/index.ts` (new); `utils/seller-notifications/messages.ts`.
- Removed: `integrations.fb-logs.ts` (replaced by claim and finish).
- n8n: `n8n/workflows/agrivive-visibility-boost.json` (12 nodes, still inactive).
- Mobile: `mobile/app/(app)/inventory/create.tsx` (popup text).
- Docs: `backend/README.md`, `backend/API_ENDPOINTS.md`.

## Verification
Backend `bunx tsc --noEmit`, `bunx drizzle-kit check`, and both `bun build` commands (to a scratch folder; `dist/` not rebuilt) passed. Mobile `bun run typecheck` passed. Workflow JSON loads and every node reference resolves. Not tested against n8n, Groq, Meta or a device.

## Still open
- A boost that n8n accepts but never posts for stays `sent`; only the follow-up step retries. No notice is sent for it.
- A stuck `pending` row needs a manual look.
- Owner must apply the migration, re-import the workflow, and deactivate the old one.
