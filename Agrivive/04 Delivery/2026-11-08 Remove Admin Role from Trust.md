---
title: Remove Admin Role from Trust
type: changelog
date: 2026-11-08
---

# 2026-11-08 Remove Admin Role from Trust

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]] · Builds on [[2026-11-08 Reservation QR Pickup and PDF Trust Mechanism]] · Rules: [[Trust and Flagging]]

**What changed:** The trust, flagging, report, dispute and pickup-decline mechanism has only two roles, buyer and seller. No person reviews or changes a trust decision. The system decides from stored records and sends a plain notice.

**Removed:** all `/admin/*` trust routes (disputes, declines, excuses, reports, review requests, seller flags), the `/trust/review-request` route, the `pending_admin` and `under_review` states, the `trust_review_requests` table, and the `admin_id`, `admin_note`, `admin_due_at` and dispute `kind` columns. The migration `20261108140000_pickup_trust_pdf` was edited because it was never applied.

**Now decided by the system:**
- **Dispute (7 days):** `utils/trust/dispute-rules.ts` checks the stored order, rating, decline or question record against the rule that made the event. Upheld (event stops counting, score and level recalculated), rejected, or unresolved (no record can settle it; the event stays). The response of `POST /trust/events/:id/dispute` now includes `result` and `because`.
- **Reports:** one report is 0 points; two different reporters confirm. A pair that already confirmed twice in 90 days waits at 0 points for a third independent reporter. Reciprocal reports are ignored.
- **Decline at pickup:** reason not allowed = buyer +1; photo hash already used = buyer +2; otherwise the seller's answer, silence or dispute ends as seller fault (+2). A dispute photo is saved but not judged.
- **Excuse:** only the order's seller confirms or rejects it.
- **Fault rate 15%+:** now labelled "High fault rate" instead of "Needs review". Formulas, weights, 90-day window, levels and time limits are unchanged.

**Limits left open (need a written system rule, no manual step invented):** photo content cannot be compared; report-based events cannot be settled by dispute; a seller who never answers an excuse leaves it pending; a blocked account can only use email recovery.

**Not touched:** the older read-only `/admin/performance` metrics route, the `admin` and `stakeholder` entries of the role enum, and `web/app/admin/performance`. They are not part of the trust mechanism; removing them is a separate decision.

**Verification:** `bunx tsc --noEmit` (only the 4 old errors in `ahp-test.ts` and `topsis-test.ts`), `drizzle-kit check`, `pickup.flow.test.ts` 55 pass, `policy.test.ts` 28 pass, web and mobile typecheck pass, API and worker rebuilt. Migration not applied; no phone or browser check. `API_ENDPOINTS.md`, the vault notes 08 to 11 and `AGENTS.md` were updated.
