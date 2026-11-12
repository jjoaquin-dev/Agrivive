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

Better Auth handles its routes under `/api/auth/*`; see `backend/src/modules/auth/index.ts`. The exact operations depend on the Better Auth plugins enabled there. The current setup includes email/password, Google OAuth, email verification codes, bearer sessions, TOTP, and Expo support. Google sign-in creates a buyer account for a new Google identity and signs in an existing linked identity. A blocked account, or one with a running reservation pause, gets no session on any sign-in route: Better Auth answers 403 with `code: "ACCOUNT_RESTRICTED"` and the reason in `message` (hook in `modules/auth/index.ts`). The buyer then restores access through the `/trust` recovery email code. Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the backend environment. The Google Cloud redirect URI is `http://localhost:3000/api/auth/callback/google` for local development and `<BETTER_AUTH_URL>/api/auth/callback/google` in production.

| Method | Path | Access | Purpose | Route source |
|---|---|---|---|---|
| GET | `/auth/password-status` | Signed-in buyer or seller | Returns `hasPassword` and `passwordSetupRequired` without exposing credential data | `backend/src/modules/auth/index/auth.password.ts` |
| POST | `/auth/password` | Signed-in buyer or seller | Sets a local password for a Google-linked account that does not already have one | `backend/src/modules/auth/index/auth.password.ts` |

Google-linked accounts without a credential password must complete `POST /auth/password` before the web or mobile app allows the completed account experience. Existing password accounts continue using Better Auth's `/api/auth/change-password` operation. The password route uses Better Auth's server-only `setPassword` operation and never accepts or returns a password hash.

## Trust recovery

| Method | Path | Access | Route source |
|---|---|---|---|
| POST | `/trust/recovery/request` | Public; sends an OTP only for a blocked account and always returns a generic success response | `backend/src/modules/trust/index/trust.recovery.ts` |
| POST | `/trust/recovery/verify` | Public; a valid email OTP restores a blocked account only. A pause cannot be lifted this way; it ends on its own | `backend/src/modules/trust/index/trust.recovery.ts` |

Recovery reuses Better Auth's hashed email OTP flow with `type: "forget-password"`. It does not grant access to an account that has no active trust action, and it records the restoration in `trust_actions`. Admin users cannot restore accounts. The web screen is `web/app/(auth)/account-recovery/page.tsx`.

## Marketplace (public)

| Method | Path | Route source |
|---|---|---|
| GET | `/marketplace/products` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/products/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/products/:id/reviews` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/map` | `backend/src/modules/marketplace/index/marketplace.sellers.map.ts` |

`GET /marketplace/products` accepts search and filter fields plus `limit` and `cursor`. It returns a page ranked by visibility score, score tier, newest publication, then product ID. The cursor contains the evaluation time to keep score-based pages in the same order. The marketplace uses the AHP–TOPSIS ranking by default, including when `VISIBILITY_POLICY` is unset. Setting `VISIBILITY_POLICY=visibility-v4` rolls back to the legacy Weighted Surplus Visibility behavior. Regardless of the marketplace feature flag, the seller promotion and Priority Boost eligibility path uses the paper-aligned AHP–TOPSIS policy with the four Figure 5 criteria and `Ci* >= 0.60` threshold.

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
| GET | `/buyer/follows` | `backend/src/modules/buyer/index/buyer.seller.follow.ts` (buyer session; returns `{ "sellers": [{ "sellerId", "followedAt", "shopName", "address", "image" }] }`, newest first) |
| GET, POST, DELETE | `/buyer/follows/:sellerId` | `backend/src/modules/buyer/index/buyer.seller.follow.ts` |
| POST | `/buyer/checkouts` | `backend/src/modules/buyer/index/buyer.checkout.create.ts` |
| POST | `/buyer/orders` | `backend/src/modules/buyer/index/buyer.order.create.ts`. Reserving from your own stall returns `403`, adds 3 points and blocks the account. More than 5 orders in 7 days to one seller are marked `counts_for_ranking = false`. |
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
| GET | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| POST | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts`. Review-bomb check: 5 or more 1 to 2 star ratings from accounts under 7 days old in 24 hours are ignored (kept on file, left out of averages and trust). |
| PATCH | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| POST | `/buyer/orders/:id/review/photo` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/sellers/:id/rating` | Public; `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/sellers/:id/reviews` | Public; `backend/src/modules/buyer/index/buyer.order.review.ts` |

