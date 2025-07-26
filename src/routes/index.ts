import adminRoutes from "./admin";
import redirectRoutes from "./redirect";
import healthRoutes from "./health";
import qrcodeRoutes from "./qrcode";
import type { FastifyInstance } from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";

export default function routes(fastify: FastifyInstance) {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify.register(adminRoutes);
  fastify.register(redirectRoutes);
  fastify.register(healthRoutes);
  fastify.register(qrcodeRoutes);
}
