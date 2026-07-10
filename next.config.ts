import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Host esterni consentiti per next/image. Le immagini locali vanno in /public.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
};

export default nextConfig;
