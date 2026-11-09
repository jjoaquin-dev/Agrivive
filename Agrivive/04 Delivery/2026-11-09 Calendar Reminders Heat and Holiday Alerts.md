---
title: Calendar Reminders, Heat Alert and Holiday Alert
type: delivery
date: 2026-11-09
---

# Calendar Reminders, Heat Alert and Holiday Alert (2026-11-09)

## What changed

- **Reminders are now in the popup.** The daily popup on the seller app used to show only weather and the next holiday; reminders lived only in a "Heads Up" card on the Weather and Calendar screen. The popup now has a "Heads Up" box listing the reminders. The card on the screen stays as the saved copy. Nothing about reminders is a button.
- **Holiday alert: 1 day ahead.** A holiday reminder appears only when a public holiday falls exactly one day away (Philippine date, UTC+8): "Tomorrow is <holiday>. Check your pickup times and your stock." The 6 AM daily notice also says "Tomorrow is <holiday>." on that day. The holiday list on the screen still shows the next 14 days. The number is `holidayAlertDaysAhead` in `backend/src/utils/advisory-alerts`.
- **Heat alert.** A forecast day of 35 °C or more (`heatAlertThresholdC`) gives a new `heat` reminder: "Heat alert: it may reach 36°C today. Keep your produce in the shade and check it often." It names today, tomorrow or the date, and appears in the popup, on the screen and in the daily notice. Before, the hot-weather text was a generic weather reminder.

## For the paper

The seller is alerted **one day before** a public holiday (once a day from 6 AM, plus the app popup when they open the app). Heat alert threshold: 35 °C. Sources: Nager.Date holidays and the Open-Meteo forecast already in use.

## Affected files

Backend: `utils/advisory-alerts/index.ts` (new), `modules/seller/services/seller.advisories.ts`, `modules/seller/model/seller.advisories.ts` (adds the `heat` kind), `jobs/daily-advisory-summary.ts`. Mobile: `DailyAdvisoryPopup.tsx`, `ContextualReminderCard.tsx`, `advisories/types.ts`.

## Verification

`bun test` in `backend/`: 216 pass (new `advisory-alerts.test.ts` and `daily-advisory-summary.test.ts`). Backend `tsc` clean apart from the two old script errors, API and worker rebuilt, mobile `typecheck` passes. **Not done:** running the app on a phone, and the screenshot of a reminder for the paper (needs a rebuilt APK or an emulator; none on this machine). To get it, rebuild the app, set the stall pin, and open the app on a day when a holiday is tomorrow or the forecast reaches 35 °C.
