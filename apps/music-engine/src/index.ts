import { loadEnvFiles } from "./config/load-env.js";
import { buildApp } from "./app.js";

loadEnvFiles();

const port = Number(process.env.PORT ?? "3010");
const host = process.env.HOST ?? "0.0.0.0";

const app = await buildApp();

try {
  await app.listen({ port, host });
  app.log.info(`music-engine listening on http://${host}:${port}`);
} catch (err) {
  const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : undefined;
  if (code === "EADDRINUSE") {
    app.log.error(
      { port, host },
      `Port ${port} is already in use (another music-engine or app). Stop that process, or set PORT in apps/music-engine/.env (e.g. PORT=3011) and point MUSIC_ENGINE_URL at the same port. Hint: lsof -i :${port}`
    );
  } else {
    app.log.error(err);
  }
  process.exit(1);
}
