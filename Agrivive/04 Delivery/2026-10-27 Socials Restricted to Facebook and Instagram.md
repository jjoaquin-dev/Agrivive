# Socials Restricted to Facebook and Instagram

**Date:** 2026-10-27  
**Type:** Feature / Configuration Cleanup  
**Scope:** Mobile (`mobile/app/(app)/boost/`, `mobile/src/features/boost/`), Backend (`backend/src/modules/integrations/`, `backend/API_ENDPOINTS.md`, `backend/README.md`)

---

## 1. Context & User Request
The user requested:
> "remove X in our SOCIALS we only post in FACEBOOK AND INSTAGRAM"

## 2. What Changed

1. **Mobile Platform Labels ([`mobile/app/(app)/boost/[productId].tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/boost/[productId].tsx))**:
   - Cleaned up `platformLabel` dictionary to only contain `facebook: "Facebook"` and `instagram: "Instagram"`.
   - Removed `x: "X"` and `tiktok: "TikTok"` entirely.
2. **Mobile Social Types ([`mobile/src/features/boost/api/social-campaigns.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/boost/api/social-campaigns.ts))**:
   - Simplified `HistoricalSocialPlatform` to strictly match `SocialPlatform` (`"facebook" | "instagram"`), eliminating `"x"`.
3. **Backend Integration Context Target Filtering ([`backend/src/modules/integrations/services/integrations.social-publish-context.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/integrations/services/integrations.social-publish-context.ts))**:
   - Filtered active publication targets strictly to `post.platform === "facebook" || post.platform === "instagram"`.
   - Permitted `isDev` environments when checking `apiBase`.
4. **Backend Documentation Updates**:
   - Updated [`backend/API_ENDPOINTS.md`](file:///home/jarajoaquinjara/projects/Agrivive/backend/API_ENDPOINTS.md) and [`backend/README.md`](file:///home/jarajoaquinjara/projects/Agrivive/backend/README.md) to document that social posting is restricted strictly to official Facebook and Instagram channels.

---

## 3. Affected Files
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/src/features/boost/api/social-campaigns.ts`
- `backend/src/modules/integrations/services/integrations.social-publish-context.ts`
- `backend/API_ENDPOINTS.md`
- `backend/README.md`

---

## 4. Verification Performed
- `cd mobile && bunx tsc --noEmit`: 0 errors.
- `cd mobile && npx -y expo-doctor`: 21/21 checks passed.
- `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun`: 0 errors.
- All code files strictly adhere to the $\le 200$ line limit.
