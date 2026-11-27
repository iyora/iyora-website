import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* Tautan pendek formulir dasbor: iyora.or.id/s/<kode> → dasbor IYORA (2026-11-27).
     Redirect dijalankan sebelum middleware bahasa, jadi tidak dibelokkan ke /id/s/…. */
  async redirects() {
    return [{ source: "/s/:kode", destination: "https://dashboard.iyora.or.id/s/:kode", permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.iyora.or.id",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
