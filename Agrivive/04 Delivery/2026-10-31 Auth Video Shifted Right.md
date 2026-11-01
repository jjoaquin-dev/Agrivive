---
title: Auth Video Shifted Right
type: delivery
date: 2026-10-31
status: complete
---

# Auth Video Shifted Right

## What changed

- The video column on the sign-in and sign-up pages has more left padding (`pl-12`, 48px) than the right (`pr-5`, 20px). The video sits further right and leaves space on the left.

## Affected files

- `web/src/features/auth/components/AuthShell.tsx` (video column wrapper classes).

## Verification

- Class change only. Not checked in a browser.
