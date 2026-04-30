import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { GenerateSongRequest } from "../models/types.js";
import { generateMusicAssets } from "../services/music.service.js";

const bodySchema = z.object({
  conceptId: z.string().min(1),
  title: z.string().min(1),
  explanation: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export async function registerGenerateSongRoute(app: FastifyInstance): Promise<void> {
  app.post<{ Body: GenerateSongRequest }>("/generate-song", async (req, reply) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    try {
      const asset = await generateMusicAssets(parsed.data);
      return reply.send(asset);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Generation failed";
      const isConfig = message.includes("OPENAI_API_KEY");
      return reply.status(isConfig ? 503 : 502).send({ error: message });
    }
  });
}
