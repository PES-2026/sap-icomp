import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
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
