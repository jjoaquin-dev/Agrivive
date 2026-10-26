# Web Typography Migration to Poppins and Lato

**Date:** 2026-10-27  
**Status:** Completed  
**Type:** Design System Typography Update  

---

## 1. Context & Motivation
The web application typography was migrated from Nunito and PT Sans to **Poppins** for all headers/headings and **Lato** for subheaders, body text, and general interface copy, providing improved readability, clean modern geometric styling, and consistent cross-platform rendering.

---

## 2. Changes Implemented

### A. Google Fonts Resource Links (`web/app/layout.tsx`)
- Updated preconnected Google Fonts stylesheet link to fetch:
  - **Poppins:** Weights 400, 500, 600, 700, 800 (plus italic variants)
  - **Lato:** Weights 300, 400, 700, 900 (plus italic variants)

### B. Global CSS Design Tokens & Base Selectors (`web/src/styles/tokens.css`)
- Root CSS variables updated:
  - `--font-heading: "Poppins";`
  - `--font-subheading: "Lato";`
  - `--font-body: "Lato";`
- Base element selectors updated:
  - `body`: `font-family: var(--font-body), "Lato", system-ui, sans-serif;`
  - `h1`: `font-family: var(--font-heading), "Poppins", system-ui, sans-serif;`
  - `h2, h3, h4, h5, h6`: `font-family: var(--font-heading), "Poppins", system-ui, sans-serif;`
  - `.font-subheading`: `font-family: var(--font-subheading), "Lato", system-ui, sans-serif;`
  - `.leaflet-popup-content`: `font-family: var(--font-body), "Lato", system-ui, sans-serif !important;`

### C. Tailwind CSS Configuration (`web/tailwind.config.ts`)
- Updated `fontFamily` mapping:
  - `heading`: `["var(--font-heading)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"]`
  - `subheading`: `["var(--font-subheading)", "Lato", "ui-sans-serif", "system-ui", "sans-serif"]`
  - `body`: `["var(--font-body)", "Lato", "ui-sans-serif", "system-ui", "sans-serif"]`
  - `sans`: `["var(--font-body)", "Lato", "ui-sans-serif", "system-ui", "sans-serif"]`

---

## 3. Affected Files
- [`web/app/layout.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/app/layout.tsx)
- [`web/src/styles/tokens.css`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/styles/tokens.css)
- [`web/tailwind.config.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/tailwind.config.ts)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** All files comply strictly with the repository limit (`layout.tsx`: 46 lines; `tokens.css`: 179 lines; `tailwind.config.ts`: 84 lines).
- **Dev Server Check:** Next.js hot-reloaded the updated font configurations cleanly.