**One review per completed order.** A buyer gives one review per order: product stars for the whole order, service stars for the seller (pickup, communication, accuracy), one optional comment and one optional photo. The earlier one-review-per-item routes (`/buyer/orders/:id/items/:itemId/review`, `/buyer/products/:id/review-eligibility`, `/seller/product-reviews*`) were removed.

- `POST /buyer/orders/:id/review` (buyer; order must be `completed`). Body `{ "productRating": 1-5, "serviceRating": 1-5, "review"?: "<=2000 chars" }`. Returns 201 `{ id, orderId, serviceRating, rating, productRating, review, photoUrl, sellerResponse, createdAt, updatedAt, editableUntil }` (`rating` equals `serviceRating`). 404 when the order is not the buyer's, 409 `Only completed orders can be reviewed` (pending, cancelled, expired) or `Order already reviewed`, 422 for stars outside 1-5 or a missing star row.
- `PATCH /buyer/orders/:id/review` (buyer). Body: any of `productRating`, `serviceRating`, `review` (an empty `review` removes the comment). Updates the same review. 400 when nothing is sent, 404 when there is no review, 403 `Reviews can only be changed for 15 days` after `editableUntil` (15 days after the review was posted).
- `POST /buyer/orders/:id/review/photo` (buyer, `multipart/form-data`, field `file`: JPG, PNG or WebP, up to 5 MB). Adds or replaces the photo. Same 15-day window. 400 for a wrong or fake image.
- `GET /buyer/orders/:id/review` (buyer) and `GET /seller/orders/:id/review` (seller) return the shape above. `photoUrl` is a signed link that expires in one hour.
- `GET /seller/reviews` rows now also carry `serviceRating`, `productRating` and `photoUrl`. `POST /seller/reviews/:id/reply` and `POST /seller/orders/:id/review-response` answer the one review once.
- `GET /marketplace/products/:id/reviews` returns the product stars buyers gave on orders that included the product (one rating counts once per product in that order), each with the shared comment, `photoUrl` and `sellerResponse`.
- **Seller trust rating** = average of `serviceRating` across orders (`GET /buyer/sellers/:id/rating`, ranking reliability). A service rating of 1 or 2 adds one trust point per order (`low_rating`). Product stars never feed trust points, the seller rating or visibility ranking.

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
| GET | `/conversations` | The user's chats, newest first (`limit`, `cursor`, `archived`). `as=buyer` or `as=seller` shows only chats where the user is on that side (web sends `buyer`, mobile sends `seller`). |
| GET | `/conversations/unread-count` | `{ "unreadMessages": 3, "unreadConversations": 2 }`. Counts messages from the other person that came after the user's last read time. |
| GET | `/conversations/:id` | One chat, same fields as an item in `GET /conversations` (including `unreadCount` and `lastMessageSenderId`). Another person's chat returns 404 `Conversation not found`. |
| GET | `/conversations/:id/messages` | Messages of one chat. |
| POST | `/conversations/:id/messages` | Send a message. A phone number or email is saved as a hidden message (3rd in 90 days adds 1 point). The same message 5 times in 10 minutes returns `429` and pauses sending for 10 minutes (2nd time in 90 days adds 1 point). |
| POST | `/conversations/:id/read` | Mark one chat read. |
| POST | `/conversations/read-all` | Mark all chats read. |

`GET /conversations/unread-count`, `GET /conversations/:id` and `POST /conversations/read-all` also take `as=buyer|seller`. `POST /conversations/:id/archive`, `/unarchive`, `/block` and `/unblock` work for buyers and sellers; only the person who blocked can unblock.

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
| GET | `/seller/weightedvisibility` | `backend/src/modules/seller/index/seller.weighted.surplus.visibility.ts`. Each ranked item has `rank` (position among all sellers' listings, so a seller's own ranks can skip numbers) and `totalRanked` (how many listings are ranked). The app shows "Rank 6 of 40". |
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

