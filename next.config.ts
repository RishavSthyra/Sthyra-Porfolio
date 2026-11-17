import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sthyra.com",
      },
      {
        protocol: "https",
        hostname: "app.aadhyaserene.com",
        pathname: "/assets/amenities/**",
      },
    ],
  },
};

export default nextConfig;
