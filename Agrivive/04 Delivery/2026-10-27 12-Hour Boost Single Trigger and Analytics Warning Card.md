# 2026-10-27 12-Hour Boost Single Trigger Flow and Analytics Discount Warning Card

## Date
2026-10-27

## What Changed
1. **Unified Boost Posting Flow (Removed Duplicate Buttons)**:
   - Eliminated the redundant "Boost this listing" button on `mobile/app/(app)/boost/[productId].tsx`.
   - The boost screen now functions as a single **Post Preview Screen** with only **one primary action button**:
     - Initial Post: `"Post to Agrivive Pages"`.
     - 12-Hour Price Drop Post: `"Post at Discounted Price (₱XX.XX)"`.
   - Pressing the button publishes the generated post draft directly to selected social channels (Facebook, Instagram, X) and accepts the notification prompt atomically.
2. **AI Discounted Price Copy Generation & Fallbacks**:
   - Updated `backend/src/utils/social-promotion-content/index.ts` to receive `basePrice` and generate price-drop promotional copy specifically highlighting the discounted surplus deal.
   - Added robust offline/timeout fallback template so sellers are never blocked even during third-party LLM rate limits or network issues.
   - Passed `basePrice` in `backend/src/modules/seller/services/seller.social-campaign.create.ts`.
3. **Analytics Discounted Produce Warning Indicator**:
   - In `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`: Added warning border (`borderColor: colors.warning` `#D97706`, `borderWidth: 1.5`, background tint `#FFFDF9`), warning banner (`"12-Hour Price Drop Active • Discounted Surplus"`), strikethrough original price $\to$ discounted price display, and dynamic button text (`"Boost Discounted Deal"`).
   - In `mobile/src/features/analytics/components/AnalyticsProductPerformance.tsx`: Added warning border, warning chip (`12h Drop`), and price comparison ($\text{₱}[\text{Base Price}] \to \text{₱}[\text{Discounted Price}]$) for produce items with active price drops.
   - In `mobile/app/(app)/analytics.tsx`: Passed the resolved `product` to `VisibilityBreakdownCard`.

## Why
1. Having two competing action buttons ("Boost this listing" vs "Post") on the same screen created cognitive overload and confusing UX. A unified single-button flow ensures the seller previews the post details (including new price and AI copy) and triggers the post with one clear action.
2. Produce undergoing the 12-hour price reduction rule must be visibly distinct on the seller's analytics dashboard to alert them of expiring or discounted inventory requiring promotional acceleration.

## Affected Files
- `backend/src/utils/social-promotion-content/index.ts`
- `backend/src/modules/seller/services/seller.social-campaign.create.ts`
- `mobile/src/features/boost/components/SocialCampaignReview.tsx`
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
- `mobile/src/features/analytics/components/AnalyticsProductPerformance.tsx`
- `mobile/app/(app)/analytics.tsx`

## Verification
- `bunx tsc --noEmit` on backend: 0 errors.
- `bun build src/index.ts --outdir dist --target bun`: Bundled 1820 modules successfully.
- `bunx tsc --noEmit` on mobile: 0 errors.
- Line counts verified on all modified files ($\le 200$ lines each).

## Git Commit
- **Implementation Commit:** `525edaad2082ee9888752401c7859464bdee9e3b`
- **Documentation Commit:** `7ff03e7`
- **Message:** `docs: add delivery note for single boost trigger and analytics warning card`
