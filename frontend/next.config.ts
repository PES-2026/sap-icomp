import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  allowedDevOrigins: ["sap-icomp.nelsul.com", "*.nelsul.com"],
};

export default nextConfig;
