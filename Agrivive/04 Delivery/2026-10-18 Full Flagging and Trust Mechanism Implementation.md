---
title: Full Flagging and Trust Mechanism Implementation (FTM-01 to FTM-10)
date: 2026-10-18
type: delivery
status: implemented
related_documents:
  - "[[04 Flagging and Trust Functional Test Cases]]"
  - "[[01 Flagging and Trust Discrepancies]]"
  - "[[02 Flagging and Trust Scope Narrowed]]"
  - "[[03 Flagging and Trust Features Needing Enhancement]]"
---

# Full Flagging and Trust Mechanism Implementation (FTM-01 to FTM-10)

## What changed

1. **User Inactivity Lifecycle (FTM-07 & FTM-08)**:
   - Added `lastActiveAt: timestamp("last_active_at", { withTimezone: true })` to the `user` table in `backend/src/db/schema.ts`.
   - Created `backend/src/utils/user-activity/index.ts` with `touchUserActivity(userId)` featuring an in-memory 1-hour throttle to protect database write throughput.
   - Connected `touchUserActivity` to `sessionAuth` macro in `backend/src/modules/auth/services/auth.session.ts` to automatically track user activity on all authenticated requests.
   - Created `backend/src/jobs/check-user-inactivity.ts` registered in `runScheduledJobs()`:
     - **FTM-07 (3-Week Warning):** When $21 \le \text{daysInactive} < 30$, deduplicates and issues an `inactivity_3w_warning` notice, recording an action of type `'warning'`.
     - **FTM-08 (1-Month Block):** When $\text{daysInactive} \ge 30$, deactivates user (`user.isActive = false`), records `actionType: 'blocked'`, and queues an `inactivity_1m_blocked` notice.

2. **Buyer Failed Reservation & No-Show Violation (FTM-09)**:
   - Updated `backend/src/modules/buyer/services/buyer.order.expire.ts` so that when a pending reservation expires unpicked:
     - Automatically logs a verified `buyer_failed_reservation` in `trust_events`.
     - Queues a `buyer_failed_reservation_warning` to the buyer.
     - Triggers `evaluateTrustAction()` on the buyer.
   - Assigned weight `2` for `buyer_failed_reservation` in `backend/src/utils/trust/policy.ts` (matching seller cancellation severity per Section 2.3.2.6).

3. **Multi-Tier Penalty Enforcement & Access Guards (FTM-06 & FTM-10)**:
   - Enabled `trustActionPolicy` by default (`process.env.TRUST_ACTIONS_ENABLED !== "false"`).
   - Made `orderId` nullable in `trust_events` and `trust_notices` to accommodate account-level lifecycle events cleanly without a phantom order ID.
   - Updated `evaluateTrustAction()` in `backend/src/utils/trust/evaluate-action.ts` to deliver action notices regardless of whether the event was order-linked or account-level.
   - In `backend/src/modules/seller/services/seller.trust.correct.ts`, guarded `event.orderId` checks to ensure TypeScript type safety across nullable foreign keys.
   - Updated `backend/src/utils/trust/send-notices.ts` with email templates for `inactivity_3w_warning`, `inactivity_1m_blocked`, and `buyer_failed_reservation_warning`.
   - Reused `requireActiveUser` & `requireNoActiveTrustRestriction` across buyer order creation and seller operations to enforce temporary restrictions and blocking automatically.

## Why

To close the historical gap between the theoretical specifications in Section 2.3.2.6 of the Agrivive research paper and the working codebase. Both buyers and sellers now operate under a symmetric, automated accountability model covering non-response, order cancellations, failed reservations, and prolonged account inactivity.

## Affected paths

### Backend
- `backend/src/db/schema.ts`
- `backend/src/utils/user-activity/index.ts`
- `backend/src/modules/auth/services/auth.session.ts`
- `backend/src/jobs/check-user-inactivity.ts`
- `backend/src/jobs/run-scheduled.ts`
- `backend/src/modules/buyer/services/buyer.order.expire.ts`
- `backend/src/utils/trust/index.ts`
- `backend/src/utils/trust/policy.ts`
- `backend/src/utils/trust/send-notices.ts`
- `backend/src/utils/trust/evaluate-action.ts`
- `backend/src/modules/seller/services/seller.trust.correct.ts`
- `backend/drizzle/20261018101916_watery_tarantula/migration.sql`

### Obsidian Vault
- `Agrivive/06 Audits and Discrepancies/04 Flagging and Trust Functional Test Cases.md`
- `Agrivive/04 Delivery/2026-10-18 Full Flagging and Trust Mechanism Implementation.md`

## Verification performed

1. **Database Schema & Drizzle Migration**:
   - `bunx drizzle-kit generate` — passed, generated `migration.sql`.
2. **Backend Typecheck & Build**:
   - `bunx tsc --noEmit` — passed with 0 errors.
   - `bun build src/index.ts --outdir dist --target bun` — passed, bundled 1696 modules into `dist/index.js`.
3. **Mobile Typecheck**:
   - `bun run typecheck` — passed with 0 errors.
4. **Code Line Limits**:
   - Every modified/created file is under 200 lines (e.g., `check-user-inactivity.ts` is 88 lines, `buyer.order.expire.ts` is 55 lines, `user-activity/index.ts` is 22 lines).
