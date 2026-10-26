---
title: General Font Inter Standardization
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-10-26 Systemwide UI-UX Standards and Layout Harmonization]]"
  - "[[2026-10-26 Product Card Typography and Price Size Enhancement]]"
---

# General Font Inter Standardization

## Overview
Standardized the general typography across the Agrivive platform to **Inter**, replacing divergent heading font configurations (`Manrope`) with a unified, high-legibility typographic family across all headings, body text, buttons, controls, and UI surfaces.

## Changes Applied

### 1. Web Application Font Loading (`web/app/layout.tsx`)
- Injected Google Fonts runtime stylesheet links for **Inter** (weights 300, 400, 500, 600, 700, 800, 900) into `<head>` with `preconnect` optimizations.
- Preserved offline Docker/production build resilience by relying on browser runtime font loading rather than build-time Next.js external font fetches.

### 2. Design Tokens (`web/src/styles/tokens.css`)
- Updated `--font-heading` token from `"Manrope"` to `"Inter"`.
- Standardized `h1, h2, h3, h4, h5, h6` font declarations to use `var(--font-heading), Inter, system-ui, sans-serif`.

### 3. Tailwind Configuration (`web/tailwind.config.ts`)
- Updated `theme.extend.fontFamily.heading` fallback chain to `["var(--font-heading)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]`, ensuring complete harmony with `body` and `sans`.

### 4. Mobile Application Theme (`mobile/src/theme/index.ts` & `mobile/app/_layout.tsx`)
- Updated `fonts.heading` tokens from `Manrope_600SemiBold` and `Manrope_700Bold` to `Inter_600SemiBold` and `Inter_700Bold`.
- Loaded `Inter_700Bold` in `mobile/app/_layout.tsx` to ensure all screen headers and navigation titles utilize Inter.

## UI/UX & Psychological Principles
- **Aesthetic-Usability Effect** (*Masaaki Kurosu & Kaori Kashimura*): A single, cohesive font family delivers geometric precision, balanced optical density, and polished visual cadence across complex marketplace cards and tabular summaries.
- **Law of Similarity (Gestalt)** (*Max Wertheimer, Kurt Koffka, Wolfgang Köhler*): Elements with shared functional hierarchy maintain unified typographical anatomy, reducing visual dissonance between headings and descriptions.
- **Jakob's Law** (*Jakob Nielsen*) & **Don't Make Me Think** (*Steve Krug*): Standardizes on the ubiquitous, highly legible Inter sans-serif interface typeface, facilitating effortless reading and rapid cognitive parsing.

## Affected File Paths
- `web/app/layout.tsx`
- `web/src/styles/tokens.css`
- `web/tailwind.config.ts`
- `mobile/src/theme/index.ts`
- `mobile/app/_layout.tsx`

## Verification Performed
1. `cd web && bun run typecheck` passed with 0 errors.
2. `cd web && bun run build` passed with 0 errors across all 20 static and dynamic routes.
3. `cd mobile && bunx tsc --noEmit` passed with 0 errors.
