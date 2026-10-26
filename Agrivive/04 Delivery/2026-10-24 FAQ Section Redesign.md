---
title: FAQ Section Redesign
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-10-24 Why Choose Agrivive Section Redesign]]"
  - "[[2026-10-24 Testimonial Section Redesign]]"
---

# FAQ Section Redesign

## What Changed

1. **2-Column Layout Architecture (Reference Photo Match)**:
   - Replaced old card spotlight block with an asymmetric 2-column layout (`lg:grid-cols-12 lg:gap-16`).
   - **Left Column (5 Cols)**: High-impact display header ("FAQ about Agrivive") with brand signature golden amber `#EBA635` upward-curved swoosh underline, introductory copy, and rounded pill button ("Contact us →" with `ArrowUpRight` icon).
   - **Right Column (7 Cols)**: Clean interactive accordion list separated by hairline borders (`border-b border-neutral-200/80`).
   - Removed secondary footer label (*"Davao City Agricultural Surplus Distribution Initiative"*) to keep the left column clean and uncluttered (*Ten Principles for Good Design*).

2. **Enlarged Typography & Progressive Disclosure**:
   - Enlarged question titles from `text-base` to `text-lg sm:text-xl md:text-[21px] font-bold` with generous vertical hit areas (`py-6 sm:py-7`) and larger `Plus`/`Minus` icons (`size-5 sm:size-5.5`) (*Fitts's Law* & *Aesthetic-Usability Effect*).
   - Enlarged answer text to `text-sm sm:text-base leading-relaxed` with comfortable right padding.
   - Set Question 1 (*"What is Agrivive?"*) to open by default, exactly as shown in the reference photo (*Hick-Hyman Law*).

3. **Interactive Social Media Contact Pop-up Modal (`HomeContactSocialModal.tsx`)**:
   - Clicking "Contact us →" triggers a high-conversion, accessible modal dialog with backdrop blur (*Jakob's Law* & *Figure-Ground Principle*).
   - Top brand accent bar with gradient from Botanical Green `#1F4D3A` through Leaf Green `#457D00` to Golden Amber `#FEA938`.
   - Header informing buyers and vendors they can message us directly on social channels:
     - **Facebook**: `@AgriviveDavao` (*Active Daily, Messenger & Community Updates*)
     - **Instagram**: `@agrivive.ph` (*Fast Response, Daily Harvest Stories & Direct Messages*)
     - **X (Twitter)**: `@AgrivivePH` (*Official, Real-time Surplus Alerts & Inquiries*)
   - Direct link to In-App Chat for authenticated users.
   - Fully accessible with `Escape` key listener, backdrop click-dismissal, and body scroll locking.

4. **Cute 3D FAQ Vegetable Mascots Integration**:
   - Generated and integrated a cohesive cluster of 4 cute 3D cartoon vegetable characters (`/brand/cute-3d-faq-veggies.png`) into the marked empty space below the "Contact us →" button in the left column.
   - **Characters & Contextual Expressions**:
     - *Thinking Purple Eggplant*: Resting one hand thoughtfully on its chin, looking up curiously toward the FAQ answers.
     - *Thinking Green Broccoli/Cabbage*: Wide inquisitive cartoon eyes with tilted head, pondering questions.
     - *Cheerful Smiling Tomato*: Warm kawaii smile with rosy cheeks, welcoming the user.
     - *Cheerful Smiling Golden Corn*: Friendly open smile with a welcoming wave.
   - Rendered with soft contact drop-shadow (`drop-shadow-[0_12px_24px_rgba(31,77,58,0.12)]`) and hover micro-interaction (`group-hover:scale-105`) (*Emotional Ergonomics & Aesthetic-Usability Effect*).

4. **Exact User Content Implemented**:
   - 1. What is Agrivive? (Platform purpose, supplier/vendor/buyer connection, reducing food waste).
   - 2. How do buyers reserve surplus produce? (Browsing, item conditions, 24h QR-based reservations, map directions).
   - 3. How can sellers list surplus items? (Posting remaining stock near/at buying prices to recover capital and prevent spoilage).
   - 4. How do buyers verify product condition and seller details? (Recent produce photographs, verified seller legitimacy details).
   - 5. Why use Agrivive instead of social media or general e-commerce apps? (Dedicated surplus tracking, clear stock visibility, single unified Davao market coordinator).

## UI/UX Standards Applied

- **Jakob's Law *(Jakob Nielsen)***: Employs standard 2-column FAQ pattern with familiar accordion expand/collapse interactions (`+` and `-`).
- **Hick-Hyman Law *(William Edmund Hick & Ray Hyman)***: Progressive disclosure hides secondary text until requested, reducing cognitive decision load and keeping the screen uncluttered.
- **Miller's Law & Chunking *(George A. Miller)***: Chunks 5 core informational answers with horizontal dividers and distinct headers.
- **Fitts's Law *(Paul Fitts)***: Full-width question hit areas make accordion toggling effortless on mobile thumbs and desktop mice.
- **Recognition Over Recall *(Jakob Nielsen & Rolf Molich)***: Directly addresses all buyer and seller objections (how reservations work, product condition verification, pricing recovery, and why Agrivive vs social media) upfront in plain language.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Clean typography with generous whitespace and 1px dividers evokes high credibility and institutional trust.

## Affected Paths

- `web/src/features/home/components/HomeFarmerFaq.tsx`
- `web/src/features/home/components/HomeContactSocialModal.tsx`
- `Agrivive/04 Delivery/2026-10-24 FAQ Section Redesign.md`

## Verification Performed

- TypeScript type check (`cd web; bunx tsc --noEmit`): Verified 0 errors across the codebase.
- Strict line count verification:
  - `HomeFarmerFaq.tsx`: 145 lines (<= 200 lines).
  - `HomeContactSocialModal.tsx`: 160 lines (<= 200 lines).
