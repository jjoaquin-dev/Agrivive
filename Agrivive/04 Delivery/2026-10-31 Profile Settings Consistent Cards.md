---
title: Profile Settings Consistent Cards
type: delivery
date: 2026-10-31
status: complete
---

# Profile Settings Consistent Cards

## What changed

- Removed the "Search settings..." bar from the profile settings page, along with its state and icon import.
- Set one card style for every settings card: 20px radius, `border-neutral-200/80`, the same soft shadow used by the security cards, and a header with a divider line, `text-lg` bold title, and `text-sm` description.
- Profile Picture and Basic Information now use that header. The earlier cards used 24px radius, mixed text sizes, and different dividers.
- Pickup & Restock Notifications is now a `Card`-style panel with the same header, and it sits in the same `max-w-xl` column as the Security tab. Checkboxes use the brand green accent.
- Two-Factor Authentication and Account Password use the same header colors as the other cards.

## Affected files

- `web/src/features/profile/components/BuyerProfile.tsx`
- `web/src/features/profile/components/ProfileBasicInfoCard.tsx`
- `web/src/features/profile/components/ProfilePictureCard.tsx`
- `web/src/features/profile/components/ProfileNotificationsCard.tsx`
- `web/src/features/profile/components/ProfileSecurityCard.tsx`
- `web/src/features/profile/components/ProfileTwoFactorCard.tsx`

## Design basis

- Project design system: `.claude/design/web-design/DESIGN.md` (Lucide icons, 48px primary buttons, 44px touch targets, status colors paired with text).
- The `ui-ux-pro-max` skill was loaded. Its `--design-system` search was not run, because the project already has a design system and a new palette would conflict with it.

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
