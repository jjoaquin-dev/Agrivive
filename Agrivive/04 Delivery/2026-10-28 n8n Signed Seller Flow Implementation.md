# 2026-10-28 n8n Signed Seller Flow Implementation

## Context and Purpose
The capstone manuscript and panel-signed architecture diagram specify an autonomous seller promotion and dynamic pricing lifecycle:
`1st Post to Facebook -> After 6 Hours, Reduce Price by Configured % -> Post Again (Flash Sale)`.

To ensure 100% compliance with the signed paper while keeping database integrity, race-condition safety, and seller minimum price floors intact:
1. Created `fb_post_logs` table in PostgreSQL to track post snapshots (`first_post` and `second_post`).
2. Integrated asynchronous webhook notification on product creation (`createSellerProduct`).
3. Implemented safe percentage (%) price reduction endpoint (`POST /integrations/products/:id/reduce-price`) that checks stock and clamps at the seller's minimum price floor.
4. Implemented Facebook post logging endpoint (`POST /integrations/social/fb-logs`).
5. Created the complete 14-node n8n workflow template (`n8n/workflows/agrivive-seller-flow.json`) powered by the active Groq model (`openai/gpt-oss-20b`).

## Changes Made
- **Database Schema**: Added `fb_post_logs` table in `backend/src/db/schema.ts` and generated Drizzle migration `backend/drizzle/20261028052448_tricky_scrambler/migration.sql`.
- **Product Creation Webhook**: Updated `backend/src/modules/seller/services/seller.product.create.ts` to asynchronously notify `N8N_SELLER_FLOW_WEBHOOK_URL` on product listing creation.
- **Price Reduction Endpoint**: Added `backend/src/modules/integrations/services/integrations.product-price-reduce.ts` and `backend/src/modules/integrations/index/integrations.product-price.ts`.
- **Unified Product Context Endpoint**: Added `backend/src/modules/integrations/services/integrations.product-context.ts` and `backend/src/modules/integrations/index/integrations.product-context.ts` to seamlessly resolve product facts whether a `productId` or `campaignId` is supplied by the incoming webhook.
- **Post Log Endpoint**: Added `backend/src/modules/integrations/services/integrations.fb-logs.ts` and `backend/src/modules/integrations/index/integrations.fb-logs.ts`.
- **Main App Mounting**: Registered new routes in `backend/src/index.ts`.
- **Environment**: Updated `backend/.env` and `backend/.env.example` with `N8N_SELLER_FLOW_WEBHOOK_URL`.
- **n8n Workflow**: Created and refined `n8n/workflows/agrivive-seller-flow.json` with 6-hour recursive lifecycle loop, standard JSON bodies without `JSON.stringify` for n8n Fixed editor compatibility, and resilient Groq fallback chains.
- **Price Floor & Metadata Integrity**: Updated `backend/src/modules/integrations/services/integrations.product-price-reduce.ts` to guarantee complete product metadata even when minimum price floor is reached or when produce is sold out.

## Affected Files
- `backend/src/db/schema.ts`
- `backend/drizzle/20261028052448_tricky_scrambler/migration.sql`
- `backend/src/modules/seller/services/seller.product.create.ts`
- `backend/src/modules/integrations/services/integrations.product-price-reduce.ts`
- `backend/src/modules/integrations/index/integrations.product-price.ts`
- `backend/src/modules/integrations/services/integrations.fb-logs.ts`
- `backend/src/modules/integrations/index/integrations.fb-logs.ts`
- `backend/src/index.ts`
- `backend/.env.example`
- `n8n/workflows/agrivive-seller-flow.json`

## Commits
- Commit: `b75aab2`
- Message: `fix: ensure product details and resilient fallbacks in n8n seller loop`
- Commit: `339ca7d`
- Message: `feat: implement signed n8n seller flow with dynamic price reduction`
- Branch: `development`

## Verification Performed
- `cd backend && bunx tsc --noEmit` passed with 0 errors.
- `cd backend && bun build src/index.ts --outdir dist --target bun` bundled 1823 modules cleanly in 88ms.
- Validated all new files are $\le 200$ lines.
