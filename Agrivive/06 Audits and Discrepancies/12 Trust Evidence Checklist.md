---
title: Trust Screenshot and Evidence Checklist
type: checklist
status: draft - nothing captured
created: 2026-11-08
---

# Screenshot and Evidence Checklist

Used with [[08 Trust System Test Case Document]]. The evidence codes (E1 to E7) match the last column of each case. Tick a box only after the file is saved and named by case ID, for example `TC-S-005_E2.png`. A case may be marked Passed only when its evidence exists. Hide emails, tokens and secrets before saving.

## Evidence types

| Code | Evidence | How to capture |
|---|---|---|
| E1 | Database rows | Screenshot of `trust_events`, `trust_actions` or `trust_notices` query result with the subject id and timestamps visible |
| E2 | Score output | `GET /admin/performance` response, `trustMonitoring` block (weightedPoints, components, allegationFlags) |
| E3 | App screen | Phone or browser screenshot of the notice, warning, pause or blocked screen |
| E4 | API response | Request (method, path, headers without tokens, body) and response status and body from OpenAPI or Postman |
| E5 | Order record | Order row or order screen showing status, `cancelled_by`, `expires_at` |
| E6 | Account state | `user.is_active` value and the sign-in or restore screen |
| E7 | Evidence file | Upload response and the private object listing (file name only) |

## Per-run checklist

- [ ] Date, tester name, branch and commit hash written on the first page
- [ ] Env values used (`TRUST_ACTIONS_ENABLED`, `TRUST_SCORE_WINDOW_DAYS`, tier thresholds, `TRUST_REPORT_CONFIRM_COUNT`) listed, with no secrets
- [ ] Test database confirmed (never production); worker process running
- [ ] Test accounts created: QA-S1, QA-S2, QA-B1 to QA-B4, QA-A1
- [ ] Clock edits logged: each changed timestamp, old and new value

## Per-group checklist

| Group | Required captures |
|---|---|
| Seller timers (TC-S-001 to 014) | E1 notice rows at 12 h, 24 h; event row at 48 h; E2 before and after; E3 buyer notice at 24 h |
| Seller cancel (TC-S-020 to 027) | E5 order before and after; E1 event; E4 each error status (400, 403, 409, 410) |
| Reports (TC-S-030 to 041, TC-D-001 to 010) | E4 each report call; E2 after 1st and after 2nd reporter; E7 for evidence uploads |
| QR (TC-S-060 to 063, TC-B-031) | E4 scan errors; E1 blocked action; E6 `is_active=false` |
| Buyer expiry and cancel (TC-B-001 to 017) | E5 order status; E1 event; E3 warning or pause message; E4 rejected reservation (403) |
| Points ladder (TC-T-001 to 015) | E2 at each of 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 points; E1 action row with `ends_at` and duration |
| Pause and recovery (TC-T-016 to 027) | E4 blocked request message; E1 `revoked_at`; E3 restore screen; recovery request and verify calls |
| 90-day window (TC-T-020 to 023) | E1 events with `created_at` at day 89 and 91; E2 before and after |
| Inactivity (TC-X-001 to 004) | E1 action rows; `last_active_at` values; E6 |
| Disputes (TC-D-014 to 022) | E4 correction responses (200, 400, 409); E1 `invalidated_at`; E2 recalculated score |
| Fault rate, Boost, badge (TC-F-001 to 012) | Screenshot of the profile or storefront; E4 boost response; for missing features, a note "feature not found" with the search done |

## Sign-off

- [ ] Every Not Tested case was run, or listed as blocked with the reason
- [ ] Each Failed case has a defect note naming the case ID, expected, actual and evidence file
- [ ] Missing-feature cases are carried to [[10 Trust Missing Functionality Report]] and the professor questions in [[11 Trust Conflicting Requirements Report]]
- [ ] Manual testing is recorded as complete only after the project owner reports the result
