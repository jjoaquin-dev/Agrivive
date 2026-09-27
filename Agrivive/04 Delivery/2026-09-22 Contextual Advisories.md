---
title: Contextual Advisories
type: implementation-status
status: working
date: 2026-09-22
---

# Contextual Advisories

## What changed

- Added `GET /seller/advisories` for active, verified sellers.
- Added backend weather retrieval from Open-Meteo using the current seller profile coordinates.
- Added Philippine holiday retrieval from Nager.Date.
- Added ten-minute weather caching and one-hour holiday caching in memory.
- Used independent timeouts and `Promise.allSettled` so an external outage returns partial data.
- Added general reminders for rain, hot conditions, public holidays, and missing seller location.
- Added the mobile Advisories screen with weather context, three-day forecast, upcoming holidays, reminders, source availability, loading, offline, missing-location, empty, and retry states.
- Added links from Home and Analytics. Reservations remains a bottom tab.
- Fixed incomplete weather-array handling so all three forecast days are validated before display.
- Kept Philippine holiday results available when seller coordinates are missing, because holiday lookup does not need coordinates.
- Added a clear mobile state when the holiday source is unavailable instead of showing an empty-holiday message.
- Replaced corrupted temperature and range characters in the mobile advisory screen.
- Added an explicit advisory network helper. An empty `ADVISORY_HTTP_PROXY` uses direct provider access and avoids an invalid inherited proxy; a valid proxy can be configured when required.
- Changed the empty-proxy path to use direct Node HTTPS requests, which bypass Bun's inherited `HTTP_PROXY` and `HTTPS_PROXY` values. An explicitly configured `ADVISORY_HTTP_PROXY` still uses Bun's proxy support.
- Failed weather and holiday responses are no longer cached, so a temporary provider or network outage is retried on the next request instead of remaining unavailable for the full cache period.
- Fixed corrupted weather unit and range characters in the mobile advisory UI by using Unicode escapes, so temperatures render as `25.0°C · Clear` and `25–32°C · 40% rain`.
- Added source failure logs without seller coordinates or secrets.
- Added a ten-second timeout to mobile API requests. A phone that cannot reach the backend now receives a retryable connection error instead of an endless loading spinner.

The external sources are [Open-Meteo Forecast API](https://open-meteo.com/en/docs) and [Nager.Date public holidays](https://date.nager.at/api/v3/PublicHolidays/2026/PH).

## Affected paths

- `backend/src/modules/seller/model/seller.advisories.ts`
- `backend/src/modules/seller/index/seller.advisories.ts`
- `backend/src/modules/seller/services/seller.advisories.ts`
- `backend/src/modules/seller/services/seller.weather.ts`
- `backend/src/modules/seller/services/seller.holidays.ts`
- `backend/src/utils/advisory-http/index.ts`
- `backend/src/modules/seller/index.ts`
- `mobile/src/features/advisories/`
- `mobile/app/(app)/advisories.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/(tabs)/home.tsx`
- `mobile/app/(app)/analytics.tsx`
- `mobile/src/api/client.ts`

## Verification

- Backend TypeScript check passed.
- Backend Bun build passed.
- Mobile TypeScript check passed.
- Backend TypeScript check passed after the advisory fixes.
- Mobile TypeScript check passed after the advisory fixes.
- Advisory network helper and provider integration passed the backend typecheck and build.
- Direct HTTPS advisory helper and non-caching failure behavior passed the backend typecheck and build.
- Mobile advisory weather formatting fix passed the mobile TypeScript check.
- Mobile API timeout and connection error handling passed the mobile TypeScript check.
- Android Expo export passed.
- Unauthenticated `GET /seller/advisories` correctly returned `401 Unauthorized`.
- Open-Meteo and Nager.Date endpoints are configured in the backend services using their documented public APIs.
- Local shell network access to both public services was unavailable during verification, so live external-data success and outage behavior still require Postman/OpenAPI testing from the running backend environment.
- Authenticated seller, missing-location, and Android device checks remain pending.
- Live provider success and independent provider outage checks remain pending from the running backend environment because local shell calls to Open-Meteo and Nager.Date returned unavailable responses.
- Direct provider access remains dependent on the host network allowing outbound HTTPS.

## Scope and safety

- External services are called by the backend; mobile never calls them directly.
- Coordinates are not written to advisory logs.
- Advisories use general inspection, handling, and selling-plan language.
- No freshness, spoilage, food-safety, shelf-life, or numeric Q10 claim is generated.
- Q10 parameters, storage-temperature capture, Groq summaries, and n8n promotion remain separate features.

## Commit

Not committed yet.
