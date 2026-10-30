# 2026-10-31 n8n Seller Flow Hardening

## What changed and why
The signed seller flow (first Facebook post, 6 hours, price cut, second post) had three public backend routes, a Meta token inside n8n, a price cut that ignored the seller's own settings, and no check on Groq captions. It now follows the same rules as the other n8n flows.

- All three seller-flow routes need `Authorization: Bearer <N8N_SELLER_FLOW_SERVICE_TOKEN>`. The webhook the backend sends on product creation carries the same token and only `{ productId, event }`.
- The price cut uses only the seller's `priceReductionPercent`, never goes below `minimumPrice`, creates the `price_drop` follower event, and cuts once even if n8n retries. Seller percent of 0 means no cut and no second post.
- The backend posts to Facebook (`POST /integrations/products/:id/facebook-post`) and writes `fb_post_logs`. n8n no longer holds the Meta token or page ID. The public `fb-logs` route is removed.
- Every post gets a link to the product page (`WEB_APP_URL/marketplace/<id>` with utm tags). Captions that do not show the current price are replaced by a backend template.
- The workflow no longer loops back to the 6-hour wait: it ends after the second post.

## Affected files
- `backend/src/utils/service-token/index.ts`, `backend/src/utils/marketplace-url/index.ts` (new); `backend/src/utils/promotion-eligibility/index.ts` (now imports `marketplaceUrl`).
- `backend/src/modules/integrations/`: `index/integrations.product-context.ts`, `index/integrations.product-price.ts`, `index/integrations.seller-flow.facebook-post.ts` (new), `model/integrations.seller-flow.ts` (new), `services/integrations.product-context.ts`, `services/integrations.product-price-reduce.ts`, `services/integrations.seller-flow.authorize.ts` (new), `services/integrations.seller-flow.facebook-post.ts` (new); `index/integrations.fb-logs.ts` removed.
- `backend/src/modules/seller/services/seller.product.create.ts`, `seller.product.flow-webhook.ts` (new).
- `backend/src/index.ts`, `backend/.env.example`, `backend/README.md`, `backend/API_ENDPOINTS.md`, `n8n/workflows/agrivive-seller-flow.json`, `backend/dist/*` (rebuilt, tracked).

## Verification
`bunx tsc --noEmit` and both `bun build` commands passed. The workflow JSON was regenerated and checked for no Meta, Groq key, fb-logs or hard-coded host strings. Endpoints and the workflow are **not manually tested**; the owner must test them.

## Notes
- No schema change. `N8N_VISIBILITY_BOOST_WEBHOOK_URL` still has no exported workflow.
- Two simultaneous `facebook-post` calls for the same type are not locked against each other; n8n calls them one at a time.
