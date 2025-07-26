import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    fastify.register(fastifyRateLimit, {
      global: true,
      max: 10,
      timeWindow: "1m",
      keyGenerator: (req) => req.ip,
      allowList: (req) => req.ip === "127.0.0.1",
      cache: 10000,
    });
  },
  {
    name: "rateLimit",
  }
);
