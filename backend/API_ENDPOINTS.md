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
| GET | `/seller/promotions` | `backend/src/modules/seller/index/seller.promotions.ts` |
| POST | `/seller/promotions/:id/read` | `backend/src/modules/seller/index/seller.promotions.ts` |
| POST | `/seller/promotions/read-all` | `backend/src/modules/seller/index/seller.promotions.ts` |
| GET | `/seller/promotions/:id/share` | `backend/src/modules/seller/index/seller.promotions.ts` |
| GET | `/seller/social-campaigns/channels` | `backend/src/modules/seller/index/seller.social-campaigns.ts` |
| POST | `/seller/social-campaigns/draft` | `backend/src/modules/seller/index/seller.social-campaigns.ts` |
| GET | `/seller/social-campaigns/:id` | `backend/src/modules/seller/index/seller.social-campaigns.ts` |
| POST | `/seller/social-campaigns/:id/publish` | `backend/src/modules/seller/index/seller.social-campaigns.ts` |
| POST | `/seller/social-campaigns/:id/retry` | `backend/src/modules/seller/index/seller.social-campaigns.ts` |
| GET | `/seller/analytics/summary` | `backend/src/modules/seller/index/seller.analytics.ts` |
| GET | `/seller/advisories` | `backend/src/modules/seller/index/seller.advisories.ts` |

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

Promotion drafts are seller-scoped and separate from the paginated order/trust notification feed. `GET /seller/promotions?limit=20&cursor=<uuid>` returns ready drafts, a next cursor, and the seller's unread draft count. `POST /seller/promotions/:id/read` and `POST /seller/promotions/read-all` require no body. `GET /seller/promotions/:id/share` returns fresh price, quantity, shop, and marketplace URL facts for the native share sheet. If a listing is no longer active, marketable, buyable, publicly visible, and Priority Boost eligible, the share endpoint returns HTTP 409 with `status: "unavailable"`. No post is published automatically.

## Promotion integration (n8n)

These routes use the server-side `N8N_PROMOTION_SERVICE_TOKEN` as `Authorization: Bearer <token>` instead of a buyer or seller session. Keep this token in backend configuration and an n8n credential; never put it in the workflow export.

| Method | Path | Route source |
|---|---|---|
| GET | `/integrations/promotions/jobs/:id/context` | `backend/src/modules/integrations/index/integrations.promotion.context.ts` |
| POST | `/integrations/promotions/jobs/:id/draft` | `backend/src/modules/integrations/index/integrations.promotion.draft.ts` |
| POST | `/integrations/promotions/jobs/:id/failure` | `backend/src/modules/integrations/index/integrations.promotion.failure.ts` |

The worker webhook body contains only `{ "jobId": "<uuid>", "stage": "initial|followup" }`. n8n retrieves the latest public listing context from the protected `context` route, generates wording only, and calls `draft` with `{"headline":"...","caption":"..."}`. The context is evaluated with `visibility-ahptopsis-v1` and includes the backend-confirmed price, quantity, availability, visibility tier, score, rank, and listing URL. A follow-up may mention only the current price, quantity, and availability supplied by the backend. Draft callbacks are idempotent. `failure` accepts `{"code":"model_failed|invalid_draft|callback_failed"}` and returns the job to bounded retry or a recorded terminal failure. A ready callback is accepted only after the backend independently confirms current Priority eligibility.

The backend checks initial eligibility hourly with the Figure 5 AHP–TOPSIS engine. It compares all currently eligible active surplus listings, uses weights `0.40/0.30/0.20/0.10`, and queues only listings at `Ci* >= 0.60` for Priority Boost. It queues one follow-up for six hours after the initial draft becomes ready, only if the same listing cycle is still publicly visible, buyable, and Priority eligible. At that follow-up, the backend may apply one configured percentage reduction toward the seller's minimum price before n8n fetches the refreshed context. Existing listing cycles are inserted as skipped during migration to prevent historical drafts.

## Boost posting (n8n)

