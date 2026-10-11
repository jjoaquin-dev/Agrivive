---
title: Recommendation Scope Cleanup
type: delivery
status: complete
date: 2026-10-10
---

# Recommendation Scope Cleanup

## What changed

The transaction-association recommendation experiment was removed from Agrivive's active system. The buyer product-detail page uses the existing category-based Similar produce experience only.

The backend recommendation route, report reader, recommendation service and model were removed. The standalone synthetic analytics implementation, generated reports, generated spreadsheets, environment settings, and related application documentation were removed. The compiled backend bundle was rebuilt without the removed route.

## Why

The startup does not yet have enough verified historical in-platform transaction data to support defensible transaction associations. Synthetic baskets could demonstrate a method, but they should not be presented as real buyer behavior or used as the capstone's active recommendation feature.

## Affected project paths

- `backend/src/modules/marketplace/index.ts`
- Deleted marketplace recommendation route, model, service, and shared report reader
- `backend/dist/index.js` rebuilt without the removed route
- `backend/.env.example` and local `backend/.env` settings removed
- Deleted the web recommendation API and recommendation component
- `web/src/features/marketplace/components/ProductDetail.tsx` and `web/src/features/marketplace/types.ts`
- Deleted the standalone synthetic analytics files, fixtures, reports, and generated spreadsheets
- `analytics/.gitignore`, `backend/README.md`, and `backend/API_ENDPOINTS.md`

## Vault paths cleaned

- Removed the old intelligence note and two historical delivery notes.
- Removed the old feature-specific cleanup note and replaced it with this neutral scope note.
- Removed stale references from the source guide, implementation record, UI delivery note, backend completion notes, and seller quality note.

## Verification performed

- `cd backend && bunx tsc --noEmit` passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` passed; Bun bundled 1,605 modules.
- `cd web && bunx tsc --noEmit` passed.
- `git diff --check` passed; Git reported only existing line-ending normalization warnings.
- The active source and vault audit found no removed recommendation-component references.
- Similar produce remains rendered by `ProductDetail.tsx`.
