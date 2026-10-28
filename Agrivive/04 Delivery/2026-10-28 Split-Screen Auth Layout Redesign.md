# 2026-10-28 Split-Screen Auth Layout Redesign

## Context & Objectives
Redesign the sign-in (`/login`) and sign-up (`/signup`) layout to use an edge-to-edge split-screen layout inspired by the reference fleet management authentication page. Place the user-provided vibrant surplus vegetables image on the left with a top-left headline and description. Preserve the existing right-side form design, inputs, logo, Google OAuth, and validation.

## Why
1. Previously, the authentication pages (`/login` and `/signup`) rendered inside a padded card modal centered on the screen (`AuthShell.tsx`), which felt boxed-in and less immersive on desktop.
2. The user requested a modern split-screen layout matching their reference image (edge-to-edge left photo + centered right form) using their newly provided photograph of fresh market produce crates.
3. The user requested the headline and description positioned at the top-left of the photo and enlarged for maximum visual impact without any white blur/fade overlay.
4. The right side's existing form layout, buttons, fields, and branding remain untouched for consistent user interaction.

## What Changed
1. **Surplus Vegetables & Market Stalls Assets**:
   - Saved the user's high-resolution fresh vegetable crate photo to [`web/public/brand/auth-market-produce.jpg`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/public/brand/auth-market-produce.jpg).
2. **Split-Screen `AuthShell` Architecture**:
   - [`web/src/features/auth/components/AuthShell.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/auth/components/AuthShell.tsx):
     - Converted the non-centered layout into an edge-to-edge `grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 bg-white`.
     - **Left Hero Panel**: Displays the market produce crates photo with:
       - 100% crisp, unblurred presentation directly against the form split (no white gradient fade/blur overlay).
       - Top-left headline positioning with a dark top-to-bottom contrast overlay (`bg-gradient-to-b from-neutral-950/90 via-neutral-950/50 to-transparent`).
       - Prominent, high-impact headline: *"Rescue Surplus Vegetables in Davao City"* (`text-4xl sm:text-5xl lg:text-[44px] font-extrabold`).
       - Enlarged subtext: *"Reserve fresh surplus produce directly from verified local market stalls. Save money and help vendors reduce food waste."* (`text-base sm:text-lg`).
     - **Right Form Panel**: Fully centered (`flex min-h-screen w-full items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-16`), preserving all existing form components, Google sign-in button, email/password inputs, and footer links.
     - Kept the `centered={true}` option intact for standalone pages such as `/password-setup`.

## Affected Files
- `web/public/brand/auth-market-produce.jpg`
- `web/src/features/auth/components/AuthShell.tsx`

## Verification Performed
- `cd web && bun run typecheck` -> Passed with 0 errors.
- `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` -> Passed with 0 errors (bundled 1,831 modules in 313ms).
- Verified line count:
  - `AuthShell.tsx`: 139 lines ($\le 200$)
- Verified `/login` and `/signup` routes display the enlarged top-left headline layout.
