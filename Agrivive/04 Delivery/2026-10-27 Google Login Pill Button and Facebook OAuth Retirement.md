# Google Login Pill Button & Facebook OAuth Retirement

**Date:** 2026-10-27  
**Type:** Feature / UX Polish  
**Scope:** Mobile (`mobile/src/features/auth/components/`, `mobile/app/(auth)/login.tsx`, `mobile/app/(auth)/register.tsx`)

---

## 1. Context & User Request
The user requested:
1. Remove Facebook OAuth.
2. Make Google login into a pill button: `[Logo LogIn With Google]`.

---

## 2. Key Changes Made

### Mobile
1. **[`mobile/src/features/auth/components/GoogleSignInButton.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/src/features/auth/components/GoogleSignInButton.tsx)**:
   - Replaced old circle/square variants with a rounded pill button:
     - Shape: `height: 50`, `borderRadius: 25` (meets Fitts's Law $\ge 48$px touch target standard).
     - Visuals: Official 4-color Google logo on the left, followed by customizable label (defaults to `"Log In with Google"` on login and `"Sign Up with Google"` on registration).
     - Surface: Clean white `#FFFFFF` surface with light border `#E5E7EB` and subtle elevation.
     - Tactile feedback: Pressed scale transition (`scale: 0.985`).
     - Feedback: Activity indicator during authentication and inline error feedback.
2. **[`mobile/app/(auth)/login.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(auth)/login.tsx)**:
   - Removed `FacebookSignInButton` import and JSX element.
   - Replaced social row with `<GoogleSignInButton title="Log In with Google" />`.
3. **[`mobile/app/(auth)/register.tsx`](file:///home/jarajoaquinjara/projects/Agrivive/mobile/app/(auth)/register.tsx)**:
   - Rendered `<GoogleSignInButton title="Sign Up with Google" showDivider />`.
4. **Deleted `mobile/src/features/auth/components/FacebookSignInButton.tsx`**:
   - Retired unused Facebook OAuth component.

---

## 3. Verification Performed
- `cd mobile && bunx tsc --noEmit`: 0 errors.
- `cd mobile && npx -y expo-doctor`: 21/21 checks passed.
- `cd backend && bunx tsc --noEmit`: 0 errors.
- `cd backend && bun build src/index.ts --outdir dist --target bun`: Success.
