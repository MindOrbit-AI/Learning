import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mindorbit/ui", "@mindorbit/lib", "@mindorbit/types", "@mindorbit/ai"],
};

export default nextConfig;
