# 2026-10-28 Human-Friendly Reservation and Trust Error Messages

## Context & Objectives
Replace vague, uninformative HTTP 403 Forbidden errors (such as "You do not have permission to do that") with clear, human-friendly layman's terms that explain why an action failed and provide actionable next steps. Implement a graded, time-based cooldown policy (12h, 24h, 3 days) rather than permanent account lockouts, with transparent reasons explaining previous expired reservations to help avoid food waste. Display an in-cart warning banner for users approaching restriction thresholds and format the "come back in X hours" countdown timer. Correct notice layout in the cart drawer so the recovery button displays cleanly below the text without inline overlap.

## Why
1. When an account was blocked or temporarily restricted by trust monitoring (e.g. after multiple expired reservations), `sessionAuth` returned an empty HTTP 403 status code with no response body.
2. The web frontend client fell back to the generic string "You do not have permission to do that", confusing users about why their cart reservation could not be placed.
3. Users should not be permanently locked out requiring manual OTP recovery for missed pickups; natural time-based cooldowns (12 hours, 24 hours, 3 days) allow accounts to recover automatically while educating buyers about food waste prevention.
4. Users approaching penalty thresholds (4 points) should receive proactive in-cart warning alerts before being paused.
5. When displayed, the recovery button was previously rendered inside the paragraph element, colliding inline with the end of the text.

## What Changed
1. **Tiered Time Cooldown Policy**:
   - [`backend/src/utils/trust/policy.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/trust/policy.ts):
     - Added `resolveTrustDurationHours(weightedPoints)`:
       - 4 points: Warning only (0h cooldown).
       - 6 points: 12-hour cooldown.
       - 8 points: 24-hour cooldown.
       - 10+ points: 72-hour (3-day) cooldown.
     - Preserved backward-compatible thresholds for admin metrics.
2. **Session Authentication & Error Messages**:
   - [`backend/src/modules/auth/services/auth.session.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/auth/services/auth.session.ts):
     - Added trust action lookup to retrieve active temporary restrictions.
     - Formatted clear layman's explanation: *"Your account is paused because previous reservations were not picked up before they expired. To help avoid food waste, reservations are temporarily paused for [12 hours / 24 hours / 3 days]. Please come back in [X hours / X days]."*
3. **Trust Access Enforcement & Evaluation**:
   - [`backend/src/utils/trust/access.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/trust/access.ts):
     - Exported `formatRemainingTime(diffMs)` to convert milliseconds to human-friendly strings (e.g. `12 hours`, `2 days`).
     - Added detailed 403 error message in `requireNoActiveTrustRestriction`.
   - [`backend/src/utils/trust/evaluate-action.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/trust/evaluate-action.ts):
     - Calculates dynamic `endsAt` using `resolveTrustDurationHours`.
     - Keeps `user.isActive = true` so users can still browse and log in during cooldowns.
4. **Buyer Profile Trust Status**:
   - [`backend/src/modules/buyer/services/buyer.profile.read.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/buyer/services/buyer.profile.read.ts):
     - Returns `trustWarning` for buyers at 4-5 points.
     - Returns `trustRestriction` with active cooldown time and message for buyers at $\ge 6$ points.
   - [`web/src/features/profile/api/profile.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/profile/api/profile.ts):
     - Added DTO typings for `trustWarning` and `trustRestriction`.
5. **Cart Drawer Warning & Cooldown Presentation**:
   - [`web/src/features/cart/components/CartDrawer.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/cart/components/CartDrawer.tsx):
     - Fetches buyer profile on drawer open.
     - Displays amber `Missed pickup warning` alert at 4 points above stall items.
     - Displays `TrustAccessNotice` with full explanation and disables Reserve button when paused.
6. **Notice Layout & Touch Target**:
   - [`web/src/features/trust/components/TrustAccessNotice.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/trust/components/TrustAccessNotice.tsx):
     - Moved the recovery button into a separate block container below the description paragraph, eliminating inline overlap.

## Affected Files
- `backend/src/utils/trust/policy.ts`
- `backend/src/utils/trust/evaluate-action.ts`
- `backend/src/utils/trust/access.ts`
- `backend/src/modules/auth/services/auth.session.ts`
- `backend/src/modules/buyer/services/buyer.profile.read.ts`
- `web/src/features/profile/api/profile.ts`
- `web/src/features/cart/components/CartDrawer.tsx`
- `web/src/features/trust/components/TrustAccessNotice.tsx`
- `web/src/lib/api.ts`

## Verification Performed
- `cd backend && bunx tsc --noEmit` -> Passed with 0 errors.
- `cd backend && bun build src/index.ts --outdir dist --target bun` -> Bundled 1,825 modules in 325ms.
- `cd web && bun run typecheck` -> Passed with 0 errors.
- Verified line counts:
  - `policy.ts`: 38 lines ($\le 200$)
  - `evaluate-action.ts`: 82 lines ($\le 200$)
  - `access.ts`: 50 lines ($\le 200$)
  - `auth.session.ts`: 133 lines ($\le 200$)
  - `buyer.profile.read.ts`: 82 lines ($\le 200$)
  - `profile.ts`: 32 lines ($\le 200$)
  - `CartDrawer.tsx`: 190 lines ($\le 200$)
  - `TrustAccessNotice.tsx`: 33 lines ($\le 200$)
  - `api.ts`: 76 lines ($\le 200$)
