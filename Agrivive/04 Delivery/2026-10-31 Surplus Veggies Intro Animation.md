---
title: Surplus Veggies Intro Animation
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Surplus Veggies Intro Animation

## What changed

A 6.000 s intro animation built from the 17 uploaded reference frames, following the storyboard timing. Ending: a left-to-right fade (not a circle iris), transparent in WebM so the landing-page hero shows through.

## Files

- `web-video/surplus-veggies.mp4`: H.264, 1920x1080, 30 fps, 180 frames. Fades to black at the end.
- `web-video/surplus-veggies.webm`: VP9 with alpha, 1920x1080, 30 fps, 180 frames. Fades to transparent at the end.
- Render scripts and extracted sprites live in the session scratchpad, not in the repository.

## How it was made

- Background and text: the text-only reference frame gives an exact alpha layer for "SURPLUS VEGGIES" over the flat green.
- Cart: the empty cart from the side-view reference frame, cut out by difference against the text plate.
- Vegetables (10 cutouts) and leaves (37 cutouts): cut from the leaf and vegetable reference frames the same way, then reused with flips and scale changes.
- A frame-indexed Python renderer (PIL and numpy) places sprites on a fixed timeline, so the duration is exact.

## Known gaps

- No red bell pepper cutout. The reference frames show peppers only inside a filled cart, so they could not be cut cleanly.
- Vegetables are a small set of 10 cutouts reused, so repetition is visible.
- Edge fringing from the green backdrop around cutouts.
- The cart does not show wheel rotation.

## Verification

- `ffmpeg` reports 180 frames and about 6.00 s for both files.
- WebM decoded with the libvpx-vp9 decoder: alpha is 0 at the left edge at 5.9 s, so the fade is transparent.
- Contact sheet of MP4 frames at 0.3–5.9 s: text entry, vegetable drop, cart entry, zoom and fill, exit, text exit, clean green, fade. Checked visually.
- Not checked: overlay on the live landing-page hero in the browser.

## Related

- Plan: `C:\Users\Arianne Bartiquien\.claude\plans\pasted-content-id-ce6f-create-a-foamy-yeti.md`.
- Previous snapshot: [[2026-10-30 Why Choose Scroll Reveal]].
