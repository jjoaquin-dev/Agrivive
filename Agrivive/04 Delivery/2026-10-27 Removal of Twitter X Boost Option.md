# Removal of Twitter (X) Boost Option from Listing Promotions

**Date:** 2026-10-27  
**Type:** Feature Modification / Cleanup  
**Scope:** Backend (`backend/src/utils/`, `backend/src/modules/`), Mobile (`mobile/src/features/boost/api/`)

---

## 1. Context & User Request
The user requested:
> "Remove TWITTER(X) OPTION IN OUR system boost listing"

## 2. What Changed

### Backend Channel Configuration & Content Generation
1. **[`backend/src/utils/social-publishing/index.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/utils/social-publishing/index.ts)**:
   - Removed the `x` channel object from `getSocialChannelAvailability()`.
   - The channels endpoint `GET /seller/social-campaigns/channels` now only offers official Agrivive channels for **Facebook** and **Instagram**.

2. **[`backend/src/utils/social-promotion-content/index.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/utils/social-promotion-content/index.ts)**:
   - Narrowed `SocialPublishPlatform` to `"facebook" | "instagram"`.
   - Removed `x: 280` character limit and `x` fallback post generation.
   - Updated AI post generation prompt to request only JSON with `facebook` and `instagram` promotional text.

3. **[`backend/src/modules/seller/model/seller.social-campaigns.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/seller/model/seller.social-campaigns.ts)**:
   - Updated `sellerSocialCampaignPlatform` union to only allow `facebook` and `instagram`.
   - Updated `sellerSocialCampaignPublishBody` maxItems to `2`.

4. **[`backend/src/modules/integrations/index/integrations.social-publish.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/integrations/index/integrations.social-publish.ts)**:
   - Removed `x` from the `publishParams` route validation.

5. **[`backend/src/modules/integrations/services/integrations.social-publish-dispatch.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/integrations/services/integrations.social-publish-dispatch.ts)**:
   - Removed `publishXPost` invocation and import.
   - Updated `SupportedPlatform` to `"facebook" | "instagram"`.

6. **Deleted Obsolete Integration Helper**:
   - Removed `backend/src/modules/integrations/services/integrations.social-publish-x.ts`.

7. **[`backend/.env.example`](file:///home/jarajoaquinjara/projects/Agrivive/backend/.env.example)**:
   - Removed obsolete `SOCIAL_X_*` environment variable placeholders.

### Mobile Application
1. **[`mobile/src/features/boost/api/social-campaigns.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/boost/api/social-campaigns.ts)**:
   - Updated active `SocialPlatform` to `"facebook" | "instagram"`.
   - Retained `"x"` in `HistoricalSocialPlatform` so any past campaign history renders safely.

---

## 3. Affected Files
- `backend/src/utils/social-publishing/index.ts`
- `backend/src/utils/social-promotion-content/index.ts`
- `backend/src/modules/seller/model/seller.social-campaigns.ts`
- `backend/src/modules/integrations/index/integrations.social-publish.ts`
- `backend/src/modules/integrations/services/integrations.social-publish-dispatch.ts`
- `backend/src/modules/integrations/services/integrations.social-publish-x.ts` (deleted)
- `backend/.env.example`
- `mobile/src/features/boost/api/social-campaigns.ts`

---

## 4. Verification Performed
- Backend TypeScript: `cd backend && bunx tsc --noEmit` passed with 0 errors.
- Backend Build: `cd backend && bun build src/index.ts --outdir dist --target bun` passed (1819 modules bundled).
- Mobile TypeScript: `cd mobile && bunx tsc --noEmit` passed with 0 errors.
- Mobile Expo Doctor: `cd mobile && npx -y expo-doctor` passed 21/21 checks.
- All files strictly adhere to the $\le 200$ line limit.
