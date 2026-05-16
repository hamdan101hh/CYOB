import type { NextConfig } from "next";

import "./lib/env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
