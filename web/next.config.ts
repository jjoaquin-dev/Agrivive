import type { NextConfig } from "next";

const s3Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME;
const s3Region = process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || "ap-southeast-1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      ...(s3Bucket
        ? [
            {
              protocol: "https" as const,
              hostname: `${s3Bucket}.s3.${s3Region}.amazonaws.com`,
            },
            {
              protocol: "https" as const,
              hostname: `${s3Bucket}.s3.amazonaws.com`,
            },
          ]
        : [
            {
              protocol: "https" as const,
              hostname: `*.s3.${s3Region}.amazonaws.com`,
            },
          ]),
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
