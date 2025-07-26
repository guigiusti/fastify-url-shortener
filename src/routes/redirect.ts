import type { FastifyInstance } from "fastify";
import { redis } from "../utils/redis";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  redirectParamsSchema,
  redirectResponseSchema,
} from "../schemas/redirect.schema";
import type { RedirectParams } from "../schemas/redirect.schema";

export default function redirect(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.get<{ Params: RedirectParams }>(
    "/:shortUrl",
    {
      schema: {
        params: redirectParamsSchema,
        response: redirectResponseSchema,
      },
    },
    async (req, res) => {
      const { shortUrl } = req.params;
      const url = await redis.get(shortUrl);
      if (!url) {
        return res.status(404).send("URL not found");
      }
      res.redirect(url).status(302);
    }
  );
}
