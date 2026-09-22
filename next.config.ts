import type { NextConfig } from "next";
import path from "path";

let supabaseHostname = "your-project.supabase.co";
try {
  const urlStr = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://agzsfvmxbvcyhtueyatk.supabase.co";
  supabaseHostname = new URL(urlStr).hostname;
} catch {
  supabaseHostname = "agzsfvmxbvcyhtueyatk.supabase.co";
}

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
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/admin/login",
        permanent: false,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
