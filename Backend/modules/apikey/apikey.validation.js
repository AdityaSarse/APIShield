import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(100),

  expiresAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "expiresAt must be a valid date string",
    })
    .optional(),
});
