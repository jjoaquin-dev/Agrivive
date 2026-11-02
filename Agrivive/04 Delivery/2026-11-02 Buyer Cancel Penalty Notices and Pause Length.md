# 2026-11-02 Buyer Cancel Penalty Notices and Pause Length

**What changed**
- Buyer cancel warnings and pauses now send the buyer a notice (new kinds `buyer_cancellation_warning` and `buyer_cancellation_restriction`), like unpicked reservations already did.
- They also respect `TRUST_ACTIONS_ENABLED`. Before, the cancel pause ran even when actions were off.
- The pause length shown to the buyer is now worked out from the pause's start and end time. Before it used the cancel count as points, so 8 cancels showed "24 hours" for a 12-hour pause.
- Profile warning bands use the policy values (`trustActionPolicy`, `cancellationWarningAt` = 5, `cancellationPauseAt` = 7) instead of typed numbers.

**Why:** an end-to-end check of the buyer rules found these four gaps. The points table, weights and expiry job did not change. No schema change.

**Files:** `backend/src/modules/buyer/services/buyer.order.cancel-penalty.ts` (new), `buyer.order.cancel.ts`, `buyer.profile.read.ts`, `backend/src/utils/trust/cancellation-policy.ts`, `send-notices.ts`, rebuilt `backend/dist/index.js` and `worker.js`.

**Verification:** `tsc --noEmit` passed. Both `bun build` commands passed. Manual API testing not done; the owner should cancel reservations as a buyer on a local database (5th warns, 7th pauses 12h, 8th still 12h, 9th 24h, 10th 3 days) and confirm a notice is queued each time.
