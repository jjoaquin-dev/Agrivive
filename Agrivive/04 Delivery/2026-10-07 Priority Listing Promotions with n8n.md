---
title: Priority Listing Promotions with n8n
date: 2026-10-07
type: delivery
status: implemented-awaiting-owner-acceptance
---

# Priority Listing Promotions with n8n

## Goal

Prepare seller-reviewed share drafts for eligible Priority Boost listings, using the paper's AHP–TOPSIS Visibility Engine. The backend owns the comparison population, eligibility, ranking, price calculation, and timing; n8n prepares copy only.

## What changed

- Added durable promotion jobs keyed by listing cycle and stage, with historical-cycle backfill to prevent rollout alerts.
- Added hourly eligibility checks, protected n8n context/draft/failure callbacks, and bounded webhook retries.
- Added a single six-hour follow-up eligibility check after the initial draft is ready.
- Added seller-scoped draft list/read/read-all/share endpoints. Share details are rebuilt from current listing data and return unavailable when the listing no longer qualifies.
- Added a seller Priority Boost inbox section with individual/all read actions and the native share sheet. Existing order/trust notification pagination remains separate.
- Added a credential-free n8n workflow export and secret-free configuration guidance.
- Recorded D-06's seller-review/native-share decision. Figure 5 now supplies the accepted AHP–TOPSIS matrix, weights, formulas, and `0.60` Priority Boost threshold.

## Why

Promotion eligibility and current listing facts must remain under backend control. n8n and the text model prepare wording only; sellers explicitly choose whether to share. Historical listing cycles are not promoted retroactively, and the six-hour follow-up is limited to one per cycle.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/drizzle/20261007082243_seller_priority_promotions/migration.sql`
- `backend/drizzle/20261007082243_seller_priority_promotions/snapshot.json`
- `backend/src/jobs/check-seller-promotion-eligibility.ts`
- `backend/src/jobs/deliver-seller-promotion-webhooks.ts`
- `backend/src/jobs/run-scheduled.ts`
- `backend/src/modules/integrations/index.ts`
- `backend/src/modules/integrations/index/integrations.promotion.context.ts`
- `backend/src/modules/integrations/index/integrations.promotion.draft.ts`
- `backend/src/modules/integrations/index/integrations.promotion.failure.ts`
- `backend/src/modules/integrations/model/integrations.promotion.ts`
- `backend/src/modules/integrations/services/integrations.promotion.authorize.ts`
- `backend/src/modules/integrations/services/integrations.promotion.context.ts`
- `backend/src/modules/integrations/services/integrations.promotion.draft.ts`
- `backend/src/modules/integrations/services/integrations.promotion.failure.ts`
- `backend/src/modules/seller/index.ts`
- `backend/src/modules/seller/index/seller.promotions.ts`
- `backend/src/modules/seller/model/seller.promotions.ts`
- `backend/src/modules/seller/services/seller.promotions.list.ts`
- `backend/src/modules/seller/services/seller.promotion.read.ts`
- `backend/src/modules/seller/services/seller.promotions.read-all.ts`
- `backend/src/modules/seller/services/seller.promotion.share.ts`
- `backend/src/utils/promotion-eligibility/index.ts`
- `backend/src/utils/visibility-ranking/index.ts`
- `backend/src/utils/visibility-ranking/load.ts`
- `backend/src/modules/seller/services/seller.product.price-reduction.followup.ts`
- `backend/drizzle/20261016120000_ahptopsis_promotion_history/migration.sql`
- `backend/src/index.ts`
- `backend/.env.example`
- `backend/API_ENDPOINTS.md`
- `backend/README.md`
- `mobile/app/(app)/notifications.tsx`
- `mobile/src/features/notifications/api/seller-promotions.ts`
- `mobile/src/features/notifications/components/SellerNotificationCard.tsx`
- `mobile/src/features/notifications/components/SellerPromotionInboxSection.tsx`
- `mobile/src/features/notifications/hooks/useSellerPromotions.ts`
- `mobile/src/features/notifications/types.ts`
- `n8n/workflows/agrivive-priority-promotion.json`
- `Agrivive/03 Intelligence/Marketing Boost.md`
- `Agrivive/04 Delivery/Open Decisions.md`

## API summary

Protected n8n callbacks use `Authorization: Bearer <N8N_PROMOTION_SERVICE_TOKEN>`:

```text
GET  /integrations/promotions/jobs/:id/context
POST /integrations/promotions/jobs/:id/draft       {"headline":"...","caption":"..."}
POST /integrations/promotions/jobs/:id/failure     {"code":"invalid_draft"}
```

Seller APIs use the existing authenticated seller session:

```text
GET  /seller/promotions?limit=20&cursor=<uuid>
POST /seller/promotions/:id/read
POST /seller/promotions/read-all
GET  /seller/promotions/:id/share
```

## Verification

- Backend `bunx tsc --noEmit`: passed on 2026-10-07.
- Backend API bundle `bun build src/index.ts --outdir dist --target bun`: passed on 2026-10-07 when run by itself. An initial parallel build hit a Windows `EUNKNOWN` output-write error; the standalone rerun succeeded.
- Backend worker bundle `bun build src/worker.ts --outdir dist --target bun`: passed on 2026-10-07.
- `bunx drizzle-kit check`: passed on 2026-10-07.
- Mobile `bun run typecheck`: passed on 2026-10-07.
- Android `bunx expo export --platform android`: passed on 2026-10-07. The first attempt could not write Hermes bytecode to the sandbox's AppData temp directory; retrying with temporary files inside the workspace succeeded. The task-specific temporary export folders were removed afterward.
- Workflow JSON parsed successfully; n8n credentials and an n8n instance were not available for import/execution verification.
- Figure 5 acceptance values are now the required ranking check: Listing A=`0.853` (Priority Boost), B=`0.402` (Standard Exposure), and C=`0.372` (Basic/Hold). The AHP consistency ratio must remain below `0.10`; this local check is separate from a database-backed promotion job.
- No migration has been applied to a database.
- No owner-run API or on-device acceptance is recorded as complete.

## Owner acceptance still required

- Configure `N8N_PROMOTION_WEBHOOK_URL` and a strong shared token in backend server configuration.
- Import the workflow, attach the n8n backend and Groq credentials, replace the backend URL, and select a Groq model enabled for the account.
- Apply the migration only to a disposable or specifically approved test database.
- Verify Figure 5 samples A=`0.853`, B=`0.402`, and C=`0.372`; verify below/at/above `0.60`, initial waiting behavior, ineligible listings, initial draft, one six-hour follow-up with backend price-floor handling, duplicate delivery/callback, bounded recovery, read isolation, current share facts, and unavailable share behavior.
- Confirm the native share sheet opens and cancellation does not publish content.
- Owner acceptance still requires applying the new migration to an approved test database, configuring n8n/Groq, and manually exercising the initial and follow-up callbacks. Direct automated social posting remains subject to owner configuration and platform permissions.

The exported workflow defaults to Groq model ID `openai/gpt-oss-20b` for JSON-mode draft generation; change it to another model only if that model is available to the configured Groq account and supports the required JSON response mode. No Groq key is stored in the workflow export.

## Commit

No commit created.
