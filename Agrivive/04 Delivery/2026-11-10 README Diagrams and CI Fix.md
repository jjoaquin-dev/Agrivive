---
title: README Alignment, Diagrams and CI Fix
type: delivery
date: 2026-11-10
---

# README Alignment, Diagrams and CI Fix (2026-11-10)

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]]

## What changed

- **README matches the system.** Database is Supabase PostgreSQL (47 tables), not Aurora. Added reservation pickup times and 3-hour auto-confirm, one review per order, chat, weather and holiday reminders, the Auto-Post and ranked Boost rounds, Groq model `openai/gpt-oss-20b`, FCM push, Open-Meteo, Nager.Date and OpenStreetMap, the `pickup` module, and the real trust points table. Removed Priority Boost, the admin trust oversight claim and the Aurora label.
- **Diagrams.** `Agrivive/docs/agrivive-system-architecture.png` and `agrivive-database-erd.png` (with editable `.svg`), shown in the README. Both are linked from [[Docs Index]].
- **Database cleanup.** The Supabase project listed 49 objects. `trust_review_requests` (empty table, removed from the code on 2026-11-08) and `transaction_data` (unused view) were dropped by the owner; it now has 47. See [[2026-11-08 Remove Admin Role from Trust]].
- **CI fix.** Backend CI failed on four `tsc` errors in `backend/src/ahp-test.ts` and `topsis-test.ts` (cast fixed). Mobile CI failed on a Setup Bun 504, so bun is pinned to 1.4.4 in all CI and CD workflows, `workflow_dispatch` and a concurrency block were added, and `backend/bunfig.toml` sets a 30-second test timeout. Not pushed yet.
- **Related:** [[2026-11-09 Calendar Reminders Heat and Holiday Alerts]].

## Verification

Backend `bun test` 260 pass; `tsc`, web and mobile typecheck and the Android export passed locally. CI on GitHub not seen passing yet.
