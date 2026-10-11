---
title: Seller Boost Visibility Social Publishing
type: delivery
date: 2026-10-08
status: implemented-needs-provider-setup
---

# Seller Boost Visibility social publishing

## What changed

- Added a full-width **Boost Visibility** button to each Marketplace Visibility Guide card and a seller review screen with editable copy, account selection, TikTok account choices, explicit TikTok consent, and per-platform publishing status.
- Added seller OAuth linking for Meta Pages/linked Instagram professional accounts, TikTok, and X. Provider tokens and OAuth PKCE verifiers are encrypted at rest; provider tokens never go to the mobile client.
- Added backend draft, final publish, campaign status, n8n callback, token refresh, TikTok status polling, and eligible S3 product-photo routes.
- Added separate n8n workflows for immediate posting and asynchronous TikTok status updates. Both disable success, failure, and manual execution payload retention.
- Kept the existing `visibility-v4 >= 0.70` Priority eligibility rule unchanged; the backend checks it before drafting, again before approval, and again before n8n fetches campaign context.
- Updated API/setup docs and the Marketing Boost product note. Live publishing still requires the generated migration, public HTTPS API, server credentials/encryption key, provider app permissions, n8n credentials, workflow import, and activation.

## Why

The seller should be able to start the flow from the mobile guide, review and edit every post, choose the destination accounts, and explicitly approve publishing. n8n handles posting only; Agrivive remains the source of truth for eligibility, seller ownership, account tokens, and post status.

