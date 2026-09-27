# Typography Alignment and Icon Harmonization

Date: 2026-09-26

## What changed

- **Configured Official Google Fonts in Next.js Root Layout (`web/app/layout.tsx`)**:
  - Loaded `Manrope` for headings (`--font-heading`) and `Inter` for body (`--font-body`).
  - Applied CSS variables to `<html>` and base styles to ensure consistent font rendering across all devices.
- **Updated Tailwind Typography Config (`web/tailwind.config.ts`)**:
  - Wired `fontFamily.heading` to `var(--font-heading), Manrope, ui-sans-serif, system-ui, sans-serif`.
  - Wired `fontFamily.body` and `fontFamily.sans` to `var(--font-body), Inter, ui-sans-serif, system-ui, sans-serif`.
- **Set Global Font Families in CSS Tokens (`web/src/styles/tokens.css`)**:
  - Enforced `font-family: var(--font-body)` on `body`.
  - Enforced `font-family: var(--font-heading)` on all heading tags (`h1` through `h6`).
- **Normalized Navigation Icon and Button Sizing (`web/src/components/BuyerSiteHeader.tsx`)**:
  - Scaled down the oversized `size-12` user button with 24px icon down to standard `size-9` with a balanced 16px (`size-4`) Lucide icon.
  - Normalized shopping cart, menu, and auth button icon sizes to `size-4`.
- **Rebalanced Profile Header & Stat Strip (`web/src/features/profile/components/ProfileHeader.tsx`)**:
  - Scaled the profile avatar from `size-20` (80px) down to `size-14` (56px) with balanced typography and border ring.
  - Scaled metric ribbon icons down to `size-4` inside `size-8` containers.

## Why

Ensure cohesive, professional typography using the project-mandated Manrope (headings) and Inter (body) typefaces, while eliminating disproportionate button and icon sizing across the buyer header and profile surfaces.

## Affected paths

- `web/app/layout.tsx`
- `web/tailwind.config.ts`
- `web/src/styles/tokens.css`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/profile/components/ProfileHeader.tsx`

## Verification

- `bun run typecheck` in `web/` passed with 0 errors.
- `bun run build` in `web/` compiled all 11 static and dynamic pages with 0 errors.
- Line counts verified: all affected files are strictly <= 200 lines (`layout.tsx`: 38, `BuyerSiteHeader.tsx`: 187, `ProfileHeader.tsx`: 108).
