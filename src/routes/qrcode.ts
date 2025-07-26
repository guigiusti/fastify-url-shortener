import type { FastifyInstance } from "fastify";
import QRCode from "qrcode";
import { redis } from "../utils/redis";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  qrcodeParamsSchema,
  qrcodeResponseSchema,
} from "../schemas/qrcode.schema";
import type { QrcodeParams } from "../schemas/qrcode.schema";

export default function qrcode(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.get<{ Params: QrcodeParams }>(
    "/qrcode/:shortUrl",
    {
      schema: {
        params: qrcodeParamsSchema,
        response: qrcodeResponseSchema,
      },
    },
    async (req, res) => {
      const { shortUrl } = req.params;
      const url = await redis.get(shortUrl);
      if (!url) {
        return res.status(404).send("URL not found");
      }
      try {
        const image = await QRCode.toBuffer(url, {
          type: "png",
          width: 400,
          margin: 2,
          errorCorrectionLevel: "H",
        });
        res.header("content-type", "image/png").code(200).send(image);
      } catch (err) {
        req.log.error(err);
        res.status(500).send("Failed to generate QR Code");
      }
    }
  );
}
