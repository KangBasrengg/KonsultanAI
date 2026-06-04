import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hdvuzjabpfqabcxhbbci.supabase.co",
      },
    ],
  },
};

export default nextConfig;
