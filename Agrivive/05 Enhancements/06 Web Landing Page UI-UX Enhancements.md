---
title: Web Landing Page UI-UX Enhancements
type: enhancement
status: in-progress
created: 2026-10-23
---

# Web Landing Page UI-UX Enhancements

## Context & Objectives
Revamp the Agrivive landing page (`web/`) to conform to comprehensive UI/UX standards, e-commerce grocery mental models (Jakob's Law), and anti-slop visual design conventions. Replace the passive informational brochure style with an active, conversion-driven marketplace interface featuring Davao City's local public market surplus produce.

---

## Change Log: 2026-10-23

### 1. Hero Section Transformation (Centerpiece & Instant Grocery Affordances)
- **Why**: 
  - Visitors previously could not tell what was being sold without clicking to `/marketplace`.
  - The hero lacked direct grocery search affordances and category quick-filters (violating Jakob's Law and Don't Make Me Think).
- **What Changed**:
  - Replaced the asymmetrical 2-column layout with a balanced, center-aligned hero structure.
  - Added an impactful, unambiguous headline: **"Fresh Surplus Vegetables Rescued For Your Table"** with warm Terracotta highlighting.
  - Positioned the high-resolution vegetable basket asset (`/brand/agrivive-vegetable-basket.png`, featuring the "Still Good, Still Useful!" tag) as the focal centerpiece with subtle ambient glows.
  - Added 4 floating benefit pills with soft depth (`Up to 50% Off Surplus`, `Bankerohan & Agdao`, `100% Edible`, `Same-Day Hold`).
  - Added a centered interactive **Produce Search Bar** routing directly to `/marketplace?search=...`.
  - Added 5 tactile **Category Quick Pills** (`Leafy Greens`, `Fruit Veggies`, `Root Crops`, `Best Surplus Deals`, `Bankerohan Stalls`).
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/public/brand/agrivive-vegetable-basket.png`
- **Verification Performed**:
  - `bun run typecheck` in `web/` passed with 0 errors (`$ tsc --noEmit`).
  - Live HTTP verification via Next.js dev server at `http://localhost:3001` rendered status `200 OK`.

### 2. Hero Visual Refinement (Pure White, Inter Typography, Search Placement & Modern Floating Pills)
- **Why**: 
  - Ensure visual cleanliness and high contrast on the hero canvas (`bg-white`).
  - Adopt modern grotesque Inter typography matching the reference design.
  - Position the search bar directly in the navigation bar beside the logo for persistent search affordance across the landing page (*Jakob's Law*).
  - Eliminate dark fringe and remove the handle hole island from the vegetable basket centerpiece.
- **What Changed**:
  - Switched hero background to clean `bg-white` with soft ambient radial backdrops.
  - Updated headline typography to Inter (`font-body font-extrabold tracking-tight text-neutral-900`): **"Make healthy life with [fresh] surplus vegetables"** with a curved green underline swoop under *"fresh"*, center-aligned.
  - Updated subtitle copy: *"Find and reserve good surplus produce from vendors at friendly everyday prices before they go to waste."*
  - Moved the search bar from the hero into the navigation bar right beside the Agrivive logo (`LandingHeader.tsx`), with mobile drawer support.
  - Removed the quick-category filter pills from the hero to keep the centerpiece clean and focused.
  - Upgraded floating pills to sleek modern glassmorphic micro-cards (`bg-white/95 backdrop-blur-md ring-1 ring-black/5 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)]`) with circular icon badges and hover translations.
  - Integrated `/brand/agrivive-vegetable-basket-clean.png` with fully decontaminated edges and transparent basket handle hole.
- **Affected File Paths**:
  - `web/src/features/home/components/LandingHeader.tsx`
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/public/brand/agrivive-vegetable-basket-clean.png`
- **Verification Performed**:
  - `bun run typecheck` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed status 200 OK.

### 3. Implementation of Audit Enhancements (Showcase, Impact Metrics & Streamlined Hero)
- **Why**: 
  - Fulfill the core UI/UX audit roadmap: transform Agrivive from a passive brochure into an action-oriented grocery marketplace.
  - Deliver immediate visibility of real vegetables, savings, and stall locations (*Recognition Over Recall*, *Jakob's Law*).
  - Clean up the hero by removing the superfluous top location pill.
- **What Changed**:
  - `HomeHero.tsx`: Removed the top pill badge to provide more breathing room for the Inter typography headline.
  - `HomeBenefits.tsx`: Upgraded from static 4 text boxes to live impact statistics (Produce Rescued, Partner Vendors, Savings) + infinite marquee ticker.
  - `HomeFeaturedProduce.tsx`: Created new component displaying 4 real surplus listings with price comparisons (e.g. `₱25` vs `₱45`), discount badges (`-44%`), stall locations, and 1-click reserve actions.
  - `app/page.tsx`: Embedded the new produce showcase seamlessly between the impact metrics and "Why Agrivive".
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/src/features/home/components/HomeBenefits.tsx`
  - `web/src/features/home/components/HomeFeaturedProduce.tsx`
  - `web/app/page.tsx`
- **Verification Performed**:
  - `bun run typecheck` in `web/` passed with 0 errors.
  - Live HTTP verification on `http://localhost:3001` confirmed 200 OK.

### 4. Navbar & Hero Search Re-alignment
- **Why**: 
  - Ensure the navigation bar remains spacious, readable, and standard (*Jakob's Law*).
  - Provide a direct link to the Marketplace in the primary navigation for immediate browsing access.
  - Anchor the vegetable search bar directly below the visual basket centerpiece in the hero (*Fitts's Law*).
- **What Changed**:
  - `LandingHeader.tsx`: Removed the embedded search form from the top bar. Added `Marketplace` (`/marketplace`) to the primary navigation bar and mobile drawer.
  - `HomeHero.tsx`: Positioned the centered search bar directly below the 3D vegetable basket centerpiece.
- **Affected File Paths**:
  - `web/src/features/home/components/LandingHeader.tsx`
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bun run typecheck` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed status 200 OK.

### 5. Chat Bubbles & Multi-Section Search Bar Enhancement
- **Why**: 
  - Fix perceived image cropping caused by floating cards overlaying lower vegetable parsley sprigs and spinach leaves.
  - Transform rectangular cards into conversational modern chat bubbles with tails pointing toward the basket (*Emotional Ergonomics*).
  - Add a comprehensive multi-section search widget (`Category`, `What are you looking for?`, `Location`, `Find`) below the basket (*Miller's Law & Chunking*, *Fitts's Law*).
- **What Changed**:
  - `HomeHero.tsx`: Expanded container bounds (`max-w-[620px]` and `h-[380px] sm:h-[460px] md:h-[520px]`). Pushed floating badges outward and styled them as sleek modern chat bubbles with speech tails (`rounded-2xl` with custom corners, circular avatar rings, and conversational quotes).
  - `HeroSearchBar.tsx`: Created a segmented search bar containing:
    1. **Category**: All 9 marketplace vegetable categories.
    2. **What are you looking for?**: Keyword input with search icon.
    3. **Location**: Davao City public markets dropdown.
    4. **Find Button**: High-contrast Forest Green pill.
  - Responsive layout: horizontal segmented capsule on desktop, stacked touch-friendly card on mobile.
- **Affected File Paths**:
  - `web/src/features/home/components/HeroSearchBar.tsx`
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bun run typecheck` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed status 200 OK.

---

## Change Log: 2026-10-24

### 6. Full Marketplace Landing Page Redesign (PioMart Reference, 5-Color Palette & Academic Marketplace Structure)
- **Why**: 
  - Restructure the Agrivive landing page to align with the user-provided e-commerce references (PioMart layout, custom 5-color palette, and category cards) and the academic surplus marketplace rubric.
  - Eliminate the generic AI-slop appearance and restrictive "3 Markets" copy by acknowledging direct farm growers and public market stall vendors across Davao City.
  - Relocate the search bar into a two-tier navigation bar and establish a strong visual hierarchy (*Jakob's Law*, *Fitts's Law*, *Figure-Ground Principle*).
- **What Changed**:
  - **LandingHeader.tsx**: Built a two-tier top navigation:
    - Upper bar: Agrivive brand logo, centered search capsule (`Search input` + `[All Categories ▾]` dropdown + `#457D00` search button), marketplace shortcut, and session/auth controls.
    - Sub-bar: Green `[All Categories ▾]` button pill (`#457D00`) and clean anchor links to all landing sections (`Home`, `Marketplace`, `Categories`, `Live Surplus`, `How It Works`, `Why Surplus?`, `Farmer Stories`, `FAQ`).
  - **HomeHero.tsx**: Replaced centered layout with PioMart 2-column layout:
    - Left column: Double-dash tag (`― Davao Surplus Produce Rescue`), bold headline with highlighted "Fresh" (`#457D00`), value proposition, and warm amber button `#FEA938` (*"Shop Today's Harvest"*).
    - Right column: Angled green backdrop polygon (`#457D00` / `clip-path`) with vertical `AGRIVIVE` watermark, centerpiece vegetable basket (`/brand/agrivive-vegetable-basket-clean.png`), and tactile floating badge (`⚡ Same-Day Pickup • ★ 100% Edible Harvest`).
  - **HomeCategories.tsx**: Created "Our Popular Categories" section with 4 pastel cards (`Fresh Vegetables`, `Fresh Healthy Fruits`, `Leafy Greens & Herbs`, `Root Crops & Tubers`) using the exact color palette (`#D9E8DF`, `#FCE8D0`, `#EBF1D4`, `#FCF6D9`).
  - **HomeFeaturedProduce.tsx**: Re-anchored live inventory directly beneath categories, featuring 4 sample offerings with **price anchoring** (retail crossed out vs. surplus price, -50% tags, stall location, and reserve buttons).
  - **HomeHowItWorks.tsx**: Streamlined into 3 clear steps (*Sourced Locally*, *Shop the Marketplace*, *Fast Pass Pickup*).
  - **HomeWhySurplus.tsx**: Created section explaining cosmetic quirks and seasonal bumper harvest, structured around 3 pillars (*Save Money*, *Protect Environment*, *Support Local Growers*).
  - **HomeImpactTestimonials.tsx**: Integrated community counters (`1,420+ kg Rescued`, `50+ Sources`, `₱180,000+ Savings`, `100% Inspected`) with authentic buyer and vendor testimonials.
  - **HomeFarmerFaq.tsx**: Created Marilog Valley organic cooperative spotlight and answered the 3 most urgent buyer FAQs.
  - **HomeFinalCta.tsx**: Added secondary push with email capture form for a 10% first-order discount voucher.
  - **HomeFooter.tsx**: Updated section links and verified all navigation targets.
  - **Code Hygiene**: Retired obsolete files (`HeroSearchBar.tsx` and `HomeBenefits.tsx`). All 13 component files remain strictly <= 200 lines.
- **Affected File Paths**:
  - `web/src/features/home/components/LandingHeader.tsx`
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/src/features/home/components/HomeCategories.tsx`
  - `web/src/features/home/components/HomeFeaturedProduce.tsx`
  - `web/src/features/home/components/HomeHowItWorks.tsx`
  - `web/src/features/home/components/HomeWhySurplus.tsx`
  - `web/src/features/home/components/HomeImpactTestimonials.tsx`
  - `web/src/features/home/components/HomeFarmerFaq.tsx`
  - `web/src/features/home/components/HomeFinalCta.tsx`
  - `web/src/features/home/components/HomeFooter.tsx`
  - `web/app/page.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors across all Next.js modules.
  - `Invoke-WebRequest` to `http://localhost:3001` verified HTTP status `200 OK` (71,227 bytes).
  - Verified all 8 primary sections present in server response HTML.
  - Confirmed all TypeScript source files are within 60 to 190 lines (<= 200 lines limit).

---

### 7. Restoration of Centered Hero Section with Modern Chat Bubbles & Sub-Basket Search Bar
- **Why**: 
  - The user preferred the previous centered hero architecture featuring the centered Inter headline with curved green swoop, uncropped 3D basket centerpiece, conversational chat bubbles, and the multi-section search bar below the basket.
  - Retained all newly constructed sections below the hero (*Our Popular Categories*, *Live Surplus Inventory*, *How It Works*, *Why Surplus?*, *Impact & Testimonials*, *Farmer FAQ*, and *Final CTA*).
- **What Changed**:
  - `HomeHero.tsx`: Restored the centered hero section with:
    - Centered headline: **"Make healthy life with [fresh] surplus vegetables"** with curved green underline swoop.
    - Subtitle copy: *"Find and reserve good surplus produce from vendors at friendly everyday prices before they go to waste."*
    - Uncropped 3D vegetable basket centerpiece (`/brand/agrivive-vegetable-basket-clean.png`).
    - 4 modern conversational chat bubbles: `Surplus Deal (Up to 50% off)`, `Local Stalls (Ready for pickup)`, `100% Fresh (Still good, crispy & edible)`, and `Instant Pass (Reserve in 1 click)`.
    - Integrated `HeroSearchBar` directly below the basket.
  - `HeroSearchBar.tsx`: Segmented multi-parameter search bar capsule (`Category`, `What are you looking for?`, `Location`, `Find`).
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/src/features/home/components/HeroSearchBar.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed status 200 OK.
  - Verified presence of centered headline, uncropped basket, chat bubbles, search bar, and all subsequent marketplace sections.

---

### 8. Sub-Basket Search Removal & Palette Application
- **Why**: 
  - Having the search bar below the basket was redundant since search is already cleanly integrated in the top navigation bar (`LandingHeader.tsx`).
  - Align all hero accents, highlights, CTA buttons, and conversational chat bubbles with the uploaded 5-color palette (`#457D00`, `#FEA938`, `#96B125`, `#C6C736`, `#FCEC9A`).
- **What Changed**:
  - `HomeHero.tsx`:
    - Removed `HeroSearchBar` from below the basket.
    - Updated "fresh" text and curved swoop to `#457D00` (Deep Farm Green).
    - Added high-contrast palette CTA buttons below the subtitle: Primary `#FEA938` (*"Shop Today's Harvest"*) and secondary border button (*"Browse Categories"*).
    - Styled conversational chat bubbles with the uploaded palette:
      - Surplus Deal: `#FEA938` (Warm Mango Amber)
      - Local Sourcing: `#457D00` (Fresh Farm Green)
      - 100% Fresh: `#96B125` (Leaf Green)
      - Instant Pass: `#C6C736` (Olive Chartreuse)
    - Ambient background glow: `#FCEC9A` and `#457D00`.
  - Removed obsolete file `web/src/features/home/components/HeroSearchBar.tsx`.
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/src/features/home/components/HeroSearchBar.tsx` (deleted)
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed status 200 OK.
  - `HomeHero.tsx` is 116 lines (well below the 200-line limit).

---

### 9. Hero CTA Streamlining, Exact Chat Bubble Copy & Sub-Nav Simplification
- **Why**: 
  - Remove secondary "Browse Categories" button to give singular visual prominence to the primary "Shop Today's Harvest" CTA (*Hick-Hyman Law* & *Von Restorff Effect*).
  - Update the 4 floating chat bubbles around the vegetable basket with the user's exact value proposition copy.
  - Clean up the sub-navbar by removing the `[All Categories ▾]` pill and the location tagline text, leaving clean, centered navigation links.
- **What Changed**:
  - `HomeHero.tsx`:
    - Removed `Browse Categories` secondary CTA button.
    - Updated Top-Left chat bubble: `Value & Savings` → *“Save up to 50% while rescuing today's fresh harvest.”*
    - Updated Top-Right chat bubble: `Quality Assurance` → *“Same great taste and nutrition, just cosmetically imperfect.”*
    - Updated Bottom-Left chat bubble: `Community & Origin` → *“Supporting local farms and community market stalls.”*
    - Updated Bottom-Right chat bubble: `Convenience` → Quick Claim: *“Reserve instantly and pick up the very same day.”*
  - `LandingHeader.tsx`:
    - Removed `[All Categories ▾]` green pill from the sub-nav.
    - Removed `Davao City Farm & Market Rescue` text from the sub-nav.
    - Cleanly centered the section links across the sub-nav bar.
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
  - `web/src/features/home/components/LandingHeader.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed status 200 OK.
  - Verified absence of "Browse Categories" and presence of all 4 updated chat bubble copy texts.
  - Both `HomeHero.tsx` (118 lines) and `LandingHeader.tsx` (177 lines) are strictly <= 200 lines.

---

### 10. Search Input Placeholder Refinement
- **Why**: 
  - Direct user request to specify search intent clearly (*Don't Make Me Think* & *Recognition Over Recall*).
- **What Changed**:
  - `LandingHeader.tsx`: Changed search input placeholder from generic copy to `"Search vegetable name..."` across both desktop and mobile drawer search bars.
- **Affected File Paths**:
  - `web/src/features/home/components/LandingHeader.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed `"Search vegetable name..."` rendered.
  - `LandingHeader.tsx` remains 177 lines (within 200-line limit).

---

### 11. Hero Copy Customization & Floating Cards Removal
- **Why**: 
  - Update the Hero headline and subheader to state the exact business model and value proposition (*Jakob's Law*, *Don't Make Me Think*).
  - Eliminate visual clutter around the centerpiece 3D vegetable basket by removing all 4 floating chat bubble cards (*Gestalt Law of Prägnanz / Simplicity*).
- **What Changed**:
  - `HomeHero.tsx`:
    - Updated headline: **"Rescue [Fresh] Surplus Vegetables in Davao City"** (with *"Fresh"* highlighted in brand green `#457D00` with the curved underline swoop).
    - Updated subheader: *"Reserve marketable surplus directly from verified local stalls. Secure your order with a 24-hour QR code and save money while helping vendors reduce food waste."*
    - Removed all 4 floating chat bubble cards around the vegetable basket.
    - Cleaned up unused Lucide icon imports (`Clock`, `MapPin`, `Sparkles`, `Sprout`).
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed new headline and subheader rendered status 200 OK.
  - Confirmed absence of floating info cards.
  - `HomeHero.tsx` is now 66 lines (well below the 200-line limit).

---

### 12. Headline Text & Highlight Underline Customization
- **Why**: 
  - Emphasize the core value proposition of "Surplus" produce with dual brand accenting (*Von Restorff Effect*).
- **What Changed**:
  - `HomeHero.tsx`:
    - Removed the word "Fresh" from the headline.
    - Highlighted **"Surplus"** in brand green (`#457D00`).
    - Added warm orange (`#FEA938`) curved swoop underline beneath "Surplus".
    - Final headline: **"Rescue [Surplus] Vegetables in Davao City"**.
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed headline rendering with orange underline (#FEA938).
  - `HomeHero.tsx` remains 66 lines (within 200-line limit).

---

### 13. Hero Centerpiece Harvest Crates Display & Responsive Layout
- **Why**: 
  - Direct user request to replace the single basket image with the wide abundant harvest crates, wooden boxes, and onion sack photo asset.
  - Ensure fluid responsiveness across all device breakpoints (mobile, tablet, and wide desktop) without distortion or unwanted letterboxing (*Touch Target Principle & Mobile-First Ergonomics*).
- **What Changed**:
  - Copied uploaded transparent RGBA asset to `web/public/brand/agrivive-harvest-crates.png`.
  - Updated `HomeHero.tsx` to render the new image with responsive attributes:
    - Container: `max-w-5xl w-full px-2 sm:px-4`.
    - Image: `max-w-[860px] w-full h-auto object-contain`, `sizes="(min-width: 1280px) 960px, (min-width: 1024px) 820px, (min-width: 640px) 90vw, 100vw"`.
    - Natural drop shadow with brand green tint `drop-shadow-[0_20px_45px_rgba(31,77,58,0.14)]`.
- **Affected File Paths**:
  - `web/public/brand/agrivive-harvest-crates.png`
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed `agrivive-harvest-crates.png` rendering.
  - `HomeHero.tsx` remains 66 lines (well within the 200-line limit).

---

### 14. Hero Centerpiece Scale Expansion
- **Why**: 
  - Enhance visual presence and hero impact by enlarging the harvest crates display on desktop and tablet viewports (*Gestalt Figure-Ground Principle*).
- **What Changed**:
  - `HomeHero.tsx`:
    - Expanded container width from `max-w-5xl` to `max-w-6xl`.
    - Increased image maximum rendering constraint from `max-w-[860px]` to `max-w-[980px] lg:max-w-[1040px]`.
    - Enhanced responsive drop shadow: `drop-shadow-[0_24px_50px_rgba(31,77,58,0.16)]`.
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed enlarged container (`max-w-6xl`) and image scale rendered status 200 OK.
  - `HomeHero.tsx` remains 66 lines (well within the 200-line limit).

---

### 15. Hero Spacing & Image Proportion Optimization
- **Why**: 
  - Direct user request to eliminate awkward vertical whitespace between the CTA button and the centerpiece image, moving the image higher and sizing it appropriately so the entire display (including bottom crates and produce) fits cleanly into view without cut-off.
- **What Changed**:
  - `HomeHero.tsx`:
    - Reduced section top/bottom padding: `pb-12 pt-10 sm:pb-16 sm:pt-14`.
    - Tightened CTA top margin: `mt-6 sm:mt-7`.
    - Moved image container upward: `mt-4 sm:mt-6` (down from `mt-10 sm:mt-12`).
    - Adjusted max display bounds: `max-w-[760px] lg:max-w-[850px]` inside `max-w-5xl`.
- **Affected File Paths**:
  - `web/src/features/home/components/HomeHero.tsx`
- **Verification Performed**:
  - `bunx tsc --noEmit` passed with 0 errors.
  - Live HTTP verification at `http://localhost:3001` confirmed tightened layout and `max-w-[850px]` rendering status 200 OK.
  - `HomeHero.tsx` remains 66 lines (well within the 200-line limit).










