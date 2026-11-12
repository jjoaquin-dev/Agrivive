---
title: Trust Level Screens and Recovery Fix
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Mechanism: [[Trust and Flagging]]

## Why
Users were not told what to do at each trust level, buyers on the web had no trust page, and an email code could lift a pause.

## What changed
- **Recovery fix:** `trust.recovery.ts` now restores a **block** only. A pause ends on its own. New `trust.recovery.test.ts` proves a paused account gets no code and keeps its pause, while a blocked one is restored.
- **Copy:** the missed-pickup warning no longer promises a "12-hour pause"; the 3-day pause message says to dispute within 7 days instead of "ask for a review". The mobile recovery screen says it is for blocked accounts.
- **Guidance from the server:** `utils/trust/guidance.ts` (`levelLadder`, `levelGuidance`, `nextLevelFor`) with a test. `GET /trust/me` now also returns `guidance`, `nextLevel`, `ladder`, `serious` (see `backend/API_ENDPOINTS.md`).
- **Web (buyers):** new Trust & Standing section in `/profile` (`#trust`): level, score, points to the next level, "What to do now", the full ladder, events with a 7-day dispute form (`web/src/features/trust/`). The "reservations paused" notice now links to this section; only a block shows the email-code button.
- **Mobile (sellers):** the standing card now shows "What to do now", points to the next level, and the ladder.

## Verification
Typecheck clean (backend, web, mobile). `bun test` 275 pass, 0 fail. `dist` rebuilt. The new web section and mobile card were not opened in a browser or on a device.
