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
| GET | `/marketplace/products/:id/reviews` | `backend/src/modules/marketplace/index/marketplace.products.ts` |
| GET | `/marketplace/sellers/:id` | `backend/src/modules/marketplace/index/marketplace.products.ts` |

`GET /marketplace/products` accepts search and filter fields plus `limit` and `cursor`. It returns a page ranked by visibility score, score tier, newest publication, then product ID. The cursor contains the evaluation time to keep score-based pages in the same order. Visibility currently uses the prototype weights and tiers from `GET /seller/weightedvisibility`; stakeholder validation of those settings is still pending.

## Buyer

Buyer routes require a signed-in active buyer except the public seller rating/review reads noted below.

| Method | Path | Route source |
|---|---|---|
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
| GET | `/buyer/products/:id/inquiries` | `backend/src/modules/buyer/index/buyer.product.inquiry.ts` |
| POST | `/buyer/products/:id/inquiries` | `backend/src/modules/buyer/index/buyer.product.inquiry.ts` |
| GET | `/buyer/products/:id/review-eligibility` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| POST | `/buyer/orders/:id/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/orders/:id/items/:itemId/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| POST | `/buyer/orders/:id/items/:itemId/review` | `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/sellers/:id/rating` | Public; `backend/src/modules/buyer/index/buyer.order.review.ts` |
| GET | `/buyer/sellers/:id/reviews` | Public; `backend/src/modules/buyer/index/buyer.order.review.ts` |

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
| GET | `/seller/analytics/summary` | `backend/src/modules/seller/index/seller.analytics.ts` |
| GET | `/seller/advisories` | `backend/src/modules/seller/index/seller.advisories.ts` |

`GET /seller/products/:id/share` returns a prepared caption, marketplace link, and image URL. Set `WEB_APP_URL` to the buyer web app origin for absolute share links.

## Admin monitoring

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/admin/performance` | Admin; read-only metrics only | `backend/src/modules/admin/index/admin.performance.ts` |

This endpoint reports aggregate usage, listings, orders, verified trust event counts, report flags, evidence-file totals, notice delivery status, and weighted trust monitoring values. Weighted points count recorded verified events; they are monitoring signals, not a quality score or penalty. Allegation flags are counted separately and do not affect weighted points. Admin monitoring does not approve reports or change user accounts.

Evidence files are stored with private access in the configured S3 bucket. Keep the bucket policy private; download links are signed and expire after five minutes.

## Stakeholder

| Method | Path | Access | Route source |
|---|---|---|---|
| GET | `/stakeholder/summary` | Stakeholder role | `backend/src/modules/stakeholder/index/stakeholder.summary.ts` |

This response contains aggregate counts only. Add approved stakeholder emails to the server-side `STAKEHOLDER_EMAILS` list; the client cannot set its own role.

## Database migration

The app code does not apply migrations on startup. Apply all migrations in `backend/drizzle/` before using the backend.
