import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { z } from "zod";

const jwtPayloadSchema = z.object({
  aud: z.string(),
  iss: z.string(),
  exp: z.number(),
  iat: z.number(),
  nbf: z.number(),
  sub: z.string(),
  jti: z.string(),
  user: z.string(),
});

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    fastify.decorate(
      "authenticate",
      async (req: FastifyRequest, reply: FastifyReply) => {
        try {
          await req.jwtVerify();
          const payload = jwtPayloadSchema.safeParse(req.user);
          if (!payload.success) return reply.status(401).send("Unauthorized");
        } catch (err) {
          return reply.status(401).send("Unauthorized");
        }
      }
    );
  },
  {
    name: "auth",
  }
);
