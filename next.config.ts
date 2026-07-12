import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Host esterni consentiti per next/image. Le immagini locali vanno in /public.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      // Immagini prodotto della demo SFCC (/projects/sfcc), host sandbox Salesforce.
      {
        protocol: "https",
        hostname: "edge.disstg.commercecloud.salesforce.com",
      },
      {
        protocol: "https",
        hostname: "zylq-002.dx.commercecloud.salesforce.com",
      },
    ],
  },
};

export default nextConfig;
