---
title: Aging Produce Stock Guard, Instagram Permalink Fix, and Visibility Guide Priority Ordering
date: 2026-10-20
type: delivery
status: verified
related_documents:
  - "[[Marketing Boost]]"
  - "[[05 AHP-TOPSIS Visibility Functional Test Cases]]"
  - "[[2026-10-19 Promotional Posting Price Inclusion in n8n and Social Campaigns]]"
---

# Aging Produce Stock Guard, Instagram Permalink Fix, and Visibility Guide Priority Ordering

## What changed

1. **Instagram Meta Graph API Permalink Resolution**:
   - In `backend/src/modules/integrations/services/integrations.social-publish-instagram.ts`, fixed the media permalink query URL from `${base}/${result.id}?fields=permalink` (which erroneously prepended the user ID `instagramId` in the path) to `${host}/${result.id}?fields=permalink,shortcode`. Added a robust fallback to shortcode permalink `https://www.instagram.com/p/${shortcode}/`.

2. **Social Campaign Re-Posting Guard (Per Listing Stage)**:
   - In `backend/src/modules/seller/services/seller.social-campaign.create.ts` and `seller.social-campaign.publish.ts`, enforced that a listing cannot be posted again if already posted for its current stage. The allowed number of published posts is bound to `1 + priceReductionPeriodsApplied`.
   - When the scheduled 12-hour price reduction occurs (`priceReductionPeriodsApplied` increments), the listing becomes eligible again for a follow-up promotion reflecting the newly discounted price.
   - In `mobile/app/(app)/boost/[productId].tsx`, handled `alreadyPublished: true` by loading the existing campaign details, surfacing live post links, and displaying an informative notice: *"Already posted to Agrivive official pages. This listing can be posted again when the scheduled 12-hour price reduction occurs."*

3. **Aging Produce Batch Warning Guard (Modal 1)**:
   - Created `mobile/src/features/inventory/components/StockFreshnessWarningModal.tsx`: An accessible modal triggered when sellers attempt to add stock to an aging batch ($\ge 12\text{h}$ old, $C_1 = 0.0$, existing stock $> 0$).
   - Presents two clear choices:
     - **"Post as New Fresh Harvest"** (Primary): Navigates to `/inventory/create` with pre-filled vegetable catalog and unit, enabling 100% Freshness and top marketplace ranking.
     - **"Add to Old Batch Anyway"** (Secondary): Continues adding stock to the existing decaying/discounted batch.
   - Added `isAgingBatch` detection and inline warning banner to `mobile/src/features/inventory/components/StockChangeForm.tsx`, with styles modularized into `StockChangeFormStyles.ts` to keep the file under 200 lines.
   - Updated `mobile/app/(app)/inventory/create.tsx` to read search parameters (`catalogId`, `unit`, `name`) and populate initial form values.

4. **Marketplace Visibility Guide Priority Points Ordering**:
   - In `mobile/app/(app)/analytics.tsx`, sorted the listings under **Marketplace Visibility Guide** in descending order of Placement Score ($C_i^*$) so the highest-scoring listings are displayed at the very top.
   - Created `mobile/src/features/analytics/components/VisibilityFactorsGrid.tsx` and refactored `VisibilityBreakdownCard.tsx`, displaying the 4 AHP-TOPSIS criteria strictly ranked from highest weight/points to lowest:
     1. **Freshness / Listing Recency ($C_1$)**: 40% Weight (0.40 max pts)
     2. **Available Stock ($C_2$)**: 30% Weight (0.30 max pts)
     3. **Seller Reliability ($C_3$)**: 20% Weight (0.20 max pts)
     4. **Surplus Recurrence ($C_4$)**: 10% Weight (0.10 max pts)
   - Updated `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts` and `mobile/src/features/analytics/api/seller-visibility.ts` to return and type `sellerReliability` in `inputs` and `criteria`.

5. **General Notifications & Marketing Boost Removal**:
   - In `mobile/app/(app)/notifications.tsx`, completely removed the embedded Priority Boost / Marketing Boost section (`SellerBoostPromptSection` and `SellerPromotionInboxSection`) from the notifications screen.
   - Removed the `"boosts"` / `"Priority Boost"` category filter tab, establishing a clean operational notification center with category chips (`All`, `Orders`, `Messages`, `Trust`, and `Filter Unread`).
   - General notifications (buyer inquiries, order updates, cancellation notices, trust alerts) now render directly beneath the filter bar without promotional distraction.

## Why

- **Meta Graph API Contract**: Instagram container/media object fields (`permalink`, `shortcode`) must be fetched directly at `graph.facebook.com/{version}/{media_id}`, not `{version}/{user_id}/{media_id}`.
- **Spam & Anti-Collision Policy**: Prevents sellers from repeatedly triggering identical social posts for the same batch, while allowing new posts when the 12-hour price deduction alters the promotional value proposition.
- **Produce Freshness Integrity & Error Prevention**: Protects sellers from inadvertently downgrading freshly harvested produce to 0% Freshness by mixing it into yesterday's aging stock.
- **Primacy & Cognitive Clarity**: Ordering the Visibility Guide by highest score and highest-weighted criteria ($C_1 \rightarrow C_2 \rightarrow C_3 \rightarrow C_4$) delivers immediate, intuitive comprehension for sellers.
- **Cognitive Ergonomics & Mental Models (Jakob's Law)**: Notifications represent an activity inbox for operational events (messages, orders, trust); marketing actions remain exclusively in dedicated visibility and boost dashboards.

## Affected paths

- `backend/src/modules/integrations/services/integrations.social-publish-instagram.ts`
- `backend/src/modules/seller/services/seller.social-campaign.create.ts`
- `backend/src/modules/seller/services/seller.social-campaign.publish.ts`
- `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- `mobile/src/features/analytics/api/seller-visibility.ts`
- `mobile/src/features/analytics/components/VisibilityFactorsGrid.tsx`
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
- `mobile/app/(app)/analytics.tsx`
- `mobile/src/features/inventory/components/StockFreshnessWarningModal.tsx`
- `mobile/src/features/inventory/components/StockChangeForm.tsx`
- `mobile/src/features/inventory/components/StockChangeFormStyles.ts`
- `mobile/app/(app)/inventory/create.tsx`
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/app/(app)/notifications.tsx`
- `Agrivive/04 Delivery/2026-10-20 Aging Produce Stock Guard, Instagram Permalink Fix, and Visibility Guide Priority Ordering.md`

## Verification performed

1. **Backend Verification**:
   - `bunx tsc --noEmit` in `backend/`: **0 errors**.
   - `bun build src/index.ts --outdir dist --target bun` in `backend/`: **Build passed (Bundled 1703 modules in 492ms)**.
2. **Mobile Workspace Verification**:
   - `bun run typecheck` (`tsc --noEmit`) in `mobile/`: **0 errors**.
3. **File Length Compliance**:
   - All modified and new source code files strictly maintain $\le 200$ lines.
