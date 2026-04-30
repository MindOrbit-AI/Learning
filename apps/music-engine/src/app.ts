import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerGenerateSongRoute } from "./routes/generate-song.js";
import { registerInternalJobRoutes } from "./routes/internal-jobs.js";
import { registerMusicCron } from "./cron/register-cron.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: process.env.MUSIC_ENGINE_CORS_ORIGIN?.split(",") ?? true,
  });

  app.get("/health", async () => ({ ok: true as const }));

  await registerGenerateSongRoute(app);
  await registerInternalJobRoutes(app);
  registerMusicCron(app);

  return app;
}
