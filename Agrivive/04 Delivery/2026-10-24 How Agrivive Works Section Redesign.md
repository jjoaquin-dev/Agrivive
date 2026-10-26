---
title: How Agrivive Works Section Redesign
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-10-24 Standardized Product Card UI-UX Redesign]]"
  - "[[2026-10-24 Popular Categories Card Redesign]]"
---

# How Agrivive Works Section Redesign

## What Changed

1. **Horizontal 3-Step Card Layout & Full-Bleed Image Architecture**:
   - Replaced generic icon cards with a modern 3-card horizontal sequential layout (`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8`) following the user's reference design.
   - Removed outer card padding around the image, allowing the scenario photography to fit flush edge-to-edge horizontally against the card's top, left, and right borders (`rounded-t-[26px]` naturally clipped by `overflow-hidden`).
   - Moved internal padding (`p-6 sm:p-7`) strictly to the text content area below the photograph (*Gestalt Law of Common Region*).

2. **Dedicated Real-World Production Photography**:
   - Integrated the 3 user-provided real-world scenario photos into `web/public/how-it-works/`:
     - **Card 01 (SOURCE)**: Local farmer holding a wooden harvest crate loaded with carrots, tomatoes, and greens (`step-1-source.jpg`).
     - **Card 02 (DISCOVER)**: Clean Agrivive marketplace browsing interface with seasonal produce categories (`step-2-discover.png`).
     - **Card 03 (COLLECT)**: Vendor and buyer scanning digital reservation QR code at a public market produce stall (`step-3-collect.jpg`).

3. **Prominent Two-Digit Step Numbering & Palette Realization**:
   - Updated step numbering to two digits (**`01`**, **`02`**, **`03`**) in accent coral `#F26A36`.
   - Placed frosted glass badges (`bg-white/95 px-3 py-1 font-heading text-xs font-black shadow-xs backdrop-blur-md`) floating over the top-left of each photo stage.
   - Added matching sequential kicker labels (`01`, `02`, `03`) above each card title for immediate visual clarity (*Von Restorff Effect & Goal-Gradient Effect*).
   - Retained deep botanical green `#1F4D3A` for the section process kicker and hover state titles.
   - Encapsulated cards in crisp white `rounded-[26px]` surfaces with subtle hairline borders (`border-neutral-200/70`) and diffused elevation (`shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-lg`).

4. **Copy & Text Alignment**:
   - **01 SOURCE**: "Discover surplus produce from local growers and market sellers across Davao. Good vegetables deserve a second chance."
   - **02 DISCOVER**: "Browse available surplus produce, check stock, and find options that fit your needs."
   - **03 COLLECT**: "Present your reservation QR code to the seller and collect your produce with ease."

5. **Header Typography & 'Agrivive' Word Styling**:
   - Styled "Agrivive" in brand agricultural green (`#457D00`) with an upward-curving golden amber (`#EBA635`) swoosh SVG stroke underneath (*Von Restorff Effect*).
   - Expanded subheader width (`max-w-3xl lg:max-w-4xl`) with `sm:whitespace-nowrap` so the explanatory text renders in a single unbroken line on desktop and tablet screens (*Miller's Law & Chunking*), while gracefully wrapping on mobile devices (*Mobile-First Ergonomics*).

## UI/UX Standards Applied

- **Gestalt Law of Uniform Connectedness & Sequential Flow *(Max Wertheimer & Kurt Koffka)***: Horizontal 1 → 2 → 3 sequential progression clearly outlines the entire service lifecycle from grower to marketplace to pickup.
- **Goal-Gradient Effect *(Clark L. Hull)***: Step numbering gives users an immediate perception of an easy, approachable 3-stage process.
- **Jakob's Law *(Jakob Nielsen)***: Employs standard digital onboarding and process card patterns.
- **Von Restorff Effect *(Hedwig von Restorff)***: Warm coral `#F26A36` step numbers anchor the sequential path.
- **Don't Make Me Think *(Steve Krug)***: Single-word bold verbs (`SOURCE`, `DISCOVER`, `COLLECT`) with concise 2-sentence descriptions.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Authentic high-resolution photography builds tangible trust and credibility compared to generic vector icons.

## Affected Paths

- `web/src/features/home/components/HomeHowItWorks.tsx`
- `web/public/how-it-works/step-1-source.jpg`
- `web/public/how-it-works/step-2-discover.png`
- `web/public/how-it-works/step-3-collect.jpg`
- `Agrivive/04 Delivery/2026-10-24 How Agrivive Works Section Redesign.md`

## Verification Performed

- `bunx tsc --noEmit --project web/tsconfig.json`: Verified 0 errors across all components.
- `cd web; bun run build`: Next.js 15.5.0 static page generation succeeded with code 0 (20/20 routes).
- Line count check: `HomeHowItWorks.tsx` verified at 104 lines (well below the 200-line ceiling).
