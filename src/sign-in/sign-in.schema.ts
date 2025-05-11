import z from "zod";

export const signinRequestBodySchema = z
  .object({
    username: z.string().trim().min(1),
    password: z.string().trim(),
  })
  .strict();

/** Database query result schema */
