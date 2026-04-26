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
  /**
   * pdf-parse uses `require(\`./pdf.js/${version}/...\`)`; bundling it pulls every pdf.js build into
   * one webpack context (~30MB+). Keep it external so only node_modules/pdf-parse is traced once.
   * youtube-transcript / openai are large; keep external to slim API route bundles (e.g. ingestion).
   */
  serverExternalPackages: [
    "@prisma/client",
    "pdf-parse",
    "youtube-transcript",
    "openai",
  ],
  /**
   * NFT can incorrectly retain local dev outputs and unrelated sources under the tracing root.
   * Strip them from all server traces (picomatch key matches every normalized route).
   */
  outputFileTracingExcludes: {
    "/**": [
      "playwright-report/**",
      "test-results/**",
      ".turbo/**",
      "e2e/**",
      "playwright.config.ts",
      "vitest.config.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
      "src/components/mission-engine/**",
      "src/features/admin-dashboard/**",
      "src/features/diagnostics/**",
      "src/features/feature-gates/**",
      "src/features/lesson-blocks/**",
      "src/features/lesson-runtime/**",
      "src/features/pricing/**",
      "src/lib/mission-flavor.ts",
      "src/lib/mission-to-lesson/**",
      "src/app/\\(app\\)/**",
      "src/features/billing/**",
      "src/lib/diagnostic.ts",
      "src/app/globals.css",
      "src/app/icon.svg",
      "src/app/opengraph-image.tsx",
      "src/app/robots.ts",
      "src/app/share/**",
      "src/app/sitemap.ts",
      "src/middleware.ts",
    ],
  },
  transpilePackages: ["@mindorbit/ui", "@mindorbit/lib", "@mindorbit/types", "@mindorbit/ai"],
};

export default nextConfig;
