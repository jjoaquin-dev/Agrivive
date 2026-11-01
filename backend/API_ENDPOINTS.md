# Agrivive API endpoint map

Use this file to find a route before changing or calling it. Local API base URL: `http://localhost:3000`.

## Where code lives

- Route handlers: `backend/src/modules/<module>/index/<feature>.ts`
- Request schemas and route DTOs: `backend/src/modules/<module>/model/<feature>.ts`
- Database and business logic: `backend/src/modules/<module>/services/<feature>.ts`
- Shared helpers: `backend/src/utils/<utility>/`
- Domain route composition: `backend/src/modules/<module>/index.ts`
- App mount, health routes, Better Auth mount, and OpenAPI plugin: `backend/src/index.ts`
- Better Auth base path and plugins: `backend/src/modules/auth/index.ts`

Protected endpoints use the signed-in user's Better Auth session. Public routes need no login. Seller routes still check active seller verification/profile requirements inside their services. The admin API is read-only monitoring; account actions are system-controlled by verified events, scheduled expiry, and user email OTP recovery.

## Root and system

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/` | Public | `backend/src/index.ts` |
| GET | `/a` | Public | `backend/src/index.ts` |
| GET | `/health` | Public liveness | `backend/src/index.ts` |
| GET | `/health/ready` | Public database readiness | `backend/src/index.ts` |

## Authentication

Better Auth handles its routes under `/api/auth/*`; see `backend/src/modules/auth/index.ts`. The exact operations depend on the Better Auth plugins enabled there. The current setup includes email/password, Google OAuth, email verification codes, bearer sessions, TOTP, and Expo support. Google sign-in creates a buyer account for a new Google identity and signs in an existing linked identity. Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the backend environment. The Google Cloud redirect URI is `http://localhost:3000/api/auth/callback/google` for local development and `<BETTER_AUTH_URL>/api/auth/callback/google` in production.

| Method | Path | Access | Purpose | Route source |
|---|---|---|---|---|
| GET | `/auth/password-status` | Signed-in buyer or seller | Returns `hasPassword` and `passwordSetupRequired` without exposing credential data | `backend/src/modules/auth/index/auth.password.ts` |
| POST | `/auth/password` | Signed-in buyer or seller | Sets a local password for a Google-linked account that does not already have one | `backend/src/modules/auth/index/auth.password.ts` |

Google-linked accounts without a credential password must complete `POST /auth/password` before the web or mobile app allows the completed account experience. Existing password accounts continue using Better Auth's `/api/auth/change-password` operation. The password route uses Better Auth's server-only `setPassword` operation and never accepts or returns a password hash.

## Trust recovery

| Method | Path | Access | Route source |
|---|---|---|---|
| POST | `/trust/recovery/request` | Public; sends an OTP only for a blocked account and always returns a generic success response | `backend/src/modules/trust/index/trust.recovery.ts` |
| POST | `/trust/recovery/verify` | Public; valid email OTP restores an account with an active trust action | `backend/src/modules/trust/index/trust.recovery.ts` |

Recovery reuses Better Auth's hashed email OTP flow with `type: "forget-password"`. It does not grant access to an account that has no active trust action, and it records the restoration in `trust_actions`. Admin users cannot restore accounts. The web screen is `web/app/(auth)/account-recovery/page.tsx`.

## Marketplace (public)

| Method | Path | Route source |
|---|---|---|
| GET | `/marketplace/products` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/products/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/products/:id/reviews` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/map` | `backend/src/modules/marketplace/index/marketplace.sellers.map.ts` |

`GET /marketplace/products` accepts search and filter fields plus `limit` and `cursor`. It returns a page ranked by visibility score, score tier, newest publication, then product ID. The cursor contains the evaluation time to keep score-based pages in the same order. The default `VISIBILITY_POLICY=visibility-v4` keeps the legacy Weighted Surplus Visibility marketplace behavior. Setting `VISIBILITY_POLICY=visibility-ahptopsis-v1` enables the AHP–TOPSIS marketplace ranking. Regardless of the marketplace feature flag, the seller promotion and Priority Boost eligibility path uses the paper-aligned AHP–TOPSIS policy with the four Figure 5 criteria and `Ci* >= 0.60` threshold.

`GET /marketplace/sellers/:id` includes `image`, which is a signed seller profile image URL when a photo exists and `null` otherwise.

`GET /marketplace/sellers/map` returns one record per matching seller, including `image` as a signed seller profile image URL when available. Sellers without a photo return `image: null` and the web map shows seller initials instead.

## Buyer

Buyer routes require a signed-in active buyer except the public seller rating/review reads noted below.

| Method | Path | Route source |
|---|---|---|
| GET | `/buyer/profile` | `backend/src/modules/buyer/index/buyer.profile.read.ts` |
| POST | `/buyer/profile/avatar` | `backend/src/modules/buyer/index/buyer.profile.avatar.ts` |
| GET | `/buyer/wishlist` | `backend/src/modules/buyer/index/buyer.wishlist.list.ts` |
| POST | `/buyer/wishlist/:productId` | `backend/src/modules/buyer/index/buyer.wishlist.save.ts` |
| DELETE | `/buyer/wishlist/:productId` | `backend/src/modules/buyer/index/buyer.wishlist.remove.ts` |
| GET, POST, DELETE | `/buyer/follows/:sellerId` | `backend/src/modules/buyer/index/buyer.seller.follow.ts` |
| POST | `/buyer/checkouts` | `backend/src/modules/buyer/index/buyer.checkout.create.ts` |
| POST | `/buyer/orders` | `backend/src/modules/buyer/index/buyer.order.create.ts` |
| GET | `/buyer/orders` | `backend/src/modules/buyer/index/buyer.order.list.ts` |
| GET | `/buyer/orders/:id` | `backend/src/modules/buyer/index/buyer.order.get.ts` |
| POST | `/buyer/orders/:id/cancel` | `backend/src/modules/buyer/index/buyer.order.cancel.ts` |
| GET | `/buyer/orders/:id/inquiries` | `backend/src/modules/buyer/index/buyer.order.inquiry.ts` |
| POST | `/buyer/orders/:id/inquiries` | `backend/src/modules/buyer/index/buyer.order.inquiry.ts` |
| POST | `/buyer/orders/:id/report` | `backend/src/modules/buyer/index/buyer.order.report.ts` |
| POST | `/buyer/orders/:id/report/:reportId/evidence` | `backend/src/modules/buyer/index/buyer.order.report.ts` |
| GET | `/buyer/orders/:id/report/:reportId/evidence` | `backend/src/modules/buyer/index/buyer.order.report.ts` |
| GET | `/buyer/notices` | `backend/src/modules/buyer/index/buyer.notices.list.ts` |
| POST | `/buyer/notices/:id/read` | `backend/src/modules/buyer/index/buyer.notices.read.ts` |
| POST | `/buyer/notices/read-all` | `backend/src/modules/buyer/index/buyer.notices.read.ts` |
| GET | `/buyer/products/:id/inquiries` | `backend/src/modules/buyer/index/buyer.product.inquiry.ts` |
| POST | `/buyer/products/:id/inquiries` | `backend/src/modules/buyer/index/buyer.product.inquiry.ts` |
| GET | `/buyer/products/:id/review-eligibility` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| POST | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/orders/:id/items/:itemId/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| POST | `/buyer/orders/:id/items/:itemId/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/sellers/:id/rating` | Public; `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/sellers/:id/reviews` | Public; `backend/src/modules/buyer/index/buyer.order.review.ts` |

Buyer order responses include `imageUrl` as a signed product image URL when the ordered listing has a valid image, `productType` for the fallback label, and `null` when the image is unavailable. This supports the marketplace order preview and order-detail image surfaces without changing order ownership or status behavior.

Wishlist routes return only the signed-in buyer's saved product IDs. Saving is idempotent, removing an item is safe to repeat, and the product must currently be a visible marketplace listing. The unique buyer/product constraint prevents duplicate saves.

Follow routes require an active buyer session (cookie or bearer token). They accept a seller user ID in the path, no request body, and return `{ "sellerId": "<id>", "following": true|false }`. A buyer cannot follow their own shop (403); a nonpublic storefront returns 404. Save and remove are idempotent. The separate worker sends an in-app notice only when a followed seller publishes a product that is public and buyable for the first time. No historical products, restocks of previously public products, emails, or push messages are sent.

`GET /buyer/notices` includes the existing order notices and `seller_new_listing` notices. New IDs are prefixed `listing:`; each has `productId`, `sellerId`, `productName`, `shopName`, and `productAvailable`, with `orderId: null`. `POST /buyer/notices/:id/read` returns the recipient's notice with `readAt`; unknown or another buyer's notice returns 404. `POST /buyer/notices/read-all` returns `{ "updatedCount": 1 }` with the actual count. Both read actions have no body. Past notices remain after unfollowing. A no-longer-available listing links to the seller storefront instead of a stale buy action.

### Buyer request examples

`POST /buyer/products/:id/inquiries`:

```json
{"question":"Is this produce still available for pickup today?"}
```

For report evidence, first `POST /buyer/orders/:id/report` with the existing report body. Use the returned report ID in the evidence paths. Upload `multipart/form-data` with a `file` field (JPG, PNG, WebP, or PDF, up to 5 MB). Only the report creator can request its short-lived download links. Reports are allegation flags until supported by verified events; they do not add weighted trust points by themselves.

## Conversations

Buyer and seller chat. All routes need a signed-in buyer or seller (cookie or bearer token). Source: `backend/src/modules/conversations/index/conversation.routes.ts`.

| Method | Path | Notes |
|---|---|---|
| GET | `/conversations` | The user's chats, newest first (`limit`, `cursor`). |
| GET | `/conversations/unread-count` | `{ "unreadMessages": 3, "unreadConversations": 2 }`. Counts messages from the other person that came after the user's last read time. |
| GET | `/conversations/:id` | One chat, same fields as an item in `GET /conversations` (including `unreadCount` and `lastMessageSenderId`). Another person's chat returns 404 `Conversation not found`. |
| GET | `/conversations/:id/messages` | Messages of one chat. |
| POST | `/conversations/:id/messages` | Send a message. |
| POST | `/conversations/:id/read` | Mark one chat read. |
| POST | `/conversations/read-all` | Mark all chats read. |

`/conversations/unread-count` is registered before `/conversations/:id`, so it is never read as an id.

## Seller

Seller routes require a signed-in seller; most listing and order routes also require active, verified seller status.

| Method | Path | Route source |
|---|---|---|
| GET | `/seller/setup` | `backend/src/modules/seller/index/seller.setup.ts` |
| POST | `/seller/profile` | `backend/src/modules/seller/index/seller.profile.create.ts` |
| POST | `/seller/addprofile` (legacy alias) | `backend/src/modules/seller/index/seller.profile.create.ts` |
| GET | `/seller/profile` | `backend/src/modules/seller/index/seller.profile.read.ts` |
| PATCH | `/seller/profile` | `backend/src/modules/seller/index/seller.profile.update.ts` |
| DELETE | `/seller/profile` | `backend/src/modules/seller/index/seller.profile.delete.ts` |
| POST | `/seller/profile/avatar` | `backend/src/modules/seller/index/seller.profile.avatar.ts` |
| GET | `/seller/vegetable-catalog` | `backend/src/modules/seller/index/seller.vegetable-catalog.ts` |
| POST | `/seller/products` | `backend/src/modules/seller/index/seller.product.create.ts` |
| POST | `/seller/addproduct` (legacy alias) | `backend/src/modules/seller/index/seller.product.create.ts` |
| GET | `/seller/products` | `backend/src/modules/seller/index/seller.products.ts` |
| GET | `/seller/products/:id` | `backend/src/modules/seller/index/seller.product.get.ts` |
| PATCH | `/seller/products/:id` | `backend/src/modules/seller/index/seller.products.ts` |
| DELETE | `/seller/products/:id` | `backend/src/modules/seller/index/seller.product.archive.ts` |
| POST | `/seller/products/:id/archive` | `backend/src/modules/seller/index/seller.product.archive.ts` |
| POST | `/seller/products/:id/deactivate` | `backend/src/modules/seller/index/seller.products.ts` |
| POST | `/seller/products/:id/reactivate` | `backend/src/modules/seller/index/seller.product.reactivate.ts` |
| POST | `/seller/products/:id/restock` | `backend/src/modules/seller/index/seller.products.ts` |
| POST | `/seller/products/:id/stock-adjustments` | `backend/src/modules/seller/index/seller.product.adjust-stock.ts` |
| POST | `/seller/product-images` | `backend/src/modules/seller/index/seller.product.image.ts` |
| GET | `/seller/products/:id/share` | `backend/src/modules/seller/index/seller.product.share.ts` |
| GET | `/seller/stock-adjustments` | `backend/src/modules/seller/index/seller.stock-adjustment.list.ts` |
| GET | `/seller/weightedvisibility` | `backend/src/modules/seller/index/seller.weighted.surplus.visibility.ts` |
| GET | `/seller/orders` | `backend/src/modules/seller/index/seller.scan-order.ts` |
| GET | `/seller/orders/:id` | `backend/src/modules/seller/index/seller.scan-order.ts` |
| POST | `/seller/orders/scan` | `backend/src/modules/seller/index/seller.scan-order.ts` |
| POST | `/seller/orders/:id/cancel` | `backend/src/modules/seller/index/seller.order.cancel.ts` |
| GET | `/seller/inquiries` | `backend/src/modules/seller/index/seller.order.inquiry.ts` |
| GET | `/seller/orders/:id/inquiries` | `backend/src/modules/seller/index/seller.order.inquiry.ts` |
| POST | `/seller/inquiries/:id/reply` | `backend/src/modules/seller/index/seller.order.inquiry.ts` |
| GET | `/seller/product-inquiries` | `backend/src/modules/seller/index/seller.product.inquiry.ts` |
| POST | `/seller/product-inquiries/:id/reply` | `backend/src/modules/seller/index/seller.product.inquiry.ts` |
| POST | `/seller/orders/:id/report` | `backend/src/modules/seller/index/seller.order.report.ts` |
| POST | `/seller/orders/:id/report/:reportId/evidence` | `backend/src/modules/seller/index/seller.order.report.ts` |
| GET | `/seller/orders/:id/report/:reportId/evidence` | `backend/src/modules/seller/index/seller.order.report.ts` |
| GET | `/seller/orders/:id/review` | `backend/src/modules/seller/index/seller.order.review.ts` |
| POST | `/seller/orders/:id/review-response` | `backend/src/modules/seller/index/seller.order.review.ts` |
| GET | `/seller/trust` | `backend/src/modules/seller/index/seller.trust.ts` |
| POST | `/seller/trust/events/:id/correction` | `backend/src/modules/seller/index/seller.trust.ts` |
| GET | `/seller/notifications` | `backend/src/modules/seller/index/seller.notifications.ts` |
| POST | `/seller/notifications/:id/read` | `backend/src/modules/seller/index/seller.notifications.ts` |
| POST | `/seller/notifications/read-all` | `backend/src/modules/seller/index/seller.notifications.ts` |
| GET | `/seller/notification-settings` | `backend/src/modules/seller/index/seller.notification-settings.ts` |
| PATCH | `/seller/notification-settings` | `backend/src/modules/seller/index/seller.notification-settings.ts` |
| GET | `/seller/analytics/summary` | `backend/src/modules/seller/index/seller.analytics.ts` |
| GET | `/seller/advisories` | `backend/src/modules/seller/index/seller.advisories.ts` |

`GET /seller/product-inquiries` returns `{ "items": [...], "nextCursor": null, "openCount": 4 }`. `openCount` is every unanswered product question of this seller, whatever the `status` filter is.

`POST /seller/product-inquiries/:id/reply` (body `{ "reply": "About 5 bundles per pile." }`) also posts the answer in the buyer's chat as a message from the seller: `About your question on <product>: "<question, cut at 200 characters>"` then a blank line and the reply. If the buyer has no chat yet, one is created. The buyer gets a `buyer_message` notification and an open chat updates live. Answering twice returns 409 and posts nothing more. The response is the answered question plus `conversationId`.

`GET /seller/vegetable-catalog?search=kamatis` returns approved catalog records with `id`, Filipino wet-market name, English name, aliases, reference category, scientific name when available, and `sourceUrl`. Search accepts Filipino names, English names, and stored aliases. Fungi and mushrooms are not seeded or returned.

`POST /seller/products` and the legacy `POST /seller/addproduct` alias require `catalogId` instead of a free-text product name or category. Example body:

```json
{
  "catalogId": "<vegetable-catalog-uuid>",
  "imagUrl": "https://api.example.com/seller/product-images/example.jpg",
  "productPrice": 80,
  "productQty": 10,
  "scalingType": "kilo",
  "isMarketable": true,
  "lowStockThreshold": 2
}
```

The API reads the canonical Filipino name and category from the selected approved catalog record, rejects inactive or unapproved records, and prevents a seller from creating a duplicate name plus selling-unit listing. `PATCH /seller/products/:id` accepts the optional `catalogId` when the seller changes the selected vegetable; product name and category are not accepted as free-text update fields.

`GET /seller/products/:id/share` returns a prepared caption, marketplace link, and image URL. Set `WEB_APP_URL` to the buyer web app origin for absolute share links.

## Boost posting (n8n)

The seller taps **Boost** (after adding a product). The app calls `POST /seller/products/:id/boost`, and the backend sends only `{ "boostId": "<uuid>", "reason": "initial" }` to `N8N_VISIBILITY_BOOST_WEBHOOK_URL` with `Authorization: Bearer <N8N_VISIBILITY_BOOST_SERVICE_TOKEN>`. n8n writes the title and description with Groq, then calls these routes, which all need the same Bearer token and return `401` without it.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/integrations/visibility-boosts/:id/context` | Current product facts, `previousPrice` (price drops only), `listingUrl`, public `imageUrl`, and `alreadyPosted` (`true` when this boost's own post, first post or price drop second post, is already saved; n8n stops there instead of writing and posting again). |
| POST | `/integrations/visibility-boosts/:id/facebook-post` | Body `{"postType":"first_post|second_post","caption":"..."}`. The backend rechecks the listing, posts with its own Meta credentials, saves the `fb_post_logs` row, removes any link in the caption and adds the product page link, and replaces captions that do not show the current price. Before posting it saves a `pending` row. A repeated call returns `alreadyPosted: true`. A `pending` row that never finished returns `409` ("still being sent", or after 5 minutes "may have reached Facebook, check the Page"), so nothing posts twice; the owner checks the Page and sets that row to `success` or `failed`. A price-drop boost post returns `409` if another price drop post went out in the last 3 hours. After the first post is saved the seller gets a **Boost Started** push and the boost gets a follow-up due time 6 hours later (only when the seller turned on price drops). After the second post of a first boost is saved, the backend creates a price-drop boost prompt and sends a **Price Lowered** push ("from ₱X to ₱Y. You can boost it again in 3 hours.") each round. |

The same call also posts to Instagram. The Instagram post is tried after Facebook, even when Facebook fails with a server error, and it is saved in `instagram_post_logs` with its own `pending` row (one post per product, post type and price since the boost began, so a repeated call never posts twice). A `409` from Facebook (still sending, too soon, first post missing) skips Instagram. A success response keeps its old fields and adds `instagram: { "status": "posted|failed", "posted", "alreadyPosted", "instagramPostId", "postUrl", "message" }`. An Instagram failure never fails the Facebook answer, and a Facebook failure keeps its own status code and message. The caption has no link and ends with the product page address. Needs `SOCIAL_INSTAGRAM_USER_ID` and a token that can publish to Instagram. Apply `backend/drizzle/20261101120000_instagram_post_logs` before testing.

`GET /seller/products/:id/boost` now returns `product.quantity`, `product.unit` and `boost.channels` (`{ facebook, instagram }`, each `{ "status": "waiting|posting|posted|failed", "postUrl" }`) for the boost's own post. The mobile Boost Started screen polls it, so each platform shows its real answer.
| POST | `/integrations/visibility-boosts/:id/reduce-price` | The 6-hour rule. Cuts the price once by the seller's `priceReductionAmount` (pesos), never below `minimumPrice` (the final price). When the cut lands on the final price, the seller gets a **Final Price Reached** notice (`final_price_reached`). `discountPercent` in the response is the real percent of that round's cut, for the n8n caption. First boost only, and needs the first post saved (`409` otherwise). Returns `reduced` plus `reason` (`not_enabled`, `at_floor`, `unavailable`) when nothing changed. A retry does not cut twice. When nothing was cut, the follow-up is closed. |

The 6-hour wait is kept in our database (`seller_visibility_boosts.follow_up_due_at`), not in n8n. When it passes, the worker sends `{ "boostId": "<uuid>", "reason": "follow_up" }` to the same webhook. n8n then calls `context`, `reduce-price`, writes the flash-sale caption and calls `facebook-post` with `second_post`. If the post is not saved, the worker asks again every 15 minutes, up to 5 times. After each round is saved (cut, flash-sale post, **Price Lowered** push), the due time is set 6 hours ahead again, so the rule repeats until the price reaches the seller's `minimumPrice`. It also ends when `reduce-price` cuts nothing (`not_enabled`, `at_floor`, `unavailable`). The worker also checks this before it calls n8n: if the product is sold out, archived, paused or already at `minimumPrice`, or its listing started a new cycle, it clears `follow_up_due_at` and sends nothing, so n8n never shows an error for a rule that has ended. These rounds are the only automatic price drops: there is no separate 12-hour schedule, so a listing that is not boosted keeps its price. Seller product create and update (`POST /seller/products`, `PATCH /seller/products/:id`) take `priceReductionAmount` (pesos, 0 to below the selling price, two decimals) instead of `priceReductionPercent`; a value above 0 needs `minimumPrice`. Example: `{ "productPrice": 60, "priceReductionAmount": 1.25, "minimumPrice": 5 }`. Migration `20261101160000_price_reduction_amount` adds the column and converts existing percents at the current price. Seller product reads (`GET /seller/products`, `GET /seller/products/:id`) return `nextPriceReductionAt` from the earliest pending `follow_up_due_at`, or `null`. Each saved Facebook post now keeps its text in `fb_post_logs.caption`, returned as `caption` on every `progress.posts[]` item of `GET /seller/products/:id/boost` and `GET /seller/boosts` (`null` for posts made before this change). `POST /seller/products/:id/boost` makes one boost per listing cycle and returns `409` ("You just boosted this product. Please wait about N hours before you boost it again.") within 3 hours of the product's last first post. **The webhook only ever sends two reasons: `initial` (the seller's Boost) and `follow_up` (the worker's 6-hour rule).** The old `price_reduction` boost, its "Boost again" prompt and `POST /seller/boost-prompts/:id/boost` are removed; a leftover `price_reduction` row is refused with `409` ("This boost type is no longer used"). The `price_reduction` value stays in the database enum only because Postgres cannot drop an enum value safely. Apply `backend/drizzle/20261031140000_boost_follow_up` before testing.

**Automatic price drops: history and on/off (seller, `Authorization` session, role `seller`).** Apply `backend/drizzle/20261101170000_price_reduction_enabled` first (adds `sellers_product.price_reduction_enabled`, default `true`; seller product reads return it as `priceReductionEnabled`).
- `GET /seller/price-drops?limit=20&cursor=<postedAt>`: Facebook posts that announced a lower price than the post before them, newest first. Response: `{ "items": [{ "id", "productId", "productName", "imageUrl", "caption", "priceBefore": 70, "priceAfter": 60, "postedAt": "ISO", "postUrl" }], "nextCursor": "ISO|null" }`.
- `PATCH /seller/products/:id/price-reduction` body `{ "enabled": false }`: `200 { "productId", "enabled" }`. Off clears the pending 6-hour timer, keeps the amount and final price, and `reduce-price` returns `not_enabled`. On needs a drop amount and `minimumPrice` (else `409` "Set a drop amount and a final price in Edit Listing first") and, if the first post already went out, starts a new 6-hour wait. The Boost screen's drop card shows "price stays the same" while it is off. Another seller's product returns `404`.

### Boost progress for the app

`GET /seller/products/:id/boost` and `GET /seller/boosts` (history) now return `progress` on each boost: `{ "state", "roundsDone", "nextDropAt", "posts": [{ "type", "price", "postedAt", "postUrl", "caption" }] }`. `state` is one of `posting`, `posted`, `running` (more price drops are due), `finished` (the price reached the seller's lowest price), `not_posted` (sent to n8n more than 5 minutes ago and nothing posted), `failed`, `needs_choice` or `dismissed`. `posts` are the saved Facebook posts, with the link to each one. The product route also returns `product.lowestPrice`, and history items return `currentPrice` and `lowestPrice`. `GET /seller/products` also returns `boost` on each listing: `null`, or `{ "state", "nextDropAt", "roundsDone", "priceDropPrompt" }` for the newest first boost, which the listing and analytics cards show as a chip. A failed post sends the seller a **Boost Did Not Post** push (`boost_failed`), once per boost and post type. The Priority Promotion draft flow (`/seller/promotions`, `/integrations/promotions/*`) was removed; its tables stay in the database.

## Boost product photo

| Method | Path | Purpose |
|---|---|---|
| GET | `/integrations/media/social-products/:id` | Streams the current eligible listing photo from private Agrivive storage so Facebook can fetch it for a Boost post. Public, no session. |

The old preview-and-post routes (`/seller/social-campaigns/*`, `/integrations/social-campaigns/*`) and the social-publishing n8n workflow were removed. Boost posting is described in the Boost posting section above.

## Admin monitoring

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/admin/performance` | Admin; read-only metrics only | `backend/src/modules/admin/index/admin.performance.ts` |

This endpoint reports aggregate usage, listings, orders, verified trust event counts, report flags, evidence-file totals, notice delivery status, weighted trust monitoring values, and active trust-action counts. `monitoring-v3` counts verified non-response at 1 point, verified cancellation at 2 points, and one 1–2-star rating signal per completed order at 1 point. Written feedback is context, not machine-scored sentiment. Allegation flags contribute zero points. These weights and the configurable warning/restriction/block thresholds are prototype policy settings, not research-proven facts. Admin monitoring does not approve reports, restore accounts, revoke actions, or change user accounts.

Trust actions are disabled by default with `TRUST_ACTIONS_ENABLED=false`. When explicitly enabled and manually validated, the scheduled system can create a warning, a temporary restriction, or a blocked state. Temporary restrictions expire through `runScheduledJobs`; blocked-account restoration requires the public OTP recovery flow above.

Evidence files are stored with private access in the configured S3 bucket. Keep the bucket policy private; download links are signed and expire after five minutes.

## Seller notifications

Seller role, session cookie or bearer session. The feed merges stored alerts (`seller_notifications`) with trust notices (`trust_notices`).

`GET /seller/notifications?limit=20&cursor=<id>&unreadOnly=true` returns:

```json
{
  "items": [
    {
      "id": "uuid",
      "source": "alert",
      "kind": "sold_out",
      "category": "listings",
      "title": "Sold Out",
      "body": "Red Tomatoes is sold out.",
      "orderId": null,
      "productId": "uuid",
      "createdAt": "2026-10-31T08:00:00.000Z",
      "readAt": null
    }
  ],
  "nextCursor": null,
  "unreadCount": 1
}
```

`source` is `alert` or `trust`. `category` is `reservations`, `messages`, `listings` or `trust`. Pass `nextCursor` back as `cursor`.

`POST /seller/notifications/:id/read` returns the updated item. `POST /seller/notifications/read-all` returns `{ "updatedCount": 3 }`.

`GET /seller/notification-settings` returns `{ "stockPrice": true, "boost": true, "account": true, "nightMode": false }`. `PATCH` takes any of those keys and returns the saved settings. They change phone alerts only; the feed always shows everything.

Phone alerts: events of the same kind inside one 60-second window (`PUSH_SELLER_ALERT_WINDOW_SECONDS`, 10 to 600) become one alert. Reservations, buyer cancellations, chat messages, buyer reminders, and account limits ring on the `orders` channel. Stock, price, Boost, and account notes arrive quietly on the `updates` channel. Night Mode (9 PM to 6 AM Asia/Manila) turns chat messages and reminders quiet; reservations, "ends soon", and account limits keep their sound.

## Stakeholder

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/stakeholder/summary` | Stakeholder role | `backend/src/modules/stakeholder/index/stakeholder.summary.ts` |

This response contains aggregate counts only. Add approved stakeholder emails to the server-side `STAKEHOLDER_EMAILS` list; the client cannot set its own role.

## Database migration

The app code does not apply migrations on startup. Apply all migrations in `backend/drizzle/` before using the backend.
