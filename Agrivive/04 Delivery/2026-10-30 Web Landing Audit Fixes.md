---
title: Web Landing Audit Fixes
date: 2026-10-30
type: delivery-record
status: code complete, manual testing pending
tags:
  - web
  - audit
  - accessibility
  - reduced-motion
  - copy
---

# Web Landing Audit Fixes

## Overview

A code-level audit of the buyer website (`web/`) found broken links, no reduced-motion support, a splash screen that played on every visit, small touch targets, low-contrast text, unsourced claims and a fetch failure that looked like an empty market. This note records the fixes. It follows [[2026-10-29 Web Landing GSAP Animation Integration]], and it changes some copy that note had kept unchanged (owner approved).

No browser was available during the audit, so nothing was rendered. Findings came from reading the code.

## What Changed

### Broken links and dead code
- `LandingHeader.tsx`: "My Passes" now goes to `/orders` (was `/buyer/orders`, a 404). "Why Surplus?" goes to `#why-agrivive` (was `#why-surplus`).
- `HomeFooter.tsx`: same `#why-surplus` fix.
- `Hero.tsx`: the seller button now downloads `/downloads/agrivive-seller.apk` and reads "Get the Seller App" (was a dead `#sellers` anchor).
- Deleted unused `HomeSellerSection`, `HomeMarketPulse`, `HomeImpactTestimonials` and `HomeWhyAgrivive`.

### Motion safety
- New `src/lib/motion.ts` with `prefersReducedMotion`, `shouldSkipSplash` and `markSplashSeen`.
- `SplashScreen.tsx`: plays once per browser session, is skipped under reduced motion, and has a Skip button (outside the `aria-hidden` stage).
- `useLenis.ts`: no smooth scrolling under reduced motion. `globals.css` adds `scroll-margin-top: 96px` for anchors.
- `Hero.tsx` and `Features.tsx`: GSAP work moved into `gsap.matchMedia()` so it only runs when motion is allowed.
- `useFadeIn`, `useStagger`, `useScrollReveal` and `Parallax`: return early under reduced motion (currently unused by pages).
- `globals.css`: the infinite float and breathe animations stop under reduced motion. `.topo-line` no longer starts hidden in CSS, so the lines show when the splash is skipped.
- `data-lenis-prevent` added to nested scroll areas (cart, conversations, notifications, order messages, report modal, mobile filter sheet).

### Accessibility
- `LandingHeader.tsx` and `LandingHeaderMobileDrawer.tsx`: 44px targets, `text-sm` links, drawer scrolls (`max-h-[calc(100dvh-4rem)]`), Escape closes it, hamburger has `aria-expanded` and `aria-controls`.
- `AuthInput.tsx` and `PasswordInput.tsx`: visible focus ring, error linked with `aria-describedby`, stronger placeholder colour, 44px show/hide password button.
- Placeholders `neutral-400` to `neutral-500` (6 files). Conversation placeholders `#9EA899` to `#6B736B`. `agrivive.muted` `#6F776F` to `#636B63` in `tailwind.config.ts`.
- `HomeFinalCta.tsx`: small text on green is now white.
- `Hero.tsx`: `min-h-dvh` instead of `min-h-screen`, description text at full opacity.

### Copy, claims and errors
- `HomeFeaturedProduce.tsx`: a failed load now shows "We could not load today's produce." with a Try Again button. An empty list still shows the empty message.
- `HomeWhySurplus.tsx`: removed the "Buyer Guarantee" pill, removed the unsourced "exceed 20%" claim, simplified copy. Added a `STAT_SOURCE` caption that shows once the owner sets it.
- `HomeFinalCta.tsx`: removed "up to 50% off".
- `Hero.tsx`: removed the invented elevation text from the background drawing. Shortened the description to 19 words.
- Replaced em-dashes in `HomeFarmerFaq.tsx` and `MarketplaceOverviewPrintComponent.tsx`.

## Why

Reduced motion and focus rules protect people who are sensitive to motion or use a keyboard. Link fixes stop signed-in buyers from landing on a 404. Claim and copy changes follow the AGENTS.md rules on plain words and on labelling unsourced content.

## Verification Performed

From `web/`:
- `bun run typecheck`: passed.
- `bun run build`: passed (21 pages).
- Searched for the old targets: no `#why-surplus`, `#sellers` or UI link to `/buyer/orders` remains in used code. (The unused `HomeHero.tsx` also had `#sellers`; it is now deleted.)

Not done: rendering, keyboard testing, reduced-motion emulation, phone-width checks, Lighthouse. These are for the owner.

## Open Items

- **Survey name needed** for the 95.1% and 97.6% figures. Set `STAT_SOURCE` in `HomeWhySurplus.tsx`.
- **The APK is not deployed with the website.** `web/public/downloads/*.apk` is gitignored and nothing in the web deploy copies it, so the hero and footer download links return 404 until the file is placed on the server.
- `LandingHeader.tsx` search categories ("Vegetables", "Fruits", "Root Crops") do not match the product types the marketplace uses ("Root Vegetables", "Fruit Vegetables", and so on). Choosing them likely returns no results.
- `HomeHero.tsx` was unused (replaced by `sections/Hero.tsx`) and has been deleted. Nothing imported it, and the image it used is still used by `Hero.tsx`. Older vault notes that list it as an affected file are left as history. Type check and build were rerun after the deletion and passed.
- Brand colour and font drift between the design docs and the code, and the trial licence on the MD Nichrome fonts, still need an owner decision.

## Manual Testing (owner)

Not yet reported. Checks: signed-in "My Passes"; every nav anchor; APK download; splash once per session plus Skip; reduced-motion emulation; 360x640 menu scroll and Escape; keyboard focus on login; API stopped to see Try Again; sub-nav on one line at 1024px.

## Affected Files

`web/app/globals.css`, `web/tailwind.config.ts`, `web/src/lib/motion.ts` (new), `web/src/hooks/{useLenis,useFadeIn,useStagger,useScrollReveal}.ts`, `web/src/components/sections/{Hero,Features,SplashScreen}.tsx`, `web/src/components/animations/Parallax.tsx`, `web/src/features/home/components/{LandingHeader,LandingHeaderMobileDrawer,HomeFooter,HomeFeaturedProduce,HomeWhySurplus,HomeFinalCta,HomeFarmerFaq}.tsx`, `web/src/features/auth/components/{AuthInput,PasswordInput}.tsx`, placeholder colour edits in `web/src/components/BuyerSiteHeader.tsx` and the marketplace, profile and conversation components, `data-lenis-prevent` edits in cart, conversation, notification, order and marketplace components. Deleted five unused home components (`HomeSellerSection`, `HomeMarketPulse`, `HomeImpactTestimonials`, `HomeWhyAgrivive`, `HomeHero`).

## Commit

Not committed.
