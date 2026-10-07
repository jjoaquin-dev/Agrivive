# Buyer Profile Image Upload

Date: 2026-10-03

## What changed

Added buyer profile photo upload for the web profile page. Signed-in buyers can view their current photo, replace it with a JPEG, PNG, or WebP image, and fall back to initials when no usable image exists.

The backend now exposes a buyer profile read route and a buyer-only multipart avatar upload route. Uploaded files use the existing S3 configuration and avatar key convention. The stored image is returned through the existing signed-avatar URL helper so private S3 buckets remain supported.

## Why it changed

The buyer profile previously showed initials only even though the shared user record already had an `image` field and the repository already supported seller avatar uploads. The new flow keeps the profile identity visible, makes the upload action familiar, and gives clear upload, success, and error feedback.

The UI follows Jakob Nielsen's Jakob's Law and Recognition Over Recall through a familiar profile-photo pattern, Visibility of System Status through upload feedback, Paul Fitts's Law through a 48px action target, Gestalt Common Region through grouped identity controls, and inline validation guidance from Caroline Jarrett and Gerry Gaffney.

## Header profile picture follow-up

The signed buyer profile image is now also used in the shared buyer header profile trigger. The header keeps its accessible 44px button target, shows the uploaded photo when available, listens for the in-page upload update, and falls back to the profile icon when the image is missing or cannot load.

Affected paths:

- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/profile/api/profile.ts`
- `web/src/features/profile/components/ProfileAvatarUploader.tsx`

## Seller storefront profile picture follow-up

The public seller storefront now includes the seller's signed profile image in `GET /marketplace/sellers/:id` and displays it beside the shop identity. Sellers without a photo, or with an image that cannot load, receive a compact shop-and-initials fallback so the storefront remains usable.

Affected paths:

- `backend/src/modules/marketplace/services/marketplace.seller.get.ts`
- `backend/API_ENDPOINTS.md`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/components/SellerProfileAvatar.tsx`
- `web/src/features/marketplace/components/SellerStorefront.tsx`

## Profile border polish

The buyer profile hero and shared header profile trigger now use a restrained Agrivive-green border and ring. The profile photo remains the primary visual when available, while the existing accessible 44px header target and fallback icon remain unchanged.

Affected paths:

- `web/src/features/profile/components/ProfileHeader.tsx`
- `web/src/components/BuyerSiteHeader.tsx`

## Affected paths

Backend:

- `backend/src/modules/buyer/index/buyer.profile.read.ts`
- `backend/src/modules/buyer/index/buyer.profile.avatar.ts`
- `backend/src/modules/buyer/model/buyer.profile.avatar.ts`
- `backend/src/modules/buyer/services/buyer.profile.read.ts`
- `backend/src/modules/buyer/services/buyer.profile.avatar.ts`
- `backend/src/modules/buyer/index.ts`
- `backend/API_ENDPOINTS.md`
- `backend/README.md`

Web:

- `web/src/features/profile/api/profile.ts`
- `web/src/features/profile/components/ProfileAvatarUploader.tsx`
- `web/src/features/profile/components/ProfileHeader.tsx`
- `web/src/features/profile/components/BuyerProfile.tsx`

## API contract

`GET /buyer/profile` requires an active buyer session and returns:

```json
{
  "account": {
    "id": "buyer-id",
    "name": "Buyer name",
    "email": "buyer@example.com",
    "image": "signed-display-url-or-null"
  }
}
```

`POST /buyer/profile/avatar` requires an active buyer session and a multipart `file` field. The server accepts JPEG, PNG, and WebP images up to 5 MB and returns the signed display URL after saving `user.image`.

## Verification performed

- `cd backend && bunx tsc --noEmit` -> Passed.
- `cd web && bunx tsc --noEmit` -> Passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` -> Passed; backend bundle generated successfully.
- `cd web && bun run build` -> Passed; all 14 Next.js routes compiled and generated successfully.
- `git diff --check` -> Passed with only existing Git LF/CRLF normalization warnings.
- The shared buyer header production build passed after replacing the signed-in profile icon with the uploaded profile image and fallback behavior.
- The clean web production build passed after clearing only the generated `web/.next` cache that had caused intermittent missing-manifest and missing-route-file errors; all 14 routes generated successfully, including the seller storefront.
- The approved green border polish passed the web type check and clean production build.

## Remaining owner-only acceptance checks

- Upload a JPEG, PNG, and WebP photo while signed in as a buyer.
- Confirm a file over 5 MB and an unsupported file type show inline errors without replacing the current photo.
- Confirm the image remains visible after a page refresh with the configured private S3 bucket.
- Confirm signed-out users receive `401` and non-buyer roles cannot use the buyer avatar route.
- Confirm S3 credentials and `AWS_S3_BUCKET_NAME` are configured in the server environment.
