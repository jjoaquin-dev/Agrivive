# Seller and trust manual API checks

Use Postman or Elysia OpenAPI at `http://localhost:3000`. Keep all credentials and OTPs in your local environment. These checks have not been marked complete until you run them and report the results.

## Setup and rollout

1. Configure `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ORDER_QR_SECRET`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` in `backend/.env`. Resend must accept the configured sender address.
2. Apply the generated Drizzle migrations to a database whose existing migration history is aligned with the two current baseline migrations. The product CRUD migration adds `product_stock_adjustments`; the visibility migration adds `listing_cycles.vegetable_key` and backfills existing cycles. Do not rerun the initial migration against an already-created schema; that was the source of the earlier `order_status already exists` error.
3. Stop the old API, apply migrations, run `bun scripts/start-seller-rollout.ts` once to snapshot pending orders for unverified existing sellers, then start the new API with `bun run dev`. The snapshot gives only those orders a 24-hour scan grace. Do not create orders between the snapshot and restart.
4. Run `bunx tsc --noEmit` and `bun build src/index.ts --outdir dist --target bun` from `backend/`.

## Authentication

- Try signup with `role: ["admin"]` or `isActive: false`. The new account must remain an active buyer. Neither field is client-writable.
- Send `POST /api/auth/email-otp/send-verification-otp` with `{ "email": "seller@example.com", "type": "email-verification" }`. Use the emailed code in `POST /api/auth/email-otp/verify-email` with `{ "email": "seller@example.com", "otp": "123456" }`.
- TOTP is optional security configurable in Profile settings. With the user's session cookie or bearer token, send `POST /api/auth/two-factor/enable` with `{ "password": "your-password", "method": "totp" }`. Scan the returned `totpURI` locally in an authenticator app, then send `POST /api/auth/two-factor/verify-totp` with `{ "code": "123456" }`. Protect the TOTP URI and backup codes as secrets. If enabled, subsequent logins require completing the TOTP challenge or entering a backup code.
- Try `POST /api/auth/sign-in/email-otp`. It must be forbidden; sellers sign in with password (and complete the TOTP challenge if they enabled it).
- Before email OTP verification, `POST /seller/profile` returns 403. After email verification, an active account can call `POST /seller/profile` and receive 201 without requiring TOTP. Creating a second current profile returns 409. The older `POST /seller/addprofile` URL remains available.

## Seller profile CRUD

Use `Authorization: Bearer <verified seller or buyer token>` for creation. The account must have completed email OTP. Other profile routes require a seller bearer token.

1. `POST /seller/profile` creates a current seller profile and returns 201 with `profile.id`. A verified buyer receives the seller role as part of creation. Example JSON body:

   ```json
   {
     "shopName": "Joaquin's Vegetable Stall",
     "detailAddress": "Stall 12, Davao City Public Market",
     "latitude": 7.0731,
     "longitude": 125.6128,
     "phoneNumber": "09123456789"
   }
   ```

   The old `POST /seller/addprofile` URL still returns its original `profile.user` response shape. A second current profile returns 409. Blank text or latitude outside −90 to 90 or longitude outside −180 to 180 is rejected.
2. `GET /seller/profile` returns the current profile. `PATCH /seller/profile` accepts a nonempty subset such as `{ "shopName": "Joaquin's Fresh Produce", "longitude": 125.61 }` and returns the updated profile. `{}` and out-of-range coordinates are rejected. The request cannot set `userId` or `isCurrent`.
3. `DELETE /seller/profile` takes no body. With a live pending order it returns 409; with an unanswered order inquiry it also returns 409. The profile and active listings remain unchanged after either rejection. Finish or resolve those obligations, then retry: expect 204 with an empty body. Repeating the delete returns 204.
4. After archive, `GET /seller/profile` and `PATCH /seller/profile` return 404. Seller listings are still stored but have `isActive: false` and cannot receive new reservations. A verified account can `POST /seller/profile` again; the archived profile remains in history and old listings stay inactive until restored individually with `POST /seller/products/:id/reactivate`.

## Listings and reservations

- `POST /seller/addproduct` requires `Authorization: Bearer <seller token>` and a verified seller profile. Example body:

```json
{
  "productName": "Fresh Tomatoes",
  "imagUrl": "https://example.com/tomatoes.jpg",
  "productPrice": 65,
  "productQty": 17.70,
  "productType": "Fruit Vegetables",
  "scalingType": "kilo",
  "isMarketable": true
}
```

- `GET /seller/products`, `GET /seller/weightedvisibility`, `GET /seller/profile`, and `PATCH /seller/profile` return only the authenticated seller's records. An anonymous visibility request must return 401; another seller cannot edit a product ID they do not own.
- `PATCH /seller/products/:id` accepts fields such as `{ "productPrice": 60, "isMarketable": false }`. `POST /seller/products/:id/restock` accepts `{ "quantity": 2.25 }`. `POST /seller/products/:id/deactivate` takes no body. A deactivated or nonmarketable listing cannot receive new reservations.
- A legacy listing lacking score inputs is shown as unscored. Update its inventory date and marketability; restock if needed. Eligible listings return a score, tier, inputs, evaluation time, and `visibility-v2` policy version.
- `POST /buyer/orders` requires buyer bearer auth and a new `Idempotency-Key` header. Example: `{ "productId": "<product UUID>", "quantity": 2.30 }`. An unverified seller's listing must reject a new reservation without deducting stock. The current workspace exposes direct order creation; any future batch path that calls `reserveOrderItem` inherits the same check.
- An existing unverified seller can scan only the pre-rollout pending orders captured by the snapshot, and only before their grace deadline. New order scans require both verification steps.

## Cancellation, inquiries, and notices

- `POST /seller/orders/:id/cancel` with seller bearer auth and `{ "reason": "Unable to fulfill the reserved quantity" }` returns a cancelled order with `cancelledBy: "seller"`. Its stock is restored once, a verified trust event is recorded, and seller/buyer notices are queued. A second cancellation returns 409. Other sellers receive 403.
- `POST /buyer/orders/:id/inquiries` with `{ "question": "What time can I collect this?" }` creates one open inquiry on an active order. A second unanswered inquiry returns 409. `GET /buyer/orders/:id/inquiries` and `GET /seller/orders/:id/inquiries` show it only to the order parties.
- `POST /seller/inquiries/:id/reply` with `{ "reply": "You may collect at 4 PM." }` closes the response clock. The seller may reply after the order closes. A second reply returns 409.
- At 12 hours without a reply, a seller reminder is queued; at 24 hours, a seller warning and buyer notice; at 48 hours, a verified non-response event. Inspect `GET /seller/trust` and `GET /buyer/notices`. Re-running the worker must not duplicate notices or events. For a disposable local database, you can move an inquiry's `created_at` backward to each deadline and wait up to one minute for the scheduler. Do not change production inquiry timestamps to test this.

## Reviews, reports, correction, and admin

- After a seller scans a QR and completes an order, `POST /buyer/orders/:id/review` accepts `{ "rating": 5, "review": "Pickup was smooth" }`. A pending order returns 409; a second review returns 409. The seller can `POST /seller/orders/:id/review-response` with `{ "response": "Thank you" }` once. Review text appears only in each party's `GET /orders/:id/review`; `GET /buyer/sellers/:id/rating` shows only count and average.
- Either participant can `POST /buyer/orders/:id/report` or `POST /seller/orders/:id/report` with `{ "reason": "pickup_problem", "details": "Describe what happened" }`. Each participant can report an order once. A report creates a private allegation flag; it cannot deactivate an account.
- `GET /seller/trust` gives the seller verified event IDs. `POST /seller/trust/events/:id/correction` with `{ "reason": "The recorded event is incorrect" }` checks the source order or inquiry automatically and returns `confirmed` or `invalidated`. A repeat request returns 409.
- `GET /admin/performance` requires an active, server-assigned admin role and returns aggregate counts only. Seller or buyer tokens return 403. There are no admin write or punishment endpoints.

Automated suspensions and blocking remain disabled until a separate policy defines weights, thresholds, durations, and correction rules.

## Seller product full CRUD

Use `Authorization: Bearer <verified seller token>` for every route below. The seller must have completed email OTP, TOTP, and a current profile. Replace `<product UUID>` with a product owned by that seller.

1. `POST /seller/products` creates a listing with the same JSON body shown in **Listings and reservations** above. Expect 201 with `products.id`. The existing `POST /seller/addproduct` remains available. Posting the same normalized name and selling unit again, including after archive, returns 409.
2. `GET /seller/products` lists all owned products, including archived ones. `GET /seller/products/<product UUID>` returns one product; another seller's token or a missing ID returns 404.
3. `PATCH /seller/products/<product UUID>` can update category and other editable fields. For example:

   ```json
   { "productType": "Fruit Vegetables", "productPrice": 60.25, "isMarketable": true }
   ```

   Try `{}` and a price with three decimal places; both must be rejected. `scalingType` and `productQty` are not PATCH fields. Editing price or name must not change the saved item and price on an existing order. A historical duplicate listing can still receive an unrelated field update; changing its name to another existing normalized name returns 409.
4. `POST /seller/products/<product UUID>/restock` with `{ "quantity": 2.25 }` increases available stock by 2.25 and records a `Restock` ledger entry. `POST /seller/products/<product UUID>/stock-adjustments` accepts a signed delta and a reason:

   ```json
   { "delta": -1.25, "reason": "Damaged stock removed" }
   ```

   A positive delta also increases stock. Zero, more than two decimal places, a reduction greater than available stock, and a result above the product limit must be rejected. Check the ledger locally with `SELECT delta, before_qty, after_qty, reason FROM product_stock_adjustments WHERE product_id = '<product UUID>' ORDER BY created_at DESC;`.
5. `DELETE /seller/products/<product UUID>` returns 204 and archives the listing. Repeat it to confirm 204 again. The seller's GET routes still return the product with `isActive: false`; a buyer cannot reserve it. An already pending order remains available for its existing pickup or cancellation flow.
6. Restock an archived product and confirm it remains inactive. `POST /seller/products/<product UUID>/reactivate` takes no body and returns the active product only when stock is positive, price is valid, and `isMarketable` is true. A failed attempt returns 409. A successful restore starts a new listing cycle; repeating it leaves that cycle unchanged.
7. For a concurrency check, submit a buyer order and a stock reduction close together against a low-stock product. The resulting available stock must never be negative, and neither request may overwrite the other's quantity change.

## Weighted surplus visibility

Use `GET http://localhost:3000/seller/weightedvisibility` with `Authorization: Bearer <verified seller token>`. There is no request body. The response keeps `{ "message": "Fetched", "weightedSurplus": [...] }`. Each eligible entry has a `score`, `tier`, `inputs`, `evaluatedAt`, and `policyVersion: "visibility-v2"`. An unscored entry has `score: null`, `tier: null`, and a reason. The score controls prototype promotion priority; it does not certify freshness or food safety.

