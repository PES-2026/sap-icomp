import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ["sap-icomp.nelsul.com", "*.nelsul.com"],
};

export default nextConfig;