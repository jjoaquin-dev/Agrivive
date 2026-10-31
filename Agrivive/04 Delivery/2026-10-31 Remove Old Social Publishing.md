# 2026-10-31 Remove Old Social Publishing

Builds on [[2026-10-31 Boost Screen Uses Same Boost]]. Earlier notes that describe the preview-and-post feature (for example the Boost Visibility screen with Post Now) are superseded.

## What changed and why
The owner wants one Boost flow and one n8n webhook. The app no longer called the old preview-and-post feature, so it was removed.

- **Removed (backend):** `/seller/social-campaigns/*` routes, the `seller.social-campaign.*` services and model, `/integrations/social-campaigns/*` routes, the social-publish context, dispatch, notify and Instagram services, `utils/social-publishing`, `utils/social-promotion-content` (the old Groq helper).
- **Removed (other):** `n8n/workflows/agrivive-social-publishing.json`; the `N8N_SOCIAL_*`, `GROQ_*` and `SOCIAL_INSTAGRAM_USER_ID` settings from `backend/.env.example` and `deploy/backend.production.env.example`.
- **Kept:** `integrations.social-publish-facebook.ts` (the Boost post uses it) and the product photo route `/integrations/media/social-products/:id`.
- **Fixed:** `seller.visibility-boost.read.ts` decided "can this be boosted?" by counting old social campaigns, so new boosts never switched the button off. It now counts boosts in `queued` or `sent` in the current listing cycle (failed, dismissed and prompt rows do not count).
- **Not changed:** the database tables `seller_social_campaigns` and `seller_social_campaign_posts` stay in the schema with their old data. Dropping them needs a migration the owner should approve. The notice kinds `boost_posted` and `boost_failed` stay so old notifications still display.
- Docs: `backend/README.md`, `backend/API_ENDPOINTS.md`.

## Verification
Backend `bunx tsc --noEmit`, `bunx drizzle-kit check` and both `bun build` runs (scratch folder) passed. Mobile typecheck passed. Not tested against n8n or a device.

## Notes for the owner
- Production only needs `N8N_VISIBILITY_BOOST_WEBHOOK_URL` (path `agrivive-visibility-boost`) and `N8N_VISIBILITY_BOOST_SERVICE_TOKEN`. The `N8N_SOCIAL_*`, `GROQ_API_KEY` and `SOCIAL_INSTAGRAM_USER_ID` lines can be deleted from the server env.
- If the first Boost post fails, the seller gets no "Boost Did Not Post" notice any more, because that notice came from the removed feature.