`GET /seller/advisories` `reminders[].kind` is `weather`, `heat`, `holiday` or `location`. `heat` appears when a forecast day reaches 35 °C. `holiday` appears only when a public holiday is exactly one day away (Philippine date). `holidays.upcoming` still lists the next 14 days.


Reports (`POST /buyer/orders/:id/report` and `POST /seller/orders/:id/report`) accept the reasons `pickup_problem`, `conduct`, `listing_inaccurate`, `qr_misuse` and `other`. When different people report the same reason about the same person, it becomes a confirmed violation: `listing_inaccurate` = misleading product information, `conduct` = inappropriate communication, `qr_misuse` = QR-code misuse (serious: blocks the account). `pickup_problem` and `other` never count by themselves.

`GET /seller/product-inquiries` returns `{ "items": [...], "nextCursor": null, "openCount": 4 }`. Each item includes `buyerName` and `buyerImage` (a ready-to-open photo link, or `null`). `openCount` is every unanswered product question of this seller, whatever the `status` filter is.

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

**Old "boost again" prompts.** Apply `backend/drizzle/20261101180000_dismiss_boost_prompts`: it marks every leftover `prompt` boost as `dismissed`. Until it runs, those rows are shown as skipped (never "Needs your choice") and listing chips no longer return `priceDropPrompt`. `POST /seller/products/:id/boost` on a listing that is already boosted now returns `409` ("This listing is already boosted. Lower the price from the Price Drops tab.") instead of answering as if a new boost started.

**First post is normal; auto-post decides the 6-hour price drops.** `POST /seller/products/:id/boost` is open to any listing (the seller is asked "Post it on Facebook and Instagram?" after adding produce). The `409`s are: not available, no photo, 3-hour first-post gap, already boosted, and a paused or high-fault-rate seller. A boost already started for the cycle (for example a failed one) can be retried. There is no minimum AHP–TOPSIS score. When the first Facebook post is saved and the listing has auto-post on, the backend schedules the 6-hour rule: with a drop amount and final price already set, `follow_up_due_at` = first post + 6 hours; without them, `price_drop_setup_at` = first post + 6 hours, and the worker sends the seller a **Set Your Price Drop** notice (`price_drop_setup`, once per boost, `price_drop_setup_notified_at`). Without auto-post the listing keeps the normal post and nothing more. `GET /seller/products/:id/boost` returns `eligibility.canBoost` (room and no wait; headline `"Ready to Post"` or `"Posted"`) and `priceDropRule`: `null` until the first post is out, then `{ "state": "waiting_6h" | "set_up_now" | "on" | "ended" | "off", "setupAt": ISO | null, "nextDropAt": ISO | null }`. Apply `backend/drizzle/20261102120000_boost_priority_price_drop_setup` before testing.

**Original stock on Add More.** `POST /seller/products/:id/stock-adjustments` with a positive `delta` on a running listing now raises the current listing cycle's original stock together with the product's, so the Boost "Amount left" and seller analytics match the Listings screen. Apply `backend/drizzle/20261101190000_sync_cycle_original_qty` to repair older listings: it copies the larger product original stock to the current cycle and touches no other rows.

**Running price drops (seller, session).** `GET /seller/price-drops/running`: `{ "items": [{ "boostId", "productId", "productName", "imageUrl", "currentPrice", "lowestPrice", "dropAmount", "nextDropAt": "ISO", "available": true, "message": null, "waitUntil": null }] }`, one per listing whose 6-hour rule is running (drops on, listing active). `available` and `message` are kept for old clients; the app no longer has a button to lower the price by hand. The app shows these on the Price Drops tab, not on the Running tab.

**Lower the price now: removed.** `POST /seller/products/:id/price-drop` no longer exists. Follow-ups are automatic and only for listings with Auto-Post on; the only manual step is the first post.

