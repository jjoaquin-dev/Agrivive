# Buyer Session Profile Header

Date: 2026-09-24

## What changed

- Made the shared buyer header session-aware through Better Auth's reactive session hook.
- Guest users see `Sign in` and `Create account`.
- Signed-in buyers no longer see those guest actions; they see a `Profile` control with their identity, Orders, and Sign out.
- Added the same signed-in profile state and sign-out action to the mobile navigation.
- Added a quiet loading placeholder while the session is being checked to prevent the header from flashing between states.
- Signing out closes the profile/menu state and returns the buyer to `/marketplace`.

## Why

The marketplace flow should clearly distinguish guest and authenticated states. Buyers need an easy way to confirm which account is active, open their orders, and sign out without seeing actions that no longer apply to them.

## Affected paths

- `web/src/components/SiteHeader.tsx`
- `.agents/design/web-design/DESIGN.md`

## Verification

- `cd web && bun run typecheck` — passed.
- `cd web && bun run build` — passed.

