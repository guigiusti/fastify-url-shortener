import { z } from "zod";

export const redirectParamsSchema = z.object({
  shortUrl: z.string().min(1),
});

export type RedirectParams = z.infer<typeof redirectParamsSchema>;

export const redirectResponseSchema = {
  302: z.object({}),
  404: z.string().min(1),
};
