# Buyer Web Profile

Date: 2026-09-26

## What changed

- **Created Buyer Profile Feature Module (`web/src/features/profile/`)**:
  - `ProfilePersonalCard.tsx`: Displays buyer avatar initials, verified buyer status badge, email address, and an editable name field powered by Better Auth `authClient.updateUser`.
  - `ProfileSecurityCard.tsx`: Provides a secure password update form with live `PasswordChecklist` validation and 2FA status indicators.
  - `ProfileOrdersSummaryCard.tsx`: Fetches real-time buyer order statistics (pending pickup vs. completed counts) with a direct link to view full reservations.
  - `BuyerProfile.tsx`: Responsive two-column profile layout with session protection (redirects to `/login?next=/profile` if unauthenticated) and quick sign-out action.
- **Created Profile Route (`web/app/profile/page.tsx`)**:
  - Mounts `BuyerSiteHeader` and `BuyerProfile` with Suspense loading boundaries.
- **Updated BuyerSiteHeader (`web/src/components/BuyerSiteHeader.tsx`)**:
  - Made the authenticated user's name/avatar a clickable link to `/profile`.
  - Added a "Profile & Settings" link in the mobile navigation menu.

## Why

Provide buyers with a dedicated account management hub to edit their profile name, update security credentials, check reservation statistics, and manage account preferences in full alignment with the Agrivive design system and the 200-line source file limit.

## Affected paths

- `web/src/features/profile/components/ProfilePersonalCard.tsx`
- `web/src/features/profile/components/ProfileSecurityCard.tsx`
- `web/src/features/profile/components/ProfileOrdersSummaryCard.tsx`
- `web/src/features/profile/components/BuyerProfile.tsx`
- `web/app/profile/page.tsx`
- `web/src/components/BuyerSiteHeader.tsx`

## Verification

- `bun run typecheck` in `web/` passed with 0 errors.
- `bun run build` in `web/` compiled 11 static and dynamic pages including `/profile` with 0 errors.
- Verified line counts: all modified and created files are strictly under the 200-line readability limit.
