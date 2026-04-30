import cron from "node-cron";
import type { FastifyInstance } from "fastify";
import { pregenerateTopNodes } from "../jobs/pregenerate-top-nodes.js";

/**
 * Daily job (3:00 server local time) to warm-generate music assets for heavily used nodes.
 * Set ENABLE_MUSIC_PREGENERATE_CRON=true and DATABASE_URL + OPENAI_API_KEY to run.
 */
export function registerMusicCron(app: FastifyInstance): void {
  if (process.env.ENABLE_MUSIC_PREGENERATE_CRON !== "true") {
    app.log.info("Music pregenerate cron disabled (set ENABLE_MUSIC_PREGENERATE_CRON=true)");
    return;
  }

  const schedule = process.env.MUSIC_PREGENERATE_CRON ?? "0 3 * * *";

  cron.schedule(schedule, async () => {
    if (!process.env.DATABASE_URL) {
      app.log.warn("Cron skipped: DATABASE_URL not set");
      return;
    }
    if (!process.env.OPENAI_API_KEY) {
      app.log.warn("Cron skipped: OPENAI_API_KEY not set");
      return;
    }
    try {
      const { processed, errors } = await pregenerateTopNodes(100);
      app.log.info({ processed, errorCount: errors.length }, "Music pregenerate cron finished");
      if (errors.length > 0) {
        app.log.warn({ sample: errors.slice(0, 5) }, "Some nodes failed during pregenerate");
      }
    } catch (e) {
      app.log.error(e, "Music pregenerate cron failed");
    }
  });

  app.log.info({ schedule }, "Music pregenerate cron registered");
}
