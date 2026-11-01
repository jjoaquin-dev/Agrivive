# 2026-11-02 Onboarding Images

The three onboarding slides in `mobile/app/(auth)/onboarding.tsx` now use the new market photos the owner supplied (`board1.png`, `board2.png`, `board3.png`, 2000×2000).

- Resized to 1200×1200 JPEG (360 to 615 KB each, down from 1 to 1.5 MB) and saved as `mobile/assets/onboarding/onboarding-1.jpg`, `-2.jpg`, `-3.jpg`.
- The old `onboarding-1/2/3.png` files were removed; nothing else used them.
- Slide text and layout are unchanged. The photos are cropped to fit the 360 px tall picture area.

Verification: mobile typecheck passes. Not checked on a phone.
