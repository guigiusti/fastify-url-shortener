import { z } from "zod";

export const adminBodySchema = z.object({
  url: z.string(),
  shortId: z.string().optional(),
});
export type AdminBody = z.infer<typeof adminBodySchema>;

export const adminGetResponseSchema = {
  200: z.object({
    urls: z.array(
      z.object({
        shortId: z.string(),
        url: z.string(),
        user: z.string(),
        createdAt: z.string(),
      })
    ),
  }),
  500: z.string().min(1),
};

export const adminResponseSchema = {
  201: z.object({
    shortUrl: z.string().min(1),
  }),
  400: z.string().min(1),
  500: z.string().min(1),
};

export const adminPutResponseSchema = {
  204: z.object({}),
  400: z.string().min(1),
  404: z.string().min(1),
  500: z.string().min(1),
};

export const adminDeleteResponseSchema = {
  204: z.object({}),
  400: z.string().min(1),
  404: z.string().min(1),
  500: z.string().min(1),
};
