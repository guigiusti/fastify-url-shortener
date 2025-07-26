import type { FastifyInstance } from "fastify";
import compression from "@fastify/compress";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    fastify.register(compression);
  },
  {
    name: "compression",
  }
);
