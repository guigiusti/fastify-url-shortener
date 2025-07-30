import { z } from "zod";
import validator from "validator";

export const redirectParamsSchema = z.object({
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

export type RedirectParams = z.infer<typeof redirectParamsSchema>;

export const redirectResponseSchema = {
  302: z.object({}),
  404: z.string().min(1),
};
