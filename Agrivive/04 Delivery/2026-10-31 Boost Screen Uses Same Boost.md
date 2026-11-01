# 2026-10-31 Boost Screen Uses Same Boost

Builds on [[2026-10-31 Boost Review Hardening]].

## What changed and why
The owner tapped Boost from the product list and got a title and description preview, but n8n showed no executions. That screen (Boost Visibility) still asked the backend for a draft and only called the old social-publishing workflow after Post Now. It never reached the new Boost workflow. The owner had asked for it to work like the add-product popup.

- `mobile/app/(app)/boost/[productId].tsx` now shows the boost status and a plain list of what will happen, with one **Boost** button. No preview, no channel picker. The button calls `POST /seller/products/:id/boost`, or `POST /seller/boost-prompts/:id/boost` when it was opened from a price-drop prompt.
- `POST /seller/boost-prompts/:id/boost` now also sends the boost to n8n straight away (`seller.visibility-boost.ts`), like the other route.
- Removed from mobile because nothing else used them: `src/features/boost/api/social-campaigns.ts`, `src/features/boost/components/SocialCampaignReview.tsx`. The backend `/seller/social-campaigns/*` routes and `agrivive-social-publishing.json` are left in place.
- Found: `backend/.env` has only the `N8N_SOCIAL_*` settings. `N8N_VISIBILITY_BOOST_WEBHOOK_URL` and `N8N_VISIBILITY_BOOST_SERVICE_TOKEN` were missing, so no boost could reach n8n.

## Verification
Backend `bunx tsc --noEmit` and mobile `bun run typecheck` passed. Not tested on a device or against n8n.
