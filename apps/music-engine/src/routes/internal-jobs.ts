import type { FastifyInstance } from "fastify";
import { pregenerateTopNodes } from "../jobs/pregenerate-top-nodes.js";

/**
 * For platform schedulers (e.g. Vercel Cron, GitHub Actions) that cannot rely on in-process node-cron.
 * Set MUSIC_CRON_SECRET and send header x-music-cron-secret.
 */
export async function registerInternalJobRoutes(app: FastifyInstance): Promise<void> {
  app.post("/jobs/pregenerate-top-nodes", async (req, reply) => {
    const secret = process.env.MUSIC_CRON_SECRET;
    if (!secret) {
      return reply.status(503).send({ error: "MUSIC_CRON_SECRET is not configured" });
    }
    const header = req.headers["x-music-cron-secret"];
    if (typeof header !== "string" || header !== secret) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    try {
      const result = await pregenerateTopNodes(100);
      return reply.send(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Job failed";
      return reply.status(500).send({ error: message });
    }
  });
}
