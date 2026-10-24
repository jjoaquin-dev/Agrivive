---
title: 12-Hour Boost Eligibility Conflict and Notification Revert Bug Fix
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-22 AHP-TOPSIS and 12-Hour Price Reduction Promotion Eligibility Alignment]]"
  - "[[2026-10-25 Notification Mark As Read Bug Fix]]"
  - "[[2026-10-25 Android APK Build and Firebase Push Notification Configuration]]"
---

# 12-Hour Boost Eligibility Conflict and Notification Revert Bug Fix

## What changed

1. **Promotion Eligibility Utility (`backend/src/utils/promotion-eligibility/index.ts`)**:
   - Added `allowActiveListing?: boolean` to `PromotionEligibilityOptions`.
   - Resolved active listing cycle ID dynamically so price changes or quantity updates on a product do not falsely trigger "Listing cycle is no longer current".
   - Maintained candidate lookup fallback against both the active cycle and the campaign's cycle.
   - Preserved eligibility when a listing has scheduled price reduction periods applied (`priceReductionPeriodsApplied >= 1`), `stage === "followup"`, or `allowActiveListing === true`, eliminating false rejection due to freshness decay ($C_1 \to 0$ after $\ge 12$ hours).

2. **Social Campaign Retry and Publishing Services (`backend/src/modules/seller/services/seller.social-campaign.retry.ts`, `backend/src/modules/integrations/services/integrations.social-publish-dispatch.ts`, `integrations.social-publish-context.ts`)**:
   - Passed `{ stage: "followup", allowActiveListing: true }` to `getPriorityPromotionEligibility` during retry and channel dispatch operations.
   - Refreshed `campaign.listingCycleId` to the current cycle ID if updated.
   - Prevented retrying failed channels from being blocked by freshness decay or cycle transitions.

3. **Seller Visibility Boost Read-All Service (`backend/src/modules/seller/services/seller.visibility-boost.prompts.read-all.ts`)**:
   - Removed rigid `status: "prompt"` filter so any unread seller boost records (`isNull(readAt)`) are cleanly marked as read.

4. **Mobile Boost API (`mobile/src/features/boost/api/visibility-boosts.ts`)**:
   - Updated `markAllSellerBoostPromptsRead` with a resilient fallback: if `/seller/boost-prompts/read-all` returns 404 or fails, it fetches unread prompt items and marks each via `/seller/boost-prompts/${id}/read`.

5. **Mobile Unified Notifications Hook (`mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`)**:
   - Added `markedReadIdsRef` set to optimistically track marked-read IDs.
   - Ensured re-fetches from `loadData` do not revert read items to unread status while network requests resolve.

6. **Web Seller APK Download Integration (`web/src/features/home/components/HomeSellerSection.tsx`, `HomeFooter.tsx`)**:
   - Added "Download Seller App (APK)" action button in the homepage seller section.
   - Added direct download link in the footer under the "Get Started" column pointing to `/downloads/agrivive-seller.apk`.

## Why

- **Eliminated 12-Hour Eligibility Deadlock**:
  Prevented aging produce with scheduled price reductions or retrying channels from failing with `"Listing is no longer eligible"`.
- **Eliminated Notification Revert Loop**:
  Prevented notifications from reverting back to 20 unread by providing client-side resilient fallbacks and optimistic state locking alongside server-side read updates.

## Affected paths

- `backend/src/utils/promotion-eligibility/index.ts`
- `backend/src/modules/seller/services/seller.social-campaign.retry.ts`
- `backend/src/modules/integrations/services/integrations.social-publish-dispatch.ts`
- `backend/src/modules/integrations/services/integrations.social-publish-context.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.prompts.read-all.ts`
- `backend/dist/index.js`
- `backend/dist/worker.js`
- `mobile/src/features/boost/api/visibility-boosts.ts`
- `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`
- `web/src/features/home/components/HomeSellerSection.tsx`
- `web/src/features/home/components/HomeFooter.tsx`
- `mobile/app.json`

## Verification performed

1. **TypeScript Verification**:
   - Backend: `bunx tsc --noEmit` — 0 errors.
   - Mobile: `bunx tsc --noEmit` — 0 errors.
   - Web: `bunx tsc --noEmit` — 0 errors.
2. **Build Verification**:
   - Backend: `bun build src/index.ts --outdir dist --target bun` — 1,706 modules bundled.
   - Backend Worker: `bun build src/worker.ts --outdir dist --target bun` — 300 modules bundled.
3. **Expo Doctor**:
   - `npx expo-doctor` — 21/21 checks passed. No issues detected.
4. **Line Count Limits**:
   - All source code files verified $\le 200$ lines.

## Git Commits

- **`1ada73f`**: `fix: 12-hour boost eligibility conflict and notification revert loop`
- **`d52a260`**: `fix(mobile): remove deprecated root splash schema in app.json`
