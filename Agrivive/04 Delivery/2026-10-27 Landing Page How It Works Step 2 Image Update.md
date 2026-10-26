# 2026-10-27 Landing Page How It Works Step 2 Image Update

## Context & Objectives
Update the illustration for Step `02 DISCOVER` ("Browse available surplus produce, check stock, and find options that fit your needs") on the landing page's **How Agrivive Works** section (`HomeHowItWorks.tsx`).

## Why
- The previous mockup graphic showcased a generic e-commerce screenshot with dollar pricing and irrelevant produce listings.
- Updating to the authentic Agrivive marketplace interface (featuring the signature surplus produce hero artwork and the 6 vegetable categories: Leafy Greens, Fruit Veggies, Root Veggies, Pod Veggies, Tuber Veggies, Bulb Veggies) aligns with **Jakob's Law** and the **Aesthetic-Usability Effect**, creating product coherence between the marketing preview and the actual marketplace experience.

## What Changed
- Replaced `web/public/how-it-works/step-2-discover.png` with the user-provided high-resolution Agrivive marketplace screenshot.

## Affected Files
- `web/public/how-it-works/step-2-discover.png`

## Verification Performed
- **Asset Verification**: Verified file presence and dimensions (1024x496) at `web/public/how-it-works/step-2-discover.png`.
- **Live Endpoint Test**: Verified `http://localhost:3001/how-it-works/step-2-discover.png` returns `HTTP 200 OK`.
- **TypeScript Typecheck**: Ran `npm run typecheck` (`tsc --noEmit`) in `web/` — passed with 0 errors.
