# 2026-10-29 Splash Screen Color Inversion Symmetry Fix

## Date
2026-10-29

## Context & Motivation
When the splash screen tile transition swept green across the viewport, the animated brand lockup inverted from green (`#457D00`) on white to white on green. However, the inverted cart appeared visually distorted compared to the base logo:
1. The cart handle and chassis path (`.cart-stroke`) received an unwanted solid white polygon fill, blocking out the open space underneath the basket.
2. The divider outlines on the vegetables (broccoli florets, tomato circle, and carrot body) turned white, merging with the white produce fills and erasing separation lines.
3. The wheel hub centers turned white, making the wheels appear as solid white discs rather than hollow wheels.
4. The horizontal accent slit on the front of the cart basket (`.accent-cut`) vanished into the white basket body.

## What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **CSS Palette**: Updated `.cart-stroke` and `.veggie-stroke` to enforce `fill: none;`. Defined `.veggie-cutout` to render `stroke: #ffffff` in base mode and `stroke: #457D00` in inverted mode. Ensured `.cart-wheel` inverts to `fill: #457D00; stroke: #ffffff;` and `.accent-cut` inverts to `stroke: #457D00; fill: none;`.
- **SVG Cutout Classes**: Added class `veggie-cutout` to the carrot body path, tomato body circle, and the three broccoli floret circles.
- **GSAP State Reset**: Explicitly reset all stroke, fill, and cutout properties on every replay run (`.cart-stroke` fill: none, `.accent-cut` stroke: `#ffffff`, `.veggie-cutout` stroke: `#ffffff`, `.cart-wheel` fill: `#ffffff`, stroke: `#457D00`).
- **GSAP Wave Transition Tweens**:
  - Filled shapes (`.cart-fill`, `.veggie-fill`): tweened to `fill: #ffffff`.
  - Open stroked paths (`.cart-stroke`, `.veggie-stroke`): tweened strictly to `stroke: #ffffff` with no fill.
  - Cutout divider paths (`.accent-cut`, `.veggie-cutout`): tweened to `stroke: #457D00`.
  - Wheels (`.cart-wheel`): tweened to `fill: #457D00` and `stroke: #ffffff`.

## Update: Floating Vegetable Slices Population Balancing

### Motivation
The floating vegetable slices in the hero section were heavily lopsided towards the right (6 large slices clustered on the right vs. only 1 leaf visible on the left, an 8:1 visual imbalance). The left side felt sparse and empty.

### What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **Balanced Composition**: Re-distributed the floating slices into a symmetrical, organic framing:
  - **Left Side (5 slices)**: Upper-left tomato wheel slice, mid-upper crisp cucumber round, mid-left purple red onion ring, lower-left orange carrot coin, and lower-left fresh basil leaf.
  - **Right Side (6 slices)**: Upper-right tomato stem crown, mid-upper large tomato slice, upper-right basil leaf, mid-lower purple red onion ring, lower-right yellow pepper slice, and lower-right cucumber round.
- **Dual Ambient Glows**: Added soft warm lime-gold glows behind both the left and right clusters for depth and illumination.

### Verification
- **Pixel Analysis**: Left-to-right produce presence improved from an 8:1 imbalance (3,774 vs 30,049 px) to a harmonious 1.58:1 ratio (50,162 vs 79,169 px).
- **Legibility**: Verified that the centered headline and CTA buttons retain clean, unobstructed negative space across viewport widths.

## Update: Background Texture & Topographic Drawn Lines Animation

### Motivation
The user requested adding a texture to the `#457D00` green background or an overlay of drawn lines with an animation on load to enrich the tactile quality and agricultural narrative of the landing experience.

### What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **Micro-Texture Grain**: Integrated an SVG fractal noise overlay (`.hero-grain-overlay`) to give the `#457D00` background an organic, artisanal paper/linen hand-feel.
- **Topographic Contour Drawn Lines**: Added an SVG overlay (`#topo-container`) representing Davao fertile highland farm terraces and elevation contours in brand lime `#E2FD56` (22% opacity) with elevation markers (`240m`, `310m`, `420m`).
- **Load Animation**: On timeline peel-off (`tileOut+=0.06`), a GSAP line-drawing tween animates `stroke-dashoffset` from 1400 to 0 (2.2s, `power2.out`, 0.08s stagger), causing the lines to gracefully draw themselves across the landscape as the hero appears.
- **Ambient Breathing Motion**: Added a slow 12s undulating wave animation (`topoBreathe`) for perpetual organic drift.

