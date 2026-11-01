# 2026-11-02 Account Recovery Restarts Inactivity Clock

## What changed
Restoring an account through email OTP (`POST /trust/recovery/verify`) now also sets `lastActiveAt` to the restore time.

## Why
An account blocked for 30 days of inactivity still had its old `lastActiveAt` after restoring. The inactivity job runs every minute, so it could block the account again before the person made a first request.

## Files
- backend/src/modules/trust/services/trust.recovery.ts
- backend/dist/index.js, worker.js

## Verification
`bunx tsc --noEmit` clean, both builds done. Not run against a database.
