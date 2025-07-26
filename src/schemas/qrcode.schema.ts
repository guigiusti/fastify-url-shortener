import { z } from "zod";

export const qrcodeParamsSchema = z.object({
  shortUrl: z.string().min(1),
});
export type QrcodeParams = z.infer<typeof qrcodeParamsSchema>;

export const qrcodeResponseSchema = {
  200: z.instanceof(Buffer),
  404: z.string().min(1),
  500: z.string().min(1),
};
