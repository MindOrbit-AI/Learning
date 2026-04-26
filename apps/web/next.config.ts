import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(configDir, "../..");

const nextConfig: NextConfig = {
  /**
   * Hoisted workspace deps live at the repo root. Pointing NFT here deduplicates traced files
   * across routes on Vercel (otherwise each function can carry a full copy and exceed 250 MB total).
   */
  outputFileTracingRoot: monorepoRoot,
  serverExternalPackages: ["@prisma/client"],
  transpilePackages: ["@mindorbit/ui", "@mindorbit/lib", "@mindorbit/types", "@mindorbit/ai"],
};

export default nextConfig;
