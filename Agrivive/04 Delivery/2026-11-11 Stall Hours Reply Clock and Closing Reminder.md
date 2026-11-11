---
title: Stall Hours Reply Clock and Closing Reminder
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## Why
Beta sellers said their hours differ: some are open 24 hours, others only at set times. Reply penalties must not count hours the stall is closed.

## What changed
- **Reply clock counts open hours only.** The 12, 24 and 48-hour timers (reminder, warning, 1 trust point) now count only time the stall is open and the seller is not Away. No saved hours means open all the time. Files: `backend/src/utils/pickup/open-hours.ts` (new), `away.ts` (`awayIntervals`), `utils/trust/response-deadlines.ts`.
- **Closing reminder.** `backend/src/jobs/send-closing-soon-notices.ts` (new, run by the worker) emails buyers with a waiting reservation 30 minutes before the stall closes. One notice per order per day. Stalls open 24 hours send none.
- **24-hour stalls have no pickup closing buffer.** `is24Hours` in `utils/pickup/rules.ts`.
- **Alarm-style hours editor in the mobile app.** `mobile/src/features/stall/components/StallHoursEditor.tsx` and `stallSchedule.ts`: set From and To once, pick the weekdays it repeats on, or switch on Open 24 hours. Add another schedule for days with different hours. Days not picked are closed. Same props, so Stall Hours and first-time setup both use it. No database or API change.
- **Wording.** Notice texts in `send-notices.ts`, `notice-text.ts` and the mobile notification card now say "open hours".

## Verification
`bunx tsc --noEmit` (backend and mobile) clean; `bun test` 266 pass, 0 fail (new: `open-hours.test.ts`, a closed-hours case in `pickup.flow.test.ts`); backend `dist` rebuilt. Not run on a device or against production.

## To update elsewhere
Paper Table 17 (reply schedule) should say open hours. Rebuild the seller APK.
