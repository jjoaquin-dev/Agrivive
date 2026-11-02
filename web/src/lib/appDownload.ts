// Public link to the seller APK in S3. Override with NEXT_PUBLIC_APK_URL (for example a CloudFront address).
export const SELLER_APK_URL =
  process.env.NEXT_PUBLIC_APK_URL?.trim() ||
  "https://agrivive-s3-5p3nb0.s3.ap-southeast-1.amazonaws.com/downloads/agrivive-seller.apk";
