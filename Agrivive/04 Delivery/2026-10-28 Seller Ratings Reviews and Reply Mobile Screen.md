# 2026-10-28 Seller Ratings Reviews and Reply Mobile Screen

## Context & Objectives
Empower sellers in the mobile app to view their overall rating score, star breakdown distribution, and verified buyer reviews/feedback, as well as directly submit a reply to buyer reviews from the mobile interface.

## Why
1. Previously, sellers could only view and reply to an individual review by navigating into an individual order's detail screen (`/(app)/orders/[id]`). There was no central hub where a seller could inspect their overall reputation, see aggregate star distributions, or see pending/unanswered reviews waiting for response.
2. In accordance with **Visibility of System Status** (*Jakob Nielsen*) and **Recognition Over Recall** (*Jakob Nielsen & Rolf Molich*), sellers need a clear overview of buyer sentiment across their orders with contextual produce tags and instant reply capabilities.
3. Adheres to **Hick-Hyman Law** (*William Edmund Hick & Ray Hyman*) and **Miller's Law** (*George A. Miller*) by providing chunked rating summaries and dedicated filter tabs ("All", "Needs Reply" with count badge, "Replied", and star filters).

## What Changed
1. **Backend Service & Route Additions**:
   - [`backend/src/modules/seller/services/seller.reviews.list.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/seller/services/seller.reviews.list.ts): Implemented `readSellerReviewsList` providing rating summary statistics (average, total count, 5-star to 1-star counts, unanswered count) and paginated buyer reviews with joined produce names from `ordered_items`.
   - [`backend/src/modules/seller/services/seller.review.reply.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/seller/services/seller.review.reply.ts): Implemented `respondSellerReviewById` allowing sellers to submit a reply by review ID.
   - [`backend/src/modules/seller/model/seller.order.review.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/seller/model/seller.order.review.ts): Added `sellerReviewsQuery` schema.
   - [`backend/src/modules/seller/index/seller.order.review.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/seller/index/seller.order.review.ts): Mounted `GET /seller/reviews` and `POST /seller/reviews/:id/reply`.
2. **Mobile Reviews Feature & Components**:
   - [`mobile/src/features/reviews/types.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/types.ts): Defined `ReviewItem`, `ReviewsSummary`, `SellerReviewsResponse`, and `ReviewFilter`.
   - [`mobile/src/features/reviews/api/seller-reviews.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/api/seller-reviews.ts): Added API client methods `fetchSellerReviewsList` and `replyToReview`.
   - [`mobile/src/features/reviews/hooks/useSellerReviews.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/hooks/useSellerReviews.ts): Encapsulated state management, filtering, and reply submission.
   - [`mobile/src/features/reviews/components/RatingSummaryCard.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/components/RatingSummaryCard.tsx): Displays average score, star icons, review count, and distribution progress bars.
   - [`mobile/src/features/reviews/components/ReviewFilterTabs.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/components/ReviewFilterTabs.tsx): Segmented tabs for "All", "Needs Reply" (with badge), and "Replied", plus star filter pills.
   - [`mobile/src/features/reviews/components/ReviewCard.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/components/ReviewCard.tsx) & [`ReviewReplyComposer.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/components/ReviewReplyComposer.tsx): Review display with verified buyer badge, produce tags, review comment, existing seller reply, or interactive reply composer with character limit and submission state.
   - [`mobile/src/features/reviews/components/review-card.styles.ts`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/reviews/components/review-card.styles.ts): Modularized styling ensuring all files remain $\le 200$ lines.
3. **Screen & Navigation Integration**:
   - [`mobile/app/(app)/reviews.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/reviews.tsx): Created full Reviews screen with pull-to-refresh and empty states.
   - [`mobile/app/(app)/_layout.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/_layout.tsx): Registered `reviews` screen with title `"Ratings & Reviews"`.
   - [`mobile/src/features/profile/components/ProfileSettingsList.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/profile/components/ProfileSettingsList.tsx) & [`mobile/app/(app)/profile/index.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(app)/profile/index.tsx): Added `"Ratings & Reviews"` navigation option with Star icon.

## Affected Files
- `backend/src/modules/seller/services/seller.reviews.list.ts`
- `backend/src/modules/seller/services/seller.review.reply.ts`
- `backend/src/modules/seller/model/seller.order.review.ts`
- `backend/src/modules/seller/index/seller.order.review.ts`
- `mobile/src/features/reviews/types.ts`
- `mobile/src/features/reviews/api/seller-reviews.ts`
- `mobile/src/features/reviews/hooks/useSellerReviews.ts`
- `mobile/src/features/reviews/components/RatingSummaryCard.tsx`
- `mobile/src/features/reviews/components/ReviewFilterTabs.tsx`
- `mobile/src/features/reviews/components/ReviewReplyComposer.tsx`
- `mobile/src/features/reviews/components/ReviewCard.tsx`
- `mobile/src/features/reviews/components/review-card.styles.ts`
- `mobile/app/(app)/reviews.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/src/features/profile/components/ProfileSettingsList.tsx`
- `mobile/app/(app)/profile/index.tsx`

## Verification Performed
- Executed `bunx tsc --noEmit` in `backend/` — passed with 0 errors.
- Executed `bun build src/index.ts --outdir dist --target bun` in `backend/` — built cleanly in 83ms.
- Executed `bunx tsc --noEmit` in `mobile/` — passed with 0 errors.
- Verified line count of all 13 modified and newly created files: all files strictly $\le 185$ lines ($\le 200$ line guideline).

## Commit Reference
- Commit: `e94f28b` — `add rating viewer`
- Commit: `c00901a` — `add proxy logs`

