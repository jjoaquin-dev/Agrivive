# Avatar Multipart Upload Fix

Date: 2026-09-21

## Change and reason

The installed Expo fetch implementation rejects plain React Native `{ uri, name, type }` form parts with `Unsupported FormDataPart implementation`. Avatar uploads now append an Expo File constructed from the selected image URI. The existing authenticated API helper continues to send the multipart request with its automatically generated boundary.

## Affected files

- `mobile/src/api/seller.ts`: import File from expo-file-system and append it under the existing `file` field; remove the unsupported object and type assertion.
- `mobile/package.json`: declare expo-file-system ~57.0.7 as a direct dependency matching the installed Expo SDK.
- `mobile/bun.lock`: update dependency metadata.

## Verification

- `bun run typecheck` in mobile: passed.
- `bun expo export --platform android --output-dir dist`: passed (3615 modules; Hermes bundle exported). The initial sandbox run failed to launch Hermes with `spawn EPERM`; retry with process permission succeeded.
- Physical-device upload and S3 image access: pending owner verification.

## Manual check

1. Keep the backend running and reload the app in Expo Go. If needed, restart Metro with `bun expo start --android --clear` from mobile.
2. In Profile, choose a JPEG, PNG, or WebP image under 5 MB and upload it. Repeat from Edit Profile, since both screens share this helper.
3. Confirm no FormDataPart error appears, the upload reports success, and the new avatar remains visible after refreshing the profile.
4. Retry after an offline failure and confirm the upload control becomes available again.

This change does not verify AWS credentials, bucket permissions, or public image access. No commit created.
