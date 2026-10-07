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

Protected endpoints use the signed-in user's Better Auth session. Public routes need no login. Seller routes still check active seller verification/profile requirements inside their services. The admin API is read-only monitoring; do not add moderation or account action endpoints.

## Root and system

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/` | Public | `backend/src/index.ts` |
| GET | `/a` | Public | `backend/src/index.ts` |
| GET | `/health` | Public liveness | `backend/src/index.ts` |
| GET | `/health/ready` | Public database readiness | `backend/src/index.ts` |

## Authentication

Better Auth handles its routes under `/api/auth/*`; see `backend/src/modules/auth/index.ts`. The exact operations depend on the Better Auth plugins enabled there. The current setup includes email/password, email verification codes, bearer sessions, TOTP, and Expo support.

## Marketplace (public)

| Method | Path | Route source |
|---|---|---|
| GET | `/marketplace/products` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/products/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/products/:id/recommendations` | `backend/src/modules/marketplace/index/marketplace.product.recommendations.ts` |
| GET | `/marketplace/products/:id/reviews` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/map` | `backend/src/modules/marketplace/index/marketplace.sellers.map.ts` |

`GET /marketplace/products` accepts search and filter fields plus `limit` and `cursor`. It returns a page ranked by visibility score, score tier, newest publication, then product ID. The cursor contains the evaluation time to keep score-based pages in the same order. Visibility currently uses the prototype weights and tiers from `GET /seller/weightedvisibility`; stakeholder validation of those settings is still pending.

`GET /marketplace/sellers/:id` includes `image`, which is a signed seller profile image URL when a photo exists and `null` otherwise.

`GET /marketplace/sellers/map` returns one record per matching seller, including `image` as a signed seller profile image URL when available. Sellers without a photo return `image: null` and the web map shows seller initials instead.

`GET /marketplace/products/:id/recommendations` returns up to three currently available marketplace listings associated with the requested product by the MBA report. Synthetic results are marked with `source: "synthetic"` and `status: "demo"`; live results remain empty while the report is collecting. The route does not require buyer authentication and does not run the Python MBA process during a request.

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

For report evidence, first `POST /buyer/orders/:id/report` with the existing report body. Use the returned report ID in the evidence paths. Upload `multipart/form-data` with a `file` field (JPG, PNG, WebP, or PDF, up to 5 MB). Only the report creator can request its short-lived download links.

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
| POST | `/seller/products` | `backend/src/modules/seller/index/seller.product.create.ts` |
| POST | `/seller/addproduct` (legacy alias) | `backend/src/modules/seller/index/seller.product.create.ts` |
| GET | `/seller/products` | `backend/src/modules/seller/index/seller.products.ts` |
| GET | `/seller/products/:id` | `backend/src/modules/seller/index/seller.product.get.ts` |
| PATCH | `/seller/products/:id` | `backend/src/modules/seller/index/seller.products.ts` |
| DELETE | `/seller/products/:id` | `backend/src/modules/seller/index/seller.product.archive.ts` |
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
| GET | `/seller/promotions` | `backend/src/modules/seller/index/seller.promotions.ts` |
| POST | `/seller/promotions/:id/read` | `backend/src/modules/seller/index/seller.promotions.ts` |
| POST | `/seller/promotions/read-all` | `backend/src/modules/seller/index/seller.promotions.ts` |
| GET | `/seller/promotions/:id/share` | `backend/src/modules/seller/index/seller.promotions.ts` |
| GET | `/seller/analytics/summary` | `backend/src/modules/seller/index/seller.analytics.ts` |
| GET | `/seller/advisories` | `backend/src/modules/seller/index/seller.advisories.ts` |

`GET /seller/products/:id/share` returns a prepared caption, marketplace link, and image URL. Set `WEB_APP_URL` to the buyer web app origin for absolute share links.

Promotion drafts are seller-scoped and separate from the paginated order/trust notification feed. `GET /seller/promotions?limit=20&cursor=<uuid>` returns ready drafts, a next cursor, and the seller's unread draft count. `POST /seller/promotions/:id/read` and `POST /seller/promotions/read-all` require no body. `GET /seller/promotions/:id/share` returns fresh price, quantity, shop, and marketplace URL facts for the native share sheet. If a listing is no longer active, marketable, buyable, publicly visible, and Priority Boost eligible, the share endpoint returns HTTP 409 with `status: "unavailable"`. No post is published automatically.

## Promotion integration (n8n)

These routes use the server-side `N8N_PROMOTION_SERVICE_TOKEN` as `Authorization: Bearer <token>` instead of a buyer or seller session. Keep this token in backend configuration and an n8n credential; never put it in the workflow export.

| Method | Path | Route source |
|---|---|---|
| GET | `/integrations/promotions/jobs/:id/context` | `backend/src/modules/integrations/index/integrations.promotion.context.ts` |
| POST | `/integrations/promotions/jobs/:id/draft` | `backend/src/modules/integrations/index/integrations.promotion.draft.ts` |
| POST | `/integrations/promotions/jobs/:id/failure` | `backend/src/modules/integrations/index/integrations.promotion.failure.ts` |

The worker webhook body contains only `{ "jobId": "<uuid>", "stage": "initial|followup" }`. n8n retrieves the latest public listing context from the protected `context` route, generates wording only, and calls `draft` with `{"headline":"...","caption":"..."}`. Draft callbacks are idempotent. `failure` accepts `{"code":"model_failed|invalid_draft|callback_failed"}` and returns the job to bounded retry or a recorded terminal failure. A ready callback is accepted only after the backend independently confirms current Priority eligibility.

The backend checks initial eligibility hourly using `visibility-v4 >= 0.70`. It queues one follow-up for six hours after the initial draft becomes ready, only if the same listing cycle is still publicly visible, buyable, and Priority eligible. Existing listing cycles are inserted as skipped during migration to prevent historical drafts.

## Admin monitoring

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/admin/performance` | Admin; read-only metrics only | `backend/src/modules/admin/index/admin.performance.ts` |

This endpoint reports aggregate usage, listings, orders, verified trust event counts, report flags, evidence-file totals, notice delivery status, and weighted trust monitoring values. `monitoring-v2` counts verified non-response at 1 point, verified cancellation at 2 points, and one 1–2-star rating signal per completed order at 1 point. Written feedback is context, not machine-scored sentiment. Allegation flags contribute zero points. These are monitoring signals, not a quality score or penalty. Admin monitoring does not approve reports or change user accounts.

Evidence files are stored with private access in the configured S3 bucket. Keep the bucket policy private; download links are signed and expire after five minutes.

## Stakeholder

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/stakeholder/summary` | Stakeholder role | `backend/src/modules/stakeholder/index/stakeholder.summary.ts` |

This response contains aggregate counts only. Add approved stakeholder emails to the server-side `STAKEHOLDER_EMAILS` list; the client cannot set its own role.

## Database migration

The app code does not apply migrations on startup. Apply all migrations in `backend/drizzle/` before using the backend.
