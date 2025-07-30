import { z } from "zod";
import validator from "validator";

export const adminBodySchema = z.object({
  url: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (url) =>
        validator.isURL(url, {
          require_protocol: true,
          protocols: ["http", "https"],
          allow_trailing_dot: false,
          allow_underscores: false,
        }),
      {
        message: "Invalid URL Type. Must be a valid URL",
      }
    ),
  shortId: z
    .string()
    .trim()
    .max(32)
    .optional()
    .refine((id) => id === undefined || validator.isAlphanumeric(id), {
      message:
        "ShortId contains invalid characters. Only alphanumeric characters are allowed",
    })
    .transform((id) => (id ? validator.escape(id) : id)),
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
  400: z.union([
    z.string().min(1),
    z.object({
      statusCode: z.number(),
      error: z.string(),
      message: z.string(),
      code: z.string().optional(),
    }),
  ]),
  500: z.string().min(1),
};

export const adminPutResponseSchema = {
  204: z.object({}),
  400: z.union([
    z.string().min(1),
    z.object({
      statusCode: z.number(),
      error: z.string(),
      message: z.string(),
      code: z.string().optional(),
    }),
  ]),
  404: z.string().min(1),
  500: z.string().min(1),
};

export const adminDeleteResponseSchema = {
  204: z.object({}),
  400: z.union([
    z.string().min(1),
    z.object({
      statusCode: z.number(),
      error: z.string(),
      message: z.string(),
      code: z.string().optional(),
    }),
  ]),
  404: z.string().min(1),
  500: z.string().min(1),
};
