# Buyer Web Auth Polish

Date: 2026-09-26

## What changed

- **Agrivive Lucide Icon System Integration**:
  - Integrated `lucide-react` icons across all buyer authentication input fields, buttons, and visual badges in full alignment with `DESIGN.md`.
  - Added leading icons to input components:
    - Full Name input: `User`
    - Email Address inputs: `Mail`
    - Password and Confirm Password inputs: `Lock` (with `Eye`/`EyeOff` toggle)
    - 2FA and OTP inputs: `ShieldCheck` and `KeyRound`
  - Replaced visual panel emoji with Lucide `Sprout` (`<Sprout className="size-3 text-emerald-300" /> Zero Waste`).
  - Added action icons to buttons: `LogIn`, `UserPlus`, `ShieldCheck`, and `RefreshCw`.
- **AuthShell Component**:
  - Enhanced the desktop 2-column layout with a prominent local market badge (`Bankerohan & Agdao Public Markets`).
  - Added a glassmorphism value-prop overlay featuring key trust pillars: `🌱 24h Hold`, `✨ Verified Stalls`, and `Sprout Zero Waste`.
  - Polished responsive padding, typography, and contrast on both desktop and mobile viewports.
- **Login Experience**:
  - Added contextual feedback alerts: displays an emerald success banner when arriving after email verification (`?verified=true`) and an informative notice when redirected from Cart or Marketplace reservations (`?next=...`).
  - Added live error clearing on typing for all inputs.
  - Enhanced 2FA code input with centered monospace styling and character limits.
  - Extracted `AuthAlerts` component to maintain the 200-line source file limit.
- **Registration (Sign Up) Experience**:
  - Created and integrated `PasswordChecklist` to give live feedback during password creation (at least 8 characters, password match status).
  - Added immediate error clearing as fields are edited.
- **Email Verification Experience**:
  - Styled the 6-digit OTP field with centered monospace typography and wide tracking (`tracking-[0.3em] font-mono text-2xl`).
  - Added a 30-second cooldown timer on the "Send a new code" button to prevent repeated rapid submissions.

## Why

Ensure full compliance with the Agrivive Icon System Guidelines in `DESIGN.md` (*Prefer Lucide stroke icons over emoji, text glyphs, or one-off SVGs*), provide tactile visual cues for fields, and deliver a polished, accessible authentication experience under the 200-line limit.

## Affected paths

- `web/src/features/auth/components/AuthInput.tsx`
- `web/src/features/auth/components/PasswordInput.tsx`
- `web/src/features/auth/components/PasswordChecklist.tsx`
- `web/src/features/auth/components/AuthAlerts.tsx`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`

## Verification

- `bun run typecheck` in `web/` passed with 0 errors.
- `bun run build` in `web/` completed successfully, compiling all static and dynamic pages with 0 errors.
- Verified line counts: all modified and created files are strictly under the 200-line readability limit (`login/page.tsx` at 197 lines; all others under 175 lines).