The primary button is at least 48px high (Fitts's Law, Paul Fitts), and the review/status view keeps the next action and publishing state visible (Visibility of System Status, Jakob Nielsen). TikTok audience choices are fetched for the connected account and are not preselected.

## Affected paths

- Backend: `backend/src/db/schema.ts`; `backend/drizzle/20261007165336_social_publishing/`; `backend/src/index.ts`; `backend/src/modules/seller/index.ts`; `backend/src/modules/seller/index/seller.social-accounts.ts`; `backend/src/modules/seller/index/seller.social-campaigns.ts`; `backend/src/modules/seller/model/seller.social-accounts.ts`; `backend/src/modules/seller/model/seller.social-campaigns.ts`; `backend/src/modules/seller/services/seller.social-accounts.connect.ts`; `backend/src/modules/seller/services/seller.social-accounts.disconnect.ts`; `backend/src/modules/seller/services/seller.social-accounts.list.ts`; `backend/src/modules/seller/services/seller.social-campaign.create.ts`; `backend/src/modules/seller/services/seller.social-campaign.publish.ts`; `backend/src/modules/seller/services/seller.social-campaign.read.ts`; `backend/src/modules/seller/services/seller.social-tiktok-settings.ts`; `backend/src/modules/integrations/index/integrations.social-account-callback.ts`; `backend/src/modules/integrations/index/integrations.social-product-image.ts`; `backend/src/modules/integrations/index/integrations.social-publish.ts`; `backend/src/modules/integrations/services/integrations.social-account-callback.ts`; `backend/src/modules/integrations/services/integrations.social-product-image.ts`; `backend/src/modules/integrations/services/integrations.social-publish-context.ts`; `backend/src/modules/integrations/services/integrations.social-publish-result.ts`; `backend/src/modules/integrations/services/integrations.social-tiktok-pending.ts`; `backend/src/utils/order-types/index.ts`; `backend/src/utils/social-account-token/index.ts`; `backend/src/utils/social-promotion-content/index.ts`; `backend/src/utils/social-token-crypto/index.ts`; `backend/.env.example`; `backend/API_ENDPOINTS.md`; `backend/README.md`.
- Mobile: `mobile/app/(app)/analytics.tsx`; `mobile/app/(app)/_layout.tsx`; `mobile/app/(app)/boost/[productId].tsx`; `mobile/src/api/client.ts`; `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`; `mobile/src/features/boost/api/social-campaigns.ts`; `mobile/src/features/boost/components/SocialCampaignReview.tsx`.
- n8n: `n8n/workflows/agrivive-social-publishing.json`; `n8n/workflows/agrivive-tiktok-status-polling.json`.
- Vault: `Agrivive/03 Intelligence/Marketing Boost.md`; this delivery note.

## Verification

- `bunx tsc --noEmit` in `backend/` — passed.
- `bun build src/index.ts --outdir dist --target bun` — passed; generated tracked bundles were restored after the check.
- `bun build src/worker.ts --outdir dist --target bun` — passed; generated tracked bundles were restored after the check.
- `bunx drizzle-kit check` — passed.
- `bun run typecheck` in `mobile/` — passed.
- Both n8n workflow JSON files and their embedded Code nodes parse successfully.
- Migration SQL and snapshot parse; selected platform column uses the intended snake-case name.
- No migration was applied. No real OAuth, provider API, n8n activation, EAS build, or live-post test was performed because the external credentials/accounts and public HTTPS backend are not configured in this workspace.

## Release setup still required

1. Configure the private backend `.env` using `backend/.env.example` and generate a 32-byte base64 `SOCIAL_TOKEN_ENCRYPTION_KEY`.
2. Rotate any service token previously pasted into chat; use the new distinct token for the n8n social callback credential.
3. Deploy a public HTTPS API and register its three exact callback URLs in Meta, TikTok, and X apps. Complete required app permissions/reviews; TikTok also needs the product-photo domain verified.
4. Import both n8n workflows, set the API hostname and Header Auth credentials, keep execution payload retention disabled, then activate both workflows.
5. Apply the social-publishing migration only to the intended development database, then test with a seller-owned eligible listing and provider test accounts before any public launch.

## Follow-up: social account management UX — 2026-10-08

### What changed and why

- Added one Social Accounts screen for connecting and removing Facebook/Instagram, TikTok, and X accounts. Profile links to it, and sellers can also reach it while setting up or from Boost Visibility.
- Made social setup optional after the seller profile is saved, with a clear way to continue without connecting accounts.
- Boost Visibility now checks for connected accounts before generating a draft. If none are connected, it explains the next step and opens Social Accounts; returning to Boost refreshes the account list.
- This keeps account management in a familiar Profile location (Jakob's Law, Jakob Nielsen), makes account state visible (Recognition Over Recall, Jakob Nielsen and Rolf Molich), and limits the no-account prompt to clear next actions (Hick–Hyman Law, William Edmund Hick and Ray Hyman).

### Affected paths

- `mobile/app/(app)/profile/social-accounts.tsx`
- `mobile/app/(app)/profile/index.tsx`
- `mobile/app/(app)/profile/setup.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/src/features/boost/api/social-campaigns.ts`
- `mobile/src/features/boost/components/SocialCampaignReview.tsx`
- This delivery note.

### Verification

- `bun run typecheck` in `mobile/` — passed.
- `bunx expo export --platform android` — passed. The first attempt hit a sandbox temporary-folder permission error; retrying with a temporary folder in the allowed workspace area completed an Android bundle for 3,693 modules.
- `git diff --check` — passed; Git reported only existing line-ending conversion warnings.
- No device UI or live OAuth test was performed. The pasted backend log reports that `seller_social_accounts` is missing from the connected database; the migration remains unapplied and social-account API behavior is therefore not verified against that database.

## Follow-up: Agrivive official-page publishing — 2026-10-08

### What changed and why

- Replaced seller social-account linking with a channel picker for Agrivive's Facebook Page, linked Instagram Professional account, and X account. TikTok is not offered in this release.
- Sellers preview the listing photo, edit a caption for each selected channel, and confirm one **Post** action. Per-channel results appear in the seller app; retry resubmits failed channels only.
- Added seller endpoints for channel availability and retry. The backend publishes to Meta and X with deployment-only credentials. The n8n webhook receives only the campaign ID, then fetches selected platform names, reviewed captions, and the eligible image URL from protected backend routes; it never receives provider tokens or directly calls a social network.
- Removed seller OAuth/account-linking routes, callback handling, mobile settings screen, and local token-encryption helpers. The migration marks pending legacy account-publishing jobs failed, drops account/OAuth token tables and the campaign account-ID field, and keeps past campaign and post records.
- The public image route continues to serve only the image of a currently eligible Agrivive listing. The rewritten n8n export is inactive and stores no execution payloads by default; any previously imported workflow must be updated or deactivated in the owner's n8n instance.

### Affected paths

- Backend: `backend/src/db/schema.ts`; `backend/drizzle/20261007181343_official_social_pages/migration.sql`; `backend/src/modules/seller/index.ts`; `backend/src/modules/seller/index/seller.social-campaigns.ts`; `backend/src/modules/seller/model/seller.social-campaigns.ts`; `backend/src/modules/seller/services/seller.social-campaign.channels.ts`; `backend/src/modules/seller/services/seller.social-campaign.create.ts`; `backend/src/modules/seller/services/seller.social-campaign.dispatch.ts`; `backend/src/modules/seller/services/seller.social-campaign.publish.ts`; `backend/src/modules/seller/services/seller.social-campaign.read.ts`; `backend/src/modules/seller/services/seller.social-campaign.retry.ts`; `backend/src/modules/integrations/index/integrations.social-publish.ts`; `backend/src/modules/integrations/services/integrations.social-publish-context.ts`; `backend/src/modules/integrations/services/integrations.social-publish-dispatch.ts`; `backend/src/modules/integrations/services/integrations.social-publish-facebook.ts`; `backend/src/modules/integrations/services/integrations.social-publish-instagram.ts`; `backend/src/modules/integrations/services/integrations.social-publish-x.ts`; `backend/src/utils/social-promotion-content/index.ts`; `backend/src/utils/social-publishing/index.ts`; `backend/.env.example`; `backend/API_ENDPOINTS.md`; `backend/README.md`.
- Mobile: `mobile/app/(app)/_layout.tsx`; `mobile/app/(app)/profile/index.tsx`; `mobile/app/(app)/profile/setup.tsx`; `mobile/app/(app)/boost/[productId].tsx`; `mobile/src/features/boost/api/social-campaigns.ts`; `mobile/src/features/boost/components/SocialCampaignReview.tsx`; removed `mobile/app/(app)/profile/social-accounts.tsx`.
- n8n and vault: `n8n/workflows/agrivive-social-publishing.json`; `Agrivive/03 Intelligence/Marketing Boost.md`; this delivery note.

### Verification

- Backend type-check, API bundle, worker bundle, Drizzle consistency check, mobile type-check, n8n workflow JSON/embedded Code parsing, and `git diff --check`: **passed**.
- Android export: passed with a workspace-local temporary folder and Hermes bytecode disabled for the check (3,692 modules bundled). The default attempt could not write to the sandbox-managed temporary path.
- Generated backend bundles were restored after build verification. The migration was not applied to any database.
- No live Meta/X API posting, n8n import/activation, device UI test, provider permission review, or HTTPS deployment test was performed.

### Owner acceptance still required

1. Set up backend-only Facebook Page ID/access token, linked Instagram Professional account ID, X OAuth 1.0a write credentials, public HTTPS API origin, Groq, and n8n webhook/service credentials using the placeholder names in `backend/.env.example`.
2. Import the new n8n export, set the deployed backend host and Header Auth credentials, and activate it only after an approved test-channel check. Deactivate any previously imported social or TikTok publishing workflow; this repository cannot change the live n8n instance.
3. Apply all pending migrations to the intended test database in timestamp order. If the social-campaign migration is pending, apply `20261007165336_social_publishing` before `20261007181343_official_social_pages`. Then manually check configured/unconfigured channels, selected-platform publishing, mixed success/failure, failed-only retry, and unavailable listings.
4. Revoke old seller-account app grants where appropriate. Rotate any real service token previously exposed in a screenshot or chat. The current `N8N_SOCIAL_SERVICE_TOKEN` is used only for the backend-to-n8n service link.

Live provider acceptance remains **unverified** until the owner completes these steps.

## Follow-up: Facebook provider diagnostics — 2026-10-08

### What changed and why

- Updated the Facebook Page photo publisher to log the Graph API response status and safe error fields (`type`, `code`, `subcode`, and `message`) when Meta rejects a post. Access tokens and request bodies remain excluded from logs.
- This preserves the generic user-facing failure message while exposing the provider reason needed to distinguish missing Page publishing permission from an inaccessible public image URL.

### Affected paths

- `backend/src/modules/integrations/services/integrations.social-publish-facebook.ts`
- This delivery note.

### Verification

- Backend `bunx tsc --noEmit` — passed.
- `bun build src/index.ts --outdir dist-verify-facebook-diagnostics --target bun` — passed; the temporary verification output was removed afterward.
- `git diff --check` — passed; existing line-ending conversion warnings were unchanged.
- No live Facebook publish was sent by this change.

## Follow-up: public social image route — 2026-10-08

### What changed and why

- Corrected the Elysia route prefix for the public social product image endpoint. The publisher generated `/integrations/media/social-products/:id`, while the route was registered at `/media/social-products/:id`, causing Facebook to receive a 404 and report `Missing or invalid image file`.
- The route now matches the existing image URL builders and the documented integration endpoint.

### Affected paths

- `backend/src/modules/integrations/index/integrations.social-product-image.ts`
- This delivery note.

### Verification

- Backend `bunx tsc --noEmit` — passed.
- `bun build src/index.ts --outdir dist-verify-social-image-route --target bun` — passed; the temporary verification output was removed afterward.
- Route and URL-builder references were checked for the `/integrations/media/social-products` prefix.
- `git diff --check` — passed after the route edit.
- No live Facebook publish was sent by this change.

## Follow-up: Facebook network diagnostics — 2026-10-08

### What changed and why

- Wrapped the Facebook Graph API request in safe network-error logging. This captures request-level failures such as DNS, TLS, connection reset, or timeout errors when no HTTP response exists for the response diagnostics to inspect.
- The log excludes access tokens, captions, and image URLs; the user-facing error remains unchanged.

### Affected paths

- `backend/src/modules/integrations/services/integrations.social-publish-facebook.ts`
- This delivery note.

### Verification

- Backend `bunx tsc --noEmit` — passed.
- `bun build src/index.ts --outdir dist-verify-facebook-network --target bun` — passed; the temporary verification output was removed afterward.
- `git diff --check` — passed after the follow-up edit.
- No live Facebook publish was sent by this change.
