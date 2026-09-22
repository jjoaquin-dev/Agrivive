---
title: Direct Order Backend
type: implementation-status
status: implemented-locally
reviewed: 2026-09-20
---

# Direct Order Backend

## What changed and why

The backend now supports a buyer ordering one product immediately, reserving its quantity, and receiving a signed QR payload. The product's seller scans the payload to complete that seller's order. This establishes the order and QR lifecycle that future cart checkout can reuse when it creates one order per seller account. Payment remains outside the platform.

The direct order expires after 24 hours. Buyer cancellation or expiry restores reserved stock once. Scanning a completed, cancelled, or expired order cannot complete it again. The QR payload is an API string for a client to render; the backend does not generate an image.

## API and data

| Role | Endpoint | Purpose |
|---|---|---|
| Buyer | `POST /buyer/orders` | Create a direct order; send `{ "productId": "uuid", "quantity": 1 }` and an `Idempotency-Key` header. Returns `201`, or `200` for an identical retry. |
| Buyer | `GET /buyer/orders?limit=20&cursor=<order-id>` | List own orders, newest first. |
| Buyer | `GET /buyer/orders/:id` | Read own order and active QR payload. |
| Buyer | `POST /buyer/orders/:id/cancel` | Cancel a pending, unexpired order and restore stock. |
| Seller | `GET /seller/orders` and `GET /seller/orders/:id` | List and read orders for products owned by the seller. |
| Seller | `POST /seller/orders/scan` | Send `{ "qrPayload": "..." }` to complete an owned, pending, unexpired order. |

The order schema adds `cancelled` and `expired` states, an expiry timestamp, product name and unit snapshots, and a checkout record keyed by buyer and idempotency key. A checkout can link several seller orders when batch ordering is added. The migration also grants the seller role to existing seller-profile and product owners. New seller-profile creation grants that role, and product creation now requires it. `ORDER_QR_SECRET` must be set to a value of at least 32 characters before order creation or scanning.

Keep the same `ORDER_QR_SECRET` across server instances and restarts. Changing it invalidates QR payloads for pending orders.

The buyer web client should generate one random idempotency key for a checkout attempt and reuse that key only when retrying the same request. A new purchase needs a new key. Seller QR scanning relies on the pending-order state check instead of an idempotency key.

## Affected files

- `backend/src/db/schema.ts` and `backend/drizzle/20260920064208_direct_order_qr/`: data model and migration, on top of the existing local order migration.
- `backend/src/modules/buyer/`: buyer routes, validation, order transactions, QR signing, and expiry. The order test files described in the original implementation were later removed in the cleanup below.
- `backend/src/modules/seller/index/seller.scan-order.ts`, `backend/src/modules/seller/index.ts`, `backend/src/modules/seller/index/seller.addproduct.ts`, and `backend/src/modules/seller/services/addprofile.service.ts`: seller scan, order views, and role alignment.
- `backend/src/index.ts`: buyer routes and the periodic expiry job.

## Verification and limits

- `bunx tsc --noEmit`: passed.
- `bun test`: 2 passed; database integration tests skipped because `TEST_DATABASE_URL` is not configured. The tests reject a test URL whose database name lacks `test`.
- `bun build src/index.ts --outdir <temporary directory> --target bun`: passed.
- `bunx drizzle-kit check`: passed.
- In-memory route check: buyer and seller order routes registered; unauthenticated buyer order creation and seller scans returned `401`.
- The migration has been generated but has not been applied to a database. Apply the existing local order migration first, then this migration. Run the integration tests against a dedicated PostgreSQL test database before deployment.
- Cart storage and batch checkout are the next phase. Until a stall ID exists, one seller account represents one stall.

No commit was created, so there is no commit hash to record.

## 2026-09-20 cleanup

Consolidated the order-specific monetary calculations and QR signing and verification functions into `backend/src/modules/buyer/services/order.service.ts`. Removed `order.money.ts`, `order.qr.ts`, `order.service.test.ts`, and `order.integration.test.ts` from the same `services/` directory, as requested. The buyer and seller routes and order behavior were not changed. The module paths were later migrated to `backend/src/modules/` after review.

Verification after cleanup: `bunx tsc --noEmit` passed; `bun build src/index.ts --outdir <temporary directory> --target bun` passed; a source search found no remaining imports of the deleted helper files. The test results above were recorded before this cleanup. There are now no order test files, so stock reservation and transition races require manual or future automated verification. No commit was created for this cleanup.

## 2026-09-20 buyer module refactor

Split each exported buyer order service function into its own file so the buyer module follows the feature layout in `AGENTS.md`. Buyer create, list, get, and cancel routes now each have matching files under `index/`, `model/`, and `services/`; reservation, persistence, and expiry each have a separate service file. Shared order access, amounts, QR handling, reads, stock restoration, and types now live under `backend/src/utils/`. Seller order services import shared utilities directly instead of importing buyer services. The API paths and transaction flow remain the same.