**Automatic price drops: history and on/off (seller, `Authorization` session, role `seller`).** Apply `backend/drizzle/20261101170000_price_reduction_enabled` first (adds `sellers_product.price_reduction_enabled`, default `true`; seller product reads return it as `priceReductionEnabled`).
- `GET /seller/price-drops?limit=20&cursor=<postedAt>`: Facebook posts that announced a lower price than the post before them, newest first. Response: `{ "items": [{ "id", "productId", "productName", "imageUrl", "caption", "priceBefore": 70, "priceAfter": 60, "postedAt": "ISO", "postUrl" }], "nextCursor": "ISO|null" }`.
- `PATCH /seller/products/:id/auto-post` (seller, Bearer session) body `{ "enabled": true }`: `200 { "productId", "enabled" }`. The seller's yes or no to automatic follow-up posts for one listing (the 6-hour price drop and flash-sale post, and posting again when the listing ranks again). The first post stays manual. Default is off. On saves `auto_post_accepted_at`; off clears any waiting follow-up. Another seller's product returns `404`. The seller product responses include `autoPostEnabled`. The mobile app asks right after a product is added and has the switch in Boost Settings.
- `PATCH /seller/products/:id/price-reduction` body `{ "enabled": false }`: `200 { "productId", "enabled" }`. Off clears the pending 6-hour timer, keeps the amount and final price, and `reduce-price` returns `not_enabled`. On needs a drop amount and `minimumPrice` (else `409` "Set a drop amount and a final price in Edit Listing first") and, if the first post already went out, starts a new 6-hour wait. The Boost screen's drop card shows "price stays the same" while it is off. Another seller's product returns `404`. **Set up in one call:** body `{ "enabled": true, "amount": 3, "minimumPrice": 20 }` saves the peso drop and final price (checked against the selling price) and turns the rule on; the response is `200 { "productId", "enabled", "dropNow" }`. For a boost waiting for its setup, the first drop is due at `price_drop_setup_at` (6 hours after the post), or right away (`dropNow: true`) if that time has passed.

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

## Pickup, QR, declines and trust (Flagging and Trust PDF)

All times are Asia/Manila. Buyers can pick up **today or tomorrow** only. Pickup times move in 15-minute steps. Every rule is checked again on the server when the order is created.

