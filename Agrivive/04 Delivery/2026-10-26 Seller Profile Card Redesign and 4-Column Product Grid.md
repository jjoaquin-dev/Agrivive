# 2026-10-26 Seller Profile Card Redesign and 4-Column Product Grid

## Date
2026-10-26

## What Changed
Redesigned the seller storefront profile card (`/sellers/[id]`) to replicate the user's reference photo design and updated the product listing to a 4-column responsive grid:
1. **Seller Profile Card Header (`SellerStorefrontHeader.tsx`)**:
   - Reorganized header layout to a balanced flex/grid presentation with a vertical divider on desktop.
   - **Vendor Identity**:
     - Avatar styled with a verified green checkmark badge (`size-6 rounded-full bg-[#16A34A]`) at the bottom-right corner (`SellerProfileAvatar.tsx`).
     - Displayed stall title beside an uppercase soft mint role pill (`bg-[#EAF7ED] text-[#16A34A] uppercase`).
     - Formatted solid green `Follow seller` button beside an icon-only message seller button (`MessageCircle`).
     - Added bio description text beneath actions.
   - **Pickup Location & Details**:
     - **Pickup Location**: Soft green squircle (`size-9 rounded-xl bg-[#EAF7ED] text-[#16A34A]`) with `MapPin` icon, stall location, and `"Get directions"` link.
     - **Pickup Details**: Soft peach squircle (`size-9 rounded-xl bg-[#FFF4E5] text-[#EA580C]`) with `Clock` icon and pickup instructions.
2. **Product Grid Layout (`SellerStorefront.tsx`)**:
   - Updated product list grid from 3 columns to **4 columns per row** on desktop screens (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
3. **Button Components**:
   - `MessageSellerButton.tsx`: Added `iconOnly` prop support for compact icon-only message triggers with green hover state.
   - `SellerFollowButton.tsx`: Restyled `Follow seller` button to high-contrast solid green (`bg-[#16A34A]`) with white text and smooth toggle states.

## Why
- **Figure-Ground Principle & Aesthetic-Usability Effect (Gestalt / Kurosu & Kashimura)**: Distinctive squircle icons and structured column partitions improve glanceability and perceived credibility.
- **Law of Common Region (Max Wertheimer)**: Clearly encloses identity, vendor actions, and pickup logistical information within cohesive sub-regions.
- **Hick-Hyman Law & Ergonomics**: A 4-column product grid optimizes viewport density and vertical scrolling efficiency on desktop displays.

## Affected Files
- `web/src/features/marketplace/components/SellerStorefrontHeader.tsx` (89 lines)
- `web/src/features/marketplace/components/SellerProfileAvatar.tsx` (49 lines)
- `web/src/features/marketplace/components/MessageSellerButton.tsx` (40 lines)
- `web/src/features/marketplace/components/SellerFollowButton.tsx` (78 lines)
- `web/src/features/marketplace/components/SellerStorefront.tsx` (187 lines)

## Verification
- Verified line count: all 5 modified files are strictly $\le 200$ lines.
- Ran `cd web; bun run typecheck` (`tsc --noEmit`): exited with code 0 (zero errors).
