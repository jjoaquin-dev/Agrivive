# 2026-11-02 Closed Account Shows Problem Screen Anywhere

## What changed
When any request answers 403 with an account paused or blocked message, the app now sends the person to the "Your Account Is Blocked / Paused" screen, whichever screen they were on. Before, only the first app-start call did this, and open screens each logged their own red error.

## Files
- mobile/src/api/client.ts (`setAccountClosedHandler`)
- mobile/src/context/AuthContext.tsx (registers the handler)
- mobile/app/(app)/_layout.tsx (redirects to the problem screen)

## Verification
Mobile typecheck clean. Not run on a phone.
