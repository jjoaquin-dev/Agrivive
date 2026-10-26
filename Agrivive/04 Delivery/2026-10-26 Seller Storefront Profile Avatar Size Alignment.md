# Seller Storefront Profile Avatar Size Alignment

**Date:** 2026-10-26  
**Context:** Seller Storefront Header Component (`/sellers/[id]`)

## What Changed

- **Profile Image Dimension and Corner Radius Scaling**:
  - In `web/src/features/marketplace/components/SellerProfileAvatar.tsx`, increased the avatar dimensions from `size-16 sm:size-20` (64px / 80px) to `size-32 sm:size-36` (128px / 144px), matching the reference design where the avatar anchors the full vertical span of the vendor metadata.
  - Adjusted corner radius from `rounded-2xl` to `rounded-[22px]`, creating a proportional squircle geometry that matches the storefront card's outer curve.
  - Scaled the fallback placeholder icon from `size-5` to `size-8` and initials font to `text-base font-bold`.

## Affected File Paths

- `web/src/features/marketplace/components/SellerProfileAvatar.tsx`

## UI/UX Standards & Psychological Laws Applied

- **Aesthetic-Usability Effect** *(Masaaki Kurosu & Kaori Kashimura)*: A bold, well-proportioned 144px squircle avatar provides a strong visual anchor, elevating vendor authenticity and trust.
- **Gestalt Law of Proximity & Common Region** *(Max Wertheimer)*: Sizing the avatar to match the vertical span of the vendor details (badge, shop name, description) creates a visually balanced, unified composition.
- **Affordances and Signifiers** *(Don Norman)*: The squircle contour with subtle green ring signifies a verified vendor storefront card.

## Verification Performed

- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` (passed with 0 errors).
- Verified file line count: `SellerProfileAvatar.tsx` is 42 lines ($\le 200$ line constraint).
