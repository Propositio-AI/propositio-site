import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.10.122", "192.168.0.218"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neobfxrodekynlqjoari.supabase.co",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
