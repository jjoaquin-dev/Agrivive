---
title: Self-Hosted Fonts for Docker Build
type: delivery
date: 2026-10-30
---

# Self-Hosted Fonts for Docker Build

## Problem
`docker compose up --build -d web` failed in `bun run build`: `next/font` threw `TypeError: null is not an object (evaluating '/\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1]')`. `next/font/google` downloads fonts at build time, and inside the build container the Google Fonts response had no usable font URL. This is the intermittent `next build` failure noted earlier in `00-LATEST.md`.

## What changed
- Plus Jakarta Sans, Parkinsans, Poppins and Lato (latin subset, SIL OFL) are vendored in `web/src/fonts/` and loaded with `next/font/local` in `web/app/layout.tsx`. The build no longer touches the network for fonts.
- Same CSS variables (`--font-jakarta`, `--font-parkinsans`, `--font-heading`, `--font-body`), weights and `display: swap`. Jakarta keeps an Arial size-matched fallback.
- `next/font` options must be literal, so the weight lists are written out (a `.map` fails to compile).

## Verification
`bun run typecheck` and `bun run build` in `web/` passed. Docker build not re-run by the assistant (needs sudo); owner to re-run `sudo docker compose up --build -d web`.
