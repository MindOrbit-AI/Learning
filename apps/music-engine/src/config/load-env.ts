import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Loads env from monorepo root then `apps/music-engine/.env` (local overrides).
 * `dotenv/config` alone only reads `.env` from cwd, which is often `apps/music-engine` when using yarn workspace.
 */
export function loadEnvFiles(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRootEnv = resolve(here, "../../../.env");
  const appEnv = resolve(here, "../../.env");
  config({ path: repoRootEnv });
  config({ path: appEnv, override: true });
}
