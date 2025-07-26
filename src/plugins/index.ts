import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import helmet from "./helmet";
import cors from "./cors";
import rateLimit from "./rateLimit";
import compression from "./compression";
import jwt from "./jwt";
import auth from "./auth";
import db from "./db";

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await Promise.all([
    fastify.register(helmet),
    fastify.register(cors),
    fastify.register(rateLimit),
    fastify.register(compression),
    fastify.register(jwt),
    fastify.register(db),
  ]);
  await fastify.register(auth);
});
