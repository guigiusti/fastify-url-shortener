import fastify from "fastify";
import { redis } from "./utils/redis";
import routes from "./routes";
import plugins from "./plugins";

export const app = fastify({
  logger: { level: "warn" },
  trustProxy: 1,
});
app.register(plugins);
app.register(routes);
process.on("SIGINT", async () => {
  await app.close();
  await redis.quit();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await app.close();
  await redis.quit();
  process.exit(0);
});
