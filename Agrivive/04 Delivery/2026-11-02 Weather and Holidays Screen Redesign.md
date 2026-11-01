# 2026-11-02 Weather and Holidays Screen Redesign

## What changed
The seller Weather & Holidays screen (`mobile/app/(app)/advisories.tsx`) now follows the Stitch frames F5 to F8 (project `AGRIVIVE MOBILE UI`, frames listed in [[2026-11-02 Stitch Change History and Weather Holidays Frames]]).

- Header: back, title "Weather & Holidays", info button, and "Updated <time> · Pull down to refresh" from the server's `generatedAt`.
- "Now at Your Stall" card: shop name and address from the seller profile, temperature, condition and rain chance from `/seller/advisories`.
- "Heads Up" card: the server's reminders only. The location reminder is left out because the pin card already says it. Hidden when there are none.
- "Next 3 Days": real forecast rows. A day turns amber at 60% rain or more (same limit the server uses).
- "Holidays in the Next 2 Weeks": real Nager.Date holidays, "in N days" worked out on the phone, English and local name.
- F6 no stall pin card (Add Stall Pin opens `profile/edit`), F7 weather unavailable card (Try Again refetches), F8 "About This Page" bottom sheet.

## Real data only
Left out of the design on purpose, because the API does not return them: "Feels like", market gate, "Regular Holiday" label, the "Sample data" tag, and the old hard-coded "Bankerohan Public Market" fallback name. Forecast icons and the long limitations card were dropped to match the frames; the "outside weather can differ from inside your stall" note moved into the About sheet.

## Files
- Changed: `advisories.tsx`, `AdvisoriesHeader.tsx`, `WeatherHeroCard.tsx`, `ContextualReminderCard.tsx`, `WeatherForecastSection.tsx`, `UpcomingHolidaysCard.tsx`
- Added: `AdvisoriesAboutSheet.tsx`, `AdvisoriesNoPinCard.tsx`, `AdvisoriesWeatherDownCard.tsx`
- Removed: `AdvisoriesLimitationsFooter.tsx`
- No backend or API change.

## Verification
`bun run typecheck` in `mobile/` passes. Not yet checked on a device by the owner.
