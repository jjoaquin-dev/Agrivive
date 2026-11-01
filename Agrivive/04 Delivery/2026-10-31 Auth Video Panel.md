---
title: Auth Video Panel
type: delivery
date: 2026-10-31
status: complete
---

# Auth Video Panel

## What changed

- The sign-in and sign-up pages now show the uploaded video (`sign in video.mp4`) in the side panel instead of the photo carousel. The video is copied to `web/public/brand/sign-in-video.mp4` and plays muted and looping with `object-cover`.
- The carousel and its dot indicators were removed, because a single video has no slides.
- The side panel is shorter: 80% of the viewport height, centered vertically, instead of filling the full screen height.

## Why

The user asked for a smaller image container and the video in place of the photos.

## Affected files

- `web/src/features/auth/components/AuthShell.tsx` (carousel replaced by `AuthVideoPanel`; used by sign-in and sign-up).
- `web/public/brand/sign-in-video.mp4` (new).

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser: video playback and the 80vh height at desktop widths.
- Not checked: the video file's codec in every browser. There is no WebM fallback.
- The video is 11 MB. Consider compressing it before release.
