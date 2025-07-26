import { z } from "zod";

export const healthParamsSchema = z.null();
export type HealthParams = z.infer<typeof healthParamsSchema>;

export const healthResponseSchema = {
  200: z.object({ status: z.literal("ok") }),
  500: z.string().min(1),
};