### Stall setup (seller)

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/seller/stall` | none | Weekly hours and `closedToday`. |
| PUT | `/seller/stall/hours` | `{ "days": [{ "weekday": 0-6, "isClosed": false, "opensMinute": 480, "closesMinute": 1200 }] }` | Exactly 7 days. Minutes after midnight. Open days need 1 hour or more. Buyers cannot reserve until hours are saved. |
| PUT | `/seller/stall/closed-today` | `{ "closed": true }` | Hides today's times only. Weekly hours stay. |

### Reserving (buyer)

| Method | Path | Notes |
|---|---|---|
| GET | `/buyer/reservation-status` | `{ canReserve, reason, level, warning }`. Paused or blocked buyers get `canReserve: false` with the reason. |
| GET | `/buyer/sellers/:sellerId/reservation-terms` | What the buyer sees before reserving: `{ shopName, is24Hours, opensMinute, closesMinute, closingBufferMinutes, pickupBy, qrUntil }`. `qrUntil` is when the QR stops: the same as `pickupBy` for a 24-hour stall, closing time for set hours (the seller may still hand over in the last 30 minutes). `pickupBy` is the advised pick-up time: 24 hours after reserving for a stall open 24 hours (or with no hours saved); otherwise 30 minutes before closing today, or on the next open day when today is over or closed. 409 when the stall has no open day in the next 8 days. |
| GET | `/buyer/sellers/:sellerId/pickup-slots` | (Older time picker, no longer used by the website.) Today and tomorrow in 15-minute cells with `available`, `full`, `busy`. |
| POST | `/buyer/orders` | Header `Idempotency-Key`. Body `{ "productId", "quantity" }`. The buyer no longer picks a time: `pickupStart` is the reservation time and `pickupEnd` is the `pickupBy` deadline from `reservation-terms`. Optional `"pickupStart"` and `"pickupEnd"` (older clients) are still checked: 409 for overlap with another of the buyer's open orders (any seller), full capacity, closed, outside hours, last 30 minutes before closing. 403 for paused or blocked buyers. |
| POST | `/buyer/checkouts` | Same, with `items`. Optional `pickups: [{ "sellerId", "pickupStart", "pickupEnd" }]` (one per seller) for older clients. |
| POST | `/buyer/orders/:id/cancel` | Only before the seller (or the 3-hour rule) confirms. After that: 409 "This order has already been confirmed by the seller. Buyer cancellation is no longer available." Within 3 hours of pickup adds 1 trust point. |

Order responses now include `pickupStart`, `pickupEnd`, `confirmedAt`, `confirmationMode` (`manual` or `auto`), `packedAt`, `readyAt`, `progress` (`placed, confirmed, preparing, ready, completed` plus `terminal`), `qr` (`status`: `not_yet_valid | active | expired`, `validFrom`, `validUntil`), `canCancel`, `cancelBlockedReason`, `disclaimer`, and on the detail route `stall` (address, directions link, away), `decline`, `excuse`, `noShow`, `reschedules`, `history`. The QR works until `qr.validUntil` (saved as `expiresAt`): 24 hours after reserving for a 24-hour stall, closing time for set hours, or `pickupEnd` + 15 minutes for orders made with a chosen range. A late cancellation (1 point) is one made within 3 hours of `pickupEnd`.

### Seller order steps

| Method | Path | Notes |
|---|---|---|
| POST | `/seller/orders/:id/confirm` | Manual confirmation. The worker confirms by itself 3 hours after the order was placed. |
| POST | `/seller/orders/:id/pack` / `/ready` | After confirmation. "Ready" does not complete the order. |
| POST | `/seller/orders/scan` | Completes only with a valid QR inside its window, once. Every try is saved in `order_qr_scans`. |
| POST | `/seller/orders/:id/no-show` | Only after the pickup time and QR time are over. First no-show = warning, 0 points; later = 2 points. The worker records it after 1 hour if the seller does not. |
| POST | `/seller/orders/:id/reschedule` | `{ pickupStart, pickupEnd, reason }`. Nothing changes until the buyer accepts. |
| POST | `/buyer/orders/:id/reschedule/respond` | `{ "accept": true }`. Accepting moves the pickup and QR window. |
| POST | `/seller/orders/:id/excuse/decide` | `{ "accept": true }`. |

### Decline at pickup

| Method | Path | Notes |
|---|---|---|
| POST | `/buyer/orders/:id/decline` | `multipart/form-data`: `reason` (`spoiled, wilted_far, wrong_item, short_weight, contamination` are valid; `small_size, changed_mind, no_longer_wants, arrived_late` are not), optional `details`, optional `items` (JSON `[{itemId, quantity}]`, whole order if left out), `capturedAt`, `photo` (JPG/PNG/WebP under 5 MB, taken in the app in the last 10 minutes). A reason that is not allowed closes at once (buyer +1, stock restored). A photo already used before goes to an admin. |
| POST | `/seller/orders/:id/decline/respond` | `multipart/form-data`: `action` = `accept` or `dispute`, optional `note`, `photo`. 24 hours; silence counts as accepted. A dispute saves the note and photo and ends the wait at once: nobody gets points, the order closes as declined at pickup, and the produce is not put back in stock. |
| POST | `/buyer/orders/:id/excuse` | `{ "reason": "rain|sick|no_transport|other", "details" }`. 24 hours after the order expired, once per 30 days. |

Outcomes, all decided by the system: allowed reason with a new photo and the seller accepts or stays silent for 24 hours = seller +2 (declined amount is **not** put back in stock); the seller disputes = nobody gets points, status `disputed`, declined amount **not** put back in stock; reason not allowed = buyer +1 (stock restored); photo already used on another decline = buyer +2 (stock restored). One trust event per order.

### Trust (user)

| Method | Path | Notes |
|---|---|---|
| GET | `/trust/me` | Score (90 days), level, `guidance` (what to do now), `nextLevel` (`label`, `atPoints`, `pointsToGo`, or null), `ladder` (every level with `fromPoints` and a plain summary), `serious`, events with `canDispute`, and for sellers the fault rate, Bayesian rating, `trustedSeller`, `underWatch`, `needsReview`, `canBoost`. |
| POST | `/trust/events/:id/dispute` | `{ "reason" }` (10+ letters). Within 7 days of the event. The system answers at once by checking the stored order, rating, decline or question record against the rule that made the event. Response adds `result` (`upheld`, `rejected` or `unresolved`) and `because`. `upheld` removes the event and recalculates the score; `unresolved` (events from reports, no record to check) leaves the event counting. |
| POST | `/buyer/orders/:id/report`, `/seller/orders/:id/report` | `details` needs 20+ characters. One report per order per person. Two different people on the same reason confirm it. A pair that confirmed twice in 90 days needs a third independent reporter; until then it stays an allegation at 0 points. |

Levels: 0-1 good standing, 2-3 notice, 4-5 warning, 6-7 pause 24 hours, 8-11 pause 3 days, 12+ block. A seller's pause or block also needs 10+ orders and a fault rate of 10%+, otherwise the seller stays at Warning ("Under watch"). Fault rate 15%+ = "High fault rate": no Priority Boost, no Trusted Seller badge.

### Scheduled jobs (worker, every 60 seconds)

3-hour auto-confirmation, order expiry (QR + 15 minutes), unmarked no-shows after 1 hour, 24-hour decline auto-accept, level recalculation when points fade, 12/24/48-hour reply timers (run only while the stall is open), notices. Each step is one conditional database update, so running twice does nothing twice.

## Database migration

The app code does not apply migrations on startup. Apply all migrations in `backend/drizzle/` before using the backend.

**Away is automatic.** There is no switch. A seller who has not used the app for 30 minutes shows as Away (`seller.away` on the product and `stall.away` on the buyer order). It changes only what buyers see: orders, pickup times, QR codes and the 3-hour auto-confirm are the same. The removed routes are `PUT /seller/stall/away` and `PUT /seller/stall/settings` (pickup capacity and pickup-within are no longer used for new orders).

## Endpoints the seller mobile app calls (added so the list is complete)

Checked against the route files on 2026-11-12. Every route here needs a signed-in session unless noted; seller routes need the `seller` role.

| Method | Path | What it does |
|---|---|---|
| POST | `/auth/check-email` | Public. Tells the sign-up screen whether an email already has an account. |
| POST | `/auth/register-role` | Adds the seller role at sign-up. |
| GET, POST | `/conversations` | List the person's chats (`as=buyer` or `as=seller`) or start one. |
| GET | `/conversations/unread-count`, `/conversations/:id`, `/conversations/:id/messages` | Unread number, one chat, its messages. |
| POST | `/conversations/:id/messages`, `/read`, `/archive`, `/unarchive`, `/block`, `/unblock`, `/conversations/read-all`, `/conversations/attachment` | Send, mark read, archive, block, mark all read, upload a photo. |
| POST, DELETE | `/notifications/devices`, `/notifications/devices/:id` | Register or remove a phone for push. |
| GET, POST | `/seller/notifications`, `/seller/notifications/:id/read`, `/seller/notifications/read-all` | The seller's notice feed. |
| GET | `/seller/orders`, `/seller/products`, `/seller/reviews`, `/seller/vegetable-catalog` | Reservations, listings, ratings, catalog. |
| POST | `/seller/orders/:id/confirm`, `/pack`, `/ready`, `/no-show` | Order steps. Also `/decline/respond`, `/excuse/decide`, `/reschedule`. |
| GET, POST | `/seller/inquiries`, `/seller/product-inquiries` and `/:id/reply` | Questions about orders and listings. |
| POST | `/seller/reviews/:id/reply` | Answer a review. |
| GET, POST | `/seller/products/:id/boost`, `/seller/boosts` | Start and list Boosts. |
| GET, POST | `/seller/boost-prompts`, `/read-all`, `/:id/read`, `/:id/dismiss` | Prompts to set up a Boost. |
| PATCH | `/seller/products/:id/auto-post`, `/seller/products/:id/price-reduction` | Turn follow-up posts and 6-hour price drops on or off. |
| GET | `/seller/price-drops`, `/seller/price-drops/running` | Price drop history and the drops running now. |
| GET, PUT | `/seller/stall`, `/hours`, `/settings`, `/closed-today`, `/away` | Stall hours, limits, Closed today and Away. |
