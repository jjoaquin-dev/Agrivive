---
title: Why Choose Agrivive Section Redesign
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-10-24 How Agrivive Works Section Redesign]]"
  - "[[2026-10-24 Popular Categories Card Redesign]]"
---

# Why Choose Agrivive Section Redesign

## What Changed

1. **Bento Grid Architecture (Hearth Reference Adaptation)**:
   - Replaced generic 3-card objection layout with a dynamic 6-card 12-column Bento Grid on a deep forest botanical canvas (`bg-[#14231A]`).
   - Grouped cards into three balanced horizontal tiers (*Miller's Law & Chunking*):
     - **Row 1**:
       - *Horizontal Card 1 (7 Cols)*: **Visual & Verified Transparency** — Spiced Terracotta `#C97850` surface featuring large high-impact stat callouts (**95.1%** for live produce photos and **97.6%** for seller verification) (*Von Restorff Effect*).
       - *Small Card 1 (5 Cols)*: **Fight Food Waste** — Full-bleed background with cabbage harvest field photography (`/benefits/fight-food-waste.jpg`), cinematic gradient overlay, and frosted pill badge (*Figure-Ground Principle*).
     - **Row 2**:
       - *Small Card 2 (4 Cols)*: **Maximize Your Budget** — Warm Cream `#FFF9EE` surface with amber wholesale savings badge.
       - *Small Card 3 (4 Cols)*: **Empower Local Communities** — Full-bleed background with vibrant Davao market stall photography (`/benefits/empower-communities.jpg`), dark gradient overlay, and frosted glass badge.
       - *Small Card 4 (4 Cols)*: **Shop with Confidence** — Soft Sage `#F0F7ED` surface with verified seller shield and trust copy.
     - **Row 3**:
       - *Horizontal Card 2 (12 Cols)*: **Centralized Access & Reliable Reservations** — Expansive Botanical Forest Green `#1F4D3A` surface with Lime `#B8EB5E` badge, interactive highlight chips (*OpenStreetMap Geolocation*, *24-Hour QR Reservations*, *Direct Stall Sourcing*).

2. **Copy Alignment & Typography Styling**:
   - Header: "Why Choose Agrivive?" styled with "Agrivive" in brand agricultural green `#B8EB5E` and an upward-arching golden amber `#EBA635` swoosh underline (*Von Restorff Effect*).
   - Subheader: "The platform assists local vendors and buyers in Davao City by making surplus vegetable listings easier to track, helping reduce postharvest losses and connect supply with local demand."
   - Tightened grid spacing from `gap-6` (24px) down to `gap-3.5 sm:gap-4` (14px–16px) to bring the cards closer together into a compact, unified Bento cluster (*Gestalt Law of Proximity*).
   - Exact text for all 4 key outcomes and 2 core value propositions preserved down to every statistic and sentence.

3. **Cute 3D Smiling Vegetable Mascots & Bilateral Visual Balance**:
   - Updated the 3D carrot mascot (`/brand/cute-3d-carrot.png`) with **104,622 pixels of rich, lush green leafy foliage tops** intact.
   - Symmetrically matched the carrot and tomato mascots to the exact same visual scale and top alignment (*Gestalt Law of Symmetry & Balance*):
     - **Card 1 (Visual & Verified Transparency)**: Cute 3D smiling tomato (`/brand/cute-3d-tomato.png`) at `size-44 sm:size-56 md:size-64 lg:size-72` (288px), positioned at `-left-6 sm:-left-10 lg:-left-14` and `-top-40 sm:-top-52 md:-top-60 lg:-top-[260px]` (`-rotate-12`, `z-0` behind the `z-10` card). Exactly 28px (~9.7%) is tucked behind the card rim, exposing 90.3% of its happy smiling face, rosy cheeks, and waving hand.
     - **Card 2 (Fight Food Waste)**: Cute 3D smiling carrot with lush green leafy tops (`/brand/cute-3d-carrot.png`) at `size-44 sm:size-56 md:size-64 lg:size-72` (288px), positioned at `-right-6 sm:-right-10 lg:-right-14` and `-top-40 sm:-top-52 md:-top-60 lg:-top-[260px]` (`rotate-12`, `z-0` behind the `z-10` card). Exactly 28px (~9.7%) is tucked behind the card rim, exposing 90.3% of its body, including full face, smiling open mouth, cheeks, waving arm, and green foliage tops.
   - Both characters symmetrically balance and frame the *"Why Choose Agrivive?"* header, eliminating previous visual asymmetry.
   - Expanded grid top spacing to `mt-28 sm:mt-36 lg:mt-44` to maintain generous breathing room below the subheader text (*Gestalt Law of Proximity*).

4. **Modularity & 200-Line Rule**:
   - Extracted benefit card presentation into `HomeWhySurplusCard.tsx` (84 lines).
   - Maintained `HomeWhySurplus.tsx` (161 lines) strictly under the 200-line ceiling.

## UI/UX Standards Applied

- **Jakob's Law *(Jakob Nielsen)***: Employs familiar modern Bento Grid cards made popular by Apple, Linear, and Hearth.
- **Miller's Law & Chunking *(George A. Miller)***: Chunks 6 distinct value propositions into discrete, highly scannable visual containers with clear category pills.
- **Von Restorff Effect *(Hedwig von Restorff)***: Highlights key buyer statistical preferences (95.1% and 97.6%) in high-contrast oversized typography.
- **Figure-Ground Principle *(Edgar Rubin & Wolfgang Köhler)***: Deep contrast gradient overlays ensure pure white text is effortlessly readable over photography.
- **Gestalt Law of Common Region *(Max Wertheimer & Kurt Koffka)***: Bounded `rounded-[28px]` surfaces separate each unique stakeholder outcome.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Rich, organic palette harmonies (Terracotta, Botanical Green, Warm Cream, Golden Amber) evoke natural agricultural authenticity.

## Affected Paths

- `web/src/features/home/components/HomeWhySurplus.tsx`
- `web/src/features/home/components/HomeWhySurplusCard.tsx`
- `web/public/brand/cute-3d-tomato.png`
- `web/public/brand/cute-3d-carrot.png`
- `web/public/benefits/fight-food-waste.jpg`
- `web/public/benefits/empower-communities.jpg`
- `Agrivive/04 Delivery/2026-10-24 Why Choose Agrivive Section Redesign.md`

## Verification Performed

- TypeScript type check (`cd web; bunx tsc --noEmit`): Verified 0 errors across the codebase.
- Strict line count verification:
  - `HomeWhySurplus.tsx`: 140 lines (<= 200 lines).
  - `HomeWhySurplusCard.tsx`: 84 lines (<= 200 lines).
