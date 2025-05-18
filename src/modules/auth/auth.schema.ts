import z from "zod";

export const signupRequestBodySchema = z
  .object({
    username: z.string().trim().min(1),
    password: z.string().trim(),
  })
  .strict();
