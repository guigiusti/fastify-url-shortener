import { FastifyRequest, FastifyReply } from "fastify";
import { Low } from "lowdb";
import { Urls } from "../plugins/db";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    db: Low<Urls>;
  }
}
