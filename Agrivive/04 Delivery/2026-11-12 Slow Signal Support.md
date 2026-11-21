# 2026-11-12 Slow Signal Support

Up: [[Delivery Index 2026-11]]

## Why
Sellers in areas with weak data signal found the app hard to use: loads failed with an error, and photos (3 to 5 MB) took too long to send.

## What changed (mobile only, no backend change)
- **Saved reads.** `mobile/src/api/readCache.ts` keeps the last good answer of every read, one small file per path in the app cache folder. In `apiFetch` (`mobile/src/api/client.ts`), when a read fails twice because of the connection, the saved answer is returned instead of an error. Auth, OTP, recovery and integration paths are never saved. Saved reads are deleted on sign out (`AuthContext.tsx`).
- **Notice.** `mobile/src/api/readStatus.ts` holds a small store; `OfflineBanner` shows "Weak signal. Showing what was saved 5 minutes ago." while saved data is on screen, and the old "No internet" text when the phone is offline.
- **Smaller photos.** `mobile/src/utils/shrinkImage.ts` resizes the longest side to 1280px and saves JPEG at 70% before upload (listing photo, profile photo, chat photo). If shrinking fails, the original is sent.
- **Uploads wait a full minute** (`UPLOAD_TIMEOUT_MS`, was 20 seconds).
- New dependency: `expo-image-manipulator` (native module, so the next app build is needed).

## Not done (offered next)
- Show saved data first and refresh behind it (needs hook changes per screen).
- Safe retry keys for writes and a queue of actions while offline (needs backend support).
- Smaller list images and paging.

## Verification
`bun run typecheck` clean; Android export builds. Not tried on a phone with a weak signal.
