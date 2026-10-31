# 2026-10-31 Boost Popup Uses Boost Visibility Screen

Supersedes [[2026-10-31 Boost Popup and Confirmed Boost Workflow]] and [[2026-10-31 n8n Seller Flow Hardening]]. Both described a separate posting path that was removed the same day.

## What changed and why
The owner wants the Boost choice after adding a product to behave like the Marketplace Visibility Guide: the seller sees a preview of the title and description, confirms, and the workflow gets only an ID and fetches the content from the backend. That flow already exists (`mobile/app/(app)/boost/[productId].tsx`, `/seller/social-campaigns/*`, `n8n/workflows/agrivive-social-publishing.json`), so the popup now opens it instead of using its own path.

- **Mobile:** `mobile/app/(app)/inventory/create.tsx` shows `Boost "<name>"?` after a product is listed. **Boost** opens the Boost Visibility screen for the new product. **Not now** opens the product. Products not for sale skip the question. The text says nothing is posted until the seller taps Post Now, and mentions the 12-hour price drop when one is set.
- **Backend:** removed the automatic n8n call on product creation, and the three public routes from the 2026-10-28 seller flow (`/integrations/products/:id/context`, `/integrations/products/:id/reduce-price`, `/integrations/social/fb-logs`) with their services. The `fb_post_logs` table stays in the schema.
- **n8n:** removed `n8n/workflows/agrivive-seller-flow.json` (its backend was removed). Posting uses `agrivive-social-publishing.json`, unchanged.
- The visibility-boost queue (`/seller/products/:id/boost`, `N8N_VISIBILITY_BOOST_*`) is untouched and still has no workflow export.

## Affected files
`mobile/app/(app)/inventory/create.tsx`, `backend/src/modules/seller/services/seller.product.create.ts`, `backend/src/index.ts`, `backend/.env.example`, `backend/src/modules/integrations/` (three routes and two services removed), `backend/dist/*`, `n8n/workflows/agrivive-seller-flow.json` (removed).

## Verification
Backend `bunx tsc --noEmit` and both builds passed; mobile `bun run typecheck` passed. Not tested on a device or against n8n/Meta.

## Notes
- The first Boost per listing cycle is allowed; another needs a 12-hour price drop.
- Commit `9b69cea` contains the superseded work. This note's changes are uncommitted.