## Update: Full-Page GSAP ScrollTrigger Animations

### Motivation
The user requested adding scroll trigger animations across the landing page to elevate the editorial experience as users scroll through the story and features.

### What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **Library Added**: Integrated `ScrollTrigger.min.js` (GSAP 3.12.5).
- **16 Scroll Triggers Registered**:
  1. *Hero Multi-Layer Parallax*: Floating produce slices move at varied rates (`scrub: 1.2` to `1.5`) while the contour lines drift upward (`y: -70`).
  2. *Section Headers*: Section badges, titles, and descriptions rise and fade up (`y: 35 -> 0, opacity: 0 -> 1`).
  3. *Category Cards Cascade*: Staggered card entrance with subtle scale pop.
  4. *Live Surplus Market*: Produce product cards slide into view as the user scrolls to the live market.
  5. *How It Works 3-Step Process*: 3 step cards cascade with a spring ease (`back.out(1.2)`).
  6. *Why Agrivive Benefit Pillars*: 3 value cards rise with smooth image zoom affordance.
  7. *Customer Stories / Testimonials*: Community quote cards tilt and fade up.
  8. *FAQ Accordion*: Expandable Q&A items slide up sequentially.
  9. *Final CTA Card*: Expands from `scale(0.94)` to `scale(1)` as user nears the footer.
- **Splash Synchronization**: Call `ScrollTrigger.refresh()` right as the splash screen completes and `#web-app-root` mounts.

## Update: Sticky Navigation Header Pill

### Motivation
The user requested that the floating navigation pill header remain sticky as you scroll down through the entire page.

### What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **Fixed Sticky Positioning**: Changed `<header>` from `absolute` to `fixed top-4 sm:top-6 left-0 right-0 z-50` with `pointer-events-none` on outer margins and `pointer-events-auto` on the pill and mobile dropdown.
- **Scroll Elevation Effect**: Added `.header-scrolled` styling and a ScrollTrigger watcher (`start: "top -20"`) that deepens the drop shadow (`shadow-xl`) and border definition when scrolling over white and cream content sections.

## Affected Files
- `/home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html`
- `/home/jarajoaquinjara/projects/Agrivive/web/public/brand/slice-cucumber-real.png`
- `/home/jarajoaquinjara/projects/Agrivive/web/public/brand/slice-yellow-pepper.png`
- `/home/jarajoaquinjara/projects/Agrivive/web/public/brand/slice-basil-leaf.png`

## Verification Performed
- **Automated CDP Live Screenshots**: Captured paired screenshots in headless Chromium at `waveSweep-=0.01` (green on white) and `waveSweep+=0.7` (inverted on green).
- **Pixel Analysis via Python PIL**:
  - Extra white pixels across the entire brand lockup: **0** (down from 2,051).
  - Wheel hubs verified hollow with green `#457D00` background show-through.
  - Undercarriage verified completely open with clean chassis stroke.
  - Vegetable divider outlines verified cleanly defined.
- **Git Status**: Tracked files in `web/` and `backend/` verified completely clean.

---

## 6. Landing Page Staggered "IN Transition" Sequence (2026-10-29)

### User Request
> "After the splash screen i want the landing page have a IN transition each element please put that"

### What Changed
1. **Isolated Outer Wrapper (`.hero-slice`) & Inner Floating Animation (`.float-slice-*`)**:
   - Wrapped all 11 floating produce slices with `.hero-slice` to give GSAP direct control over entrance spring scaling (`scale: 0.35 -> 1.0`, `back.out(1.35)`) and initial opacity without conflicting with continuous ambient CSS keyframe floating loops.
2. **Synchronized Multi-Element Entrance Timeline (`tileOut` to `tileOut+=0.55`)**:
   - **Contour Lines** (`tileOut+=0.06`): Drawn farm elevation contours draw in (`strokeDashoffset: 0`, `duration: 2.0s`).
   - **Floating Slices** (`tileOut+=0.08`): 11 produce slices pop into zero gravity with organic stagger (`stagger: 0.045s`, `duration: 0.95s`).
   - **Sticky Navigation Pill** (`tileOut+=0.12`): Header pill smoothly slides down from top (`y: -45 -> 0`, `duration: 0.75s`, `power3.out`).
   - **Davao Network Badge** (`tileOut+=0.16`): Produce network pill pops up (`y: 22 -> 0`, `back.out(1.5)`).
   - **Main Headline** (`tileOut+=0.22`): Oversized headline "Rescue Surplus Vegetables in Davao City" glides up (`y: 35 -> 0`, `power3.out`).
   - **Subtitle Copy** (`tileOut+=0.30`): Supporting description glides up smoothly (`y: 28 -> 0`).
   - **CTA Action Buttons** (`tileOut+=0.38`): "Shop Today's Harvest" and "Seller App" buttons bounce in side-by-side (`back.out(1.4)`, `stagger: 0.1s`).
   - **Bottom Harvest Crate** (`tileOut+=0.44`): Harvest crate section gently rises into view (`y: 48 -> 0`, `power3.out`).
