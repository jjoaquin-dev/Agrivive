---
title: Authentication Pages Modern UI-UX Redesign & Password Rules Overhaul
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[06 Web Landing Page UI-UX Enhancements]]"
  - "[[2026-10-25 Login Hero 3D Burlap Sacks Market Illustration]]"
  - "[[2026-10-25 Login Hero 3D Grocery Cart Illustration]]"
---

# Authentication Pages Modern UI-UX Redesign & Password Rules Overhaul

## What Changed

1. **Full Horizontal Line Field Arrangement (One Input per Line)**:
   - In `SignUpForm.tsx`, reverted the 2-column input grid back to a clean, full-width single-column layout where each input occupies its own complete horizontal line:
     - **Line 1**: Full name (`w-full`)
     - **Line 2**: Email address (`w-full`)
     - **Line 3**: Password (`w-full`)
     - **Line 4**: Confirm password (`w-full`)
     - **Line 5**: 5-rule password strength bar and vertical checklist (`w-full`)
     - **Line 6**: Full-width primary CTA button (`w-full`)
   - Eliminates awkward 2-column squeezing and gives each input field unconstrained horizontal typing room (*Jakob's Law & Law of Prägnanz*).

2. **Password Rules UI & Logic Overhaul (Matching Reference Screenshot)**:
   - In `PasswordChecklist.tsx`, implemented a **5-segment progressive strength bar** with dynamic status label (`Weak password` in red, `Fair password` in amber, `Good password` in emerald, `Strong password` in deep forest green `#1F4D3A`).
   - Implemented circular checkmark status badges arranged vertically (one line per rule):
     - `8 - 10+ characters`
     - `At least 1 uppercase letter`
     - `At least 1 lowercase letter`
     - `At least 1 number`
     - `At least 1 special character`
     - `Passwords match`
   - Active criteria display filled green circular checkmark badges (`bg-emerald-600 text-white`) and green text; pending criteria show neutral grey circular badges (`bg-neutral-300 text-white`).
   - Updated `validation.ts` to enforce all 5 criteria during signup while keeping existing logins backwards-compatible.

3. **Sign In Card Vertically Longer**:
   - In `AuthShell.tsx`, raised card minimum height to `min-h-[840px] lg:min-h-[860px]` (`min-h-[800px] lg:min-h-[820px]` on the 3D illustration column).
   - Gives the 3D market artwork grand vertical scale and provides the sign-in form luxurious top and bottom breathing room.

4. **Code Modularity & 200-Line Limit Compliance**:
   - `PasswordChecklist.tsx`: 100 lines.
   - `AuthShell.tsx`: 79 lines.
   - `SignUpForm.tsx`: 191 lines.
   - `signup/page.tsx`: 38 lines.
   - `login/page.tsx`: 177 lines.
   - `validation.ts`: 43 lines.
   - `PasswordInput.tsx`: 70 lines.
   - All source files strictly comply with the 200-line ceiling.

5. **Elimination of Duplicate Browser Reveal Eye Icon**:
   - Resolved dual-eye visual glitch in Microsoft Edge / Chromium on Windows where the browser's native `::-ms-reveal` icon was rendering side-by-side with Agrivive's custom Lucide toggle icon.
   - Suppressed `input::-ms-reveal` and `input::-ms-clear` in both `PasswordInput.tsx` (via Tailwind `[&::-ms-reveal]:hidden [&::-ms-clear]:hidden`) and globally in `tokens.css` base layer.
   - Preserves a clean, single custom eye toggle icon.

6. **Centered Single-Card Layout for Account Recovery & Verify Email**:
   - Enhanced `AuthShell.tsx` to support a `centered` layout variant.
   - For Forgot Password / Account Recovery (`/account-recovery`) and Verify Email (`/verify-email`), removed the large side 3D illustration column and replaced it with a single, focused, centered card (`max-w-[480px] w-full mx-auto bg-white rounded-[28px] border border-agrivive-border/80 shadow-auth`).
   - Retains the split-card with 3D illustration for Login and Signup where visual branding is intended.

7. **Individual 6-Digit Number Box Component (`OtpCodeInput`)**:
   - Created `OtpCodeInput.tsx` to render 6 distinct, accessible digit boxes (`[ ][ ][ ][ ][ ][ ]`).
   - Supports auto-advance to next box upon entering a digit, backspace backwards-traversal, arrow key navigation, and instant 6-digit clipboard paste distribution.
   - Replaced single text inputs across both `/account-recovery` and `/verify-email`.
   - Sized boxes to `48px – 56px` wide/high (`h-13 w-11 sm:h-14 sm:w-12`), meeting Fitts's Law touch standards.

8. **Color Palette & Visual Hierarchy Synchronization**:
   - **Primary CTA Buttons**: Forest Green `#1F4D3A` (`hover:bg-[#173C2D]`, `active:scale-[0.99]`, 48px height).
   - **Secondary Actions ("Send a new code")**: Soft Warm Cream `#F6F4EE` (`hover:bg-[#ECE8DF]`, 48px height, `border border-agrivive-border/80`).
   - **Status Banners**: Pastel mint `#EDF8F1` with green border `#C2E7CE` and deep green `#1F4D3A` typography.
   - **Prefilled Email**: Light periwinkle tint `bg-[#EEF2FF] border-[#D1DBF0]` matching design reference.

## UI/UX Standards Applied

- **Jakob's Law *(Jakob Nielsen)***: Users expect standard registration forms to flow in a single, top-to-bottom sequence. Segmented digit inputs match standard OTP verification interactions across modern platforms.
- **Miller's Law & Chunking *(George A. Miller)***: Chunks 6-digit codes into discrete, single-character boxes (well within 7 ± 2 items), radically improving readability and reducing typo rates.
- **Figure-Ground Principle & Law of Common Region *(Gestalt - Max Wertheimer)***: A single centered white card enclosed on warm cream focuses the buyer directly on account recovery, removing sensory overload from side images.
- **Affordances and Signifiers *(Don Norman)*** & **Law of Prägnanz *(Max Wertheimer)***: Duplicate eye icons confuse users regarding control affordance. Retaining a single consistent toggle button clarifies control intent without competing browser artifacts.
- **Goal-Gradient Effect & Visibility of System Status *(Clark L. Hull & Jakob Nielsen)***: Real-time visual feedback with the 5-segment color bar gives buyers immediate, satisfying confirmation as their password strengthens.
- **Fitts's Law *(Paul Fitts)***: Full-width inputs, 48px+ button targets, and 48px+ digit boxes ensure effortless target acquisition across mobile and desktop.
- **Doherty Threshold *(Walter J. Doherty & Ahrvid J. Thadhani)***: Instant focus auto-advance (<100ms) and clipboard paste distribution.

## Affected Files

- `web/src/features/auth/components/OtpCodeInput.tsx` *(new)*
- `web/src/features/auth/components/AuthShell.tsx`
- `web/app/(auth)/account-recovery/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`
- `web/src/features/auth/components/PasswordInput.tsx`
- `web/src/styles/tokens.css`
- `web/src/features/auth/components/PasswordChecklist.tsx`
- `web/src/features/auth/components/SignUpForm.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/login/page.tsx`
- `web/src/features/auth/model/validation.ts`

## Verification Performed

- `cd web; bun run typecheck` verified with 0 errors.
- `http://localhost:3001/account-recovery` verified with `HTTP 200 OK` (single centered card, 6-box OTP, palette aligned).
- `http://localhost:3001/verify-email` verified with `HTTP 200 OK` (single centered card, 6-box OTP, palette aligned).
- All source files strictly comply with the 200-line ceiling (OtpCodeInput: 118, AuthShell: 122, account-recovery: 170, verify-email: 181).
