# Hero White Background Restyle (2026-10-30)

**What changed:** Hero background is now white with dark text. The headline is bigger and left-aligned. The centre image is the new falling-vegetables-in-a-crate photo (blended into the white page with `mix-blend-multiply`). The four existing labels are on the right, each with a short plain-word description. Navbar, primary button colours and the lime "Surplus" word are unchanged. The "Get the Seller App" text turned dark so it can be read on white.

**Files:**
- `web/src/components/sections/Hero.tsx`
- `web/app/globals.css` (`.hero-title-line` larger)
- `web/public/brand/hero-veggies-falling.webp` (new image)

**Verification:** `bunx tsc --noEmit` clean. Checked at 1440 and 375 widths, no horizontal overflow. Tablet not checked.

**Known risks:** Lime "Surplus" on white is low contrast. The navbar pill has little separation from the white hero. Feature descriptions were written from existing site copy and need owner review.
