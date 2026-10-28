# 2026-10-28 Product Image Unconfigured Host Fix

## Context & Objectives
While rendering marketplace produce listings, Next.js threw a runtime error:
`Invalid src prop (https://example.com/tomatoes.jpg) on 'next/image', hostname "example.com" is not configured under images in your 'next.config.js'`
This occurred because a test product in the database had `https://example.com/tomatoes.jpg` as its `image_url`, and Next.js `<Image>` component threw an unconfigured hostname exception at render time.

## Why
- **Postel's Law / Robustness Principle (*Jon Postel*)**: Be conservative in what you send, liberal in what you accept. Components rendering user- or database-provided image URLs must gracefully handle arbitrary external hostnames without crashing the entire page.
- **Error Prevention & Graceful Degradation (*Caroline Jarrett & Gerry Gaffney*)**: When an external or placeholder image hostname is encountered, the UI must bypass optimizer restrictions (`unoptimized={true}`) and safely fall back to the category placeholder (`<ImageOff />`) if the browser fails to load the asset.

## What Changed
1. **`web/src/features/marketplace/components/ProductImage.tsx`**:
   - Added `isOptimizableHost(urlStr: string)` check to identify configured S3 and Google user content domains.
   - If `src` originates from an unconfigured/external host, dynamically applies `unoptimized={!isOptimizable}` to `<Image>`.
   - Handled browser load errors via `onError` to fall back to the clean category produce placeholder.
   - File length: 57 lines (well under 200 lines limit).

2. **`web/next.config.ts`**:
   - Added `example.com` and default S3 bucket patterns (`agrivive-s3-5p3nb0.s3.ap-southeast-1.amazonaws.com`) to `images.remotePatterns`.
   - File length: 41 lines (well under 200 lines limit).

3. **Database Cleanup**:
   - Cleared the mock `example.com` URL on product `e573d7c1-e651-496e-827a-eb97e3aa87e6` (*Sigarilyas*), allowing it to render the clean category produce placeholder.

## Affected Files
- `web/src/features/marketplace/components/ProductImage.tsx`
- `web/next.config.ts`

## Verification Performed
- **TypeScript Check**: `cd web; bunx tsc --noEmit` passed with 0 errors.
- **Database Query**: Verified no `sellers_product` records retain `example.com` image URLs.
- **Line Count**: Verified both files are strictly $\le 200$ lines (57 and 41 lines).
