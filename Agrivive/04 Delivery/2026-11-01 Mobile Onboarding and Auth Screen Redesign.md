# 2026-11-01 Mobile Onboarding and Auth Screen Redesign

## What changed and why
Wrapped and integrated the 8 Google Stitch screens from `projects/11184471743007910085` (`AGRIVIVE MOBILE UI`) into the mobile application codebase (`mobile/app/(auth)/`), standardizing layout, typography, plain-language wording, brand icons, and state handling.

### Screen Mappings & Enhancements
1. **Onboarding Slides 1, 2, 3 (`d80a9f37`, `7893b0fe`, `f07948d7` ➔ `mobile/app/(auth)/onboarding.tsx`):**
   - **Slide 1:** *"Sell your extra vegetables"* — *"List what you have left. Buyers nearby can reserve it and pick it up at your stall."*
   - **Slide 2:** *"Keep track of orders"* — *"We save the vegetables for each buyer, so you know what to pack before they come."*
   - **Slide 3:** *"Easy pickup"* — *"Scan the buyer's QR code at your stall to finish the handover."*
   - **Typography & Polish:** Title color updated to `#111827` (26px bold), body copy to `#4B5563` (15px).
   - **Pagination Indicator:** Active dot styled as an elongated green pill (`24×8px`, `#0F920F`), inactive dots as `#E5E7EB` 8px circles.
   - **Controls:** `Next →` action button with 52px touch target and `I already have an account` text link.

2. **Sign In Default & Error States (`848245a8`, `ea8a2a58` ➔ `mobile/app/(auth)/login.tsx`):**
   - **Navigation & Brand:** Added 48px top navigation bar with green back chevron and 40px Agrivive sprout brand icon.
   - **Copy:** Heading updated to *"Welcome back"*, subtitle to *"Sign in to manage your stall."*
   - **Buttons & Links:** CTA renamed to *"Sign in"*, footer link to *"Don't have an account? Create one"*, and *"Forgot password?"*.
   - **Error Handling:** Verified credentials error banner displays *"The email or password you entered is incorrect."*

3. **Create Account Default, Existing Buyer & Validation Errors (`39a89523`, `42c75949`, `d5f6acd4` ➔ `mobile/app/(auth)/register.tsx`):**
   - **Navigation & Brand:** Added top navigation bar with back chevron and 40px Agrivive sprout brand icon.
   - **Copy:** Heading updated to *"Create your seller account"*, subtitle to *"Set up your stall to start selling your extra vegetables."*
   - **Helper Cues:** Added *"Use 8 or more characters."* hint under password and verification notice *"We'll email you a code to check it's really you."*
   - **Multi-Role Support:** Verified buyer detection banner *"You already have a Buyer account. Enter its password to add a Seller profile."*
   - **Action CTA:** Renamed to *"Create Account"* (or *"Add Seller Profile"* when existing buyer detected).

## Affected Files
- `mobile/app/(auth)/onboarding.tsx`
- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/register.tsx`

## Verification
- `cd mobile && bunx tsc --noEmit`: 0 errors.
- `cd backend && bunx tsc --noEmit`: 0 errors.
