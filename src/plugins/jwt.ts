import type { FastifyInstance } from "fastify";
import JWT from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import { readFileSync } from "fs";

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    const JWT_AUD = process.env.JWT_AUD;
    const JWT_ISS = process.env.JWT_ISS;
    const PUBLIC_KEY = readFileSync("./public.pem");

    if (!JWT_AUD || !JWT_ISS || !PUBLIC_KEY) {
      fastify.log.error("Missing Environment Variables");
      process.exit(1);
    }
    fastify.register(JWT, {
      secret: {
        public: PUBLIC_KEY,
      },
      verify: {
        algorithms: ["EdDSA"],
        allowedAud: JWT_AUD,
        allowedIss: JWT_ISS,
        maxAge: "1m",
        requiredClaims: ["aud", "iss"],
      },
    });
  },
  {
    name: "jwt",
  }
);
