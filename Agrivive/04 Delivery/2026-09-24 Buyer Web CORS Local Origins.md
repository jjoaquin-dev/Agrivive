# Buyer Web CORS Local Origins

Date: 2026-09-24

## What changed

Updated the backend CORS configuration to keep the configured web origins and also allow local `localhost` and `127.0.0.1` origins on development ports with credentials enabled.

## Why

The marketplace request was reaching the backend, but browsers opened through `127.0.0.1:3001` did not receive an allowed origin header. The frontend then displayed the generic connection error even though the API was healthy.

## Affected paths

- `backend/src/index.ts`

## Verification

- `cd backend && bunx tsc --noEmit` passed.
- Restarted the backend dev process on port 3000.
- Confirmed `GET /marketplace/products` returns `200` with credentialed CORS headers for `http://localhost:3001`, `http://127.0.0.1:3001`, and another local development port.
