# Hero Step Cards Section (2026-10-30)

**What changed:** The four feature items (Rescue Vegetables, Surplus Produce, 24-hour QR code, Help Local Sellers) were removed from the hero and now live in a new section directly below it, as four stacking step cards. Wording is unchanged. Each card sticks under the header; the next card slides over it, and the card underneath shrinks and tilts slightly (scroll-linked GSAP ScrollTrigger). Earlier cards peek out above the newest one. Motion follows a screen-recording reference. Reduced motion keeps the stacking but skips the shrink and tilt.

**Hero:** Grid is now two columns (text, image). The `#hero-features` animation lines were removed from `hero-entrance.ts`.

**Files:**
- `web/src/features/home/components/HomeStepCards.tsx` (new)
- `web/app/page.tsx` (renders it between Hero and Features)
- `web/src/components/sections/Hero.tsx`
- `web/src/lib/gsap/hero-entrance.ts`

**Verification:** `bunx tsc --noEmit` clean. Checked in browser at 1440 and 375 widths: cards stack, no horizontal overflow. Tablet and reduced motion not checked.
