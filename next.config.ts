import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.10.122", "192.168.0.218"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neobfxrodekynlqjoari.supabase.co",
      },
    ],
    domains: ["images.microcms-assets.io"],
  },
};

module.exports = nextConfig;

export default nextConfig;
