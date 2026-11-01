# 2026-11-02 Recovery Route Error Statuses

## What changed
`POST /trust/recovery/request` and `/trust/recovery/verify` now catch `OrderError` and answer with its real status and message.

## Why
The routes let errors escape. The global error handler turns every unknown error into HTTP 500 in production. A wrong or expired code therefore came back as 500, and the mobile screen showed "We could not restore your account" instead of "That code didn't work". "This account does not need recovery" never reached the app either.

## Files
- backend/src/modules/trust/index/trust.recovery.ts
- backend/dist/index.js, worker.js

## Verification
- In-memory Postgres test through the real route with NODE_ENV=production: wrong code 400 "invalid or expired", right code 200, second use 400 "does not need recovery". The old route returned 500 for the wrong code.
- `bunx tsc --noEmit` clean, 45 tests pass, both builds done.
