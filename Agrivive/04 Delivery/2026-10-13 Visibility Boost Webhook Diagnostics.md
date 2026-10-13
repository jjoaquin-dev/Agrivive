# Visibility Boost Webhook Diagnostics

Date: 2026-10-13

## What changed

Added diagnostic logging for rejected seller visibility boost webhook responses. When the n8n request returns a non-2xx response, the worker now records the boost ID, HTTP status, and up to 500 characters of the response body in its server log.

## Why

Production worker logs showed that visibility boosts were configured and queued, but none were sent successfully. One boost reached the retry limit and failed, while other boosts remained queued. The previous worker log only exposed the aggregate counters, so it could not distinguish a missing webhook path from an authentication or workflow error.

The new log is intentionally limited to response diagnostics and does not print the n8n service token.

## Affected file

- `backend/src/jobs/deliver-seller-visibility-boosts.ts`

## Verification

- `bunx tsc --noEmit` from `backend/` passed.
- `bun build src/index.ts --outdir dist --target bun` from `backend/` passed.
- The production worker image must be rebuilt and recreated before the new log appears on the VPS.

## Next production check

After rebuilding the backend/worker image, retry one failed boost and inspect the worker log for `Visibility boost webhook rejected`. Use its HTTP status and response body to correct the hosted n8n production webhook or Header Auth configuration.
