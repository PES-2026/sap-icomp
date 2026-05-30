import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ["sap-icomp.nelsul.com", "*.nelsul.com"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
