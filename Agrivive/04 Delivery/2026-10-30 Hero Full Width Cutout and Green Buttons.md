# Hero Full Width, Cutout Image, Green Buttons (2026-10-30)

**What changed:** Hero content now spans the full screen width. Text and buttons sit at the far left (bigger headline and lede), the feature list sits at the far right, and the produce photo in the centre has its background removed. "Surplus" and its underline are `#457D00`. The primary button is solid `#457D00` with white text; "Get the Seller App" has a `#457D00` border, text and icon. Navbar unchanged.

**Files:**
- `web/src/components/sections/Hero.tsx`
- `web/app/globals.css` (`.hero-title-line` larger)
- `web/public/brand/hero-veggies-cutout.webp` (new transparent image; replaces the earlier `hero-veggies-falling.webp`, now deleted)

**Image note:** The cutout was made with a colour and transparency mask, not an AI model, so the lower-left crate edge is slightly ragged.

**Verification:** `bunx tsc --noEmit` clean. Checked at 1440 and 375 widths, no horizontal overflow. Tablet not checked.
