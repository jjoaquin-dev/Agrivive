---
title: Footer Restored to Original Layout
type: delivery
date: 2026-10-30
status: code complete, browser check done on the home page
---

# Footer Restored to Original Layout

## What changed

- `web/src/features/home/components/HomeFooter.tsx` is restored to the committed layout (HEAD): plain links, small gold column headings, the original copy, the Davao line with its pin icon, and the plain seller download link.
- The logo uses the new transparent white file, `agrivive-logo-full-white.png`, at 40px tall. The committed version used the old green-on-white file with a colour invert, which showed as an empty white block. That bug is not brought back.
- The current version (before this change) was saved to the session scratchpad as `HomeFooter.before-restore.tsx`.

## Why

- The owner asked to bring back the footer design. They chose the original committed layout over keeping the current one or the earlier white-panel version.

## Fields and behavior

- No fields or routes changed. All links, anchors and the APK download are as committed.

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the built-in browser at `localhost:3001`: the footer renders in the original layout with the white logo.
- Not checked: the desktop width at 1440px and reduced motion.
- The CTA card screenshot the owner sent is the current split layout; it was not changed.