1. Create a marketable product with positive stock using `POST /seller/products` and the JSON example above. Its score entry should include `inputs.postingAge`, `remainingQuantity`, `recurrence`, `priorCycles`, and `vegetableKey`. A newly posted item has `postingAge` near zero, `remainingQuantity: 1`, and `priorCycles: 0` when the seller has no matching cycles from the last 30 days.
2. Archive and reactivate the product using `DELETE /seller/products/<product UUID>` and `POST /seller/products/<product UUID>/reactivate`. The archived item must be unscored. Reactivation creates another publication cycle; the earlier cycle should contribute one to `priorCycles` and `1/3` to `recurrence`.
3. To check recurrence across product IDs, post the same name with a different selling unit, such as `kilo` then `pile`. Names with case or extra internal spaces, such as `Fresh Tomatoes` and `  FRESH   TOMATOES  `, use the same prototype `vegetableKey`. The second listing's `priorCycles` should include the first listing's earlier cycle. The duplicate guard prevents a second listing with the same name **and** selling unit.
4. Rename a product with `PATCH /seller/products/<product UUID>` and `{ "productName": "Roma Tomatoes" }`. Its current cycle retains the name captured when that cycle began. Archive and reactivate to start a cycle with the new name. Earlier cycles remain under their original name. The first migration backfills historical cycles from each product's name at migration time because earlier names were not stored.
5. Change a listing to `{ "isMarketable": false }`, archive it, or reduce its available stock to zero; each state should give `score: null` with `Listing is not eligible`. A legacy listing without original quantity or publication time stays unscored with `Missing score inputs` until the seller supplies or initializes those inputs.
6. Compare the raw formula `0.30P + 0.30Q + 0.25I + 0.15R` with the returned score, rounded to four decimals. The server assigns `priority` at raw score `>= 0.70`, `standard` at `>= 0.40`, otherwise `basic`; display rounding cannot change the tier. Cycles older than 30 days stop contributing to recurrence.
7. Repeat the GET with another seller's token and with no token. The first result contains only that seller's listings; the anonymous request is denied.

This prototype equates vegetables by trimmed, space-collapsed, lowercase product name. Spelling variants and synonyms remain separate until a standardized vegetable catalog is approved. Buyer ranking and automated promotion are outside this seller score API.