The QR verifier's UUID pattern was corrected from four groups to the required five. The old pattern rejected every signed payload generated for a normal UUID order ID.

Affected paths: `backend/src/modules/buyer/index.ts`, `backend/src/modules/buyer/index/`, `backend/src/modules/buyer/model/`, `backend/src/modules/buyer/services/`, `backend/src/modules/seller/index/seller.scan-order.ts`, `backend/src/modules/seller/model/seller.scan-order.ts`, `backend/src/modules/seller/services/seller.scan-order.ts`, `backend/src/utils/order-*/index.ts`, and `backend/src/index.ts`. The previous buyer route, model, and service files were removed after their imports were replaced. No schema or migration files were changed for this refactor.

Verification: `bunx tsc --noEmit` passed; `bun build src/index.ts --outdir dist --target bun` passed. In-memory checks returned `401` for all four buyer order routes and all three seller order routes without authentication. A focused QR and amount check passed for QR issue/verify, tamper rejection, price multiplication, and amount summing. No database integration check was run because a test database was not configured. No commit was created.

## 2026-09-20 order module structure refactor

Reorganized the order implementation to follow the seller module's `index/`, `model/`, and `services/` pattern. The buyer create and list routes now use `buyer.orders.ts` across those directories; the buyer detail and cancellation routes use `buyer.order.id.ts`. `buyer/index.ts` combines both route files. The create service accepts the inferred `OrderInput` type from the `orderModel` validation schema, and the `ReservedOrderItem` DTO, including the stored `productName` snapshot, is declared in the buyer model. The seller QR scan now has its own `seller.scan-order.ts` model and service. The former buyer `buyer.order.model.ts` and `order.service.ts` files were removed after their logic moved. `backend/src/index.ts` imports expiry from the new buyer ID service.

**Why:** Keep validation and DTOs in `model/`, Elysia handlers in `index/`, and order transactions in role-specific services while preserving the direct order and QR behavior. Buyers still submit only `productId` and `quantity`; the server reads `productName` from the stored product.

**Affected files:** `backend/src/modules/buyer/index.ts`, `backend/src/modules/buyer/index/buyer.orders.ts`, `backend/src/modules/buyer/index/buyer.order.id.ts`, `backend/src/modules/buyer/model/buyer.orders.ts`, `backend/src/modules/buyer/model/buyer.order.id.ts`, `backend/src/modules/buyer/services/buyer.orders.ts`, `backend/src/modules/buyer/services/buyer.order.id.ts`, `backend/src/modules/seller/index/seller.scan-order.ts`, `backend/src/modules/seller/model/seller.scan-order.ts`, `backend/src/modules/seller/services/seller.scan-order.ts`, and `backend/src/index.ts`.

**Verification:** `bunx tsc --noEmit` passed. `bun build src/index.ts --outdir <temporary directory> --target bun` passed. An in-memory Elysia route check listed all four buyer and three seller order endpoints. No database test ran; the test files were removed earlier at the user's request. No commit was created for this refactor.

## 2026-09-20 idempotency header schema placement

Moved the `Idempotency-Key` validation schema from `backend/src/modules/buyer/model/buyer.order.create.ts` into the route options in `backend/src/modules/buyer/index/buyer.order.create.ts`. The model now keeps the order body schema and DTOs; the route still passes the header value separately to `createDirectOrder`. Updated `AGENTS.md` so future header schemas stay with their routes. No API payload or service behavior changed.

Affected paths: `backend/src/modules/buyer/model/buyer.order.create.ts`, `backend/src/modules/buyer/index/buyer.order.create.ts`, `AGENTS.md`, and this note. Verification: `bunx tsc --noEmit` and Bun build passed. An in-memory request without `Idempotency-Key` returned `422`; a request with it reached authentication and returned `401` without a session. No database test ran. No commit was created.

## 2026-09-20 fractional order quantities

Changed the buyer order JSON body schema to accept a number such as `2.3`. The previous `multipleOf: 0.01` check rejected valid decimals because of floating-point remainder behavior. Order reservation now permits positive quantities with up to two decimal places, matching the product and ordered-item numeric columns. The amount helper converts quantity to integer hundredths before multiplication and rounds the resulting total to cents, avoiding `BigInt` conversion errors for fractional quantities.

Affected paths: `backend/src/modules/buyer/model/buyer.order.create.ts`, `backend/src/modules/buyer/model/buyer.order.create.test.ts`, `backend/src/modules/buyer/services/buyer.order.reserve.ts`, `backend/src/utils/order-amount/index.ts`, and this note.

Verification: `bun test src/modules/buyer/model/buyer.order.create.test.ts` passed (2 tests), including an in-memory Elysia request with quantity `2.3`, two-decimal precision checks, and price calculation. `bunx tsc --noEmit` passed. `bun build src/index.ts --outdir dist --target bun` passed. No live order or database migration was run. No commit was created.

