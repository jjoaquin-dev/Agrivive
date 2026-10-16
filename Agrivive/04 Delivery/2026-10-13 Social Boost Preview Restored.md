# Social Boost Preview Restored

Date: 2026-10-13

## What changed

Restored the seller Boost Visibility social-post preview flow that had been replaced by the visibility-status-only screen. The screen now keeps both flows together:

- product preview with the product name as the title;
- generated description text and per-channel description editing;
- Facebook, Instagram, and X channel selection;
- publish confirmation, per-channel publishing status, and retry for failed channels;
- existing visibility boost status card and boost history link;
- marketplace link on the preview image, title, and visible marketplace link action;
- marketplace URL included in generated social post text while respecting each channel limit.

## Why

The status/history feature was needed, but it must supplement the social preview rather than remove the seller's ability to choose channels and edit the post before publishing. The product link gives sellers and buyers a direct path from the preview or social caption to the marketplace listing.

## Affected files

- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/src/features/boost/components/SocialCampaignReview.tsx`
- `mobile/src/features/boost/api/social-campaigns.ts`
- `backend/src/modules/seller/services/seller.social-campaign.create.ts`
- `backend/src/modules/seller/services/seller.social-campaign.read.ts`
- `backend/src/utils/social-promotion-content/index.ts`
- `backend/dist/index.js` (generated production build output)

The existing visibility boost status/history routes and database tables were not changed. No database migration is required.

## Verification

- `mobile`: `bun run typecheck` passed.
- `backend`: `bunx tsc --noEmit` passed.
- `backend`: `bun build src/index.ts --outdir dist --target bun` passed.
- The restored mobile screen remains under the repository's 200-line source-file guideline.

## Mobile status follow-up

Date: 2026-10-13

The publishing result now refreshes safely while a campaign is queued, publishing, or processing. Status-refresh failures are no longer silently discarded, and the result card identifies the specific failed channels before showing the retry action. The campaign response status is typed as the known social-campaign status values instead of an unrestricted string.

Affected files:

- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/src/features/boost/api/social-campaigns.ts`

Verification:

- `mobile`: `bun run typecheck` passed.
- No backend or n8n files were changed for this mobile follow-up.

## New-product posting review

Date: 2026-10-13

The Add Product flow now sends a marketable, in-stock new listing to the existing Boost Visibility review screen when the seller chooses “Boost now.” The seller can select the target platform, edit the generated post, review the marketplace link, and submit through the same campaign workflow. The old behavior that queued a visibility webhook immediately from the alert was removed from this path, preventing an unreviewed duplicate post. “Not now” still returns to the product-listed confirmation.

Affected files:

- `mobile/app/(app)/inventory/create.tsx`
- `mobile/app/(app)/boost/[productId].tsx`

Verification:

- `mobile`: `bun run typecheck` passed.
- `git diff --check` passed.

## Commit

No commit created yet.
