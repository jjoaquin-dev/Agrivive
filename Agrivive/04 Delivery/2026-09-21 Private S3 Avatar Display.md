# Private S3 Avatar Display

Date: 2026-09-21

## Problem and change

Avatar upload succeeded and the permanent object URL was saved, but an anonymous request to that URL returned HTTP 403. The profile screen could not load the image.

The seller setup response now generates a signed GET URL valid for one hour. Profile refresh generates a fresh display URL. The database continues to store the permanent URL; no schema migration or bucket permission changes were made.

## Affected files

- `backend/src/utils/s3-avatar/index.ts`: generates signed display URLs only for the configured regional S3 bucket and avatar prefix; preserves existing HTTP(S) external images without signing them and returns null for malformed or unsupported values.
- `backend/src/modules/seller/services/seller.setup.ts`: resolves `account.image` through the new helper.
- `backend/package.json` and `backend/bun.lock`: add `@aws-sdk/s3-request-presigner` version 3.1136.0, matching the S3 SDK.

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed (1481 modules).
- Read-only check of the saved avatar: generated URL reports a 3600-second expiry; a signed GET requesting one byte returned HTTP 206 with `image/jpeg`. No credentials, signed URLs, or image content were printed.
- Physical-device profile rendering: pending owner testing.

## Manual verification

1. Restart the backend if watch mode has not restarted it.
2. Pull down to refresh Profile in the mobile app. The previously uploaded photo should appear without another upload.
3. Check Edit Profile displays the same photo.
4. In Postman, send `GET http://localhost:3000/seller/setup` using the seller session bearer token. No request body is needed. Expect HTTP 200 and a signed URL in `account.image` containing `X-Amz-Expires=3600`.
5. Treat the signed URL as temporary access to the image; do not paste it into logs or delivery notes. After expiry, refresh the profile to obtain a new URL.

No commit created.