## 2026-09-20 manual endpoint testing convention

Removed `backend/src/modules/buyer/model/buyer.order.create.test.ts` at the project owner's request. Updated `AGENTS.md` to assign endpoint testing in Elysia OpenAPI or Postman to the project owner and to require a request and response example when an endpoint changes. The test results in the preceding section are historical; the test file is no longer present.

Affected paths: `backend/src/modules/buyer/model/buyer.order.create.test.ts`, `AGENTS.md`, and this note. Verification after removal: `bunx tsc --noEmit` passed; `bun build src/index.ts --outdir dist --target bun` passed; a source file search found no `*.test.ts` or `*.spec.ts` files in `backend/`. Manual `POST /buyer/orders` testing with quantity `2.3` is pending the owner's result. No commit was created.

## 2026-09-20 manual order observations

The project owner subsequently shared direct-order and `GET /buyer/orders` responses showing `2.30` quantity, calculated `149.50` subtotal for a `65.00` unit price, checkout IDs, three pending orders, and complete signed `qrPayload` values. This confirms order creation, listing, and QR payload generation in the owner's local environment. A seller scan sent only the trailing portion of a QR payload and received `Invalid order QR payload`; a successful scan with a complete payload has not yet been reported. Cancellation, expiration and stock restoration, idempotency replay, and fresh-database migration setup also remain unverified.

The migration paths named in the original implementation sections above are historical. The current `backend/drizzle/` folder contains `20260920115300_Initial tables/` and `20260920115509_Initial fixed qty/`; the local database migration journal has eight recorded entries. No schema, migration, or application code was changed for this documentation update. No commit was created.

## 2026-09-21 order verification suite

**Why:** The project owner approved automated tests to confirm the remaining direct-order behavior and requested instructions for running them. A separate test database is required so the checks cannot modify development orders or products.

**Changed:** Added `backend/tests/order.unit.test.ts` for decimal quantity and amount calculations, `backend/tests/order.integration.test.ts` for route-level buyer and seller flows, `backend/tests/test-database.ts` for test URL checks, `backend/tests/migrate-test-db.ts` for fresh test database migrations, and `backend/tests/README.md` for setup and run commands. The integration checks cover product duplicates, stock reservation, idempotency, ownership, QR scan, cancellation, expiry, and competing buyers. The tests use generated accounts and clean up their records after a normal run. No application routes or database schema were changed.

**Verification:** `bun test tests/order.unit.test.ts` passed (2 tests); `bunx tsc --noEmit` passed; `bun build src/index.ts --outdir dist --target bun` passed. The migration script and integration test both rejected a missing `TEST_DATABASE_URL` before connecting to PostgreSQL. `TEST_DATABASE_URL` is not configured yet, so fresh migrations and database-backed behavior remain unverified. The owner can follow `backend/tests/README.md` after creating the separate database. No commit was created.

## 2026-09-21 fractional seller stock

**Why:** A seller could not list `50.5` kg because the add-product request model required an integer, although the `product_qty` database column and buyer order reservation support two decimal places.

**Changed:** `backend/src/modules/seller/model/addproduct.model.ts` now uses decimal-capable numeric validation for `productQty`, from `0.01` through `99999999`. `backend/src/modules/seller/services/addproduct.service.ts` rejects values with more than two decimal places before writing to PostgreSQL. `backend/src/modules/seller/index/seller.addproduct.ts` returns a `400` message for that service error instead of a `500`. No schema or migration file changed.

**Verification:** `bunx tsc --noEmit` and `bun build src/index.ts --outdir dist --target bun` passed. The owner chose manual endpoint testing; a Postman request with `productQty: 50.5` and a valid seller bearer token is pending the owner's result. No commit was created.

## 2026-09-21 manual ordering follow-up

The project owner reports that cancelling an order and restoring its stock work, seller product creation accepts a decimal `productQty`, and purchases from different sellers work. A read-only database check also found a completed order with its product stock at the reserved quantity; scanning changes the order status and does not subtract stock a second time.

The owner wants a cart that submits separate orders, with a different checkout ID for each order. The buyer source currently accepts one `productId` and `quantity` per `POST /buyer/orders` request and creates one checkout and one seller order for that request. Separate purchases from multiple sellers already follow the intended checkout structure. A client cart can submit each item using its own idempotency key; a server-side cart submission endpoint is not registered in the current buyer routes.

This update changes only `Agrivive/04 Delivery/2026-09-20 Direct Order Backend.md`. Verification was the owner's manual report, a read-only database observation, and a source check of `backend/src/modules/buyer/model/buyer.order.create.ts`, `backend/src/modules/buyer/services/buyer.order.create.ts`, and `backend/src/modules/buyer/index.ts`. No commit was created.
