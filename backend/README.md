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

The API listens on `http://localhost:3000`. The worker expires pending reservations, processes inquiry deadlines, and sends queued trust notices every 60 seconds.

For local email testing set `EMAIL_PROVIDER=mailtrap`. Production should set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`. OTP values are never written to logs unless `ALLOW_DEV_EMAIL_LOG=true`.

## Verification

```bash
bunx tsc --noEmit
bun build src/index.ts --outdir dist --target bun
bunx drizzle-kit check
```

The owner should manually verify authenticated API journeys in OpenAPI or Postman, including email delivery, S3 uploads, reservation expiry, QR pickup, and report evidence.

Buyer profile photo endpoints:

- `GET /buyer/profile` returns the signed-in buyer profile and a signed display URL when a photo exists.
- `POST /buyer/profile/avatar` accepts a `multipart/form-data` request with a `file` field. Accepted files are JPEG, PNG, or WebP up to 5 MB. The request requires an active buyer session and stores the image under the configured S3 avatar path.
