# 2026-10-31 Boost Popup and Confirmed Boost Workflow

Supersedes [[2026-10-31 n8n Seller Flow Hardening]], whose automatic flow was replaced the same day.

## What changed and why
The owner wants: seller adds a product, a popup says what will happen with **Boost** or **Not now**, and nothing is posted unless the seller taps Boost. The app already had a seller-confirmed Boost (`POST /seller/products/:id/boost`, prompts, 12-hour price-drop job), so the new popup uses it and the earlier automatic webhook-on-create flow was removed.

- **Mobile:** `mobile/app/(app)/inventory/create.tsx` shows a native alert after a product is listed. It explains the post and the link. If a price drop is set, it also explains the 12-hour drop and the next Boost question. **Boost** calls `requestSellerVisibilityBoost`; **Not now** opens the product. Products that are not for sale skip the question.
- **Backend:** removed the automatic n8n call on product creation and the three seller-flow routes (`/integrations/products/:id/context|reduce-price`, `/integrations/social/fb-logs`), which were public. Added `POST /integrations/visibility-boosts/:id/facebook-post` (Bearer `N8N_VISIBILITY_BOOST_SERVICE_TOKEN`): rechecks the boost and listing, posts with the backend's Meta credentials, logs to `fb_post_logs`, adds the product page link, and replaces captions that do not show the current price. A repeated delivery does not post twice (log row posted after the boost was created). The context route now also returns `previousPrice`.
- **n8n:** `n8n/workflows/agrivive-seller-flow.json` replaced by `agrivive-visibility-boost.json` (webhook, context, Groq caption, format, backend post). No Meta token, no price cut (the 12-hour job and seller prompt own that).
- New utils: `utils/service-token`, `utils/marketplace-url` (moved from `promotion-eligibility`).

## Affected files
`backend/src/modules/integrations/` (visibility-boost route, model, context and facebook-post services; product-context, product-price and fb-logs routes removed), `backend/src/modules/seller/services/seller.product.create.ts`, `backend/src/index.ts`, `backend/src/utils/{service-token,marketplace-url,promotion-eligibility}`, `backend/.env.example`, `backend/README.md`, `backend/API_ENDPOINTS.md`, `backend/dist/*`, `n8n/workflows/agrivive-visibility-boost.json`, `mobile/app/(app)/inventory/create.tsx`.

## Verification
Backend `bunx tsc --noEmit` and both builds passed; mobile `bun run typecheck` passed. Not tested on a device or against n8n/Meta; the owner tests manually.

## Notes
- No schema change. Two simultaneous posts for one boost are not locked against each other.
- The signed diagram says 6 hours; the existing price job uses 12-hour periods. Unchanged.
