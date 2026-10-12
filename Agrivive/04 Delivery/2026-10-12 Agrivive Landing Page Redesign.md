---
title: Agrivive Landing Page Redesign
type: delivery
date: 2026-10-12
status: implemented
---

# Agrivive Landing Page Redesign — 2026-10-12

## What changed and why

Reworked the public Agrivive landing page from a single hero card into a warm, illustrated long-scroll experience inspired by the approved reference layout. The new structure welcomes buyers, explains the buyer-and-seller workflow, introduces the public market-data purpose, and ends with clear marketplace and account actions.

The design uses Agrivive's existing warm cream, forest green, sage, terracotta, mango, tomato, sky, and soft-pink palette. It keeps the shared site header and existing routes instead of introducing a parallel navigation system.

## Affected paths

- `web/app/page.tsx`
- `web/src/features/home/components/HomeHero.tsx`
- `web/src/features/home/components/HomeBenefits.tsx`
- `web/src/features/home/components/HomeWhyAgrivive.tsx`
- `web/src/features/home/components/HomeHowItWorks.tsx`
- `web/src/features/home/components/HomeMarketPulse.tsx`
- `web/src/features/home/components/HomeSellerSection.tsx`
- `web/src/features/home/components/HomeFinalCta.tsx`
- `web/public/brand/agrivive-market-day-hero.png`
- `web/public/brand/agrivive-seller-listing.png`
- `web/public/brand/agrivive-buyer-reserve.png`
- `web/public/brand/agrivive-pickup.png`
- `web/public/brand/agrivive-market-pulse.png`
- `web/public/brand/agrivive-welcome-basket.png`

## Data and content boundaries

- No fabricated marketplace counts, testimonials, demand percentages, or buyer statistics were added.
- The public Market Pulse section explains the future aggregated-data view and does not display invented values.
- Marketplace, sign-in, and sign-up actions use existing application routes.
- The generated artwork contains no embedded readable text, logos, or fake data.

## Verification performed

- Confirmed all six generated PNG assets exist in `web/public/brand/`.
- Visually inspected the hero, seller listing, Market Pulse, and closing basket assets.
- `bun run typecheck` passed from `web/`.
- `bun run build` reached the existing `next/font` setup but could not finish because this environment could not resolve `fonts.googleapis.com`; no application compile error was reported for the landing-page changes.
- Browser preview could not be opened here because the in-app browser blocks localhost and port 3001 is already occupied by an existing dev server.
