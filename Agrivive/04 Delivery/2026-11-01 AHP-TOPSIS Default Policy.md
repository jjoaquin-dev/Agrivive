---
title: AHP-TOPSIS Default Policy
type: delivery
date: 2026-11-01
---

# AHP-TOPSIS Default Policy

## What changed

- AHP-TOPSIS is now the default marketplace ranking. A missing, empty or unknown `VISIBILITY_POLICY` uses it. Only the exact value `visibility-v4` (any case, spaces ignored) rolls back to the baseline formula.
- The baseline formula itself is unchanged. It rewards listing age by design and stays as the rollback.
- Example env files now use `visibility-ahptopsis-v1` (`backend/.env.example`, `deploy/backend.production.env.example`). The note "keep visibility-v4 until the pilot is approved" was removed.
- `backend/API_ENDPOINTS.md` describes the new default.

## Why

Test run of the WSV sheet found that the live server ran the baseline, where a fresh listing scored 0.40 and ranked below old listings. That contradicted WSV-001 and WSV-003. The pilot is now approved by the owner request.

## Files

- `backend/src/utils/visibility-ranking/policy.ts`, `policy.test.ts`
- `backend/.env.example`, `deploy/backend.production.env.example`, `backend/API_ENDPOINTS.md`

## Verification

- `bun test`: 29 passed. `bunx tsc --noEmit` clean. `bun build` of the API worked.
- Read-only run on the dev database: default and explicit AHP-TOPSIS give the same ranking, `visibility-v4` rolls back, and paging has no repeats on all of them.

## Deploy step

The VPS `.env` must set `VISIBILITY_POLICY=visibility-ahptopsis-v1` (or remove the line), then rebuild and recreate the API container. No migration.
