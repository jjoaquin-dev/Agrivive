# 2026-10-31 Boost Straight to n8n With 6-Hour Price Cut

Supersedes [[2026-10-31 Boost Popup Uses Boost Visibility Screen]] for the add-product popup. Earlier same-day notes: [[2026-10-31 Boost Popup and Confirmed Boost Workflow]], [[2026-10-31 n8n Seller Flow Hardening]].

## What changed and why
The owner's plan: Boost sends the product to n8n first, n8n writes the title and description (Groq) and posts, waits 6 hours, asks the API to lower the price by the percent the seller set, then posts again. The owner chose no preview screen and chose to have the backend save post records.

- **Mobile:** `mobile/app/(app)/inventory/create.tsx`. The `Boost "<name>"?` popup describes the post, the product page link, and the 6-hour cut when a percent is set. **Boost** calls `POST /seller/products/:id/boost` and shows a plain result message. **Not now** opens the product. The Boost Visibility screen (preview and Post Now) is not changed and is still used from the product list, analytics and notices.
- **Backend:** the seller boost route now sends the boost to n8n immediately (`deliverSellerVisibilityBoosts`); the worker pass stays as the retry path. New token-protected routes: `POST /integrations/visibility-boosts/:id/facebook-post` (backend posts to Facebook with its own Meta credentials, saves `fb_post_logs`, adds the product page link, replaces captions that do not show the current price, no double post) and `POST /integrations/visibility-boosts/:id/reduce-price` (the 6-hour rule: seller percent only, never below the minimum price, once, first boost only). The context route also returns `previousPrice`. Restored `integrations.fb-logs.ts` as an internal service (no public route).
- **n8n:** `n8n/workflows/agrivive-visibility-boost.json` (13 nodes): webhook, context, Groq caption, format, post, first-boost check, 6-hour wait, context again, API price cut, reduced check, Groq flash-sale caption, format, post. No Meta token inside n8n. Price-drop boosts (from the 12-hour job prompt) post once and stop.

## Affected files
`mobile/app/(app)/inventory/create.tsx`; `backend/src/modules/seller/index/seller.visibility-boost.ts`; `backend/src/modules/integrations/` (visibility-boost routes, model, authorize, facebook-post, reduce-price, context, fb-logs); `backend/src/index.ts`; `backend/README.md`; `backend/API_ENDPOINTS.md`; `n8n/workflows/agrivive-visibility-boost.json`.

## Verification
Backend `bunx tsc --noEmit` and mobile `bun run typecheck` passed. `backend/dist/` was not rebuilt because another session has uncommitted work in progress. Not tested against n8n, Groq or Meta.

## Notes
- The backend `.env` needs `N8N_VISIBILITY_BOOST_WEBHOOK_URL` and `N8N_VISIBILITY_BOOST_SERVICE_TOKEN` (checked: not present at the time). The old Seller Flow workflow in n8n should be deactivated.
- No separate "save to database" node: the post call saves the record.
- The 12-hour price job still exists; after a 6-hour cut its next cut is due at 24 hours.

## Update: seller push notices
- **Boost Started** (`boost_started`, new): sent when the first post is saved. Says the product was posted and, when a price drop is set, that the price goes down in 6 hours.
- **Price Lowered** (`price_lowered`, existing kind, body extended): sent when the second post of a first boost is saved. With `priceBefore` it reads "went from ₱X to ₱Y. Tap to boost it again."; without it, the old wording. The backend also creates the same price-drop boost prompt the 12-hour job makes, so tapping Boost on the listing accepts it and n8n posts once. It is created after the second post so that post is not blocked by the duplicate check.
- Both go through `createSellerNotification`, so they respect the seller's Boost / Stock and Price switches and Night Mode. Level is silent (a push without sound), like the other boost notices.
- Files: `backend/src/utils/seller-notifications/messages.ts`, `backend/src/modules/integrations/services/integrations.visibility-boost.notify-started.ts`, `...notify-price-lowered.ts`, `...facebook-post.ts`, `mobile/src/features/notifications/utils/sellerNoticeMapper.ts` (icon). Typechecks pass; not tested on a device.