3. **Replay & State Preservation**:
   - Initial GSAP sets configured inside `buildTimeline()` ensuring instant reset on `Replay Splash` button click.
   - Declarative `mainTl.set("#web-app-root", { display: "block", opacity: 1 })` on timeline guaranteeing visibility during scrub and seek.

### Affected Files
- [`scratch/splash-demo.html`](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html)
- [`Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md`](file:///home/jarajoaquinjara/projects/Agrivive/Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md)

### Verification Performed
- **Chrome CDP Frame Capture**:
  - `tileOut+=0.10`: Verified initial peel with elements prepped at off-stage positions.
  - `tileOut+=0.25`: Verified active mid-transition with header gliding down and left produce slices popping in.
  - `tileOut+=0.48`: Verified secondary wave with headline and CTA buttons springing into place.
  - `tileOut+=0.80`: Verified full settled state (`hero_in_transition_settled.png`) with 100% opacity, 0px translation, and active floating motion.
- **Git Status**: Tracked files remain clean on branch `development`.

---

## 7. Mobile Transition Grid Line Seam Elimination (2026-10-29)

### User Request
> "The mobile transition can see the grid lines please fix that" (with screenshot showing visible grid lines across mobile viewport)

### Root Cause Analysis
1. **Fractional Subpixel Bleed**: On mobile viewports (e.g. 390px width), dividing `100vw` by 18 columns produced fractional pixel boundaries (`21.666px`). Antialiasing against the underlying white background caused hairline seams.
2. **Individual Tile Staggering**: Passing all 180 tiles to GSAP with `stagger: 0.0022` caused tiles within the same column to animate at slightly different times. Tile (row 0, col 14) had opacity 0.82 while tile (row 5, col 14) had opacity 0.64, rendering individual rectangular cells with visible horizontal steps.

### What Changed
1. **Synchronized Column Tweens (`buildTimeline()`)**:
   - Replaced flat 180-tile stagger with column-grouped tweens: all 10 tiles in column `c` animate simultaneously at `"waveSweep+=" + (c * 0.022)`.
   - Result: every column moves as a single, solid vertical bar `|` with zero horizontal contrast or row boundary lines.
2. **Horizontal Subpixel Overlap CSS**:
   - Added `overflow: hidden` to `#tile-grid` and `width: calc(100% + 1px); height: 100%; margin-left: -0.5px;` to `.tile`.
   - Result: adjacent columns overlap by 1.0px, completely covering fractional pixel rounding gaps without creating darker vertical or horizontal bands.

### Affected Files
- [`scratch/splash-demo.html`](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html)
- [`Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md`](file:///home/jarajoaquinjara/projects/Agrivive/Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md)

### Verification Performed
- **Chrome CDP Mobile Emulation (iPhone 14, 390×844 @ DPR 3)**:
  - `waveSweep+=0.38`: Verified pure vertical bar sweep (`mobile_wave_fixed.png`) with zero horizontal or vertical grid lines.
  - `waveSweep+=0.70`: Verified solid green inverted hold (`mobile_hold_fixed.png`).
  - `tileOut+=0.18`: Verified smooth `<` chevron exit peel (`mobile_peel_fixed.png`).
  - Desktop 1280×800 verification (`desktop_wave_fixed.png`).
- **Git Status**: Tracked files verified completely clean.

---

## 8. Comprehensive Mobile-First Redesign & Experience Overhaul (2026-10-29)

### User Request
> "NOw I WANT IT TO BE MOBILE FIRST PLEASE SCAN ALL THE MAKE SURE IT'S A MOBILE FIRST DESIGNA AN EXPERIENCE"

### Design Principles & Ergonomics Applied
1. **Mobile-First Ergonomics & Touch Targets** *(Luke Wroblewski & Apple Human Interface Guidelines)*:
   - All primary touch targets upgraded to at least 48px height (`Shop Today's Harvest`: 52px; `Seller App`: 48px; `Get Started Free`: 48px; `Reserve`: 44px; hamburger button: 44×44px; carousel arrows: 44×44px).
   - Zero horizontal overflow across viewports (`docWidth <= winWidth`).
2. **Fitts's Law** *(Paul Fitts)*:
   - Primary CTAs stack full-width on mobile (`w-full sm:w-auto`) for effortless thumb acquisition.
   - Interactive carousel arrows upgraded to 44px round targets.
3. **Jakob's Law & Miller's Law (Chunking)** *(Jakob Nielsen & George A. Miller)*:
   - Filtered out 3 secondary background produce slices on small screens (`hidden sm:block`), leaving the center 75% of the mobile viewport crystal clear for the headline and value proposition.
   - Restructured sticky header on mobile to a clean 2-element bar: brand logo on the left, 44×44px hamburger menu on the right. Inside the mobile drawer, full-width 48px touch targets for navigation and high-contrast "Register" and "Sign In" buttons are provided.
4. **Affordances & Signifiers** *(Don Norman, The Design of Everyday Things)*:
   - Surplus produce slider cards calibrated to `min-w-[80vw] sm:min-w-[320px]` with `-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;`, intentionally peeking ~20vw of the adjacent card to clearly communicate a swipeable track.
5. **Doherty Threshold** *(Walter J. Doherty & Ahrvid J. Thadhani)*:
   - Added native touch swipe gesture listeners (`touchstart` / `touchend` with 45px delta threshold) to the Davao Community Stories testimonial carousel for instant responsive transitions.

### What Changed Across All Sections
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
1. **Sticky Header & Mobile Menu**:
   - Hidden desktop "Sign In" and "Register" on `< 640px` (`hidden sm:inline-flex whitespace-nowrap`).
   - Upgraded mobile menu button to `size-11` (44×44px) with `:active:scale-90`.
   - Added full-width 48px navigation rows and action buttons in `#mobile-menu`.
2. **Hero Section**:
   - Container padding: `pt-28 pb-16 sm:pt-40 sm:pb-28 min-h-[92vh] sm:min-h-screen`.
   - Headline typography: `text-3xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.12]`.
   - Stacked full-width CTA buttons: `flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-4 px-3 sm:px-0`.
   - Harvest crate graphic max-height: `max-h-[280px] sm:max-h-[500px]`.
   - Produce slices: Anchored along the screen perimeter (`left-[2%]` to `-left-3.5`, `right-[4%]` to `-right-3.5`) scaled to `w-[54px]`–`w-[80px]` on mobile. 3 accent slices hidden on mobile (`hidden sm:block`).
3. **Categories Section**:
   - Responsive 2-column mobile grid: `grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-6`.
   - Compact cards: `rounded-[20px] sm:rounded-[26px] p-3 sm:p-4`, image container `h-22 sm:h-28`.
4. **Live Surplus Inventory Slider**:
   - Track: `mt-8 sm:mt-10 flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0`.
   - Cards: `min-w-[80vw] sm:min-w-[320px] max-w-[320px] snap-start shrink-0 p-3.5 sm:p-4 rounded-[24px] sm:rounded-[28px]`.
   - Reserve button: `min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs`.
5. **How It Works & Why Agrivive**:
   - How It Works cards: `rounded-[24px] sm:rounded-[30px]`, image `h-48 sm:h-60`, body `p-5 sm:p-7`.
   - Why Agrivive cards: `rounded-[26px] sm:rounded-[32px] p-5 sm:p-9`, image `h-44 sm:h-52 mb-4 sm:mb-6`, title `text-xl sm:text-2xl md:text-3xl`.
6. **Community Stories Testimonials**:
   - Card padding: `rounded-[26px] sm:rounded-[36px] p-5 sm:p-12`.
   - Navigation buttons: `size-11` (44×44px hit region).
   - Added native touch swipe gesture handler (`touchstart` / `touchend`).
7. **FAQ Accordion & CTA Banner**:
   - Accordion trigger buttons: `min-h-[44px] p-4 sm:p-5`.
   - CTA banner: `rounded-[28px] sm:rounded-[44px] px-5 py-10 sm:px-12 sm:py-20`.
   - CTA buttons: Full-width stacked on mobile `w-full sm:w-auto min-h-[48px]`.
8. **Controller Dock**:
   - Added responsive `@media (max-width: 639px)` scaling (`transform: scale(0.88)`, `bottom: 12px; right: 12px;`) to prevent overlapping content.
9. **ScrollTrigger Optimizations**:
   - Corrected target selectors for Live Inventory (`#produce-slider`), Testimonials (`.max-w-4xl`), and FAQ (`#faq-accordion`).
   - Configured `toggleActions: "play none none none"` to prevent abrupt card re-entry when scrolling upward.

### Affected Files
- [`scratch/splash-demo.html`](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html)
- [`Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md`](file:///home/jarajoaquinjara/projects/Agrivive/Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md)

### Verification Performed
- **Chrome CDP Mobile Emulation (iPhone 14, 390×844 @ DPR 2)**:
  - Overflow test: `docWidth: 765 <= winWidth: 780` (`overflow: false`).
  - Hero section captured (`mobile_first_hero_top.png`): verified zero text collisions, clean perimeter framing, and 52px stacked CTAs.
  - Categories section captured (`mobile_first_cat_clean.png`): verified neat 2-column layout.
  - Live inventory captured (`mobile_first_live_final.png`): verified 80vw snap card with 20vw peek affordance and 44px reserve button.
  - Testimonials captured (`mobile_first_testimonials_final.png`): verified 44px buttons, touch swipe, and comfortable padding.
  - FAQ & CTA captured (`mobile_first_faq_final.png`, `mobile_first_cta_real_mobile.png`): verified 44px accordion triggers and 48px full-width banner CTAs.
- **Desktop 1280×800 Viewport**: Verified layout integrity and horizontal navbar remain intact.
- **Git Status**: Tracked files verified completely clean.

---

## 9. Header Smooth IN Transition & Desynchronization Fix (2026-10-29)

### User Request
> "Header IN transtion kinda glitch not smooth please fix it" (accompanied by screenshot showing the sticky pill cut off at the viewport ceiling and sliced vertically by green splash tiles)

### Root Cause Analysis
1. **CSS Transition Collision (`transition-all duration-300`)**:
   `<header>` and `#nav-pill` contained Tailwind's `transition-all duration-300`. Whenever GSAP animated `transform`, `opacity`, and `scale` at 60fps/120fps, the browser's CSS transition engine intercepted each frame and attempted a 300ms tween. This created frame fighting, micro-stuttering, and choppy motion.
2. **Premature Entrance Timing During Splash Tile Peel**:
   `#nav-pill` was triggering at `tileOut+=0.12`, but the green tiles across the top row don't finish peeling away until `tileOut+=0.48`. This caused the green tiles to slice vertically through the white glass pill as it entered.
3. **Out-of-Bounds Starting Offset (`y: -45`)**:
   With `top: 24px` (`sm:top-6`), translating `y: -45` pushed the top of the pill 21px outside the top of the browser viewport (`top: -21px`), cutting the pill in half horizontally at the start of the entrance.

### What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **Removed `transition-all duration-300`** from `<header>` and `#nav-pill`.
- **Restricted CSS Transitions to Scroll Elevation**: Added explicit CSS rule on `#nav-pill` to transition only `box-shadow` and `border-color` with `will-change: transform, opacity`, eliminating all transition fighting with GSAP.
- **Calibrated Starting Offset**: Changed `gsap.set("#nav-pill", ...)` from `y: -45` to `y: -20, opacity: 0, scale: 0.98`, keeping the pill geometry 100% inside the viewport boundaries.
- **Synchronized Entrance Timing**: Shifted `mainTl.to("#nav-pill", ...)` from `tileOut+=0.12` to `tileOut+=0.40` with `duration: 0.7, ease: "power2.out"`. The pill smoothly glides down into place once the splash screen tiles have cleared the top of the screen.

### Affected Files
- [`scratch/splash-demo.html`](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html)
- [`Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md`](file:///home/jarajoaquinjara/projects/Agrivive/Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md)

### Verification Performed
- **Chrome CDP Frame Capture (Desktop 1440×800 & Mobile 390×844)**:
  - `tileOut+=0.40`: Verified pill starts cleanly from within the viewport margins (`desktop_header_entry_start.png`, `mobile_header_entry_start.png`).
  - `tileOut+=0.55`: Verified flawless midway glide with intact rounded pill geometry and zero tile strip artifacts (`desktop_header_entry_mid.png`, `mobile_header_entry_mid.png`).
  - `tileOut+=0.85`: Verified settled sticky position with crisp elevation shadow (`desktop_header_entry_settled.png`, `mobile_header_entry_settled.png`).
- **Git Status**: Tracked files verified completely clean.

---

## 10. Smooth Momentum Scroll & Anchor Offset Integration (2026-10-29)

### User Request
> "ADD smooth scroll please"

### Design Rationale & Psychological Foundations
1. **Doherty Threshold (Walter J. Doherty & Ahrvid J. Thadhani)**:
   Inertia and smooth momentum scrolling make viewport navigation feel fluid, physical, and premium. Standard browser scrolling can feel abrupt and disjointed; smooth scrolling bridges interactions seamlessly with under 16ms render updates.
2. **Recognition Over Recall & Jakob's Law (Jakob Nielsen)**:
   When users click sticky navigation items (e.g., "How It Works", "FAQ", "Live Surplus"), jumping instantly to an element causes disorienting cognitive re-orientation. Smooth scrolling preserves spatial context and mental map position.
3. **Offset Compensation for Floating Navigation Elements (Fitts's Law)**:
   Without an offset, scrolling directly to an element places its heading under the fixed sticky header pill, obscuring the primary signifier. An offset of `-90px` leaves clean visual clearance and breathing space directly below the header pill.

### What Changed
In [splash-demo.html](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html):
- **Imported Lenis Smooth Scroll**: Added Lenis 1.1.18 via CDN (`https://unpkg.com/lenis@1.1.18/dist/lenis.min.js`).
- **Core CSS Rules**: Injected Lenis CSS (`html.lenis, html.lenis body { height: auto }`, `.lenis.lenis-smooth`, `.lenis.lenis-stopped`, etc.) into `<style>`.
- **GSAP Ticker & ScrollTrigger Synchronization**:
  - Bound `lenis.on('scroll', ScrollTrigger.update)` to ensure GSAP parallax and scroll triggers calculate positions synchronously.
  - Linked Lenis RAF loop to GSAP's RAF ticker (`gsap.ticker.add((time) => lenis.raf(time * 1000))`) with `gsap.ticker.lagSmoothing(0)` for zero-jitter 60fps/120fps physics.
- **Sticky Pill Anchor Navigation Offset**:
  - Attached interceptor to all `a[href^="#"]` links to invoke `lenis.scrollTo(target, { offset: -90, duration: 1.3 })`.
  - Added auto-close behavior for the mobile menu on anchor tap.
- **Splash Screen Scroll Lock Coordination**:
  - Called `lenis.stop()` during splash animation to prevent scroll displacement.
  - Called `lenis.start()` and `ScrollTrigger.refresh()` as the green tiles peel off (`tileOut+=0.55`) and on animation completion.
  - Updated `#replay-btn` to call `lenis.scrollTo(0, { immediate: true })` and `lenis.stop()` immediately.
- **Horizontal Scroll Protection (`data-lenis-prevent`)**: Added `data-lenis-prevent` to the live surplus carousel (`#produce-slider`) so horizontal touch drag and wheel events are not intercepted.

### Affected Files
- [`scratch/splash-demo.html`](file:///home/jarajoaquinjara/.gemini/antigravity/brain/15a49f83-71b4-467b-8e99-7c9a3e57bec9/scratch/splash-demo.html)
- [`Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md`](file:///home/jarajoaquinjara/projects/Agrivive/Agrivive/04 Delivery/2026-10-29 Splash Screen Color Inversion Symmetry Fix.md)

### Verification Performed
- **Chrome CDP Automated Verification (`verify_lenis.js`)**:
  - **Splash State**: Verified `isStopped: true`, `scrollY: 0` during splash animation.
  - **Post-Splash State**: Verified `isStopped: false`, `bodyOverflow: "auto"` upon entrance.
  - **Desktop Anchor Navigation**: Clicked `#how-it-works`. Verified smooth scroll to `scrollY: 2785`, `targetTop: 90px`, `pillBottom: 78px` with exactly 12px breathing room below sticky pill (`lenis_desktop_scroll.png`).
  - **Mobile Menu Anchor Navigation**: Opened mobile menu, clicked `#faq`. Verified `isMenuHidden: true` (menu auto-closed), smooth scroll to `scrollY: 5749`, `targetTop: 90px` (`lenis_mobile_scroll.png`).
  - **Replay Reset**: Clicked Replay button. Verified `scrollY: 0`, `isStopped: true`, `bodyOverflow: "hidden"`.
- **Git Status**: Tracked repository files verified completely clean.
