# 2026-11-02 Ended Pause Opens Account

## What changed
- New `utils/trust/read-account-block.ts` decides why an inactive account is shut. A blocked account stays shut. A pause that has not ended stays shut. A pause that has ended is closed and the account is opened again.
- A pause saved without an end time now ends after 3 days (`restrictionEnd` in `utils/trust/access.ts`), in the pause check, the message, the expiry job and the session check.
- `auth.session.ts` uses the new function.
- Mobile logs a 403 (paused or blocked) as a quiet warning, not a red error.

## Why
A test seller showed "paused for 3 days ... come back in a few moments". The account was inactive with a pause whose end had passed (or had no end), so nothing ever opened it.

## Verification
In-memory Postgres: ended pause opens the account, a pause with no end opens after 3 days, a live pause says "2 days", a blocked account stays shut, the expiry job closes old pauses with no end time. Typecheck clean on backend and mobile, 45 repo tests pass, both builds done.
