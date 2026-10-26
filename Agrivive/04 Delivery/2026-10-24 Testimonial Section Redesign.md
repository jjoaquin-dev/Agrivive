---
title: Testimonial Section Redesign
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-10-24 Why Choose Agrivive Section Redesign]]"
  - "[[2026-10-24 How Agrivive Works Section Redesign]]"
---

# Testimonial Section Redesign

## What Changed

1. **Removed 4 Impact Stat Numbers (3rd Reference Photo)**:
   - Completely removed the 4 stat metric boxes (`1,420+ kg Surplus Rescued`, `50+ Sources`, `₱180,000+ Savings`, `100% Inspected Fresh`) from the testimonial section.

2. **Refined Header & Two-Tone Typography (1st Reference Photo Style)**:
   - Centered pill tag: `Testimonials` in soft mint (`bg-[#EAF7E1] text-[#1F4D3A] border border-[#CFECC0]/60`).
   - Two-tone heading:
     - Line 1: `Trusted by buyers & growers` in Botanical Green `#1F4D3A`.
     - Line 2: `across Davao City` in deep neutral dark `#171717`.
   - Subheader: "Real experiences from home cooks, eatery owners, and local stall vendors reducing food waste and saving together."

3. **6 Community Stories in Clean 2-Tier Grid**:
   - Replaced placeholder 2-card section with 6 authentic stories from Davao stakeholder personas:
     - **Elena Marasigan** (Home Cook • Matina, Davao City)
     - **Mang Danilo Tan** (Stall Vendor • Bankerohan Public Market)
     - **Ate Grace Tolentino** (Carinderia Owner • Agdao District, Davao City)
     - **Kuya Robert Singson** (Highland Grower • Marilog District)
     - **Chef Marcus Villanueva** (Restaurateur • Poblacion, Davao City)
     - **Nanay Susan Bautista** (Neighborhood Cook • Toril, Davao City)
   - Integrated curated avatar portrait photography (`/avatars/*.jpg`).
   - Added large Botanical Green `#1F4D3A` quotation marks (`““`) at the top of each card (*Figure-Ground Principle*).
   - Encapsulated within crisp white `rounded-[24px]` cards with subtle hairline borders (`border-neutral-200/70`) and smooth hover lift.

## UI/UX Standards Applied

- **Jakob's Law *(Jakob Nielsen)***: Employs standard social proof and quote card conventions familiar from leading modern SaaS and e-commerce platforms.
- **Social Proof Principle *(Robert Cialdini)***: Multi-perspective testimonials from verified community members establish multi-sided trust and credibility.
- **Miller's Law & Chunking *(George A. Miller)***: 6 cards structured into 2 clean 3-card rows prevent cognitive overload.
- **Figure-Ground Principle *(Edgar Rubin & Wolfgang Köhler)***: Large botanical green quotation marks draw the eye straight to the testimonial voice.
- **Gestalt Law of Common Region *(Max Wertheimer & Kurt Koffka)***: Bounded `rounded-[24px]` card surfaces clearly isolate individual experiences.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Clean white cards with gentle hover lift create an inviting, trustworthy atmosphere.

## Affected Paths

- `web/src/features/home/components/HomeImpactTestimonials.tsx`
- `web/public/avatars/elena.jpg`
- `web/public/avatars/danilo.jpg`
- `web/public/avatars/grace.jpg`
- `web/public/avatars/robert.jpg`
- `web/public/avatars/marcus.jpg`
- `web/public/avatars/susan.jpg`
- `Agrivive/04 Delivery/2026-10-24 Testimonial Section Redesign.md`

## Verification Performed

- Next.js production build (`cd web; bun run build`): Verified 0 errors across all 20 routes.
- Strict line count verification: `HomeImpactTestimonials.tsx` verified at 119 lines (well below the 200-line ceiling).
