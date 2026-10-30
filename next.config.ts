import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Serve Supabase public storage from the portfolio's own domain. TikTok's
  // PULL_FROM_URL only fetches media from a domain verified in its developer portal.
  async rewrites() {
    if (!supabaseUrl) return [];
    return [{ source: "/media/:path*", destination: `${supabaseUrl}/storage/v1/object/public/:path*` }];
  },
};

export default nextConfig;
