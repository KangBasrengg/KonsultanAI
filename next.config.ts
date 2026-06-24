import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hdvuzjabpfqabcxhbbci.supabase.co",
      },
    ],
  },
};

export default nextConfig;
