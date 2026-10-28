import type { NextConfig } from "next";

const s3Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || "agrivive-s3-5p3nb0";
const s3Region = process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || "ap-southeast-1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "@base-ui/react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${s3Bucket}.s3.${s3Region}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `${s3Bucket}.s3.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `*.s3.${s3Region}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
