import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Used by ProductCard / BranchBulletin / category tiles
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
