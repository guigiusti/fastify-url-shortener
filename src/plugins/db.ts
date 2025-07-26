import type { FastifyInstance } from "fastify";
import { JSONFilePreset } from "lowdb/node";
import fastifyPlugin from "fastify-plugin";
import { redis } from "../utils/redis";

export interface Urls {
  urls: {
    shortId: string;
    url: string;
    user: string;
    createdAt: string;
  }[];
}

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    const defaultData: Urls = { urls: [] };
    const db = await JSONFilePreset<Urls>("db.json", defaultData);
    fastify.decorate("db", db);
    fastify.addHook("onReady", async () => {
      try {
        await db.read();
        const { urls } = db.data;
        if (!urls.length) return;
        const pipeline = redis.pipeline();
        for (const { shortId, url } of urls) {
          pipeline.set(shortId, url);
        }
        await pipeline.exec();
        fastify.log.info("Redis populated successfully");
      } catch (err) {
        fastify.log.error("Error populating Redis:", err);
      }
    });
    fastify.addHook("onClose", async () => {
      await db.write();
    });
  },
  {
    name: "db",
  }
);
