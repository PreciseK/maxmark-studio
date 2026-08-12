import type { NextConfig } from "next";
import path from "path";

const supabaseHostname = new URL(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://your-project.supabase.co",
).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
