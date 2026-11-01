# 2026-11-01 Mobile Type Scale Consistency

Builds on [[2026-11-01 Boost Facebook and Instagram Flow]].

## What changed and why
The owner asked for consistent font, size, scale and hierarchy across the mobile app. The app used 19 different font sizes and had no shared tokens, and the 2026-11-01 Notifications and My Listings restyles had pushed text above the documented scale. The owner chose the documented scale (`.claude/design/mobile-design/DESIGN.md`) and "tokens, then core screens".

- `mobile/src/theme/index.ts`: new `type` roles (largeTitle 28, screenTitle 22, sectionHeading 17, bodyLarge 15, body 14, label 13, labelSmall 12, caption 11, each with a line height) and `fontSizeScale`. Only Inter is loaded, so headings use Inter Bold. DESIGN.md names Manrope, which is not installed.
- Notifications and My Listings text brought back to the scale (for example listing title 32 to 28, listing name 20 to 17, price 30 to 22, buttons 16 to 14). Layout, 44px+ touch targets and colors from the restyles are kept.
- A one-time snap moved every off-scale `fontSize` in the core screens to the nearest scale step (9 to 10, 20 to 22, 24 to 22, 26 to 28). Scope: tab screens, notifications, orders, conversations, profile, marketing, inventory, `src/components`, and the matching feature folders (13 files changed).

## Not done
- Screens outside that scope still have off-scale sizes (analytics, advisories, auth, reviews, trust: sizes 9, 20, 24, 26, 34).
- Styles still set `fontSize` directly. They do not yet spread the `type` roles, so line heights are not uniform.
- About 70 styles set `fontWeight` without a matching Inter family. Android may not show those as bold.
- 700 hard-coded hex colors are not tokenised.

## Verification
`bun run typecheck` in `mobile/` passed. Not checked on a device.
