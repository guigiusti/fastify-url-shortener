import { redis } from "../utils/redis";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  healthParamsSchema,
  healthResponseSchema,
} from "../schemas/health.schema";
import type { HealthParams } from "../schemas/health.schema";
export default function health(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.get<{ Params: HealthParams }>(
    "/health",
    {
      schema: {
        params: healthParamsSchema,
        response: healthResponseSchema,
      },
    },
    async (req, res) => {
      const health = await redis.ping();
      if (health !== "PONG") {
        return res.status(500).send("Redis failure");
      }
      res.status(200).send({ status: "ok" });
    }
  );
}
