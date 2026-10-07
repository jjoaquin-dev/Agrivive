# Agrivive backend

## Local setup

Copy `.env.example` to `.env`, set `DATABASE_URL`, and fill the provider credentials needed for the flow you are testing. Keep `.env` local and ignored.

Install dependencies and apply migrations before starting the API:

```bash
bun install --frozen-lockfile
bunx drizzle-kit migrate
```

Start the API and the scheduled worker in separate terminals:

```bash
bun run dev
bun run worker:dev
```

For a built or hosted process, run `bun run start` for the API and `bun run worker` as a separate process. Do not run the worker inside multiple API replicas.

The API listens on `http://localhost:3000`. The worker expires pending reservations, processes inquiry deadlines, sends queued trust notices, delivers new-listing notices to current followers, and processes promotion jobs every 60 seconds. Promotion checks are stored with hourly due times; run exactly one worker. A listing event is created only once, when a product first becomes public and buyable; existing products are marked as already announced by the migration.

Before testing seller follows, apply `backend/drizzle/20261005213227_seller_follow_notices` to a disposable or owner-approved database. Do not apply this migration to production as part of the code-only batch. Applying migrations is an explicit release step; the app does not apply them on startup.

## Market Basket Analysis

The MBA pipeline lives under `analytics/mba/` and does not insert synthetic orders into the application database. Synthetic mode is for demonstration and local testing only:

Run the generator from the repository root:

```powershell
$env:MBA_MODE = "synthetic"
python analytics/mba/run_mba.py
```

Use `MBA_MODE=live` only when a read-only completed-order source is available. Live mode reports `collecting` and returns no rules until `MBA_MIN_COMPLETED_BASKETS` usable completed baskets exist. Cancelled, expired, pending, incomplete, and synthetic records are excluded. n8n remains disabled until live rules are reviewed.

The buyer recommendation endpoint reads the generated report without running Python during a request:

```text
GET /marketplace/products/:id/recommendations
```

Set `MBA_REPORT_DIR` when the report directory differs from `../analytics/mba/output`. Synthetic recommendations are shown only outside production with a demo label and resolve to currently available marketplace listings. Live recommendations remain hidden while the report is collecting.

For local email testing set `EMAIL_PROVIDER=mailtrap`. Production should set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`. OTP values are never written to logs unless `ALLOW_DEV_EMAIL_LOG=true`.

## Verification

```bash
bunx tsc --noEmit
bun build src/index.ts --outdir dist --target bun
bun build src/worker.ts --outdir dist --target bun
bunx drizzle-kit check
```

The owner should manually verify authenticated API journeys in OpenAPI or Postman, including email delivery, S3 uploads, reservation expiry, QR pickup, and report evidence.

Seller follows require an active buyer session. Use `GET /buyer/follows/:sellerId`, `POST /buyer/follows/:sellerId`, and `DELETE /buyer/follows/:sellerId` with the Better Auth session cookie or bearer session token. There is no request body. Each returns `{ "sellerId": "<id>", "following": true|false }`; save and remove are safe to repeat. Self-follow returns 403 and a seller without a visible storefront returns 404. A followed seller's first new public listing creates an in-app notice when the worker runs. The buyer inbox returns `id: "listing:<uuid>"`, `kind: "seller_new_listing"`, product and seller IDs, name snapshots, and whether the product is still available. Read one with `POST /buyer/notices/:id/read` (URL-encode the ID if needed), or all with `POST /buyer/notices/read-all`; neither accepts a body. Both operations are recipient-scoped. The existing order-notice IDs remain unchanged. Unfollowing before worker delivery stops that pending notice; prior notices remain.

## Priority Boost share drafts

Set `N8N_PROMOTION_WEBHOOK_URL` and `N8N_PROMOTION_SERVICE_TOKEN` in the backend's private `.env`. Configure the same shared token as an n8n Header Auth credential, plus a separate Groq API credential; neither credential belongs in the repository. Import `n8n/workflows/agrivive-priority-promotion.json`, attach the credentials after import, and replace the example backend origin in its HTTP Request nodes. The workflow export contains no keys or tokens. Set the Groq model ID to one enabled for the account; the included model setting is configurable because provider model access can vary.

The backend computes promotion eligibility from the same `visibility-v4` score used by seller visibility and requires at least `0.70`, a current listing cycle, an active/marketable listing with stock, and a publicly visible seller profile. A newly created cycle is first checked on a later worker pass and remains scheduled for hourly checks while it stays valid and below the threshold. An initial draft creates one follow-up check due six hours after the initial draft is ready. Existing listing cycles are marked skipped by migration so rollout does not create historical promotions.

Use `GET /seller/promotions?limit=20` to list the signed-in seller's ready drafts. Mark one read with `POST /seller/promotions/:id/read` or all with `POST /seller/promotions/read-all`; both require no body. The mobile app obtains a fresh share payload through `GET /seller/promotions/:id/share`. A listing that no longer qualifies returns HTTP 409 and is not shared. The seller must choose a destination or cancel in the native share sheet; n8n never posts to a social account and never changes the price.

Protected n8n callbacks use `Authorization: Bearer <N8N_PROMOTION_SERVICE_TOKEN>`:

```text
GET  /integrations/promotions/jobs/:id/context
POST /integrations/promotions/jobs/:id/draft       {"headline":"...","caption":"..."}
POST /integrations/promotions/jobs/:id/failure     {"code":"invalid_draft"}
```

The worker sends only `{ "jobId": "<uuid>", "stage": "initial|followup" }` to n8n. Callback retries are bounded; terminal failure status and a non-sensitive reason are stored for diagnosis. Do not apply `backend/drizzle/20261007082243_seller_priority_promotions` to production as part of this implementation. Apply it only to a disposable or specifically approved test database before manual endpoint acceptance.

`GET /seller/analytics/summary` now returns a factual summary from the already-computed metrics without waiting on an external AI service. Trust monitoring uses policy `monitoring-v2`: verified non-response = 1 point, verified cancellation = 2 points, and each completed order with a 1–2-star rating = 1 rating signal, counted once per order. Written review text is context only; unverified report flags contribute zero points. Neither the score nor the admin page restricts an account.

Buyer profile photo endpoints:

- `GET /buyer/profile` returns the signed-in buyer profile and a signed display URL when a photo exists.
- `POST /buyer/profile/avatar` accepts a `multipart/form-data` request with a `file` field. Accepted files are JPEG, PNG, or WebP up to 5 MB. The request requires an active buyer session and stores the image under the configured S3 avatar path.
