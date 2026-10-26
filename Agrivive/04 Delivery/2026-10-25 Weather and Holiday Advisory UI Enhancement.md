---
title: Weather and Holiday Advisory UI Enhancement
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-09-22 Contextual Advisories]]"
  - "[[2026-10-25 Seller Dashboard UI Replication and Real Data Integration]]"
  - "[[02 Product/Feature Map]]"
---

# Weather and Holiday Advisory UI Enhancement

## What Changed

Applied the visual styling, card layouts, and color hierarchy from the design reference (`WeatherAdvisoryPage.png`) while binding **strictly to our actual existing system fields and APIs** (`useSellerAdvisories` and `useAuth`), adhering completely to `.agents/rules/design-replication-rule/RULE.md` and repository guidelines in `AGENTS.md`.

### Field & Component Mapping:

1. **`AdvisoriesHeader.tsx`**:
   - Replicated header with circular back button, title ("Weather & Holiday Advisory"), subtitle ("Local weather and upcoming holiday guidance"), circular refresh button (`RotateCw`), circular info button (`Info`), and timestamp subheader (`advisories.generatedAt`).
   - Modal dialog explaining Open-Meteo weather and Philippine holiday data sources.

2. **`WeatherHeroCard.tsx`**:
   - Replicated the vibrant blue outdoor weather hero card (`#1D4ED8`):
     - Uppercase "OUTDOOR WEATHER" label and condition icon (`Sun`, `CloudSun`, `CloudRain`, `CloudLightning`, etc.).
     - Seller stall/market location pin (`setup.profile.shopName`).
     - Large temperature (`current.temperatureC`), rain probability (`current.precipitationProbability`), and weather condition text (`weatherCode`).
     - Open-Meteo source attribution and contextual advisory disclaimer.

3. **`ContextualReminderCard.tsx`**:
   - Replicated the soft amber reminder container (`#FFFBEB` with border `#FDE68A`) bound directly to `advisories.reminders` (rain warning, hot weather warning, holiday planning).

4. **`WeatherForecastSection.tsx`**:
   - 3-day weather forecast card rendering `advisories.weather.forecast` with day label, condition icon, condition text, temperature range (`min° - max°C`), and rain probability badges.

5. **`UpcomingHolidaysCard.tsx`**:
   - Replicated upcoming holiday presentation from `advisories.holidays.upcoming` using a calendar-page date badge (green month banner + bold day number), holiday name, local name, and operational guidance.

6. **`AdvisoriesLimitationsFooter.tsx`**:
   - Replicated the limitations footer card emphasizing that weather and holiday advisories are operational context and physical inspection remains the seller's responsibility.

7. **`mobile/app/(app)/advisories.tsx`**:
   - Coordinates all components with pull-to-refresh, safe-area layout, missing location prompt, error retry states, and source status indicators.

## Verification Performed

1. **Mobile TypeScript Verification**:
   - Ran `bunx tsc --noEmit --project mobile/tsconfig.json` $\to$ **Exit code 0, 0 type errors**.
2. **Backend Verification**:
   - Ran `bunx tsc --noEmit` & `bun build src/index.ts --outdir dist --target bun` $\to$ **Exit code 0, 1704 modules bundled successfully**.
3. **Line Count Audit**:
   - All components strictly observe the $\le 200$ lines limit:
     - `AdvisoriesHeader.tsx`: 182 lines
     - `WeatherHeroCard.tsx`: 190 lines
     - `ContextualReminderCard.tsx`: 96 lines
     - `WeatherForecastSection.tsx`: 132 lines
     - `UpcomingHolidaysCard.tsx`: 160 lines
     - `AdvisoriesLimitationsFooter.tsx`: 37 lines
     - `advisories.tsx`: 147 lines
