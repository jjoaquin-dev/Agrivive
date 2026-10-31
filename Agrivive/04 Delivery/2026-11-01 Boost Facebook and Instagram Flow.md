# 2026-11-01 Boost Facebook and Instagram Flow

Builds on [[2026-10-31 Boost Screen Uses Same Boost]] and [[2026-10-31 Remove Old Social Publishing]].

## What changed and why
The owner asked for a three-screen Boost flow (intro sheet, Preview Boost, Boost Started) that posts to both the Agrivive Facebook Page and Instagram, with each platform reporting its own result. The `.env` already had `SOCIAL_INSTAGRAM_USER_ID`, but the Instagram code had been removed, so it was restored.

- **Backend:** new table `instagram_post_logs` (migration `20261101120000_instagram_post_logs`, not applied). New services for the Instagram publisher, claim, finish, post and a combined `integrations.visibility-boost.social-post.ts`. The existing `/integrations/visibility-boosts/:id/facebook-post` route now calls the combined service, so the n8n workflow does not change. Facebook runs first and keeps its own answer and status code. Instagram runs next and never fails the Facebook answer. A Facebook `409` skips Instagram. The caption text moved to `integrations.visibility-boost.caption.ts` and Facebook reuses it.
- **Status API:** `GET /seller/products/:id/boost` adds `product.quantity`, `product.unit` and `boost.channels` (new `seller.visibility-boost.channels.ts`).
- **Mobile:** `BoostIntroSheet` replaces the add-product Alert. `marketing/[productId].tsx` is now Preview Boost (destination tabs, post card, price drop card, eligibility note before the button, duplicate-tap guard). New `marketing/started.tsx` polls each platform's status. New components: `PlatformBadge`, `BoostPostPreview`, `BoostPriceDropCard`, `BoostEligibilityNote`, `BoostChannelList`.
- Products have no description field, so none is shown.

## Verification
Backend `bunx tsc --noEmit`, `drizzle-kit check` and `bun build` (scratch folder) passed. Mobile `bun run typecheck` passed. Not tested on a device or against Meta.

## Notes for the owner
- Apply the migration before testing. Production order: migration first, then deploy. `backend/dist` was not rebuilt.
- Instagram needs a JPEG photo at a public HTTPS URL (`SOCIAL_PUBLIC_API_URL`) and a token with Instagram publish permission. Not verified.
- No seller notice is sent when only Instagram fails. The Boost Started screen shows it.
- Older boosts have no Instagram row and show Instagram as "Did not post" once stuck.
