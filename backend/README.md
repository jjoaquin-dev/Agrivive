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

The API listens on `http://localhost:3000`. The worker expires pending reservations, processes inquiry deadlines, sends queued trust notices, delivers new-listing notices to current followers, and sends Boost follow-ups every 60 seconds; run exactly one worker. A listing event is created only once, when a product first becomes public and buyable; existing products are marked as already announced by the migration.

Before testing seller follows, apply `backend/drizzle/20261005213227_seller_follow_notices` to a disposable or owner-approved database. Do not apply this migration to production as part of the code-only batch. Applying migrations is an explicit release step; the app does not apply them on startup.

For local email testing set `EMAIL_PROVIDER=mailtrap`. Production should set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`. OTP values are never written to logs unless `ALLOW_DEV_EMAIL_LOG=true`.

Web Google sign-in uses Better Auth's built-in Google provider. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the backend `.env`, keep `BETTER_AUTH_URL=http://localhost:3000` for local development, and add `http://localhost:3000/api/auth/callback/google` to the Google Cloud OAuth client's authorized redirect URIs. The web client sends users back to the current web page after Google sign-in. A new Google identity is registered as a buyer; an existing matching Google identity is signed in.

## Verification

```bash
bunx tsc --noEmit
bun build src/index.ts --outdir dist --target bun
bun build src/worker.ts --outdir dist --target bun
bunx drizzle-kit check
```

The owner should manually verify authenticated API journeys in OpenAPI or Postman, including email delivery, S3 uploads, reservation expiry, QR pickup, and report evidence.

Seller follows require an active buyer session. Use `GET /buyer/follows/:sellerId`, `POST /buyer/follows/:sellerId`, and `DELETE /buyer/follows/:sellerId` with the Better Auth session cookie or bearer session token. There is no request body. Each returns `{ "sellerId": "<id>", "following": true|false }`; save and remove are safe to repeat. Self-follow returns 403 and a seller without a visible storefront returns 404. A followed seller's first new public listing creates an in-app notice when the worker runs. The buyer inbox returns `id: "listing:<uuid>"`, `kind: "seller_new_listing"`, product and seller IDs, name snapshots, and whether the product is still available. Read one with `POST /buyer/notices/:id/read` (URL-encode the ID if needed), or all with `POST /buyer/notices/read-all`; neither accepts a body. Both operations are recipient-scoped. The existing order-notice IDs remain unchanged. Unfollowing before worker delivery stops that pending notice; prior notices remain.

## Boost visibility

Seller-confirmed Boost Visibility uses `N8N_VISIBILITY_BOOST_WEBHOOK_URL` and `N8N_VISIBILITY_BOOST_SERVICE_TOKEN`. The worker sends n8n only a `boostId` and `reason`; n8n must fetch the current, protected context from `GET /integrations/visibility-boosts/:id/context` with the same Bearer token before posting the current product facts. The backend accepts only HTTPS webhook origins outside local development.

`GET /seller/analytics/summary` now returns a factual summary from the already-computed metrics without waiting on an external AI service. Trust monitoring uses policy `monitoring-v3`: verified non-response = 1 point, verified cancellation = 2 points, and each completed order with a 1–2-star rating = 1 rating signal, counted once per order. Written review text is context only; unverified report flags contribute zero points. The exact weights and configurable thresholds are prototype policy settings, and trust actions remain disabled until `TRUST_ACTIONS_ENABLED=true` is explicitly approved. When enabled, the system can create warning, temporary restriction, and blocked actions; temporary restrictions expire automatically and blocked-account restoration uses the email OTP recovery flow. Admin monitoring remains read-only.

## Seller notifications

Every seller event is a stored row in `seller_notifications` (or `trust_notices` for account notes), written by `createSellerNotification` in `src/utils/seller-notifications/`. The wording, level (sound, quiet, list only), and topic for each kind live in one map, `messages.ts`. The same call queues the phone alert in `notification_outbox` (type `seller_alert`); `jobs/deliver-push-notifications.ts` sends it. The mobile app no longer polls for alerts.

Triggers: new reservation, buyer cancelled, reservation ended (order create, cancel, expiry), reservation ends soon (`jobs/send-reservation-ending-notices.ts`, about one hour left), pickup done (QR scan), running low and sold out (stock reserve), listing live (product create), price lowered (`jobs/apply-seller-price-reductions.ts`), Boost posted or not posted (social campaign result), and trust notices (`queueTrustNotice`).

Frequency: the list is never limited. Phone alerts of one kind within one 60-second window become one alert. Sellers can turn off Stock and Price, Boost, and Account alerts, and turn on Night Mode, through `/seller/notification-settings`. Apply migration `20261031120000_seller_notifications` before use.

## Boost product photo

The product image URL used in Boost posts is public for Facebook to fetch, but it returns only the current eligible image hosted in Agrivive S3 (`GET /integrations/media/social-products/:id`). Live posting needs a public HTTPS API (`SOCIAL_PUBLIC_API_URL`), a valid Facebook Page token and ID, and the Boost webhook settings described in "Boost posting" below. The earlier preview-and-post feature and the social-publishing n8n workflow were removed. Instagram posting came back inside the Boost post: the `facebook-post` route also posts to Instagram and keeps its result in `instagram_post_logs` (see `API_ENDPOINTS.md`). The n8n workflow does not change.

Buyer profile photo endpoints:

- `GET /buyer/profile` returns the signed-in buyer profile and a signed display URL when a photo exists.
- `POST /buyer/profile/avatar` accepts a `multipart/form-data` request with a `file` field. Accepted files are JPEG, PNG, or WebP up to 5 MB. The request requires an active buyer session and stores the image under the configured S3 avatar path.

## Boost posting (title, post, 6-hour price cut, second post)

After a seller adds a product the app asks **Boost** or **Not now**. **Boost** queues a boost and sends it to n8n straight away (the worker retries if that fails). Set `N8N_VISIBILITY_BOOST_WEBHOOK_URL`, `N8N_VISIBILITY_BOOST_SERVICE_TOKEN`, `SOCIAL_PUBLIC_API_URL`, `WEB_APP_URL` and the Meta page values in the backend's private `.env`. Import `n8n/workflows/agrivive-visibility-boost.json`, replace `YOUR_AGRIVIVE_API_HOST`, and attach one Header Auth credential (the same token) to the webhook and backend requests plus a Groq credential. n8n writes the title and description with Groq, the backend posts to Facebook and saves the post record, and the post ends with a link to the product page. The 6 hours are counted by the backend, not n8n: saving the first post sets a due time on the boost, and the worker then sends `{ boostId, reason: "follow_up" }` to the same webhook (retrying every 15 minutes, up to 5 times, until the post is saved). n8n then asks the API to lower the price by the percent the seller set (never below their minimum price) and posts again. After each round the backend sets the next check 6 hours ahead, so the rule repeats until the price reaches the seller's minimum price. It stops sooner if the seller set 0%, the product sold out, or nothing was cut. Each Facebook post first saves a `pending` row, so a crash between posting and saving never causes a second post; a stuck `pending` row needs a manual check of the Page. A boost again after a price drop uses reminder wording and must wait 3 hours after the last price drop post. Apply `backend/drizzle/20261031140000_boost_follow_up` first. The export is inactive until the owner configures it.

