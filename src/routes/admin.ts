import { redis } from "../utils/redis";
import generateShortId from "../utils/generateShortId";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  adminBodySchema,
  adminDeleteResponseSchema,
  adminPutResponseSchema,
  adminResponseSchema,
} from "../schemas/admin.schema";
export default async function adminRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.post(
    "/admin/urls",
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: adminBodySchema,
        response: adminResponseSchema,
      },
    },
    async (req, res) => {
      const { user } = req.user as { user: string };
      const { url, shortId } = req.body;
      const id = shortId ?? (await generateShortId());
      try {
        if (!url) res.status(400).send("Missing URL");
        await redis.set(id, url);
        res.code(201).send({ shortUrl: id });
      } catch (err) {
        req.log.error(err);
        return res.status(500).send("Internal Server Error");
      }
    }
  );

  app.put(
    "/admin/urls",
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: adminBodySchema,
        response: adminPutResponseSchema,
      },
    },
    async (req, res) => {
      const { user } = req.user as { user: string };
      const { url, shortId } = req.body;
      try {
        if (!url || !shortId) res.status(400).send("Missing parameters");
        const exists = await redis.exists(shortId as string);
        if (exists === 0) res.status(404).send("ShortId not found");
        await redis.set(shortId as string, url);
        res.code(204).send();
      } catch (err) {
        req.log.error(err);
        return res.status(500).send("Internal Server Error");
      }
    }
  );

  app.delete(
    "/admin/urls",
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: adminBodySchema,
        response: adminDeleteResponseSchema,
      },
    },
    async (req, res) => {
      const { user } = req.user as { user: string };
      const { shortId } = req.body;
      try {
        if (!shortId) res.status(400).send("Missing parameters");
        const exists = await redis.exists(shortId as string);
        if (exists === 0) res.status(404).send("ShortId not found");
        await redis.del(shortId as string);
        res.code(204).send();
      } catch (err) {
        req.log.error(err);
        return res.status(500).send("Internal Server Error");
      }
    }
  );
}
