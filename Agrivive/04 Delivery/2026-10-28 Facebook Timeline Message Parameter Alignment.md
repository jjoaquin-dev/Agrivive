# 2026-10-28 Facebook Timeline Message Parameter Alignment

## Context & Objectives
Ensure photos published to the official Agrivive Facebook Page (`1418061001382207`) via Meta Graph API appear directly on the Page's public Timeline feed ("Posts" tab) with their full status message, rather than only populating the internal "Photos" album repository.

## Why
1. In Meta Graph API (`/{pageId}/photos`), `caption` is treated as internal photo album metadata. Without passing `message`, Facebook places the photo into the Page's photo uploads but does not create an active story card on the main timeline feed.
2. In accordance with honest system status and transparency (Visibility of System Status, Jakob Nielsen), published promotional boosts must be immediately visible on the Page's main feed to both followers and public visitors.

## What Changed
- [`backend/src/modules/integrations/services/integrations.social-publish-facebook.ts`](file:///home/jarajoaquinjara/projects/Agrivive/backend/src/modules/integrations/services/integrations.social-publish-facebook.ts): Added `message: caption` alongside `caption` and `published: "true"` in the `URLSearchParams` payload to `POST /{version}/{pageId}/photos`.

## Affected Files
- `backend/src/modules/integrations/services/integrations.social-publish-facebook.ts`
- `backend/dist/index.js`

## Verification Performed
- `cd backend && bunx tsc --noEmit` — passed with 0 errors.
- `cd backend && bun build src/index.ts --outdir dist --target bun` — bundled cleanly in 159ms.
- Line count verified: `integrations.social-publish-facebook.ts` is 50 lines ($\le 200$ lines).

## Commit Reference
- **Hash:** `b8c85c5`
- **Message:** `add message parameter to facebook photo publish`
