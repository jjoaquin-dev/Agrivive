---
title: Seller App Screen Size Fixes
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

# Seller app screen size fixes

**What changed.** Onboarding reads the screen size live (slide width, picture height is about 38 percent of the screen between 200 and 420, picture never wider than 520). The three analytics charts follow the window width live. Sign in, Sign up and the shared auth layout keep a centered 520 wide column on wide screens. The bottom tab bar height follows the real bottom inset instead of fixed 84 or 64. The loading logos shrink on narrow screens. Two-per-row cards (dashboard stock, More Tools, analytics quick stats) use a flexible basis so they stay two per row down to very small phones. The forecast date column and the inventory menu can shrink.

**Not done.** A global cap on system font scaling: React 19 ignores `Text.defaultProps`, so it needs a wrapped Text component and was left out. The app is portrait only and `supportsTablet` is false, so tablets run it in a phone-sized frame.

**Checked.** Mobile typecheck. Not tried on different physical screens.
