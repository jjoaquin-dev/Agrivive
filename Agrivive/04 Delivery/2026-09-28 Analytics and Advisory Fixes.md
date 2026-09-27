---
title: Analytics and Advisory Fixes
type: delivery
date: 2026-09-28
status: implemented; automated checks passed; live API and mobile verification pending
---

# Analytics and Advisory Fixes

## What changed

- Changed seller analytics reserved quantity to count reservations created during the selected period, including reservations that later completed, were cancelled, or expired.
- Kept currently pending quantity separate so the remaining-quantity metric is not inflated by historical reservations.
- Changed recurring-listing detection to recognize a current-period vegetable with an earlier seller listing cycle in the comparison period.
- Added configurable Groq summary timeout handling and safe server diagnostics for missing credentials, non-success responses, empty responses, and request failures.
- Changed the Groq default from the inaccessible `llama-3.3-70b-versatile` model to the configured key's accessible `openai/gpt-oss-20b` model, with low reasoning effort and a larger output budget for usable summary text.
- Aligned the mobile marketplace visibility types and card with the backend's `postingAge`, `remainingQuantity`, and `recurrence` fields, preventing `NaN%` output.
- Replaced escaped weather forecast text with readable temperature ranges, rain probability wording, and broader weather-code labels.
- Added `GROQ_TIMEOUT_MS` to the backend environment example.

## Why

The analytics screen showed zero reserved units when reservations had already changed state, and recurring history was missed when only one matching cycle existed in the selected period. The visibility card read fields that the backend did not return, producing `NaN%`. The weather forecast displayed escaped system text instead of plain seller-facing wording. Groq failures were silently collapsed into an unavailable state and used a short fixed timeout, making diagnosis difficult.

## Affected paths

- `backend/src/modules/seller/services/seller.analytics.metrics.ts`
- `backend/src/modules/seller/services/seller.analytics.summary.ts`
- `backend/.env.example`
- `mobile/src/features/analytics/api/seller-visibility.ts`
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
- `mobile/app/(app)/advisories.tsx`

## Verification performed

- `cd backend && bunx tsc --noEmit` — passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` — passed.
- `cd mobile && node node_modules/typescript/bin/tsc --noEmit --pretty false` — passed.
- A read-only Groq connectivity check from the restricted agent environment could not reach `api.groq.com`; the updated backend now logs a safe HTTP or network failure reason when run in the user's backend environment.
- Live Groq checks with the configured key returned `200` for `openai/gpt-oss-20b` model access and a successful analytics-style completion.
- Live authenticated analytics, Groq generation, and Expo-device rendering remain pending owner verification.
