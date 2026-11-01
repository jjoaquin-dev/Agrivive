---
title: Auth Screens Match Stitch Reference
type: delivery
date: 2026-11-01
---

# Auth Screens Match Stitch Reference

## What changed

Compared the Stitch screens (project `11184471743007910085`: onboarding slide 1, Sign In, Create Account) with the mobile auth screens. Onboarding already matched, so it was left alone. Fixed the gaps:

- Sign In: header left-aligned; placeholders `you@example.com` and `Your password`; button reads "Sign In"; order is Sign In, "or", Continue with Google, outlined "Sign in with email code" button, then "Don't have an account? Create one" last.
- Create Account: labels "Email address" and "Confirm password"; placeholder "Type your password again"; "Sign up with Google".
- Google button: rounded rectangle (`radii.button`, 52px) instead of a pill, shadow removed, to match the reference.

No fields, validation, or API calls changed.

## Files

- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/register.tsx`
- `mobile/src/features/auth/components/GoogleSignInButton.tsx`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. Only slide 1, Sign In default and Create Account default were compared; the error, existing buyer and slides 2 and 3 were not.
