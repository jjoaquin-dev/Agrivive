---
title: Login Hero 3D Grocery Cart Illustration and Expanded Card Dimensions
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-10-24 Header and Footer Navigation Refinements]]"
---

# Login Hero 3D Grocery Cart Illustration and Expanded Card Dimensions

## What Changed

1. **New 3D Clay Shopping Cart Hero Visual**:
   - Replaced `/brand/cute-veggies-auth.jpg` with a new, high-resolution 3D Pixar/Blender clay animation illustration featuring a supermarket chrome shopping cart and 6 joyful cartoon vegetable characters having fun:
     - **Pushing the cart from behind**: Cute bright orange Carrot with lush green leafy foliage tops and glossy purple Eggplant, both smiling joyfully with hands on the red handle.
     - **In / on the upper basket**: Plump smiling red Tomato waving cheerfully from inside the basket, and bright yellow Bell Pepper sitting on the upper wire rim with open arms.
     - **Sitting on the lower shelf/tray**: Cute round brown Potato relaxing on the bottom wire tray, and friendly green Broccoli sitting beside it kicking its feet.
   - Removed all artificial text, watermarks, or baked-in card artifacts from the image itself, allowing the native frosted glass UI cards to float cleanly (*Figure-Ground Principle*).

2. **Expanded Card Proportions (Matching Markup Dimensions)**:
   - Updated `AuthShell.tsx` container width from `max-w-[1180px]` to `max-w-[1440px]` with `lg:px-12` margin padding to match the user's expanded bounding box markup.
   - Increased minimum height from `min-h-[720px]` to `min-h-[780px]` (aside `min-h-[740px]`).
   - Adjusted column ratio to `lg:grid-cols-[1.12fr_0.88fr]`, giving the 3D illustration showcase ~56% width (~780px at full desktop scale) while keeping the form centered at an optimal `max-w-[420px]` (*Fitts's Law*).
   - Updated accessibility `alt` text to `"Cute 3D vegetable characters having fun with a grocery shopping cart"`.
   - File length remains strictly under 200 lines (98 lines total).

## UI/UX Standards Applied

- **Gestalt Law of Common Region *(Max Wertheimer, Kurt Koffka, Wolfgang Köhler)***: Expanding the unified card surface (`max-w-[1440px]`, `min-h-[780px]`) matches the marked boundary, harmoniously grouping the 3D grocery cart visual and the login form inside a spacious, premium container.
- **Figure-Ground Principle *(Max Wertheimer & Edgar Rubin)***: The expanded card proportion creates a balanced ratio against the Warm Cream background (`#F8F6F1`), reducing excessive empty margins on widescreen desktop displays.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: A high-craft 3D clay illustration combined with an expansive card surface creates emotional warmth and visual polish, increasing buyer trust and perceived platform reliability.
- **Peak-End Rule & Emotional Ergonomics *(Daniel Kahneman & Barbara Fredrickson)***: Greets buyers at the gateway to the marketplace with delightful, playful characters to make login and signup feel welcoming and approachable.
- **Fitts's Law *(Paul Fitts)***: Interactive form inputs remain anchored within an ergonomic max-width (`max-w-[420px]`), preventing horizontal field distortion while the outer card expands.
- **Jakob's Law *(Jakob Nielsen)***: Adheres to the proven e-commerce authentication pattern: compelling visual brand anchor on the left, focused single-column form on the right.

## Verification Performed

- `web/src/features/auth/components/AuthShell.tsx` updated and verified at 98 lines.
- Type check verified: `bunx tsc --noEmit` exited with 0 errors.
- Dev server verified: `http://localhost:3001/login` responds with `HTTP 200 OK`.
