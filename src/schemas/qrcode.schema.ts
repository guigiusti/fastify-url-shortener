import { z } from "zod";
import validator from "validator";

export const qrcodeParamsSchema = z.object({
  shortUrl: z
    .string()
    .min(1)
    .max(32)
    .refine((url) => validator.isAlphanumeric(url), {
      message:
        "Url contains invalid characters. Only alphanumerics are allowed",
    })
    .transform((url) => validator.escape(url)),
});
export type QrcodeParams = z.infer<typeof qrcodeParamsSchema>;

export const qrcodeResponseSchema = {
  200: z.instanceof(Buffer),
  404: z.string().min(1),
  500: z.string().min(1),
};