The seller taps **Boost** (after adding a product, or from a price-drop prompt). The app calls `POST /seller/products/:id/boost` (or `POST /seller/boost-prompts/:id/boost`), and the backend sends only `{ "boostId": "<uuid>", "reason": "initial|price_reduction" }` to `N8N_VISIBILITY_BOOST_WEBHOOK_URL` with `Authorization: Bearer <N8N_VISIBILITY_BOOST_SERVICE_TOKEN>`. n8n writes the title and description with Groq, then calls these routes, which all need the same Bearer token and return `401` without it.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/integrations/visibility-boosts/:id/context` | Current product facts, `previousPrice` (price drops only), `listingUrl`, public `imageUrl`. |
| POST | `/integrations/visibility-boosts/:id/facebook-post` | Body `{"postType":"first_post|second_post","caption":"..."}`. The backend rechecks the listing, posts with its own Meta credentials, saves the `fb_post_logs` row, removes any link in the caption and adds the product page link, and replaces captions that do not show the current price. Before posting it saves a `pending` row. A repeated call returns `alreadyPosted: true`. A `pending` row that never finished returns `409` ("still being sent", or after 5 minutes "may have reached Facebook, check the Page"), so nothing posts twice; the owner checks the Page and sets that row to `success` or `failed`. A price-drop boost post returns `409` if another price drop post went out in the last 3 hours. After the first post is saved the seller gets a **Boost Started** push and the boost gets a follow-up due time 6 hours later (only when the seller turned on price drops). After the second post of a first boost is saved, the backend creates a price-drop boost prompt and sends a **Price Lowered** push ("from ₱X to ₱Y. You can boost it again in 3 hours."). |
| POST | `/integrations/visibility-boosts/:id/reduce-price` | The 6-hour rule. Cuts the price once by the seller's `priceReductionPercent`, never below `minimumPrice`. First boost only, and needs the first post saved (`409` otherwise). Returns `reduced` plus `reason` (`not_enabled`, `at_floor`, `unavailable`) when nothing changed. A retry does not cut twice. When nothing was cut, the follow-up is closed. |

The 6-hour wait is kept in our database (`seller_visibility_boosts.follow_up_due_at`), not in n8n. When it passes, the worker sends `{ "boostId": "<uuid>", "reason": "follow_up" }` to the same webhook. n8n then calls `context`, `reduce-price`, writes the flash-sale caption and calls `facebook-post` with `second_post`. If the second post is not saved, the worker asks again every 15 minutes, up to 5 times. Seller routes `POST /seller/products/:id/boost` and `POST /seller/boost-prompts/:id/boost` return `409` ("You can boost again in about N hours") for a price drop boost within 3 hours of the last price drop post. Apply `backend/drizzle/20261031140000_boost_follow_up` before testing.

## Seller social publishing to official Agrivive pages

These session-protected routes require a signed-in seller. Sellers select Agrivive's Facebook Page and linked Instagram Professional account; no seller OAuth linking is used. TikTok and X publishing are not offered. Provider credentials remain in backend environment settings and are never returned to mobile or sent to n8n.

`GET /seller/social-campaigns/channels` returns each channel's label, caption limit, and configured state. `POST /seller/social-campaigns/draft` accepts `{"productId":"<uuid>"}` and returns an editable draft, listing name, and image preview URL. The backend checks seller ownership, current listing cycle, current public/buyable status, Agrivive-hosted listing photo, and `visibility-ahptopsis-v1 >= 0.60`.

`POST /seller/social-campaigns/:id/publish` is the seller's explicit confirmation. Example body:

```json
{
  "platforms": ["facebook", "instagram"],
  "posts": {
    "facebook": "Reviewed Facebook caption",
    "instagram": "Reviewed Instagram caption"
  }
}
```

The request requires the normal seller session; the campaign must belong to that seller. The response is `{"campaignId":"<uuid>","status":"queued"}`. `GET /seller/social-campaigns/:id` returns live overall and per-channel statuses and any published links. `POST /seller/social-campaigns/:id/retry` retries only failed channels; already successful posts are retained.

n8n uses `Authorization: Bearer <N8N_SOCIAL_SERVICE_TOKEN>` to coordinate the workflow. Its webhook receives only `{ "campaignId": "<uuid>" }`; it fetches targets and calls the backend per selected platform. It never receives provider access tokens or calls social provider APIs:

| Method | Path | Purpose |
|---|---|---|
| GET | `/integrations/social-campaigns/:id/context` | Recheck eligibility and return selected channel names/text plus a public eligible product image URL. |
| POST | `/integrations/social-campaigns/:id/publish/:platform` | Ask the backend to publish to one selected channel using server-side credentials. |
| GET | `/integrations/media/social-products/:id` | Stream the current eligible listing photo from private Agrivive storage for platform retrieval. |

Import `n8n/workflows/agrivive-social-publishing.json`, replace `YOUR_AGRIVIVE_API_HOST`, and set Header Auth credentials for the webhook and protected API requests. Keep execution payload retention disabled. The exported workflow is inactive; activate it only after backend setup and approved test-channel checks. If an older social-posting or TikTok status workflow was already imported, deactivate it. Do not import or reactivate `agrivive-tiktok-status-polling.json`.

Set the server-only credentials listed in `backend/.env.example`: public HTTPS API URL, n8n webhook URL/token, Groq key, Meta Graph API version, Agrivive Facebook Page ID and Page access token, and linked Instagram Professional account ID. Meta requires the linked Instagram Professional account and approved posting permissions. No seller account tokens or OAuth callback URLs are used. Apply all pending migrations in timestamp order to an approved development/test database before manual acceptance. If the social-campaign migration is pending, apply `20261007165336_social_publishing` before `20261007181343_official_social_pages`; do not apply migrations to production as part of implementation.

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
